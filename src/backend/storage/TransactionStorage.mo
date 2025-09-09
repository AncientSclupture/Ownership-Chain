import HashMap "mo:base/HashMap";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import InputType "../data/inputType";

module TransactionStorage {
  public class TransactionStorageClass() {
    private var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(100, Text.equal, Text.hash);
    private var transactionsCounter : Nat = 0;

    public func create(insertedtransaction : InputType.TransactionInput) : Text {
      let id = "tnx_" # Nat.toText(transactionsCounter);
      transactionsCounter += 1;

      let transaction : DataType.Transaction = {
        id = id;
        assetId = insertedtransaction.assetId;
        from = insertedtransaction.from;
        to = insertedtransaction.to;
        totalPurchasedToken = insertedtransaction.totalPurchasedToken;
        pricePerToken = insertedtransaction.pricePerToken;
        totalPrice = insertedtransaction.totalPrice;
        transactionType = insertedtransaction.transactionType;
        transactionStatus = insertedtransaction.transactionStatus;
        details = insertedtransaction.details;

        timestamp = insertedtransaction.timestamp;
      };

      transactionsStorage.put(id, transaction);

      id;
    };

    public func get(id : Text) : ?DataType.Transaction {
      transactionsStorage.get(id);
    };

    public func getAll() : [DataType.Transaction] {
      Iter.toArray(transactionsStorage.vals());
    };

    public func update(id : Text, transaction : DataType.Transaction) : Bool {
      switch (transactionsStorage.get(id)) {
        case (?_existing) {
          transactionsStorage.put(id, transaction);
          true;
        };
        case null { false };
      };
    };
  };
};
