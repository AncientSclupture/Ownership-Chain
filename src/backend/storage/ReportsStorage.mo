import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";

module ReportStorage {
    public class ReportStorageClass() {
        private var assetReportsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Report>>(100, Text.equal, Text.hash);
        private var assetReportsCounter : Nat = 0;

        public func create(report: TrieMap.TrieMap<Principal, DataType.Report>) : Text {
            let id = "r_" # Nat.toText(assetReportsCounter);
            assetReportsCounter += 1;
            assetReportsStorage.put(id, report);
            id
        };

        public func get(id: Text) : ?TrieMap.TrieMap<Principal, DataType.Report> {
            assetReportsStorage.get(id)
        };

        public func getAll() : [TrieMap.TrieMap<Principal, DataType.Report>] {
            Iter.toArray(assetReportsStorage.vals())
        };

        public func update(id: Text, report: TrieMap.TrieMap<Principal, DataType.Report>) : Bool {
            switch(assetReportsStorage.get(id)) {
                case (?_existing) {
                    assetReportsStorage.put(id, report);
                    true
                };
                case null { false };
            }
        };
    }
}