import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

module BuyProposalStorage {
    public class BuyProposalStorageClass() {
        private var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(100, Text.equal, Text.hash);
        private var buyProposalsCounter : Nat = 0;

        public func create(proposal: DataType.BuyProposal) : Text {
            let id = "bp_" # Nat.toText(buyProposalsCounter);
            buyProposalsCounter += 1;
            buyProposalsStorage.put(id, proposal);
            id
        };

        public func get(id: Text) : ?DataType.BuyProposal {
            buyProposalsStorage.get(id)
        };

        public func getAll() : [DataType.BuyProposal] {
            Iter.toArray(buyProposalsStorage.vals())
        };

        public func update(id: Text, proposal: DataType.BuyProposal) : Bool {
            switch(buyProposalsStorage.get(id)) {
                case (?_existing) {
                    buyProposalsStorage.put(id, proposal);
                    true
                };
                case null { false };
            }
        };
    }
}