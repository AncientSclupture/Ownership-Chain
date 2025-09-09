import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import DataType "../data/dataType";
import Iter "mo:base/Iter";

module UserStorage {
    public class UserStorageClass() {
        private var usersStorage = HashMap.HashMap<Principal, DataType.User>(100, Principal.equal, Principal.hash);
        private var userCounter : Nat = 0;

        public func create(principal: Principal, user: DataType.User) : Bool {
            switch(usersStorage.get(principal)) {
                case (?_existing) { false };
                case null {
                    usersStorage.put(principal, user);
                    userCounter += 1;
                    true
                };
            }
        };

        public func get(principal: Principal) : ?DataType.User {
            usersStorage.get(principal)
        };

        public func getAll() : [DataType.User] {
            Iter.toArray(usersStorage.vals())
        };

        public func update(principal: Principal, user: DataType.User) : Bool {
            switch(usersStorage.get(principal)) {
                case (?_existing) {
                    usersStorage.put(principal, user);
                    true
                };
                case null { false };
            }
        };
    }
}