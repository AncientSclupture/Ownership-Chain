import AssetStorage "../storage/AssetStorage";
import OwnershipsStorage "../storage/ownershipsStorage";
import UserStorage "../storage/UserStorage";
import TransactionStorage "../storage/TransactionStorage";
import BuyProposalsStorage "../storage/BuyProposalsStorage";
import InvestorProposalsStorage "../storage/InvestorProposalsStorage";
import Result "mo:base/Result";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import DataType "../data/dataType";
import InputType "../data/inputType";
import Helper "../utils/helper";

module {
  public class ProposalService(
    assetstorage : AssetStorage.AssetStorageClass,
    ownershipstorage : OwnershipsStorage.OwnershipStorageClass,
    userstorage : UserStorage.UserStorageClass,
    transaction : TransactionStorage.TransactionStorageClass,
    buyproposal : BuyProposalsStorage.BuyProposalStorageClass,
    investorproposal : InvestorProposalsStorage.InvestorProposalStorageClass,
  ) {

    public func proposedBuyToken(
      assetId : Text,
      amount : Nat,
      pricePerToken : Nat,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      // sufficient token amount validation
      switch (assetstorage.get(assetId)) {
        case (null) {
          return #err("Asset not found.");
        };
        case (?asset) {
          if (amount == 0) {
            return #err("There is no token you are going to purchased.");
          };

          if (asset.tokenLeft < amount) {
            return #err("No token available for this asset.");
          };

          if (asset.minTokenPurchased > amount or asset.maxTokenPurchased < amount) {
            return #err("Cannot proceed because of token minimum or maximum puchased is not suficient.");
          };

          if (asset.assetStatus != #Open) {
            return #err("This is asset token is not open for sale.");
          };

          if (asset.rule.minDownPaymentPercentage > 1.0) {
            return #err("Cannot downpayment percentage is cannot be greater than 100%.");
          };

          if (asset.creator == caller) {
            return #err("You cannot proposed to buy your own asset as an asset creator.");
          };

        };

      };

      let now = Time.now();
      let newApprovals = HashMap.HashMap<Principal, Float>(10, Principal.equal, Principal.hash);

      switch (assetstorage.get(assetId)) {
        case (null) {
          return #err("There is no token you are going to purchased.");
        };
        case (?existAsset) {
          switch (existAsset.rule.needDownPayment) {
            case (true) {
              let newProposal : InputType.BuyProposalInput = {
                assetId = assetId;
                buyer = caller;
                amount = amount;
                pricePerToken = pricePerToken;
                totalPrice = amount * pricePerToken;
                approvals = newApprovals;
                createdAt = now;
                downPaymentStatus = false;
                downPaymentTimeStamp = 0;
              };

              let propid = buyproposal.create(newProposal);
              return #ok("Your proposal is created, don't forget to do down payment as the asset rules." #propid);
            };
            case (false) {
              let updatedAsset : DataType.Asset = {
                id = existAsset.id;
                creator = existAsset.creator;
                name = existAsset.name;
                description = existAsset.description;
                totalToken = existAsset.totalToken;
                tokenLeft = existAsset.tokenLeft - amount;
                providedToken = existAsset.providedToken;
                pendingToken = existAsset.pendingToken + amount;
                minTokenPurchased = existAsset.minTokenPurchased;
                maxTokenPurchased = existAsset.maxTokenPurchased;
                pricePerToken = existAsset.pricePerToken;
                locationInfo = existAsset.locationInfo;
                documentHash = existAsset.documentHash;
                assetType = existAsset.assetType;
                assetStatus = existAsset.assetStatus;
                rule = existAsset.rule;
                riskScore = existAsset.riskScore;

                createdAt = existAsset.createdAt;
                updatedAt = now;
              };

              let newProposal : InputType.BuyProposalInput = {
                assetId = assetId;
                buyer = caller;
                amount = amount;
                pricePerToken = pricePerToken;
                totalPrice = amount * pricePerToken;
                approvals = newApprovals;
                createdAt = now;
                downPaymentStatus = true;
                downPaymentTimeStamp = now;
              };
              let _assetId = assetstorage.update(assetId, updatedAsset);
              let propid = buyproposal.create(newProposal);
              return #ok("Your proposal is created, waiting for the voting approval." #propid);
            };
          };
        };
      };
      return #ok("Your proposal is created, waiting for the voting approval.");
    };

    public func proceedDownPayment(
      price : Nat,
      buyProposalId : Text,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      let now = Time.now();

      switch (buyproposal.get(buyProposalId)) {
        case (?existProposal) {
          if (caller != existProposal.buyer) {
            return #err("You are not allowed to do downpayment for this proposal.");
          };

          // is user have the asset ownership
          switch (ownershipstorage.get(existProposal.assetId)) {
            case (?ownership) {
              switch (ownership.get(caller)) {
                case (null) {};
                case (_existOwnership) {
                  return #err("you already have this ownership");
                };
              };
            };
            case (null) {};
          };

          switch (assetstorage.get(existProposal.assetId)) {
            case (?proposeAsset) {
              let timeProposalCreated = existProposal.createdAt;
              let expiredDownPayemntTimeDays = proposeAsset.rule.downPaymentMaturityTime;

              if (
                Helper.isExpired(
                  timeProposalCreated,
                  expiredDownPayemntTimeDays,
                )
              ) {
                return #err("Sorry your payment time has passed the downpayment expire time.");
              };

              let dpFloat : Float = Float.fromInt(existProposal.totalPrice) * proposeAsset.rule.minDownPaymentPercentage;
              let dpnat : Nat = Int.abs(Float.toInt(Float.floor(dpFloat)));

              if (price != dpnat) {
                return #err("Do the downpayment as this amount, " # Nat.toText(dpnat) # ".");
              };

              let updatedAsset : DataType.Asset = {
                id = proposeAsset.id;
                creator = proposeAsset.creator;
                name = proposeAsset.name;
                description = proposeAsset.description;
                totalToken = proposeAsset.totalToken;
                tokenLeft = proposeAsset.tokenLeft - existProposal.amount;
                providedToken = proposeAsset.providedToken;
                pendingToken = proposeAsset.pendingToken + existProposal.amount;
                minTokenPurchased = proposeAsset.minTokenPurchased;
                maxTokenPurchased = proposeAsset.maxTokenPurchased;
                pricePerToken = proposeAsset.pricePerToken;
                locationInfo = proposeAsset.locationInfo;
                documentHash = proposeAsset.documentHash;
                assetType = proposeAsset.assetType;
                assetStatus = proposeAsset.assetStatus;
                rule = proposeAsset.rule;
                riskScore = proposeAsset.riskScore;

                createdAt = proposeAsset.createdAt;
                updatedAt = now;
              };

              let updateAssetStatus = assetstorage.update(proposeAsset.id, updatedAsset);

              if (not updateAssetStatus) {
                return #err("failed to update asset");
              };

              let updatedProposal : DataType.BuyProposal = {
                id = existProposal.id;
                assetId = existProposal.assetId;
                buyer = existProposal.buyer;
                amount = existProposal.amount;
                pricePerToken = existProposal.pricePerToken;
                totalPrice = existProposal.totalPrice;
                approvals = existProposal.approvals;
                createdAt = existProposal.createdAt;
                downPaymentStatus = true;
                downPaymentTimeStamp = now;
              };

              let updateProposalStatus = buyproposal.update(existProposal.id, updatedProposal);

              if (not updateProposalStatus) {
                return #err("failed to update proposal");
              };

              let createdDPTransacation : InputType.TransactionInput = {
                assetId = proposeAsset.id;
                from = caller;
                to = proposeAsset.creator;
                totalPurchasedToken = existProposal.totalPrice;
                pricePerToken = existProposal.pricePerToken;
                totalPrice = price;
                transactionType = #Downpayment;
                transactionStatus = #Completed;
                details = null;

                timestamp = now;
              };

              let createdid = transaction.create(createdDPTransacation);

              return #ok("Success to do downpayemnt wait for the approval" #createdid);
            };
            case null {
              return #ok("Asset is not found to do downpayemnt");
            };
          };

        };
        case null {
          return #err("Proposal is not found.");
        };
      };

    };

    public func finishedPayment(
      proposalId : Text,
      price : Int,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (buyproposal.get(proposalId)) {
        case (?existProposal) {

          // is user have the asset ownership
          switch (ownershipstorage.get(existProposal.assetId)) {
            case (?ownership) {
              switch (ownership.get(caller)) {
                case (null) {};
                case (_existOwnership) {
                  return #err("you already have this ownership");
                };
              };
            };
            case (null) {};
          };

          if (existProposal.downPaymentStatus == false) {
            return #err("Finished the downpayment first.");
          };

          var totalApproval : Float = 0;
          for ((_, percent) in existProposal.approvals.entries()) {
            totalApproval += percent;
          };

          if (totalApproval <= 0.51) {
            return #err("Approval percentage is not enough. Current: " # Float.toText(totalApproval) # "%");
          };

          switch (assetstorage.get(existProposal.assetId)) {
            case (null) { return #ok("no asset found") };
            case (?existAsset) {

              let dpFloat : Float = Float.fromInt(existProposal.totalPrice) * existAsset.rule.minDownPaymentPercentage;
              let dpNat : Int = Float.toInt(Float.floor(dpFloat));

              let remainingPriceleft = existProposal.totalPrice - dpNat;

              if (price != remainingPriceleft) {
                return #err("The remaining payment is " # Int.toText(remainingPriceleft));
              };

              let now = Time.now();

              let updatedAsset : DataType.Asset = {
                id = existAsset.id;
                creator = existAsset.creator;
                name = existAsset.name;
                description = existAsset.description;
                totalToken = existAsset.totalToken;
                // remain the same because the token left is already subs when the dp is done
                tokenLeft = existAsset.tokenLeft;
                providedToken = existAsset.providedToken;
                pendingToken = existAsset.pendingToken - existProposal.amount;
                minTokenPurchased = existAsset.minTokenPurchased;
                maxTokenPurchased = existAsset.maxTokenPurchased;
                pricePerToken = existAsset.pricePerToken;
                locationInfo = existAsset.locationInfo;
                documentHash = existAsset.documentHash;
                assetType = existAsset.assetType;
                assetStatus = existAsset.assetStatus;
                rule = existAsset.rule;
                riskScore = existAsset.riskScore;

                createdAt = existAsset.createdAt;
                updatedAt = now;
              };

              let updatedAssetStatus = assetstorage.update(existAsset.id, updatedAsset);

              if (not updatedAssetStatus) {
                return #err("failed to update asset");
              };

              let percentage : Float = Float.fromInt(existProposal.amount) / Float.fromInt(existAsset.totalToken);

              var ownershipMaturityTime : Int = 0;
              if (existAsset.rule.paymentMaturityTime > 0) {
                ownershipMaturityTime := now + existAsset.rule.ownerShipMaturityTime * 1_000_000_000 * 60 * 60 * 24;
              };

              let createdTransaction : InputType.TransactionInput = {
                assetId = existAsset.id;
                from = existAsset.creator;
                to = caller;
                totalPurchasedToken = existProposal.amount;
                pricePerToken = existProposal.totalPrice;
                totalPrice = Int.abs(remainingPriceleft);
                transactionType = #Buy;
                transactionStatus = #Completed;
                details = null;

                timestamp = now;
              };

              let _createtransactionstatus = transaction.create(createdTransaction);

              let createownershipstatus = ownershipstorage.addNewOwnershipHolder(
                existAsset.id,
                caller,
                existProposal.amount,
                percentage,
                now,
                Int.abs(remainingPriceleft + dpNat),
                ownershipMaturityTime,
              );

              if (not createownershipstatus) {
                return #err("failed to create ownership");
              };

              return #ok("Success to get the token.");
            };

          };
        };
        case (null) {
          return #err("Proposal is not found.");
        };
      };
    };

    public func approveBuyProposal(
      buyProposalId : Text,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (buyproposal.get(buyProposalId)) {
        case (?existProposal) {

          if (existProposal.downPaymentStatus == false) {
            return #err("The downpayment is not done yet.");
          };

          if (existProposal.buyer == caller) {
            return #err("Not allowed");
          };

          switch (ownershipstorage.get(existProposal.assetId)) {
            case (?ownershipMap) {
              switch (ownershipMap.get(caller)) {
                case (?ownership) {

                  if (existProposal.approvals.get(caller) != null) {
                    return #err("You have already approved this proposal.");
                  };

                  var percentage : Float = ownership.percentage;

                  switch (assetstorage.get(existProposal.assetId)) {
                    case (?existAsset) {
                      let calculatedAssetHolderCapability : Float = Float.fromInt(existAsset.tokenLeft) / Float.fromInt(existAsset.totalToken);
                      if (calculatedAssetHolderCapability < 0.51) {
                        percentage := 1.0;
                      };
                    };
                    case null {};
                  };

                  existProposal.approvals.put(caller, percentage);
                  let _updatebuyproposalStatus = buyproposal.update(buyProposalId, existProposal);

                  return #ok("Successfully approved with " # Float.toText(percentage) # "% ownership.");
                };
                case null {
                  return #err("You do not own any token of this asset.");
                };
              };
            };
            case null {
              return #err("No ownership data found for this asset.");
            };
          };
        };
        case null {
          return #err("Buy proposal not found.");
        };
      };
    };

    public func createIvestorProposal(
      assetId : Text,
      incomingInvestor : Principal,
      amount : Nat,
      pricePerToken : Nat,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (assetstorage.get(assetId)) {
        case (?asset) {
          if (asset.assetStatus != #Active) {
            return #err("Asset is in not active status.");
          };

          if (asset.tokenLeft < amount) {
            return #err("There is no token left in this asset.");
          };

          switch (ownershipstorage.get(assetId)) {
            case (?ownership) {
              switch (ownership.get(caller)) {
                case (?_userOwnership) {
                  let now = Time.now();
                  let newapprovals = HashMap.HashMap<Principal, Float>(10, Principal.equal, Principal.hash);

                  let createNewInsestorProposal : InputType.InvestorProposalInput = {
                    assetId = asset.id;
                    investor = incomingInvestor;
                    amount = amount;
                    pricePerToken = pricePerToken;
                    totalPrice = pricePerToken * amount;
                    approvals = newapprovals;
                    createdAt = now;
                  };

                  let updatedAsset : DataType.Asset = {
                    id = asset.id;
                    creator = asset.creator;
                    name = asset.name;
                    description = asset.description;
                    totalToken = asset.totalToken;
                    tokenLeft = asset.tokenLeft;
                    providedToken = asset.providedToken;
                    pendingToken = asset.pendingToken - amount;
                    minTokenPurchased = asset.minTokenPurchased;
                    maxTokenPurchased = asset.maxTokenPurchased;
                    pricePerToken = asset.pricePerToken;
                    locationInfo = asset.locationInfo;
                    documentHash = asset.documentHash;
                    assetType = asset.assetType;
                    assetStatus = asset.assetStatus;
                    rule = asset.rule;
                    riskScore = asset.riskScore;

                    createdAt = asset.createdAt;
                    updatedAt = now;
                  };

                  let _createdasset = assetstorage.update(asset.id, updatedAsset);
                  let _createdinvestor = investorproposal.create(createNewInsestorProposal);
                  return #ok("Successfully create proposal, wait for the ownership approval.");
                };
                case null {
                  return #err("Asset is not found.");

                };
              };
            };
            case (null) {
              return #err("You have no ownership in this asset.");

            };
          };
        };
        case null {
          return #err("Asset is not found.");
        };
      };
    };

    public func approveInvestorProposal(
      investorProposalId : Text,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (investorproposal.get(investorProposalId)) {
        case (?investorProposal) {
          switch (ownershipstorage.get(investorProposal.assetId)) {
            case (?ownershipMap) {
              switch (ownershipMap.get(caller)) {
                case (?ownership) {
                  if (investorProposal.approvals.get(caller) != null) {
                    return #err("You have already approved this proposal.");
                  };

                  let percentage : Float = ownership.percentage;

                  let newProposal : DataType.InvestorProposal = {
                    id = investorProposal.id;
                    assetId = investorProposal.assetId;
                    investor = investorProposal.investor;
                    amount = investorProposal.amount;
                    pricePerToken = investorProposal.pricePerToken;
                    totalPrice = investorProposal.totalPrice;
                    approvals = investorProposal.approvals; // mutable HashMap
                    createdAt = investorProposal.createdAt;
                  };

                  newProposal.approvals.put(caller, percentage);

                  ignore investorproposal.update(investorProposalId, newProposal);

                  return #ok("Successfully approved with " # Float.toText(percentage) # "% ownership.");
                };
                case null {
                  return #err("You do not own any token of this asset.");
                };
              };
            };
            case null {
              return #err("No ownership data found for this asset.");
            };
          };
        };
        case null {
          return #err("There is no investor proposal found.");
        };
      };
    };

    public func finishTheInvitation(
      investorProposalId : Text,
      price : Nat,
      caller : Principal,
    ) : async Result.Result<Text, Text> {

      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (investorproposal.get(investorProposalId)) {
        case (?invitation) {
          switch (invitation.investor == caller) {
            case (true) {
              if (invitation.totalPrice != price) {
                return #err("The price you are withdraw is not sufficient.");
              };

              switch (assetstorage.get(invitation.assetId)) {
                case (?asset) {
                  let now = Time.now();

                  let createdTransaction : InputType.TransactionInput = {
                    assetId = invitation.assetId;
                    from = asset.creator;
                    to = caller;
                    totalPurchasedToken = invitation.amount;
                    pricePerToken = invitation.pricePerToken;
                    totalPrice = price;
                    transactionType = #Buy;
                    transactionStatus = #Completed;
                    details = null;

                    timestamp = now;
                  };

                  let percentage : Float = Float.fromInt(invitation.amount) / Float.fromInt(asset.totalToken);

                  let createownershipstatus = ownershipstorage.addNewOwnershipHolder(
                    asset.id,
                    caller,
                    invitation.amount,
                    percentage,
                    now,
                    invitation.totalPrice,
                    asset.rule.paymentMaturityTime,
                  );

                  if (not createownershipstatus) {
                    return #err("failed to create ownership");
                  };

                  let updatedAsset : DataType.Asset = {
                    id = asset.id;
                    creator = asset.creator;
                    name = asset.name;
                    description = asset.description;
                    totalToken = asset.totalToken;
                    tokenLeft = asset.tokenLeft - invitation.amount;
                    providedToken = asset.providedToken;
                    pendingToken = asset.pendingToken + invitation.amount;
                    minTokenPurchased = asset.minTokenPurchased;
                    maxTokenPurchased = asset.maxTokenPurchased;
                    pricePerToken = asset.pricePerToken;
                    locationInfo = asset.locationInfo;
                    documentHash = asset.documentHash;
                    assetType = asset.assetType;
                    assetStatus = asset.assetStatus;
                    rule = asset.rule;
                    riskScore = asset.riskScore;

                    createdAt = asset.createdAt;
                    updatedAt = now;
                  };

                  let _transactionid = transaction.create(createdTransaction);
                  let _updateAssetStatus = assetstorage.update(asset.id, updatedAsset);

                  return #ok("Accepted the invitation.");
                };
                case (null) {
                  return #err("Invalid investor proposal of there is no asset.");

                };
              };
            };
            case (false) {
              return #err("Not allowed this invitation.");
            };
          };
        };
        case (null) {
          return #err("Invitation is not found.");
        };
      };
    };

    public func getMyProposal(caller : Principal) : async ?[DataType.ProposalResult] {
      let buyProposalEntries = buyproposal.getEntries();

      let filtered = Iter.filter<(Text, DataType.BuyProposal)>(
        buyProposalEntries,
        func((key, proposal) : (Text, DataType.BuyProposal)) : Bool {
          switch (ownershipstorage.get(proposal.assetId)) {
            case (null) {
              proposal.buyer == caller;
            };
            case (?owners) {
              switch (owners.get(caller)) {
                case (null) {
                  proposal.buyer == caller;
                };
                case (?_) {
                  false;
                };
              };
            };
          };
        },
      );

      let mapped = Iter.map<(Text, DataType.BuyProposal), DataType.ProposalResult>(
        filtered,
        func((key, proposal) : (Text, DataType.BuyProposal)) : DataType.ProposalResult {
          // hitung voterPercentage
          let approvalVals = proposal.approvals.vals();
          var total : Float = 0;
          var count : Nat = 0;
          for (val in approvalVals) {
            total += val;
            count += 1;
          };
          let voterPercentage = if (count > 0) { total } else { 0.0 };

          {
            id = proposal.id;
            assetId = proposal.assetId;
            amount = proposal.amount;
            pricePerToken = proposal.pricePerToken;
            totalPrice = proposal.totalPrice;
            createdAt = proposal.createdAt;
            downPaymentStatus = proposal.downPaymentStatus;
            downPaymentTimeStamp = proposal.downPaymentTimeStamp;
            voterPercentage = voterPercentage;
          };
        },
      );

      let result = Iter.toArray(mapped);

      if (result.size() > 0) {
        ?result;
      } else {
        null;
      };
    };

    public func getProposalbyAssetId(assetId : Text) : async ?[DataType.ProposalResult] {
      let buyProposalEntries = buyproposal.getEntries();

      let filtered = Iter.filter<(Text, DataType.BuyProposal)>(
        buyProposalEntries,
        func((key, proposal) : (Text, DataType.BuyProposal)) : Bool {
          proposal.assetId == assetId;
        },
      );

      let mapped = Iter.map<(Text, DataType.BuyProposal), DataType.ProposalResult>(
        filtered,
        func((key, proposal) : (Text, DataType.BuyProposal)) : DataType.ProposalResult {
          // hitung voterPercentage
          let approvalVals = proposal.approvals.vals();
          var total : Float = 0;
          var count : Nat = 0;
          for (val in approvalVals) {
            total += val;
            count += 1;
          };
          let voterPercentage = if (count > 0) { total } else {
            0.0;
          };

          {
            id = proposal.id;
            assetId = proposal.assetId;
            amount = proposal.amount;
            pricePerToken = proposal.pricePerToken;
            totalPrice = proposal.totalPrice;
            createdAt = proposal.createdAt;
            downPaymentStatus = proposal.downPaymentStatus;
            downPaymentTimeStamp = proposal.downPaymentTimeStamp;
            voterPercentage = voterPercentage;
          };
        },
      );

      let result = Iter.toArray(mapped);

      if (result.size() > 0) {
        ?result;
      } else {
        null;
      };
    };

  };
};
