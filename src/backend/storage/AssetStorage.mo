import DataType "../data/dataType";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import InputType "../data/inputType";

module AssetStorage {
  public class AssetStorageClass() {
    private var assetStorage = HashMap.HashMap<Text, DataType.Asset>(10, Text.equal, Text.hash);
    private var assetCounter : Nat = 0;
    private var assetIds = Buffer.Buffer<Text>(100);
    private var assetName = Buffer.Buffer<Text>(100);

    public func create(insertedasset : InputType.CreateAssetInput) : Text {

      let id = "asset-" # Nat.toText(assetCounter);
      assetCounter += 1;

      let asset : DataType.Asset = {
        id = id;

        creator = insertedasset.creator;
        name = insertedasset.name;
        description = insertedasset.description;

        totalToken = insertedasset.totalToken;
        tokenLeft = insertedasset.tokenLeft;
        pendingToken = insertedasset.pendingToken;
        minTokenPurchased = insertedasset.minTokenPurchased;
        maxTokenPurchased = insertedasset.maxTokenPurchased;
        pricePerToken = insertedasset.pricePerToken;

        locationInfo = insertedasset.locationInfo;
        documentHash = insertedasset.documentHash;

        assetType = insertedasset.assetType;
        assetStatus = insertedasset.assetStatus;
        rule = insertedasset.rule;

        ownershipMaturityTime = insertedasset.ownershipMaturityTime;

        createdAt = Time.now();
        updatedAt = Time.now();
      };
      assetStorage.put(id, asset);
      assetIds.add(id);
      assetName.add(insertedasset.name);
      id;
    };

    public func editAssetStatus(assetId : Text, newStatus : DataType.AssetStatus) : Text {
      switch (assetStorage.get(assetId)) {
        case (?asset) {
          let updated : DataType.Asset = {
            id = asset.id;

            creator = asset.creator;
            name = asset.name;
            description = asset.description;

            totalToken = asset.totalToken;
            tokenLeft = asset.tokenLeft;
            pendingToken = asset.pendingToken;
            minTokenPurchased = asset.minTokenPurchased;
            maxTokenPurchased = asset.maxTokenPurchased;
            pricePerToken = asset.pricePerToken;

            locationInfo = asset.locationInfo;
            documentHash = asset.documentHash;

            assetType = asset.assetType;
            assetStatus = newStatus;
            rule = asset.rule;

            ownershipMaturityTime = asset.ownershipMaturityTime;

            createdAt = asset.createdAt;
            updatedAt = Time.now();
          };
          assetStorage.put(assetId, updated);
          return "Asset status updated for " # assetId;
        };
        case (null) {
          return "Asset not found: " # assetId;
        };
      };
    };

    public func get(id : Text) : ?DataType.Asset {
      return assetStorage.get(id);
    };

    public func getAll() : [DataType.Asset] {
      Iter.toArray(assetStorage.vals());
    };

    public func findAssetIdByName(querydata : Text) : ?Text {
      let q = Text.toLowercase(querydata);
      var idx : Nat = 0;
      label l for (name in assetName.vals()) {
        if (Text.toLowercase(name) == q) {
          return ?(assetIds.get(idx));
        };
        idx += 1;
      };
      return null;
    };

    public func getRange(startIndex : Nat, endIndex : Nat) : [DataType.Asset] {
      let idsArray = Buffer.toArray(assetIds);
      let totalItems = idsArray.size();

      if (startIndex >= totalItems or startIndex >= endIndex) return [];

      let actualEndIndex = Nat.min(endIndex, totalItems);
      var result = Buffer.Buffer<DataType.Asset>(actualEndIndex - startIndex);

      for (i in Iter.range(startIndex, actualEndIndex - 1)) {
        let id = idsArray[i];
        switch (assetStorage.get(id)) {
          case (?asset) { result.add(asset) };
          case null {};
        };
      };

      Buffer.toArray(result);
    };

    public func getTotalCount() : Nat {
      assetIds.size();
    };

    public func getEntries() : Iter.Iter<(Text, DataType.Asset)> {
      return assetStorage.entries();
    };

  };
};
