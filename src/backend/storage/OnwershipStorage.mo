import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import DataType "../data/dataType";
import InputType "../data/inputType";

module OwnershipStorage {
  public class OwnershipStorageClass() {
    private var ownershipStorage = HashMap.HashMap<Text, HashMap.HashMap<Text, DataType.AssetOwnership>>(10, Text.equal, Text.hash);
    private var ownershipCounter : Nat = 0;

    public func addNewHolder(assetId : Text, insertedinput : InputType.CreateOwnershipInput) : Text {
      let id = "own-" # Nat.toText(ownershipCounter);

      let newOwnership : DataType.AssetOwnership = {
        id = id;
        assetid = assetId;
        owner = insertedinput.owner;
        tokenhold = insertedinput.tokenhold;
        openForSale = insertedinput.openForSale;
        buyingprice = insertedinput.buyingprice;
        upuntil = insertedinput.upuntil;
        holdat = Time.now();
      };

      switch (ownershipStorage.get(assetId)) {
        case (null) {
          let newInnerMap = HashMap.HashMap<Text, DataType.AssetOwnership>(5, Text.equal, Text.hash);
          newInnerMap.put(id, newOwnership);
          ownershipStorage.put(assetId, newInnerMap);
        };
        case (?innermap) {
          innermap.put(id, newOwnership);
        };
      };
      ownershipCounter += 1;
      return "Ownership added for asset " # assetId # " by ownership " # id;
    };

    public func changeOwnershipHolder(from : Principal, to : Principal, assetid : Text, ownershipid : Text, amount : Nat, allowZeroAmount : Bool) : (Bool, Text) {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return (false, "Asset Not Found") };
        case (?innermap) {
          switch (innermap.get(ownershipid)) {
            case (null) { return (false, "Ownership not found") };
            case (?owns) {
              if (owns.owner == to) {
                return (false, "You cannot transfer to yourself");
              };
              if (owns.owner != from) {
                return (false, "You are not the owner of this ownership");
              };
              if (owns.openForSale == false and not allowZeroAmount) {
                return (false, "This ownership is not open for sale");
              };
              if (owns.upuntil < Time.now() and owns.upuntil != 0) {
                return (false, "This ownership is expired");
              };

              // ✅ Allow transaction if allowZeroAmount = true
              if (not allowZeroAmount and amount < owns.buyingprice) {
                return (false, "Insufficient amount");
              };

              switch (checkPartOfHolder(assetid, to)) {
                case (null) {
                  let newOwn : DataType.AssetOwnership = {
                    id = owns.id;
                    assetid = owns.assetid;
                    owner = to;
                    tokenhold = owns.tokenhold;
                    openForSale = false;
                    buyingprice = owns.buyingprice;
                    upuntil = owns.upuntil;
                    holdat = Time.now();
                  };
                  innermap.put(owns.id, newOwn);
                  return (true, "Success");
                };
                case (?currentOwnership) {
                  let newOwn : DataType.AssetOwnership = {
                    id = currentOwnership.id;
                    assetid = currentOwnership.assetid;
                    owner = to;
                    tokenhold = currentOwnership.tokenhold + owns.tokenhold;
                    openForSale = currentOwnership.openForSale;
                    buyingprice = currentOwnership.buyingprice + owns.buyingprice;
                    upuntil = owns.upuntil;
                    holdat = Time.now();
                  };
                  innermap.put(currentOwnership.id, newOwn);
                  return (true, "Success");
                };
              };
            };
          };
        };
      };
    };

    public func checkPartOfHolder(assetid : Text, user : Principal) : ?DataType.AssetOwnership {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return null };
        case (?innermap) {
          label l for ((_, ownership) in innermap.entries()) {
            if (ownership.owner == user) {
              return ?ownership;
              break l;
            };
          };
          return null;
        };
      };
    };

    public func getMyOwnership(user : Principal) : [DataType.AssetOwnership] {
      var resultBuffer = Buffer.Buffer<DataType.AssetOwnership>(10);

      for ((_, innerMap) in ownershipStorage.entries()) {
        for ((_, ownership) in innerMap.entries()) {
          if (ownership.owner == user) {
            resultBuffer.add(ownership);
          };
        };
      };

      return Buffer.toArray(resultBuffer);
    };

    public func getAllOwnershipByAssetId(assetid : Text) : [DataType.AssetOwnership] {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return [] };
        case (?innermap) {
          var resultBuffer = Buffer.Buffer<DataType.AssetOwnership>(10);
          for ((_, ownership) in innermap.entries()) {
            resultBuffer.add(ownership);
          };
          return Buffer.toArray(resultBuffer);
        };
      };
    };

    public func getOwnershipById(assetid : Text, ownershipid : Text) : ?DataType.AssetOwnership {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return null };
        case (?innermap) {
          return innermap.get(ownershipid);
        };
      };
    };

    public func isOwnershipForSale(assetid : Text, ownershipid : Text) : Bool {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return false };
        case (?innermap) {
          switch (innermap.get(ownershipid)) {
            case (null) { return false };
            case (?ownsership) {
              return ownsership.openForSale;
            };
          };
        };
      };
    };

    public func getTokenHolder(assetid : Text, user : Principal) : (Bool, Nat) {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return (false, 0) };
        case (?innermap) {
          label l for ((_, ownership) in innermap.entries()) {
            if (ownership.owner == user) {
              return (true, ownership.tokenhold);
              break l;
            };
          };
          return (false, 0);
        };
      };
    };

    public func openMyOwnership(assetid : Text, ownershipid : Text, user : Principal) : (Bool, Text) {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return (false, "Asset id is not valid") };
        case (?innermap) {
          switch (innermap.get(ownershipid)) {
            case (null) { return (false, "Ownership is not found") };
            case (?own) {
              if (own.owner != user) {
                return (false, "You are not the owner");
              };

              let updated : DataType.AssetOwnership = {
                id = own.id;
                assetid = own.assetid;
                owner = own.owner;
                tokenhold = own.tokenhold;
                openForSale = true;
                buyingprice = own.buyingprice;
                upuntil = own.upuntil;
                holdat = own.holdat;
              };

              innermap.put(ownershipid, updated);

              return (true, "Success");
            };
          };
        };
      };
    };
  };
};
