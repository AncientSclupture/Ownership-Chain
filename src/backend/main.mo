import DataType "data/dataType";
import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HelperId "utils/helperID";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Validation "utils/validation";
// import Array "mo:base/Array";

persistent actor {

  // data storage

  private transient var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(
    100,
    Text.equal,
    Text.hash,
  );
  private transient var assetCounter : Nat = 0;

  //   private transient var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(
  //     1000,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var transactionCounter : Nat = 0;

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

  //   private transient var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(
  //     100,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var buyProposalsCounter : Nat = 0;

  //   private transient var investorProposalsStorage = HashMap.HashMap<Text, DataType.InvestorProposal>(
  //     100,
  //     Text.equal,
  //     Text.hash,
  //   );
  //   private transient var investorProposalsCounter : Nat = 0;

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

  private func updateUserProtofolio(user : Principal, addToken : Nat, addAsset : Nat) : Bool {
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
        let newId = HelperId.userID(id);

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

    let newassetId = HelperId.assetID(assetType, assetid);

    let newAsset : DataType.Asset = {
      id = newassetId;
      creator = caller;
      name = name;
      description = description;
      totalToken = totalToken;
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
    let newownershipId = HelperId.ownershipID(ownershipid);

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

  public query func getAllAssets() : async [DataType.Asset] {
    Iter.toArray(assetsStorage.vals());
  };

  public query func getAssetOwners(assetId : Text) : async [(Principal, DataType.Ownership)] {
    switch (ownershipsStorage.get(assetId)) {
      case null { [] };
      case (?ownershipMap) { Iter.toArray(ownershipMap.entries()) };
    };
  };

  public query func getUsers() : async [DataType.User] {
    Iter.toArray(usersStorage.vals());
  };

};
