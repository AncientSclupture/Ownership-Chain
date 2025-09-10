import HashMap "mo:base/HashMap";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Float "mo:base/Float";

module OwnershipStorage {
  public class OwnershipStorageClass() {
    // IMPORTANT NOTES: id key in ownershipsStorage hash is the same as the assetsStorage hash id key
    private var ownershipsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Ownership>>(1000, Text.equal, Text.hash);

    public func create(id : Text, ownership : TrieMap.TrieMap<Principal, DataType.Ownership>) : Bool {
      switch (ownershipsStorage.get(id)) {
        case (?_existing) { false };
        case null {
          ownershipsStorage.put(id, ownership);
          true;
        };
      };
    };

    public func transferOwnerShip(
      id : Text,
      from : Principal,
      to : Principal,
      percAmount : Float,
    ) : Bool {

      if (percAmount <= 0.0) {
        return false;
      };

      switch (ownershipsStorage.get(id)) {
        case null { false };
        case (?existing) {
          switch (existing.get(from)) {
            case (null) { return false };
            case (?fromOwnership) {
              switch (existing.get(to)) {
                case (null) { return false };
                case (?toOwnership) {
                  let newFromPercentage = fromOwnership.percentage - percAmount;
                  let newToPercentage = toOwnership.percentage + percAmount;

                  if (newToPercentage > 1.0 or newFromPercentage < 0.0) {
                    return false;
                  };

                  let newFromOwnership : DataType.Ownership = {
                    id = fromOwnership.id;
                    owner = fromOwnership.owner;
                    tokenOwned = fromOwnership.tokenOwned;
                    percentage = newFromPercentage;
                    purchaseDate = fromOwnership.purchaseDate;
                    purchasePrice = fromOwnership.purchasePrice;
                    maturityDate = fromOwnership.maturityDate;
                  };

                  let newToOwnership : DataType.Ownership = {
                    id = toOwnership.id;
                    owner = toOwnership.owner;
                    tokenOwned = toOwnership.tokenOwned;
                    percentage = newToPercentage;
                    purchaseDate = toOwnership.purchaseDate;
                    purchasePrice = toOwnership.purchasePrice;
                    maturityDate = toOwnership.maturityDate;
                  };

                  existing.put(to, newToOwnership);
                  existing.put(from, newFromOwnership);

                  ownershipsStorage.put(id, existing);
                  true;
                };
              };
            };
          };
        };
      };
    };

    public func changeOwnership(
      id : Text,
      from : Principal,
      to : Principal,
    ) : Bool {
      switch (ownershipsStorage.get(id)) {
        case null { false };
        case (?existing) {
          switch (existing.get(from)) {
            case (null) { false };
            case (?fromOwnership) {
              switch (existing.get(to)) {
                case (?_existingToOwnership) {
                  false;
                };
                case null {
                  let newOwnership : DataType.Ownership = {
                    id = fromOwnership.id;
                    owner = to;
                    tokenOwned = fromOwnership.tokenOwned;
                    percentage = fromOwnership.percentage;
                    purchaseDate = fromOwnership.purchaseDate;
                    purchasePrice = fromOwnership.purchasePrice;
                    maturityDate = fromOwnership.maturityDate;
                  };

                  existing.put(to, newOwnership);

                  existing.delete(from);

                  ownershipsStorage.put(id, existing);

                  true;
                };
              };
            };
          };
        };
      };
    };

    public func addNewOwnershipHolder(
      id : Text,
      owner : Principal,
      tokenOwned : Nat,
      percentage : Float,
      purchaseDate : Int,
      purchasePrice : Nat,
      maturityDate : Int,
    ) : Bool {
      switch (ownershipsStorage.get(id)) {
        case null { false };
        case (?existing) {
          switch (existing.get(owner)) {
            case (?_existingOwnership) {
              false;
            };
            case null {
              if (percentage <= 0.0 or percentage > 1.0) {
                return false;
              };

              var currentTotal : Float = 0.0;
              for (ownership in existing.vals()) {
                currentTotal += ownership.percentage;
              };

              if (currentTotal + percentage > 1.0) {
                return false;
              };

              let newOwnership : DataType.Ownership = {
                id = id;
                owner = owner;
                tokenOwned = tokenOwned;
                percentage = percentage;
                purchaseDate = purchaseDate;
                purchasePrice = purchasePrice;
                maturityDate = maturityDate;
              };

              existing.put(owner, newOwnership);
              ownershipsStorage.put(id, existing);
              true;
            };
          };
        };
      };
    };

    public func get(id : Text) : ?TrieMap.TrieMap<Principal, DataType.Ownership> {
      ownershipsStorage.get(id);
    };

    public func getAll() : [TrieMap.TrieMap<Principal, DataType.Ownership>] {
      Iter.toArray(ownershipsStorage.vals());
    };

    public func update(id : Text, ownership : TrieMap.TrieMap<Principal, DataType.Ownership>) : Bool {
      switch (ownershipsStorage.get(id)) {
        case (?_existing) {
          ownershipsStorage.put(id, ownership);
          true;
        };
        case null { false };
      };
    };
  };
};
