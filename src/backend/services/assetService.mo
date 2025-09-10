import AssetStorage "../storage/AssetStorage";
import OwnershipsStorage "../storage/ownershipsStorage";
import UserStorage "../storage/UserStorage";
import DataType "../data/dataType";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Float "mo:base/Float";
import TrieMap "mo:base/TrieMap";
import Validation "../utils/validation";
import InputType "../data/inputType";

module {
  public class AssetServiceClass(
    assetstorage : AssetStorage.AssetStorageClass,
    ownershipstorage : OwnershipsStorage.OwnershipStorageClass,
    userstorage : UserStorage.UserStorageClass,
  ) {

    public func createAsset(
      name : Text,
      description : Text,
      totalToken : Nat,
      providedToken : Nat,
      minTokenPurchased : Nat,
      maxTokenPurchased : Nat,
      pricePerToken : Nat,
      locationInfo : DataType.LocationType,
      documentHash : [DataType.DocumentHash],
      assetType : DataType.AssetType,
      assetStatus : DataType.AssetStatus,
      rule : DataType.Rule,
      caller : Principal
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

      // sanity asset input validation
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

      let insertedAsset : InputType.AssetInput = {
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

      let createdAssetid = assetstorage.create(insertedAsset);

      let ownershipMap = TrieMap.TrieMap<Principal, DataType.Ownership>(Principal.equal, Principal.hash);
      let initial_percentage : Float = Float.fromInt(totalToken - providedToken) / Float.fromInt(totalToken);

      let initial_ownership_creator : DataType.Ownership = {
        id = createdAssetid;
        owner = caller;
        tokenOwned = totalToken - providedToken;
        percentage = initial_percentage;
        purchaseDate = now;
        purchasePrice = (totalToken - providedToken) * pricePerToken;
        maturityDate = 0;
      };
      ownershipMap.put(caller, initial_ownership_creator);
      let status = ownershipstorage.create(createdAssetid, ownershipMap);

      if (not status) {
        return #err("asset id has already taken");
      };

      return #ok("asset created" #createdAssetid);
    };

    public func changeAssetStatus(
      id : Text,
      status : DataType.AssetStatus,
      caller : Principal
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

      switch (assetstorage.get(id)) {
        case (null) { return #err("asset not found") };
        case (?existingasset) {
          if (existingasset.creator == caller) {
            switch (status) {
              case (#Active) {
                let updatedAsset : DataType.Asset = {
                  id = existingasset.id;
                  creator = existingasset.creator;
                  name = existingasset.name;
                  description = existingasset.description;
                  totalToken = existingasset.totalToken;
                  tokenLeft = existingasset.tokenLeft;
                  providedToken = existingasset.providedToken;
                  pendingToken = existingasset.pendingToken;
                  minTokenPurchased = existingasset.minTokenPurchased;
                  maxTokenPurchased = existingasset.maxTokenPurchased;
                  pricePerToken = existingasset.pricePerToken;
                  locationInfo = existingasset.locationInfo;
                  documentHash = existingasset.documentHash;

                  assetType = existingasset.assetType;
                  assetStatus = #Active;
                  rule = existingasset.rule;
                  riskScore = existingasset.riskScore;

                  createdAt = existingasset.createdAt;
                  updatedAt = Time.now();
                };
                let status = assetstorage.update(id, updatedAsset);
                if (not status) {
                  return #err("failed");
                };
              };
              case (#Inactive) {
                return #err("not allowed");
              };
              case (#Pending) {
                return #err("not allowed");
              };
              case (#Open) {
                let updatedAsset : DataType.Asset = {
                  id = existingasset.id;
                  creator = existingasset.creator;
                  name = existingasset.name;
                  description = existingasset.description;
                  totalToken = existingasset.totalToken;
                  tokenLeft = existingasset.tokenLeft;
                  providedToken = existingasset.providedToken;
                  pendingToken = existingasset.pendingToken;
                  minTokenPurchased = existingasset.minTokenPurchased;
                  maxTokenPurchased = existingasset.maxTokenPurchased;
                  pricePerToken = existingasset.pricePerToken;
                  locationInfo = existingasset.locationInfo;
                  documentHash = existingasset.documentHash;

                  assetType = existingasset.assetType;
                  assetStatus = #Open;
                  rule = existingasset.rule;
                  riskScore = existingasset.riskScore;

                  createdAt = existingasset.createdAt;
                  updatedAt = existingasset.updatedAt;
                };
                let status = assetstorage.update(id, updatedAsset);
                if (not status) {
                  return #err("failed");
                };
              };
            };
          };
          
          // owner validation if the creator != caller
          return #err("you are not the owner of asset");
        };
      };

      return #ok("updated asset status");
    };

  };
};
