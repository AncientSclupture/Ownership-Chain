import HashMap "mo:base/HashMap";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module TransactionStorage {
    public class TransactionStorageClass() {
        private var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(100, Text.equal, Text.hash);
        private var transactionsCounter : Nat = 0;

        public func create(transaction: DataType.Transaction) : Bool {
            switch(transactionsStorage.get(transaction.id)) {
                case (?_existing) { false };
                case null {
                    transactionsStorage.put(transaction.id, transaction);
                    transactionsCounter += 1;
                    true
                };
            }
        };

        public func get(id: Text) : ?DataType.Transaction {
            transactionsStorage.get(id)
        };

        public func getAll() : [DataType.Transaction] {
            Iter.toArray(transactionsStorage.vals())
        };

        public func update(id: Text, transaction: DataType.Transaction) : Bool {
            switch(transactionsStorage.get(id)) {
                case (?_existing) {
                    transactionsStorage.put(id, transaction);
                    true
                };
                case null { false };
            }
        };
    }
}