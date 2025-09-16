import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

module ReportActionStorage {
  public class ReportActionStorageClass() {
    // IMPORTANT NOTES: id key in reportActionsStorage hash is the same as the assetsStorage hash id key
    private var reportActionsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.ReportAction>>(100, Text.equal, Text.hash);

    public func create(caller : Principal, action : DataType.ReportAction) : ?Text {
      let assetId : Text = action.id;

      switch (reportActionsStorage.get(assetId)) {
        case (?existingMap) {
          switch (existingMap.get(caller)) {
            case (?_) { return null };
            case null {
              existingMap.put(caller, action);
              reportActionsStorage.put(assetId, existingMap);
              return ?assetId;
            };
          };
        };

        case null {
          let newMap = TrieMap.TrieMap<Principal, DataType.ReportAction>(
            Principal.equal,
            Principal.hash,
          );
          newMap.put(caller, action);
          reportActionsStorage.put(assetId, newMap);
          return ?assetId;
        };
      };
    };

    public func get(id : Text) : ?TrieMap.TrieMap<Principal, DataType.ReportAction> {
      reportActionsStorage.get(id);
    };

    public func getAll() : [TrieMap.TrieMap<Principal, DataType.ReportAction>] {
      Iter.toArray(reportActionsStorage.vals());
    };

    public func update(id : Text, action : TrieMap.TrieMap<Principal, DataType.ReportAction>) : Bool {
      switch (reportActionsStorage.get(id)) {
        case (?_existing) {
          reportActionsStorage.put(id, action);
          true;
        };
        case null { false };
      };
    };
  };
};
