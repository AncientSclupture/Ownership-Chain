import HashMap "mo:base/HashMap";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";

module OwnershipStorage {
    public class OwnershipStorageClass() {
        // IMPORTANT NOTES: id key in ownershipsStorage hash is the same as the assetsStorage hash id key
        private var ownershipsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Ownership>>(1000, Text.equal, Text.hash);
        private var ownershipsCounter : Nat = 0;

        public func create(id: Text, ownership: TrieMap.TrieMap<Principal, DataType.Ownership>) : Bool {
            switch(ownershipsStorage.get(id)) {
                case (?_existing) { false };
                case null {
                    ownershipsStorage.put(id, ownership);
                    ownershipsCounter += 1;
                    true
                };
            }
        };

        public func get(id: Text) : ?TrieMap.TrieMap<Principal, DataType.Ownership> {
            ownershipsStorage.get(id)
        };

        public func getAll() : [TrieMap.TrieMap<Principal, DataType.Ownership>] {
            Iter.toArray(ownershipsStorage.vals())
        };

        public func update(id: Text, ownership: TrieMap.TrieMap<Principal, DataType.Ownership>) : Bool {
            switch(ownershipsStorage.get(id)) {
                case (?_existing) {
                    ownershipsStorage.put(id, ownership);
                    true
                };
                case null { false };
            }
        };
    }
}