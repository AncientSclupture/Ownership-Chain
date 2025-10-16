import AssetStorage "storage/AssetStorage";
import AssetProposalStorage "storage/AssetProposalStorage";
import ComplaintStorage "storage/ComplaintStorage";
import OnwershipStorage "storage/OnwershipStorage";
import TransactionStorage "storage/TransactionStorage";
import TreasuryStorage "storage/TreasuryStorage";
import DataType "data/dataType";
import InputType "data/inputType";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Buffer "mo:base/Buffer";

persistent actor {
  private transient let assetStorage = AssetStorage.AssetStorageClass();
  private transient let assetproposalStorage = AssetProposalStorage.AssetProposalClass();
  private transient let complaintStorage = ComplaintStorage.ComplaintStorageClass();
  private transient let ownershipStorage = OnwershipStorage.OwnershipStorageClass();
  private transient let transactionStorage = TransactionStorage.TransactionStorageClass();
  private transient let treasuryStorage = TreasuryStorage.TreasuryStorageClass();

  // 1. User dapat membuat asset
  public shared (msg) func createAsset(input : InputType.CreateAssetInputApi) : async Text {
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

    return "Asset created successfully with id: " # assetId;
  };

  // 2. User dapat melakukan proposed asset (untuk membeli token)
  public shared (msg) func proposeAssetPurchase(
    assetid : Text,
    token : Nat,
    pricePerToken : Nat,
    amount : Nat,
  ) : async Text {
    let caller = msg.caller;

    // Validasi asset exist
    switch (assetStorage.get(assetid)) {
      case (null) { return "Asset not found" };
      case (?asset) {
        // Validasi token availability
        if (asset.tokenLeft < token) {
          return "Insufficient tokens available";
        };

        // Validasi min/max token
        if (token < asset.minTokenPurchased or token > asset.maxTokenPurchased) {
          return "Token amount must be between " # debug_show (asset.minTokenPurchased) # " and " # debug_show (asset.maxTokenPurchased);
        };

        // Hitung total DP (misalnya 20% dari total price)
        let totalPrice = token * pricePerToken;
        let dpAmount = totalPrice * 20 / 100;

        // Validasi DP amount
        if (dpAmount > amount) {
          return "Down payment amount is insufficient. Required: " # debug_show (dpAmount);
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
          return msg # " - DP of " # debug_show (dpAmount) # " stored in treasury";
        } else {
          return msg;
        };
      };
    };
  };

  // 3. User dapat melakukan voting (untuk holder di asset yang sama)
  public shared (msg) func voteProposal(
    assetid : Text,
    proposalid : Text,
  ) : async Text {
    let caller = msg.caller;

    // Check apakah user adalah holder di asset ini
    switch (ownershipStorage.checkPartOfHolder(assetid, caller)) {
      case (null) { return "You must be a token holder to vote" };
      case (?ownership) {
        // Vote value berdasarkan jumlah token yang dimiliki
        let voteValue = Float.fromInt(ownership.tokenhold);

        let (msg, _success) = assetproposalStorage.voteProposal(assetid, proposalid, caller, voteValue);
        return msg;
      };
    };
  };

  // 4. User dapat melakukan finished payment (setelah proposal disetujui)
  public shared (msg) func finishPayment(
    assetid : Text,
    proposalid : Text,
  ) : async Text {
    let caller = msg.caller;

    // Get proposal
    switch (assetproposalStorage.getProposal(assetid, proposalid)) {
      case (null) { return "Proposal not found" };
      case (?proposal) {
        // Validasi caller adalah pembuat proposal
        if (proposal.from != caller) {
          return "Only proposal creator can finish payment";
        };

        // Get asset untuk validasi
        switch (assetStorage.get(assetid)) {
          case (null) { return "Asset not found" };
          case (?asset) {
            let totalPrice = proposal.token * proposal.pricePerToken;
            let dpAmount = totalPrice * 20 / 100;
            let remainingPayment : Nat = if (totalPrice >= dpAmount) {
              totalPrice - dpAmount;
            } else { 0 };

            // Buat transaksi untuk remaining payment
            let txInput : InputType.TransactionInput = {
              assetid = assetid;
              to = asset.creator;
              from = caller;
              totalprice = remainingPayment;
              transactionType = #Donepayment;
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

            return "Payment completed successfully. " # txMsg;
          };
        };
      };
    };
  };

  // 5. User dapat mengambil DP cashback (jika proposal ditolak)
  public shared (msg) func withdrawDPCashback(
    assetid : Text,
    tsid : Text,
    amount : Nat,
  ) : async Text {
    let caller = msg.caller;

    // Ambil DP dari treasury
    let (treasuryMsg, success) = treasuryStorage.takeTreasury(assetid, tsid, amount); // amount 0 untuk query

    if (not success) {
      return treasuryMsg;
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

    return "DP cashback withdrawn successfully";
  };

  // 6. User bisa transfer ke sesama holder di asset yang sama
  public shared (msg) func transferOwnership(
    assetid : Text,
    ownershipid : Text,
    to : Principal,
  ) : async Text {
    let caller = msg.caller;

    let result = ownershipStorage.changeOwnershipHolder(caller, to, assetid, ownershipid, 0, true);

    if (result == "Succes") {
      // Buat transaksi record
      let txInput : InputType.TransactionInput = {
        assetid = assetid;
        to = caller; // akan diganti dengan actual buyer di storage
        from = caller;
        totalprice = 0;
        transactionType = #Transfer;
        status = #Done;
      };

      let _ = transactionStorage.createTransaction(txInput);
    };

    return result;
  };

  public shared (msg) func buyOwnership(
    assetid : Text,
    ownershipid : Text,
    amount : Nat,
    from : Principal,
  ) : async Text {
    let caller = msg.caller;

    let result = ownershipStorage.changeOwnershipHolder(from, caller, assetid, ownershipid, amount, true);

    if (result == "Succes") {
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

    return result;
  };

  // 7. User bisa mendapatkan Liquidation sharing (ketika asset bankrupt/fraud)
  public shared (msg) func processLiquidation(
    assetid : Text,
    liquidationAmount : Nat,
  ) : async Text {
    let _caller = msg.caller;

    // Hanya creator atau admin yang bisa trigger liquidation
    switch (assetStorage.get(assetid)) {
      case (null) { return "Asset not found" };
      case (?asset) {
        // Update asset status menjadi Inactive
        let _ = assetStorage.editAssetStatus(assetid, #Inactive);

        // Create treasury ledger untuk liquidation
        let treasuryInput : InputType.CreateTreasuryLedgerInput = {
          assetid = assetid;
          description = "Liquidation fund distribution";
          treasuryledgerType = #AssetSupport;
          priceamount = liquidationAmount;
          from = asset.creator;
        };

        let _ = treasuryStorage.addNewTreasury(treasuryInput);

        // Note: Distribution ke holders harus dilakukan secara terpisah berdasarkan proporsi token

        return "Liquidation process initiated for asset " # assetid;
      };
    };
  };

  // 8. User bisa melakukan pengaduan ke asset tertentu
  public shared (msg) func fileComplaint(
    assetid : Text,
    reason : Text,
    complaintType : DataType.ComplaintType,
  ) : async Text {
    let caller = msg.caller;

    let input : InputType.ComplaintInput = {
      reporter = caller;
      reason = reason;
      complaintType = complaintType;
      assetid = assetid;
      resolved = false;
    };

    return complaintStorage.createComplaint(input);
  };

  // 9. User bisa support asset
  public shared (msg) func supportAsset(
    assetid : Text,
    amount : Nat,
  ) : async Text {
    let caller = msg.caller;

    // Validasi asset exist
    switch (assetStorage.get(assetid)) {
      case (null) { return "Asset not found" };
      case (?asset) {
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
          return "Failed to add support to treasury";
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

        return "Support sent successfully to asset " # assetid;
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

  public query func getOwnershipById(assetid : Text, ownershipid : Text) : async ?DataType.AssetOwnership {
    return ownershipStorage.getOwnershipById(assetid, ownershipid);
  };

  public query func getTransactionByTransactionId(assetid : Text, transactionid : Text) : async ?DataType.Transaction {
    return transactionStorage.getTransactionByTransactionId(assetid, transactionid);
  };

  public query func getAssetDividend(assetid : Text) : async [DataType.Transaction]{
    return transactionStorage.getTransactionByType(assetid, #Dividend);
  };

  // Owner dapat menarik uang dari treasury setelah proposal disetujui
  public shared (msg) func withdrawFromTreasury(
    assetid : Text,
    tsid : Text,
    amount : Nat,
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
};
