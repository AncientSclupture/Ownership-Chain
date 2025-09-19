import UserStorage "../storage/UserStorage";
import DataType "../data/dataType";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import InputType "../data/inputType";
import AssetStorage "../storage/AssetStorage";
import OwnershipsStorage "../storage/ownershipsStorage";
import TransactionStorage "../storage/TransactionStorage";

module {
  public class UserServiceClass(
    usersstorage : UserStorage.UserStorageClass,
    assetstorage : AssetStorage.AssetStorageClass,
    ownershipstorage : OwnershipsStorage.OwnershipStorageClass,
    transactionsstorage : TransactionStorage.TransactionStorageClass,
  ) {

    public func registUser(
      fullName : Text,
      lastName : Text,
      phone : Text,
      country : Text,
      city : Text,

      userIDNumber : Text,
      userIdentity : DataType.IdentityNumberType,
      publicsignature : Text,
      caller : Principal

    ) : async Result.Result<Text, Text> {
      switch (usersstorage.get(caller)) {
        case (?_existsUser) {
          return #err("user already registered.");
        };
        case null {
          let now = Time.now();

          let initial_kyc_user : DataType.UserKyc = {
            status = #Verivied;
            riskScore = 0;
          };

          let input : InputType.UserInput = {
            fullName = fullName;
            lastName = lastName;
            phone = phone;
            country = country;
            city = city;
            publickey = publicsignature;

            userIDNumber = userIDNumber;
            userIdentity = userIdentity;

            kyc_level = initial_kyc_user;
            timeStamp = now;

          };

          let createdStatus = usersstorage.create(caller, input);

          if (not createdStatus) {
            return #err("failed to create user");
          };

          return #ok("user creted");
        };
      };

    };

    public func getMyAssets(caller : Principal) : async [DataType.Asset] {
      let data = Array.filter<DataType.Asset>(
        assetstorage.getAll(),
        func(asset : DataType.Asset) : Bool {
          asset.creator == caller;
        },
      );
      return data;
    };

    public func getMyOwnerShip(caller : Principal) : async [DataType.Ownership] {
      var myOwnerships : [DataType.Ownership] = [];

      let allMaps = ownershipstorage.getAll();

      for (i in Iter.range(0, Array.size(allMaps) - 1)) {
        let ownershipMap = allMaps[i];
        switch (ownershipMap.get(caller)) {
          case (?ownership) {
            myOwnerships := Array.append(myOwnerships, [ownership]);
          };
          case (null) {};
        };
      };

      return myOwnerships;
    };

    public func getAssetFullDetails(assetId : Text) : async ?{
      asset : DataType.Asset;
      ownerships : [DataType.Ownership];
      transactions : [DataType.Transaction];
      dividends : [DataType.Transaction];
    } {

      let assetOpt = assetstorage.get(assetId);

      switch (assetOpt) {
        case null {
          return null;
        };
        case (?asset) {
          var ownershipList : [DataType.Ownership] = [];
          switch (ownershipstorage.get(assetId)) {
            case (null) {};
            case (?ownerMap) {
              ownershipList := Iter.toArray(ownerMap.vals());
            };
          };

          var transactionList : [DataType.Transaction] = [];
          var dividendList : [DataType.Transaction] = [];

          for ((_, tx) in transactionsstorage.getEntries()) {
            transactionList := Array.append(transactionList, [tx]);
            if (tx.transactionType == #Dividend and tx.assetId == assetId) {
              dividendList := Array.append(dividendList, [tx]);
            };
          };

          return ?{
            asset = asset;
            ownerships = ownershipList;
            transactions = transactionList;
            dividends = dividendList;
          };
        };
      };
    };

    public func getMyIncome(caller : Principal, assetId : Text) : async ?[DataType.Transaction] {
      let assetOpt = assetstorage.get(assetId);

      switch (assetOpt) {
        case null {
          return null;
        };
        case (?asset) {

          var dividendList : [DataType.Transaction] = [];

          for ((_, tx) in transactionsstorage.getEntries()) {
            if (tx.transactionType == #Dividend and tx.to == caller) {
              dividendList := Array.append(dividendList, [tx]);
            };
          };

          return ?dividendList;
        };
      };
    };

    public func getMyProfiles(
      caller : Principal
    ) : async ?DataType.UserOverviewResult {

      var totalTx = 0;
      var buy = 0;
      var sell = 0;
      var transfer = 0;
      var dividend = 0;

      for ((_, tx) in transactionsstorage.getEntries()) {
        if (tx.from == caller) {
          totalTx += 1;
          switch (tx.transactionType) {
            case (#Buy) buy += 1;
            case (#Sell) sell += 1;
            case (#Transfer) transfer += 1;
            case (#Dividend) dividend += 1;
            case (#Downpayment) {};
            case (#DownpaymentCashBack) {};
            case (#Extending) {};
            case (#Redeem) {};
          };
        };
      };

      var totalOwn = 0;
      var ownToken = 0;

      for ((_, owns) in ownershipstorage.getEntries()) {
        switch (owns.get(caller)) {
          case (?data) {
            totalOwn += 1;
            ownToken += data.tokenOwned;
          };
          case null {};
        };
      };

      var totalAsset = 0;
      var assetToken = 0;

      for ((_, asset) in assetstorage.getEntries()) {
        if (asset.creator == caller) {
          totalAsset += 1;
          assetToken += (asset.totalToken - asset.providedToken);
        };
      };

      switch (usersstorage.get(caller)) {
        case (null) { return null };
        case (?user) {
          return ?{
            userIdentity = user;
            transaction = {
              total = totalTx;
              buy = buy;
              sell = sell;
              transfer = transfer;
              dividend = dividend;
            };
            ownership = {
              total = totalOwn;
              token = ownToken;
            };
            asset = {
              total = totalAsset;
              token = assetToken;
            };
          };
        };
      };
    };
  };
};
