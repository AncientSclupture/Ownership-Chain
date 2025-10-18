import AssetStorage "storage/AssetStorage";
import AssetProposalStorage "storage/AssetProposalStorage";
import ComplaintStorage "storage/ComplaintStorage";
import OnwershipStorage "storage/OnwershipStorage";
import TransactionStorage "storage/TransactionStorage";
import TreasuryStorage "storage/TreasuryStorage";
import UserKyc "storage/UserKYC";
import DataType "data/dataType";
import InputType "data/inputType";

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";

persistent actor {
  private transient let assetStorage = AssetStorage.AssetStorageClass();
  private transient let assetproposalStorage = AssetProposalStorage.AssetProposalClass();
  private transient let complaintStorage = ComplaintStorage.ComplaintStorageClass();
  private transient let ownershipStorage = OnwershipStorage.OwnershipStorageClass();
  private transient let transactionStorage = TransactionStorage.TransactionStorageClass();
  private transient let treasuryStorage = TreasuryStorage.TreasuryStorageClass();
  private transient let userStorage = UserKyc.UserKycStorageClass();

  // 1. User dapat membuat asset
  public shared (msg) func createAsset(input : InputType.CreateAssetInputApi) : async (Bool, Text) {
    let caller = msg.caller;

    let asset : InputType.CreateAssetInput = {
      creator = caller;
      name = input.name;
      description = input.description;

      totalToken = input.totalToken;
      tokenLeft = input.tokenLeft;
      pendingToken = 0;
      minTokenPurchased = input.minTokenPurchased;
      maxTokenPurchased = input.maxTokenPurchased;
      pricePerToken = input.pricePerToken;

      locationInfo = input.locationInfo;
      documentHash = input.documentHash;

      assetType = input.assetType;
      assetStatus = input.assetStatus;
      rule = input.rule;

      ownershipMaturityTime = input.ownershipMaturityTime;
    };

    let fee = userStorage.calcPercentage(input.pricePerToken * Float.fromInt(input.totalToken), 0.05);
    let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
    if (chargeStatus == false) {
      return (false, chargeMsg);
    };

    // Buat asset baru
    let assetId = assetStorage.create(asset);

    // Buat ownership untuk creator (initial holder)
    let ownershipInput : InputType.CreateOwnershipInput = {
      assetid = assetId;
      owner = caller;
      tokenhold = input.totalToken - input.tokenLeft;
      openForSale = false;
      buyingprice = 0;
      upuntil = 0;
      holdat = Time.now();
    };

    let _ = ownershipStorage.addNewHolder(assetId, ownershipInput);

    return (true, "Asset created successfully with id: " # assetId);
  };

  // 2. User dapat melakukan proposed asset (untuk membeli token)
  public shared (msg) func proposeAssetPurchase(
    assetid : Text,
    token : Nat,
    pricePerToken : Float,
    amount : Float,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // Validasi asset exist
    switch (assetStorage.get(assetid)) {
      case (null) { return (false, "Asset not found") };
      case (?asset) {
        // Validasi token availability
        if (asset.tokenLeft < token) {
          return (false, "Insufficient tokens available");
        };

        // Validasi min/max token
        if (token < asset.minTokenPurchased or token > asset.maxTokenPurchased) {
          return (false, "Token Transaction Amount must be greater than zero be between " # debug_show (asset.minTokenPurchased) # " and " # debug_show (asset.maxTokenPurchased));
        };

        // Hitung total DP (misalnya 20% dari total price)
        let totalPrice = Float.fromInt(token) * pricePerToken;
        let dpAmount = totalPrice * 20 / 100;

        // Validasi DP amount
        if (dpAmount > amount) {
          return (false, "Down payment amount is insufficient. Required: " # debug_show (dpAmount));
        };

        // Simpan DP ke treasury
        let treasuryInput : InputType.CreateTreasuryLedgerInput = {
          assetid = assetid;
          description = "Down payment for proposal purchase of " # debug_show (token) # " tokens";
          treasuryledgerType = #Donepayment;
          priceamount = dpAmount;
          from = caller;
        };

        let _ = treasuryStorage.addNewTreasury(treasuryInput);

        // Buat proposal
        let proposalInput : InputType.AssetProposalInput = {
          from = caller;
          assetid = assetid;
          token = token;
          pricePerToken = pricePerToken;
        };

        let (msg, success) = assetproposalStorage.initiateProposal(proposalInput);

        if (success) {
          let txInput : InputType.TransactionInput = {
            assetid = assetid;
            to = asset.creator;
            from = caller;
            totalprice = amount;
            transactionType = #Dividend;
            status = #Done;
          };

          let _txMsg = transactionStorage.createTransaction(txInput);
          return (false, msg # " - DP of " # debug_show (dpAmount) # " stored in treasury");
        } else {
          return (true, msg);
        };
      };
    };
  };

  // 3. User dapat melakukan voting (untuk holder di asset yang sama)
  public shared (msg) func voteProposal(
    assetid : Text,
    proposalid : Text,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // Check apakah user adalah holder di asset ini
    switch (ownershipStorage.checkPartOfHolder(assetid, caller)) {
      case (null) { return (false, "You must be a token holder to vote") };
      case (?ownership) {
        let voteValue = Float.fromInt(ownership.tokenhold);

        let (msg, success) = assetproposalStorage.voteProposal(assetid, proposalid, caller, voteValue);

        return (success, msg);
      };
    };
  };

  // 4. User dapat melakukan finished payment (setelah proposal disetujui)
  public shared (msg) func finishPayment(
    assetid : Text,
    proposalid : Text,
    amount : Float,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // Ambil proposal
    switch (assetproposalStorage.getProposal(assetid, proposalid)) {
      case (null) { return (false, "Proposal not found") };
      case (?proposal) {
        // Validasi bahwa caller adalah pembuat proposal
        if (proposal.from != caller) {
          return (false, "Only proposal creator can finish payment");
        };

        // Ambil data asset
        switch (assetStorage.get(assetid)) {
          case (null) { return (false, "Asset not found") };
          case (?asset) {
            let totalPrice = Float.fromInt(proposal.token) * proposal.pricePerToken;
            let dpAmount = totalPrice * 20 / 100;
            let remainingPayment = totalPrice - dpAmount;

            // Hitung rasio token terjual
            let soldRatio : Float = Float.fromInt(asset.totalToken - asset.tokenLeft) / Float.fromInt(asset.totalToken);

            // Hitung total vote value
            var totalVoteValue : Float = 0;
            for ((_, value) in proposal.votes.vals()) {
              totalVoteValue += value;
            };

            let voteRatio : Float = totalVoteValue / Float.fromInt(asset.totalToken);

            // Validasi berdasarkan kondisi voting
            if (soldRatio < 0.5) {
              if (voteRatio < soldRatio) {
                let percentage : Text = Float.toText(voteRatio * Float.fromInt(100));
                return (
                  false,
                  "Voting approval not enough (" # percentage # "%) to continue payment.",
                );
              };
            };

            if (soldRatio >= 0.5) {
              if (voteRatio <= 0.5) {
                return (
                  false,
                  "Voting approval not enough (<50%) to continue payment.",
                );
              };
            };

            // Validasi jumlah pembayaran
            if (remainingPayment != amount) {
              return (false, "Payment failed, because insufficient amount");
            };

            // Kurangi token di asset
            let (status, reduceTokenMsg) = assetStorage.reduceAssetToken(asset.id, proposal.token);

            if (status == false) {
              return (false, reduceTokenMsg);
            };

            let (tsIdStatus, tsFoundedMsg) = treasuryStorage.getTreasuryForDonePayment(assetid, caller);

            if (tsIdStatus == false) {
              return (false, tsFoundedMsg);
            };

            let (treasuryMsg, success) = treasuryStorage.takeTreasury(assetid, tsFoundedMsg, dpAmount);

            if (not success) {
              return (false, treasuryMsg);
            };

            let fee = userStorage.calcPercentage(amount, 0.05);
            let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
            if (chargeStatus == false) {
              return (false, chargeMsg);
            };

            // Buat transaksi pembayaran
            let txInput : InputType.TransactionInput = {
              assetid = assetid;
              to = asset.creator;
              from = caller;
              totalprice = remainingPayment;
              transactionType = #Buy;
              status = #Done;
            };

            let txMsg = transactionStorage.createTransaction(txInput);

            // Transfer ownership ke buyer
            let ownershipInput : InputType.CreateOwnershipInput = {
              assetid = assetid;
              owner = caller;
              tokenhold = proposal.token;
              openForSale = false;
              buyingprice = proposal.pricePerToken;
              upuntil = Time.now() + asset.ownershipMaturityTime;
              holdat = Time.now();
            };

            let _ = ownershipStorage.addNewHolder(assetid, ownershipInput);

            return (true, "Payment completed successfully. " # txMsg);
          };
        };
      };
    };
  };

  // 5. User dapat mengambil DP cashback (jika proposal ditolak)
  public shared (msg) func withdrawDPCashback(
    assetid : Text,
    tsid : Text,
    proposalid : Text,
    amount : Float,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // validasi expiredtime dari proposal by default in 20 days
    let (validationStatus, isexpiredStatus) = assetproposalStorage.validateExpired(assetid, proposalid, 20);

    if (validationStatus == false) {
      return (false, "Proposal fetching is not valid");
    };

    if (isexpiredStatus == false) {
      return (false, "Proposal fetching is not expired yet");
    };

    // Ambil DP dari treasury
    let (treasuryMsg, success) = treasuryStorage.takeTreasury(assetid, tsid, amount); // amount 0 untuk query

    if (not success) {
      return (false, treasuryMsg);
    };

    let fee = userStorage.calcPercentage(amount, 0.02);
    let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
    if (chargeStatus == false) {
      return (false, chargeMsg);
    };

    // Buat transaksi cashback
    let txInput : InputType.TransactionInput = {
      assetid = assetid;
      to = caller;
      from = caller;
      totalprice = 0; // Seharusnya ambil dari treasury data
      transactionType = #DonepaymentCashback;
      status = #Done;
    };

    let _ = transactionStorage.createTransaction(txInput);

    return (true, "DP cashback withdrawn successfully");
  };

  // 6. User bisa transfer ke sesama holder di asset yang sama
  public shared (msg) func transferOwnership(
    assetid : Text,
    ownershipid : Text,
    to : Principal,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    let (status, resultmsg) = ownershipStorage.changeOwnershipHolder(caller, to, assetid, ownershipid, 0, true);

    if (status == false) {
      return (status, resultmsg);
    };

    let fee = userStorage.calcPercentage(1, 1.0);
    let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
    if (chargeStatus == false) {
      return (false, chargeMsg);
    };

    if (status == true) {
      // Buat transaksi record
      let txInput : InputType.TransactionInput = {
        assetid = assetid;
        to = to;
        from = caller;
        totalprice = 0;
        transactionType = #Transfer;
        status = #Done;
      };

      let _ = transactionStorage.createTransaction(txInput);
    };

    return (true, resultmsg);
  };

  public shared (msg) func buyOwnership(
    assetid : Text,
    ownershipid : Text,
    amount : Float,
    from : Principal,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    let isForOpen = ownershipStorage.isOwnershipForSale(assetid, ownershipid);

    if (isForOpen == false) {
      return (false, "Ownership is not for sale");
    };

    let (status, result) = ownershipStorage.changeOwnershipHolder(from, caller, assetid, ownershipid, amount, true);

    if (status == false) {
      return (status, result);
    };

    if (amount == 0.0) {
      let fee = userStorage.calcPercentage(1.0, 1.0);
      let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
      if (chargeStatus == false) {
        return (false, chargeMsg);
      };

      let (mockTransferStatus, mockTransferMsg) = userStorage.mockTransferBalance(caller, from, fee);
      if (mockTransferStatus == false) {
        return (false, mockTransferMsg);
      };
    };

    let fee = userStorage.calcPercentage(amount, 0.2);
    let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
    if (chargeStatus == false) {
      return (false, chargeMsg);
    };
    let (mockTransferStatus, mockTransferMsg) = userStorage.mockTransferBalance(caller, from, fee);
    if (mockTransferStatus == false) {
      return (false, mockTransferMsg);
    };

    if (status == true) {
      // Buat transaksi record
      let txInput : InputType.TransactionInput = {
        assetid = assetid;
        to = from;
        from = caller;
        totalprice = amount;
        transactionType = #Transfer;
        status = #Done;
      };

      let _ = transactionStorage.createTransaction(txInput);
    };

    return (true, result);
  };

  // 7. User bisa mendapatkan Liquidation sharing (ketika asset bankrupt/fraud)
  public shared (msg) func processLiquidation(
    assetid : Text
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // Hanya creator atau admin yang bisa trigger liquidation
    switch (assetStorage.get(assetid)) {
      case (null) { return (false, "Asset not found") };
      case (?asset) {
        // Update asset status menjadi Inactive
        if (asset.assetStatus != #Inactive) {
          return (false, "Asset is Still alive");
        };

        let (ownershipStatus, tokenHold) = ownershipStorage.getTokenHolder(assetid, caller);

        if (ownershipStatus == false) {
          return (false, "You are not the sharing holder");
        };

        let liquidationAmount : Float = treasuryStorage.getTotalAssetFunding(assetid) * Float.fromInt(tokenHold) / Float.fromInt(asset.totalToken);

        let fee = userStorage.calcPercentage(liquidationAmount, 0.02);
        let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
        if (chargeStatus == false) {
          return (false, chargeMsg);
        };

        let (fundingStatus, fundingAmount) = treasuryStorage.getFundingFromAssetTreasuryTotal(assetid, liquidationAmount);

        if (fundingStatus == false) {
          return (false, "Cannot funding from asset support");
        };

        // Create treasury ledger untuk liquidation
        let treasuryInput : InputType.CreateTreasuryLedgerInput = {
          assetid = assetid;
          description = "Liquidation fund distribution";
          treasuryledgerType = #AssetSupport;
          priceamount = fundingAmount;
          from = asset.creator;
        };

        let _ = treasuryStorage.addNewTreasury(treasuryInput);

        return (true, "Liquidation process initiated for asset " # assetid);
      };
    };
  };

  // 8. User bisa melakukan pengaduan ke asset tertentu
  public shared (msg) func fileComplaint(
    assetid : Text,
    reason : Text,
    complaintType : DataType.ComplaintType,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    let (chengeassetStatus, changeassetMsg) = assetStorage.editAssetStatus(assetid, #Pending);

    if (chengeassetStatus == false) {
      return (false, changeassetMsg);
    };

    let input : InputType.ComplaintInput = {
      reporter = caller;
      reason = reason;
      complaintType = complaintType;
      assetid = assetid;
      resolved = false;
    };

    return (true, complaintStorage.createComplaint(input));
  };

  public shared (msg) func inactiveAsset(assetid : Text) : async (Bool, Text) {
    let caller = msg.caller;
    switch (assetStorage.get(assetid)) {
      case (null) { return (false, "Asset not found") };
      case (?asset) {
        if (asset.creator != caller) {
          return (false, "You are not the asset creator");
        };
        let fee = userStorage.calcPercentage(asset.pricePerToken * Float.fromInt(asset.totalToken), 0.5);
        let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
        if (chargeStatus == false) {
          return (false, chargeMsg);
        };
      };
    };
    return assetStorage.editAssetStatus(assetid, #Inactive);
  };

  // 9. User bisa support asset
  public shared (msg) func supportAsset(
    assetid : Text,
    amount : Float,
  ) : async (Bool, Text) {
    let caller = msg.caller;

    // Validasi asset exist
    switch (assetStorage.get(assetid)) {
      case (null) { return (false, "Asset not found") };
      case (?asset) {

        let fee = userStorage.calcPercentage(amount, 0.02);
        let (chargeStatus, chargeMsg) = userStorage.chargeTo(caller, fee);
        if (chargeStatus == false) {
          return (false, chargeMsg);
        };

        // Simpan support ke treasury
        let treasuryInput : InputType.CreateTreasuryLedgerInput = {
          assetid = assetid;
          description = "Asset support from user";
          treasuryledgerType = #AssetSupport;
          priceamount = amount;
          from = caller;
        };

        let trsRes = treasuryStorage.addNewTreasury(treasuryInput);

        if (trsRes != "Treasury added") {
          return (false, "Failed to add support to treasury");
        };

        // Buat transaksi record
        let txInput : InputType.TransactionInput = {
          assetid = assetid;
          to = asset.creator;
          from = caller;
          totalprice = amount;
          transactionType = #Supportasset;
          status = #Done;
        };

        let _ = transactionStorage.createTransaction(txInput);

        return (true, "Support sent successfully to asset " # assetid);
      };
    };
  };

  public shared (msg) func openMyOwnership(assetid : Text, ownershipid : Text) : async (Bool, Text) {
    let caller = msg.caller;
    return ownershipStorage.openMyOwnership(assetid, ownershipid, caller);
  };

  public shared (msg) func shareDevidend(assetid : Text, totalDevidend : Float) : async (Bool, Text) {
    switch (assetStorage.get(assetid)) {
      case (null) { return (false, "Asset not found") };
      case (?asset) {
        if (asset.creator != msg.caller) {
          return (false, "You are not the asset holder");
        };
        let tokenHoldInTotal : Nat = asset.totalToken - asset.tokenLeft;
        let holders : [DataType.AssetOwnership] = ownershipStorage.getAllOwnershipByAssetId(assetid);
        for (ownershipHolder in holders.vals()) {
          let proportion = Float.fromInt(ownershipHolder.tokenhold) / Float.fromInt(tokenHoldInTotal);
          let amount = totalDevidend * proportion;

          let transactionInput : InputType.TransactionInput = {
            assetid = asset.id;
            to = ownershipHolder.owner;
            from = msg.caller;
            totalprice = amount;
            transactionType = #Dividend;
            status = #Done;
          };

          ignore transactionStorage.createTransaction(transactionInput);
        };
        return (true, "Success");
      };
    };
  };

  // Query functions
  public query func getAsset(assetid : Text) : async ?DataType.Asset {
    return assetStorage.get(assetid);
  };

  public query func getPersonalAset(user : Principal) : async [DataType.Asset] {
    var result = Buffer.Buffer<DataType.Asset>(10);
    for (entry in assetStorage.getEntries()) {
      let (_id, asset) = entry;
      if (asset.creator == user) {
        result.add(asset);
      };
    };
    Buffer.toArray(result);
  };

  public query func getAllAssets() : async [DataType.Asset] {
    return assetStorage.getAll();
  };

  public query func getMyOwnerships(user : Principal) : async [DataType.AssetOwnership] {
    return ownershipStorage.getMyOwnership(user);
  };

  public query func getAssetOwnerships(assetid : Text) : async [DataType.AssetOwnership] {
    return ownershipStorage.getAllOwnershipByAssetId(assetid);
  };

  public query func getAllTransactionsByAssetId(assetid : Text) : async [DataType.Transaction] {
    return transactionStorage.getAllTransactionByAssetId(assetid);
  };

  public query func getAllTreasury() : async [DataType.TreasuryLedger] {
    return treasuryStorage.getAllTreasury();
  };

  public query func getMyProposals(user : Principal) : async [DataType.AssetProposal] {
    return assetproposalStorage.getMyProposal(user);
  };

  public query func getAssetProposals(assetid : Text) : async [DataType.AssetProposal] {
    return assetproposalStorage.getAllProposalAsset(assetid);
  };

  public query func getProposal(assetid : Text, proposalid : Text) : async ?DataType.AssetProposal {
    return assetproposalStorage.getProposal(assetid, proposalid);
  };

  public query func getAssetComplaints(assetid : Text) : async [DataType.Complaint] {
    return complaintStorage.getComplaintByAssetid(assetid);
  };

  public query func getAssetByRange(start : Nat, end : Nat) : async [DataType.Asset] {
    return assetStorage.getRange(start, end);
  };

  public query func getTotalAsset() : async Nat {
    return assetStorage.getTotalCount();
  };

  public query func getAllTreasuryByAssetId(assetid : Text) : async [DataType.TreasuryLedger] {
    return treasuryStorage.getAllTreasuryByAssetId(assetid);
  };

  public query func getTreasuryByAssetId(assetid : Text, treasuryid : Text) : async ?DataType.TreasuryLedger {
    return treasuryStorage.getTreasurybyId(assetid, treasuryid);
  };

  public query func getOwnershipById(assetid : Text, ownershipid : Text) : async ?DataType.AssetOwnership {
    return ownershipStorage.getOwnershipById(assetid, ownershipid);
  };

  public query func getTransactionByTransactionId(assetid : Text, transactionid : Text) : async ?DataType.Transaction {
    return transactionStorage.getTransactionByTransactionId(assetid, transactionid);
  };

  public query func getAssetDividend(assetid : Text) : async [DataType.Transaction] {
    return transactionStorage.getTransactionByType(assetid, #Dividend);
  };

  // Owner dapat menarik uang dari treasury setelah proposal disetujui
  public shared (msg) func withdrawFromTreasury(
    assetid : Text,
    tsid : Text,
    amount : Float,
  ) : async Text {
    let caller = msg.caller;

    // Validasi caller adalah owner asset
    switch (assetStorage.get(assetid)) {
      case (null) { return "Asset not found" };
      case (?asset) {
        if (asset.creator != caller) {
          return "Only asset creator can withdraw from treasury";
        };

        let (msg, success) = treasuryStorage.takeTreasury(assetid, tsid, amount);

        if (success) {
          // Create transaction record
          let txInput : InputType.TransactionInput = {
            assetid = assetid;
            to = caller;
            from = caller;
            totalprice = amount;
            transactionType = #Liquidation;
            status = #Done;
          };

          let _ = transactionStorage.createTransaction(txInput);
        };

        return msg;
      };
    };
  };

  // Resolve complaint (for admin/moderator)
  public shared (_msg) func resolveComplaint(
    assetid : Text,
    complaintid : Text,
  ) : async Text {
    let (msg, _success) = complaintStorage.solveComplain(assetid, complaintid);
    return msg;
  };

  // demo purposes
  public shared (msg) func registKyc(surname : Text, publickey : ?Text) : async (Bool, Text) {
    return userStorage.createUser(msg.caller, surname, publickey);
  };

  public shared (msg) func addPublicKey(publickey : Text) : async (Bool, Text) {
    return userStorage.addPublicKey(msg.caller, publickey);
  };

  public query func getDevBalance() : async Float {
    return userStorage.getDevBalance();
  };

  public shared (msg) func myBalance() : async Float {
    return userStorage.getUserBalance(msg.caller);
  };

  public query func totalRegisteredUser() : async Nat {
    return userStorage.getUserCount();
  };

  public query func getRegisteredUser(user : Principal) : async ?DataType.User {
    return userStorage.getRegisteredUser(user);
  };

  // THIS IS FOR DEMO ONLY!!!!
  public shared (msg) func getBalanceForDemo() : async (Bool, Text) {
    return userStorage.mockTransferTo(msg.caller, 20);
  };
};
