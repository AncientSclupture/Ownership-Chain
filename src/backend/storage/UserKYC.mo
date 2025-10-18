import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import DataType "../data/dataType";

module {
  public class UserKycStorageClass() {

    private var userKycStorage = HashMap.HashMap<Principal, DataType.User>(10, Principal.equal, Principal.hash);
    private var userKycCounter : Nat = 0;

    private var devMockBalance : Float = 0;

    public func createUser(
      principal : Principal,
      surname : Text,
      publickey : ?Text,
    ) : (Bool, Text) {
      switch (userKycStorage.get(principal)) {
        case (?_) {
          return (false, "User already exists");
        };
        case (null) {
          let newUser : DataType.User = {
            principalAddress = principal;
            surname = surname;
            mockBalance = 0;
            publickey = publickey;
            userStatus = #Approve;
          };
          userKycStorage.put(principal, newUser);
          userKycCounter += 1;
          return (true, "User successfully created");
        };
      };
    };

    public func addPublicKey(principal : Principal, publickey : Text) : (Bool, Text) {
      switch (userKycStorage.get(principal)) {
        case (null) {
          return (false, "User doesn't exists, register first");
        };
        case (?existuser) {
          if (existuser.publickey != null) {
            return (false, "User already add public key");
          };

          let updatedUser : DataType.User = {
            principalAddress = existuser.principalAddress;
            surname = existuser.surname;
            mockBalance = existuser.mockBalance;
            publickey = ?publickey;
            userStatus = existuser.userStatus;
          };

          userKycStorage.put(principal, updatedUser);
          return (true, "User successfully created");
        };
      };
    };

    public func suspendUser(principal : Principal) : (Bool, Text) {
      switch (userKycStorage.get(principal)) {
        case (null) {
          return (false, "User not found");
        };
        case (?user) {
          let updatedUser : DataType.User = {
            principalAddress = user.principalAddress;
            surname = user.surname;
            mockBalance = user.mockBalance;
            publickey = user.publickey;
            userStatus = #Suspended;
          };
          userKycStorage.put(principal, updatedUser);
          return (true, "User suspended successfully");
        };
      };
    };

    public func mockTransferBalance(from : Principal, to : Principal, amount : Float) : (Bool, Text) {
      if (amount == 0) {
        return (false, "Transaction Amount must be greater than zero be greater than 0");
      };

      let fromUserOpt = userKycStorage.get(from);
      let toUserOpt = userKycStorage.get(to);

      switch (fromUserOpt, toUserOpt) {
        case (null, _) { return (false, "Sender not found") };
        case (_, null) { return (false, "Receiver not found") };
        case (?fromUser, ?toUser) {
          if (fromUser.userStatus == #Suspended) {
            return (false, "Sender account suspended");
          };
          if (toUser.userStatus == #Suspended) {
            return (false, "Receiver account suspended");
          };

          if (fromUser.mockBalance < amount) {
            return (false, "Insufficient balance");
          };

          let updatedFrom : DataType.User = {
            principalAddress = fromUser.principalAddress;
            surname = fromUser.surname;
            mockBalance = fromUser.mockBalance - amount;
            publickey = fromUser.publickey;
            userStatus = fromUser.userStatus;
          };

          let updatedTo : DataType.User = {
            principalAddress = toUser.principalAddress;
            surname = toUser.surname;
            mockBalance = toUser.mockBalance + amount;
            publickey = toUser.publickey;
            userStatus = toUser.userStatus;
          };

          userKycStorage.put(from, updatedFrom);
          userKycStorage.put(to, updatedTo);

          return (true, "Transfer successful");
        };
      };
    };

    public func getRegisteredUser(user : Principal) : ?DataType.User {
      return userKycStorage.get(user);
    };

    public func getUserCount() : Nat {
      return userKycCounter;
    };

    public func getUserBalance(user : Principal) : Float {
      switch (userKycStorage.get(user)) {
        case (null) { return 0 };
        case (?existuser) {
          return existuser.mockBalance;
        };
      };
    };

    public func mockTransferTo(to : Principal, amount : Float) : (Bool, Text) {
      if (amount == 0) {
        return (false, "Transaction Amount must be greater than zero be greater than zero");
      };

      switch (userKycStorage.get(to)) {
        case (null) {
          return (false, "Recipient not found, Register First");
        };
        case (?receiver) {
          let updatedReceiver = {
            principalAddress = receiver.principalAddress;
            surname = receiver.surname;
            mockBalance = receiver.mockBalance + amount;
            publickey = receiver.publickey;
            userStatus = receiver.userStatus;
          };

          userKycStorage.put(to, updatedReceiver);

          return (true, "Balance successfully added to recipient");
        };
      };
    };

    public func chargeTo(to : Principal, amount : Float) : (Bool, Text) {
      switch (userKycStorage.get(to)) {
        case (null) {
          return (false, "Recipient not found");
        };
        case (?receiver) {
          if (receiver.mockBalance < amount) {
            return (false, "Insufficient recipient balance");
          };

          let updatedReceiver = {
            principalAddress = receiver.principalAddress;
            surname = receiver.surname;
            mockBalance = receiver.mockBalance - amount;
            publickey = receiver.publickey;
            userStatus = receiver.userStatus;
          };

          // update storage
          userKycStorage.put(to, updatedReceiver);

          // dev account receives the charged amount
          devMockBalance += amount;

          return (true, "Recipient successfully charged");
        };
      };
    };

    public func getDevBalance() : Float {
      return devMockBalance;
    };

    public func addDevBalance(amount : Float) : Float {
      devMockBalance := amount;
      return devMockBalance;
    };

    public func calcPercentage(amount : Float, prc : Float) : Float {
      let fee : Float = amount * prc;
      return fee;
    };

  };
};
