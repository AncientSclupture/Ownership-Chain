import DataType "data/dataType";
import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Helper "utils/helper";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Validation "utils/validation";

persistent actor {

  // data storage

  private transient var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(
    100,
    Text.equal,
    Text.hash,
  );
  private transient var assetCounter : Nat = 0;

  private transient var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(
    1000,
    Text.equal,
    Text.hash,
  );
  private transient var transactionCounter : Nat = 0;

  private transient var ownershipsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Ownership>>(
    1000,
    Text.equal,
    Text.hash,
  );
  private transient var ownershipsCounter : Nat = 0;

  private transient var usersStorage = HashMap.HashMap<Principal, DataType.User>(
    100,
    Principal.equal,
    Principal.hash,
  );
  private transient var userCounter : Nat = 0;

  private transient var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(
    100,
    Text.equal,
    Text.hash,
  );
  private transient var buyProposalsCounter : Nat = 0;

  // private transient var investorProposalsStorage = HashMap.HashMap<Text, DataType.InvestorProposal>(
  //   100,
  //   Text.equal,
  //   Text.hash,
  // );
  // private transient var investorProposalsCounter : Nat = 0;

  //   private transient var assetsReport = HashMap.HashMap<Text, TrieMap.TrieMap<Text, DataType.Report>>(
  //     100,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var assetsReportCounter : Nat = 0;

  //   private transient var assetReportAction = HashMap.HashMap<Text, TrieMap.TrieMap<Text, DataType.ReportAction>>(
  //     100,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var assetsReportActionCounter : Nat = 0;

  private func updateUserProtofolio(
    user : Principal,
    addToken : Nat,
    addAsset : Nat,
  ) : Bool {
    switch (usersStorage.get(user)) {
      case (?existsUser) {
        let updatedUser : DataType.User = {
          id = existsUser.id;
          fullName = existsUser.fullName;
          lastName = existsUser.lastName;
          phone = existsUser.phone;
          country = existsUser.country;
          city = existsUser.city;
          //   update proposals
          tokenHold = addToken + existsUser.tokenHold;
          totalAssets = addAsset + existsUser.totalAssets;

          userIDNumber = existsUser.userIDNumber;
          userIdentity = existsUser.userIdentity;

          kyc_level = existsUser.kyc_level;
          timeStamp = existsUser.timeStamp;
        };

        usersStorage.put(user, updatedUser);

        return true;
      };
      case null {
        return false;
      };
    };
  };

  private func isUserNotBanned(user : Principal) : Bool {
    switch (usersStorage.get(user)) {
      case (?existsUser) {
        return existsUser.kyc_level.status == #Verivied;
      };
      case null {
        return false;
      };
    };
  };

  public shared (msg) func registUser(
    fullName : Text,
    lastName : Text,
    phone : Text,
    country : Text,
    city : Text,

    userIDNumber : Text,
    userIdentity : DataType.IdentityNumberType,

  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;
    switch (usersStorage.get(caller)) {
      case (?_existsUser) {
        return #err("User Already Registered.");
      };
      case null {
        let now = Time.now();
        userCounter += 1;
        let id = userCounter;
        let newId = Helper.userID(id);

        let initial_kyc_user : DataType.UserKyc = {
          status = #Verivied;
          riskScore = 0;
        };

        let newUser : DataType.User = {
          id = newId;
          fullName = fullName;
          lastName = lastName;
          phone = phone;
          country = country;
          city = city;
          tokenHold = 0;
          totalAssets = 0;

          userIDNumber = userIDNumber;
          userIdentity = userIdentity;

          kyc_level = initial_kyc_user;
          timeStamp = now;
        };

        usersStorage.put(caller, newUser);

        return #ok(newId);
      };
    };

  };

  public shared (msg) func createAsset(
    name : Text,
    description : Text,
    totalToken : Nat,
    providedToken : Nat,
    minTokenPurchased : Nat,
    maxTokenPurchased : Nat,
    pricePerToken : Nat,
    locationInfo : Text,
    documentHash : [DataType.DocumentHash],
    assetType : DataType.AssetType,
    assetStatus : DataType.AssetStatus,
    rule : DataType.Rule,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to create asset.");
    };

    switch (
      Validation.validateAssetInput(
        totalToken,
        providedToken,
        minTokenPurchased,
        maxTokenPurchased,
        pricePerToken,
        rule,
        documentHash,
      )
    ) {
      case (#err(e)) return #err(e);
      case (#ok(_)) {};
    };

    let now = Time.now();
    assetCounter += 1;
    let assetid = assetCounter;

    let newassetId = Helper.assetID(assetType, assetid);

    let newAsset : DataType.Asset = {
      id = newassetId;
      creator = caller;
      name = name;
      description = description;
      totalToken = totalToken;
      tokenLeft = providedToken;
      providedToken = providedToken;
      pendingToken = 0;
      minTokenPurchased = minTokenPurchased;
      maxTokenPurchased = maxTokenPurchased;
      pricePerToken = pricePerToken;
      locationInfo = locationInfo;
      documentHash = documentHash;
      assetType = assetType;
      assetStatus = assetStatus;
      rule = rule;
      riskScore = 0.0;
      createdAt = now;
      updatedAt = now;
    };

    ownershipsCounter += 1;
    let ownershipid = ownershipsCounter;
    let newownershipId = Helper.ownershipID(ownershipid);

    let ownershipMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
    let initial_percentage : Float = Float.fromInt(totalToken - providedToken) / Float.fromInt(totalToken);
    let initial_ownership_creator : DataType.Ownership = {
      id = newownershipId;
      owner = caller;
      tokenOwned = totalToken - providedToken;
      percentage = initial_percentage;
      purchaseDate = now;
      purchasePrice = (totalToken - providedToken) * pricePerToken;
      maturityDate = 0;
    };

    if (
      updateUserProtofolio(
        caller,
        totalToken - providedToken,
        1,
      )
    ) {
      assetsStorage.put(newassetId, newAsset);
      ownershipMap.put(caller, initial_ownership_creator);
      ownershipsStorage.put(newassetId, ownershipMap);
      return #ok(newassetId);
    } else {
      return #err("Failed to update user portofolio.");
    }

  };

  public shared (msg) func proposedBuyToken(
    assetId : Text,
    amount : Nat,
    pricePerToken : Nat,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to proposed to buy token asset.");
    };

    if (amount == 0) {
      return #err("There is no token you are going to purchased.");
    };

    switch (
      Validation.validateExistAssetAndExistToken(
        caller,
        assetId,
        assetCounter,
        amount,
        assetsStorage,
      )
    ) {
      case (#err(e)) return #err(e);
      case (#ok(())) {};
    };

    let now = Time.now();

    buyProposalsCounter += 1;
    let proposalId = buyProposalsCounter;
    let newBuyProposalId = Helper.buyproposalID(proposalId);

    let newApprovals = HashMap.HashMap<Principal, Float>(10, Principal.equal, Principal.hash);

    switch (assetsStorage.get(assetId)) {
      case (?existAsset) {
        switch (existAsset.rule.needDownPayment) {
          case (true) {

            let newProposal : DataType.BuyProposal = {
              id = newBuyProposalId;
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

            buyProposalsStorage.put(newBuyProposalId, newProposal);
            return #ok("Your proposal is created, don't forget to do down payment as the asset rules.");
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

            let newProposal : DataType.BuyProposal = {
              id = newBuyProposalId;
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

            assetsStorage.put(assetId, updatedAsset);
            buyProposalsStorage.put(newBuyProposalId, newProposal);
            return #ok("Your proposal is created, waiting for the voting approval.");
          };
        };
      };
      case null {
        return #err("Asset is Not Found");
      };
    };

  };

  public shared (msg) func proceedDownPayment(
    price : Nat,
    buyProposalId : Text,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to proposed to buy token asset.");
    };

    let now = Time.now();

    switch (buyProposalsStorage.get(buyProposalId)) {
      case (?existProposal) {
        if (caller != existProposal.buyer) {
          return #err("You are not allowed to do downpayment of this proposal.");
        };

        switch (assetsStorage.get(existProposal.assetId)) {
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

            if (Float.fromInt(price / existProposal.totalPrice) < proposeAsset.rule.minDownPaymentPercentage) {
              return #err("The Price is not enough, with minimum dp is " # Float.toText(proposeAsset.rule.minDownPaymentPercentage) # ".");
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

            transactionCounter += 1;
            let transactionId = transactionCounter;
            let newTransactionId : Text = Helper.transactionID(#Downpayment, transactionId);

            let createdDPTransacation : DataType.Transaction = {
              id = newTransactionId;
              assetId = proposeAsset.id;
              from = caller;
              to = proposeAsset.creator;
              totalPurchasedToken = existProposal.totalPrice;
              pricePerToken = existProposal.pricePerToken;
              totalPrice = price;
              transactionType = #Downpayment;
              transactionStatus = #Completed;

              timestamp = now;
            };

            transactionsStorage.put(newTransactionId, createdDPTransacation);
            buyProposalsStorage.put(existProposal.id, updatedProposal);
            assetsStorage.put(existProposal.assetId, updatedAsset);
            return #ok("Success to do downpayemnt wait for the approval");
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

  public shared (msg) func finishedPayment(
    proposalId : Text,
    price : Nat,
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return #err("You are not allowed to finished the payment.");
    };

    switch (buyProposalsStorage.get(proposalId)) {
      case (?existProposal) {

        if (existProposal.downPaymentStatus == false) {
          return #err("Finished the downpayment first.");
        };

        var totalApproval : Float = 0;
        for ((_, percent) in existProposal.approvals.entries()) {
          totalApproval += percent;
        };

        if (totalApproval <= 51) {
          return #err("Approval percentage is not enough. Current: " # Float.toText(totalApproval) # "%");
        };

        switch (assetsStorage.get(existProposal.assetId)) {
          case (?existAsset) {

            let totalAssetPricePurchased : Nat = existAsset.pricePerToken * existProposal.totalPrice;
            let remainingPriceleft : Nat = totalAssetPricePurchased - existProposal.amount;

            if (price != remainingPriceleft) {
              return #err("Not Enough Price.");
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

            ownershipsCounter += 1;
            let ownershipid = ownershipsCounter;
            let newownershipId = Helper.ownershipID(ownershipid);

            let percentage : Float = Float.fromInt(existProposal.amount) / Float.fromInt(existAsset.totalToken);
            let ownershipMaturityTime : Int = now + existAsset.rule.paymentMaturityTime * 1_000_000_000 * 60 * 60 * 24;
            let createdOwnership : DataType.Ownership = {
              id = newownershipId;
              owner = caller;
              tokenOwned = existProposal.amount;
              percentage = percentage;
              purchaseDate = now;
              purchasePrice = remainingPriceleft + price;
              maturityDate = ownershipMaturityTime;
            };

            switch (ownershipsStorage.get(existAsset.id)) {
              case (?existingMap) {
                existingMap.put(caller, createdOwnership);
                ownershipsStorage.put(existAsset.id, existingMap);
              };
              case (null) {
                let newMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
                newMap.put(caller, createdOwnership);
                ownershipsStorage.put(existAsset.id, newMap);
              };
            };

            assetsStorage.put(existAsset.id, updatedAsset);
            return #ok("Success to get the token.");

          };
          case (null) {
            return #ok("Success to get the token.");

          };
        };
      };
      case (null) {
        return #err("Proposal is not found.");
      };
    };

  };

  public shared (msg) func approveBuyProposal(
    buyProposalId : Text
  ) : async Result.Result<Text, Text> {
    let caller : Principal = msg.caller;

    switch (buyProposalsStorage.get(buyProposalId)) {
      case (?existProposal) {
        switch (ownershipsStorage.get(existProposal.assetId)) {
          case (?ownershipMap) {
            switch (ownershipMap.get(caller)) {
              case (?ownership) {

                if (existProposal.approvals.get(caller) != null) {
                  return #err("You have already approved this proposal.");
                };

                let percentage : Float = ownership.percentage;
                existProposal.approvals.put(caller, percentage);
                buyProposalsStorage.put(buyProposalId, existProposal);

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

  public shared (msg) func getMyBuyProposals() : async [DataType.MyProposalResult] {
    let caller : Principal = msg.caller;
    var summaries : [DataType.MyProposalResult] = [];

    if (not isUserNotBanned(caller)) {
      return summaries;
    };

    let myProposals = Array.filter<DataType.BuyProposal>(
      Iter.toArray(buyProposalsStorage.vals()),
      func(proposal : DataType.BuyProposal) : Bool {
        proposal.buyer == caller;
      },
    );

    for (proposal in myProposals.vals()) {
      var totalApproval : Float = 0;
      for ((_, percent) in proposal.approvals.entries()) {
        totalApproval += percent;
      };

      let isApproved = totalApproval >= 51;

      summaries := Array.append(
        summaries,
        [{
          assetId = proposal.assetId;
          downPaymentStatus = proposal.downPaymentStatus;
          isApprove = isApproved;
          approvals = Iter.toArray(proposal.approvals.entries());
        }],
      );
    };

    return summaries;
  };

  public query func getAllAssets() : async [DataType.Asset] {
    Iter.toArray(assetsStorage.vals());
  };

  public shared (msg) func getVotableBuyProposal() : async [DataType.MyVotablePoroposalResult] {
    let caller : Principal = msg.caller;

    if (not isUserNotBanned(caller)) {
      return [];
    };

    var results = Buffer.Buffer<DataType.MyVotablePoroposalResult>(0);

    for ((proposalId, proposal) in buyProposalsStorage.entries()) {
      switch (ownershipsStorage.get(proposal.assetId)) {
        case (?ownershipMap) {
          switch (ownershipMap.get(caller)) {
            case (?ownership) {
              switch (assetsStorage.get(proposal.assetId)) {
                case (?asset) {
                  let createdResults : DataType.MyVotablePoroposalResult = {
                    proposalId = proposal.id;
                    assetId = proposal.assetId;
                    asstName = asset.name;
                    buyer = proposal.buyer;
                    tokenAmount = proposal.amount;
                    pricePerToken = proposal.pricePerToken;
                    approvalResult = Helper.calculateTotalApprovalPercentage(proposal.approvals);
                    myVotePercentage = ownership.percentage;
                  };

                  results.add(createdResults);
                };
                case (null) {};
              };
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };

    Buffer.toArray(results);
  };

  public query func getUsers() : async [DataType.User] {
    Iter.toArray(usersStorage.vals());
  };

  public shared (msg) func getMyAssets() : async [DataType.Asset] {
    let caller : Principal = msg.caller;
    let data = Array.filter<DataType.Asset>(
      Iter.toArray(assetsStorage.vals()),
      func(asset : DataType.Asset) : Bool {
        asset.creator == caller;
      },
    );
    return data;
  };

  public shared (msg) func getMyOwnerShip() : async [DataType.Ownership] {
    let caller : Principal = msg.caller;
    var myOwnerships : [DataType.Ownership] = [];

    for ((_, ownershipMap) in ownershipsStorage.entries()) {
      switch (ownershipMap.get(caller)) {
        case (?ownership) {
          myOwnerships := Array.append(myOwnerships, [ownership]);
        };
        case (null) {};
      };
    };

    return myOwnerships;
  };

};
