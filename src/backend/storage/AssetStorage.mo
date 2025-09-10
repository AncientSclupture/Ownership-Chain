import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import InputType "../data/inputType";

module AssetStorage {
  public class AssetStorageClass() {
    private var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(100, Text.equal, Text.hash);
    private var assetCounter : Nat = 0;

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
      id;
    };

    public func get(id : Text) : ?DataType.Asset {
      assetsStorage.get(id);
    };

    public func getAll() : [DataType.Asset] {
      Iter.toArray(assetsStorage.vals());
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
