import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
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
          treasuryStorage.put(insertedinput.assetid, newInnerMap);
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
            case (null) {
              return ("Treaseury by your treasury id is not found", false);
            };
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

    public func getAllTreasuryByAssetId(assetid : Text) : [DataType.TreasuryLedger] {
      switch (treasuryStorage.get(assetid)) {
        case (null) {
          return [];
        };
        case (?innermap) {
          return Iter.toArray(innermap.vals());
        };
      };
    };

    public func getAllTreasury() : [DataType.TreasuryLedger] {
      var result : [DataType.TreasuryLedger] = [];

      for ((_, innermap) in treasuryStorage.entries()) {
        let innerValues = Iter.toArray(innermap.vals());
        result := Array.append(result, innerValues);
      };

      return result;
    };

    public func getTreasurybyId(assetid : Text, treasuryid : Text) : ?DataType.TreasuryLedger {
      switch (treasuryStorage.get(assetid)) {
        case (null) { return null };
        case (?innermap) {
          switch (innermap.get(treasuryid)) {
            case (null) { return null };
            case (?treasurydata) {
              return ?treasurydata;
            };
          };
        };
      };
    };

    public func getTotalAssetFunding(assetid: Text) : Nat {
      var treasuryTotal : Nat = 0;
      switch(treasuryStorage.get(assetid)){
        case (null){return 0};
        case (?innermap){
          for ((_, treasury) in innermap.entries()){
            treasuryTotal := treasuryTotal + treasury.priceamount;
          };
        };
      };
      return treasuryTotal;
    };

    public func getFundingFromAssetTreasuryTotal(assetid : Text, amountToTake : Nat) : (Bool, Nat) {
      var remaining : Nat = amountToTake;

      switch (treasuryStorage.get(assetid)) {
        case (null) { return (false, 0) };
        case (?innermap) {
          label takeLoop for ((_, treasury) in innermap.entries()) {
            if (remaining == 0) { break takeLoop };

            switch (treasury.treasuryledgerType) {
              case (#AssetSupport) {
                if (treasury.priceamount == 0) continue takeLoop;

                if (remaining >= treasury.priceamount) {
                  remaining := remaining - treasury.priceamount;

                  let updatedTreasury : DataType.TreasuryLedger = {
                    assetid = treasury.assetid;
                    tsid = treasury.tsid;
                    description = treasury.description;
                    treasuryledgerType = treasury.treasuryledgerType;
                    priceamount = 0;
                    from = treasury.from;
                    createdAt = treasury.createdAt;
                  };

                  innermap.put(treasury.tsid, updatedTreasury);
                } else {
                  let updatedTreasury : DataType.TreasuryLedger = {
                    assetid = treasury.assetid;
                    tsid = treasury.tsid;
                    description = treasury.description;
                    treasuryledgerType = treasury.treasuryledgerType;
                    priceamount = treasury.priceamount - remaining;
                    from = treasury.from;
                    createdAt = treasury.createdAt;
                  };

                  innermap.put(treasury.tsid, updatedTreasury);
                  remaining := 0;
                };
              };
              case (_) {};
            };
          };

          treasuryStorage.put(assetid, innermap);

          if (remaining > 0) {
            return (true, remaining);
          } else {
            return (true, amountToTake);
          };
        };
      };
    }

  };
};
