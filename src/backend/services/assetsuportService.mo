import AssetSuportStorage "../storage/AssetSuportStorage";
import DataType "../data/dataType";
import UserStorage "../storage/UserStorage";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import TransactionStorage "../storage/TransactionStorage";
import AssetStorage "../storage/AssetStorage";
import OwnershipsStorage "../storage/ownershipsStorage";
import InputType "../data/inputType";

module {
  public class AssetSuportServiceClass(
    suportassetstorage : AssetSuportStorage.AssetSuportStorageClass,
    userstorage : UserStorage.UserStorageClass,
    transactionstorage : TransactionStorage.TransactionStorageClass,
    assetstorage : AssetStorage.AssetStorageClass,
    ownershipstorage : OwnershipsStorage.OwnershipStorageClass,
  ) {

    public func initializeNewAssetSponsor(input : DataType.AssetSponsorship, caller : Principal) : async Result.Result<Text, Text> {

      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not registered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {
              ignore suportassetstorage.initializeNewAssetSponsor(input, caller);
              return #ok("success to add new guarantee");
            };
          };
        };
      };
    };

    public func addNewSponsor(assetid : Text, input : DataType.AssetSponsorship, caller : Principal) : async Result.Result<Text, Text> {

      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not registered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {
              ignore suportassetstorage.addNewSponsor(assetid, input, caller);
              return #ok("success to add new guarantee");
            };
          };
        };
      };
    };

    public func createAssetGuarantee(input : DataType.AssetGuarantee, caller : Principal) : async Result.Result<Text, Text> {

      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not registered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {
              ignore suportassetstorage.createAssetGuarantee(input);
              return #ok("success to add new guarantee");
            };
          };
        };
      };
    };

    public func getAllSponsor() : async [DataType.AssetSponsorship] {
      suportassetstorage.getAllSponsorships();
    };

    public func getAllAssetGuarantees() : async [DataType.AssetGuarantee] {
      suportassetstorage.getAllAssetGuarantees();
    };

    public func getAssetGuarantee(assetid : Text) : async ?DataType.AssetGuarantee {
      suportassetstorage.getAssetGuarantee(assetid);
    };

    public func getSponsorsByAssetId(assetid : Text) : async [DataType.AssetSponsorship] {
      suportassetstorage.getSponsorsByAssetId(assetid);
    };

    public func getAllSponsorships() : async [DataType.AssetSponsorship] {
      suportassetstorage.getAllSponsorships();
    };

    public func claimAssetSponsorSurpot(assetId : Text, caller : Principal) : async Result.Result<Text, Text> {
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not registered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      switch (assetstorage.get(assetId)) {
        case (null) return #err("asset notfound");
        case (?asset) {
          switch (ownershipstorage.get(asset.id)) {
            case (null) { return #err("no ownership") };
            case (?ownershipMap) {
              if (asset.assetStatus == #Pending or asset.assetStatus == #Inactive) {
                return #err("the asset is not banned");
              };
              switch (ownershipMap.get(caller)) {
                case (null) return #err("you have no ownership in this asset");
                case (?ownership) {
                  let transactionInput : InputType.TransactionInput = {
                    assetId = asset.id;
                    from = asset.creator;
                    to = caller;
                    totalPurchasedToken = ownership.tokenOwned;
                    pricePerToken = ownership.purchasePrice;
                    totalPrice = ownership.tokenOwned * ownership.purchasePrice;
                    transactionType = #Redeem;
                    transactionStatus = #Completed;
                    details = ?"claim asset support";

                    timestamp = Time.now();
                  };
                  let _createdTransactionID = transactionstorage.create(transactionInput);
                  let _deleteownership = ownershipstorage.removeOwnership(assetId, caller);
                };
              };
            };
          };
        };
      };

      return #ok("success to add new guarantee");
    };
  };
};
