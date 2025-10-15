import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import DataType "../data/dataType";
import InputType "../data/inputType";

module TreasuryStorage {
  public class TreasuryStorageClass() {
    private var treasuryStorage = HashMap.HashMap<Text, HashMap.HashMap<Text, DataType.TreasuryLedger>>(10, Text.equal, Text.hash);
    private var treasuryCounter : Nat = 0;

    public func addNewTreasury(insertedinput : InputType.CreateTreasuryLedgerInput) : Text {
      let id = "tsr-" # Nat.toText(treasuryCounter);

      let newTs : DataType.TreasuryLedger = {
        assetid = insertedinput.assetid;
        tsid = id;
        description = insertedinput.description;
        treasuryledgerType = insertedinput.treasuryledgerType;
        priceamount = insertedinput.priceamount;
        from = insertedinput.from;
        createdAt = Time.now();
      };

      switch (treasuryStorage.get(insertedinput.assetid)) {
        case (null) {
          let newInnerMap = HashMap.HashMap<Text, DataType.TreasuryLedger>(5, Text.equal, Text.hash);
          newInnerMap.put(id, newTs);
        };
        case (?innermap) {
          innermap.put(id, newTs);
        };
      };
      treasuryCounter += 1;
      return "Treasury added";
    };

    public func takeTreasury(assetid : Text, tsid : Text, amount : Nat) : (Text, Bool) {
      switch (treasuryStorage.get(assetid)) {
        case (null) { return ("Treaseury by your assetid is not found", false) };
        case (?innermap) {
          switch (innermap.get(tsid)) {
            case (null) { return ("Treaseury by your treasury id is not found", false) };
            case (?tsdata) {
              if (tsdata.priceamount < amount) {
                return ("Unsufficient amount", false);
              };
              let updatedTsdata : DataType.TreasuryLedger = {
                assetid = tsdata.assetid;
                tsid = tsdata.tsid;
                description = tsdata.description;
                treasuryledgerType = tsdata.treasuryledgerType;
                priceamount = tsdata.priceamount - amount;
                from = tsdata.from;
                createdAt = tsdata.createdAt;
              };
              innermap.put(tsdata.tsid, updatedTsdata);
              return ("Treasury successfully updated", true);
            };
          };
        };
      };
    };

  };
};
