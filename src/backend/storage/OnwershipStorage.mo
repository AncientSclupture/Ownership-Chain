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

    public func changeOwnershipHolder(from : Principal, to: Principal, assetid : Text, ownershipid : Text, amount : Nat) : Text {
      switch (ownershipStorage.get(assetid)) {
        case (null) { return "Asset Not Found" };
        case (?innermap) {
          switch (innermap.get(ownershipid)) {
            case (null) { return "Ownership not found" };
            case (?owns) {
              if (owns.owner == to) {
                return "You cannot transfer to yourself";
              };
              if (owns.owner == from) {
                return "You are not owned this ownership";
              };
              if (owns.openForSale == false) {
                return "This ownership is not open for sale";
              };
              if (owns.upuntil < Time.now()) {
                return "This ownership is expired";
              };
              if (owns.buyingprice != amount) {
                return "Unsufficient ammount";
              };

              switch (checkPartOfHolder(assetid, to)) {
                case (null) {
                  let newOwn : DataType.AssetOwnership = {
                    id = owns.id;
                    assetid = owns.assetid;
                    owner = to;
                    tokenhold = owns.tokenhold;
                    openForSale = false;
                    buyingprice = owns.buyingprice; // price per token
                    upuntil = owns.upuntil;
                    holdat = Time.now();
                  };
                  innermap.put(owns.id, newOwn);
                  return "Succes";
                };
                case (?currentOwnership) {
                  let newOwn : DataType.AssetOwnership = {
                    id = currentOwnership.id;
                    assetid = currentOwnership.assetid;
                    owner = to;
                    tokenhold = currentOwnership.tokenhold + owns.tokenhold;
                    openForSale = currentOwnership.openForSale;
                    buyingprice = currentOwnership.buyingprice + owns.buyingprice; // price per token
                    upuntil = owns.upuntil;
                    holdat = Time.now();
                  };
                  innermap.put(currentOwnership.id, newOwn);
                  return "Succes";
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
  };
};
