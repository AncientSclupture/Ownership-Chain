import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import DataType "../data/dataType";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import InputType "../data/inputType";

module UserStorage {
  public class UserStorageClass() {
    private var usersStorage = HashMap.HashMap<Principal, DataType.User>(100, Principal.equal, Principal.hash);
    private var userCounter : Nat = 0;

    public func create(principal : Principal, inserteduser : InputType.UserInput) : Bool {
      switch (usersStorage.get(principal)) {
        case (?_existing) { false };
        case null {
          let id = "user_" # Nat.toText(userCounter);
          userCounter += 1;

          let user : DataType.User = {
            id = id;
            fullName = inserteduser.fullName;
            lastName = inserteduser.lastName;
            phone = inserteduser.phone;
            country = inserteduser.country;
            city = inserteduser.city;
            publickey = inserteduser.publickey;

            userIDNumber = inserteduser.userIDNumber;
            userIdentity = inserteduser.userIdentity;

            kyc_level = inserteduser.kyc_level;
            timeStamp = inserteduser.timeStamp;
          };
          usersStorage.put(principal, user);
          true;
        };
      };
    };

    public func get(principal : Principal) : ?DataType.User {
      usersStorage.get(principal);
    };

    public func getAll() : [DataType.User] {
      Iter.toArray(usersStorage.vals());
    };

    public func update(principal : Principal, user : DataType.User) : Bool {
      switch (usersStorage.get(principal)) {
        case (?_existing) {
          usersStorage.put(principal, user);
          true;
        };
        case null { false };
      };
    };
  };
};
