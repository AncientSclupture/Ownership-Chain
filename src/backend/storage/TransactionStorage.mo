import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import DataType "../data/dataType";
import InputType "../data/inputType";

module TransactionStorage {
  public class TransactionStorageClass() {
    private var transactionStorage = HashMap.HashMap<Text, HashMap.HashMap<Text, DataType.Transaction>>(10, Text.equal, Text.hash);
    private var transactionCounter : Nat = 0;

    public func createTransaction(insertedinput : InputType.TransactionInput) : Text {
      let transactionId = "tnx-" # Nat.toText(transactionCounter);

      let newTransaction : DataType.Transaction = {
        id = transactionId;
        assetid = insertedinput.assetid;
        to = insertedinput.to;
        from = insertedinput.from;
        totalprice = insertedinput.totalprice;
        transactionType = insertedinput.transactionType;
        status = insertedinput.status;
        createdAt = Time.now();
      };

      let innerMap = switch (transactionStorage.get(insertedinput.assetid)) {
        case (?map) map;
        case (null) HashMap.HashMap<Text, DataType.Transaction>(10, Text.equal, Text.hash);
      };

      innerMap.put(transactionId, newTransaction);
      transactionStorage.put(insertedinput.assetid, innerMap);
      transactionCounter += 1;
      return ("Transaction successfully created with id: " # transactionId);
    };

    public func getAllTransactionByAssetId(assetid : Text) : [DataType.Transaction] {
      switch (transactionStorage.get(assetid)) {
        case (null) { return [] };
        case (?innermap) {
          return Iter.toArray(innermap.vals());
        };
      };
    };

    public func getTransactionByTransactionId(assetid : Text, transactionid : Text) : ?DataType.Transaction {
      switch (transactionStorage.get(assetid)) {
        case (null) { return null };
        case (?innermap) {
          return innermap.get(transactionid);
        };
      };
    };
  };
};
