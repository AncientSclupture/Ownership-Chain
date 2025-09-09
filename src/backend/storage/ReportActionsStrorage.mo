import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";

module ReportActionStorage {
    public class ReportActionStorageClass() {
        private var reportActionsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.ReportAction>>(100, Text.equal, Text.hash);
        private var reportActionsCounter : Nat = 0;

        public func create(action: TrieMap.TrieMap<Principal, DataType.ReportAction>) : Text {
            let id = "ra_" # Nat.toText(reportActionsCounter);
            reportActionsCounter += 1;
            reportActionsStorage.put(id, action);
            id
        };

        public func get(id: Text) : ?TrieMap.TrieMap<Principal, DataType.ReportAction> {
            reportActionsStorage.get(id)
        };

        public func getAll() : [TrieMap.TrieMap<Principal, DataType.ReportAction>] {
            Iter.toArray(reportActionsStorage.vals())
        };

        public func update(id: Text, action: TrieMap.TrieMap<Principal, DataType.ReportAction>) : Bool {
            switch(reportActionsStorage.get(id)) {
                case (?_existing) {
                    reportActionsStorage.put(id, action);
                    true
                };
                case null { false };
            }
        };
    }
}