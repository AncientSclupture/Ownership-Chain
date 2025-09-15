import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

module ReportStorage {
  public class ReportStorageClass() {
    // IMPORTANT NOTES: id key in reportActionsStorage hash is the same as the assetsStorage hash id key

    private var assetReportsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Report>>(100, Text.equal, Text.hash);

    public func create(report : DataType.Report) : ?Text {
      let assetId : Text = report.id;
      let reporter : Principal = report.complainer;

      switch (assetReportsStorage.get(assetId)) {
        case (?existingMap) {
          switch (existingMap.get(reporter)) {
            case (?_) { return null };
            case null {
              existingMap.put(reporter, report);
              assetReportsStorage.put(assetId, existingMap);
              return ?assetId;
            };
          };
        };

        case null {
          let newMap = TrieMap.TrieMap<Principal, DataType.Report>(
            Principal.equal,
            Principal.hash,
          );
          newMap.put(reporter, report);
          assetReportsStorage.put(assetId, newMap);
          return ?assetId;
        };
      };
    };

    public func get(id : Text) : ?TrieMap.TrieMap<Principal, DataType.Report> {
      assetReportsStorage.get(id);
    };

    public func getAll() : [TrieMap.TrieMap<Principal, DataType.Report>] {
      Iter.toArray(assetReportsStorage.vals());
    };

    public func update(id : Text, report : TrieMap.TrieMap<Principal, DataType.Report>) : Bool {
      switch (assetReportsStorage.get(id)) {
        case (?_existing) {
          assetReportsStorage.put(id, report);
          true;
        };
        case null { false };
      };
    };
  };
};
