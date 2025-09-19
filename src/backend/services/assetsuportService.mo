import AssetSuportStorage "../storage/AssetSuportStorage";
import DataType "../data/dataType";
import UserStorage "../storage/UserStorage";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

module {
  public class AssetSuportServiceClass(
    suportassetstorage : AssetSuportStorage.AssetSuportStorageClass,
    userstorage : UserStorage.UserStorageClass,
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
  };
};
