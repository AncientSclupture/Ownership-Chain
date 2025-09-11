import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import InputType "../data/inputType";

module AssetStorage {
  public class AssetStorageClass() {
    private var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(100, Text.equal, Text.hash);
    private var assetCounter : Nat = 0;
    private var assetIds = Buffer.Buffer<Text>(100);
    private var assetName = Buffer.Buffer<Text>(100);

    public func create(insertedasset : InputType.AssetInput) : Text {

      let id = "asset_" # Nat.toText(assetCounter);
      assetCounter += 1;

      let asset : DataType.Asset = {
        id = id;
        creator = insertedasset.creator;
        name = insertedasset.name;
        description = insertedasset.description;
        totalToken = insertedasset.totalToken;
        tokenLeft = insertedasset.tokenLeft;
        providedToken = insertedasset.providedToken;
        pendingToken = insertedasset.pendingToken;
        minTokenPurchased = insertedasset.minTokenPurchased;
        maxTokenPurchased = insertedasset.maxTokenPurchased;
        pricePerToken = insertedasset.pricePerToken;
        locationInfo = insertedasset.locationInfo;
        documentHash = insertedasset.documentHash;
        assetType = insertedasset.assetType;
        assetStatus = insertedasset.assetStatus;
        rule = insertedasset.rule;
        riskScore = insertedasset.riskScore;

        createdAt = insertedasset.createdAt;
        updatedAt = insertedasset.updatedAt;
      };
      assetsStorage.put(id, asset);
      assetIds.add(id);
      assetName.add(insertedasset.name);
      id;
    };

    public func get(id : Text) : ?DataType.Asset {
      assetsStorage.get(id);
    };

    public func getAll() : [DataType.Asset] {
      Iter.toArray(assetsStorage.vals());
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
        switch (assetsStorage.get(id)) {
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
      return assetsStorage.entries();
    };

    public func update(id : Text, asset : DataType.Asset) : Bool {
      switch (assetsStorage.get(id)) {
        case (?_existing) {
          assetsStorage.put(id, asset);
          true;
        };
        case null { false };
      };
    };
  };
};
