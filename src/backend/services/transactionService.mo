import OwnershipsStorage "../storage/ownershipsStorage";
import AssetStorage "../storage/AssetStorage";
import TransactionStorage "../storage/TransactionStorage";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import UserStorage "../storage/UserStorage";
import InputType "../data/inputType";

module {
  public class TransactionServiceClass(
    ownershipsStorage : OwnershipsStorage.OwnershipStorageClass,
    assetstorage : AssetStorage.AssetStorageClass,
    transactionsstorage : TransactionStorage.TransactionStorageClass,
    userstorage : UserStorage.UserStorageClass,
  ) {

    public func sellOwnership(
      ownershipId : Text,
      caller : Principal,
      to : Principal,
      price : Nat,
    ) : async Result.Result<Text, Text> {
      // user validation
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {};
          };
        };
      };

      var sellSharingAsset : Bool = false;
      var sellSharingNeedVoteAsset : Bool = false;
      var sellSharingPriceAsset : Nat = 0;

      switch (ownershipsStorage.get(ownershipId)) {
        case (null) { return #err("ownership is not exist") };
        case (?onwership) {
          switch (assetstorage.get(ownershipId)) {
            case (null) { return #err("ownership has no asset parent") };
            case (?asset) {
              if (not asset.rule.sellSharing) {
                return #err("this ownership is not for sale");
              };
              sellSharingAsset := asset.rule.sellSharing;

              if (asset.rule.sellSharingNeedVote) {
                return #err("this ownership needed agreement for sale");
              };
              sellSharingNeedVoteAsset := asset.rule.sellSharingNeedVote;

              if (price != asset.rule.sellSharingPrice) {
                return #err("set the price into" # Nat.toText(asset.rule.sellSharingPrice));
              };
              sellSharingPriceAsset := asset.rule.sellSharingPrice;

              switch (onwership.get(caller)) {
                case (null) { return #err("you have no ownership here") };
                case (?myownership) {
                  let changeOwnershipStatus = ownershipsStorage.changeOwnership(asset.id, caller, to);

                  if (not changeOwnershipStatus) {
                    return #err("failed to change ownership");
                  };
                  
                  let transactionInput : InputType.TransactionInput = {
                    assetId = asset.id;
                    from = caller;
                    to = to;
                    totalPurchasedToken = myownership.tokenOwned;
                    pricePerToken = price;
                    totalPrice = myownership.tokenOwned * price;
                    transactionType = #Sell;
                    transactionStatus = #Completed;
                    details = ?"Selling ownership";

                    timestamp = Time.now();
                  };

                  let transactionId = transactionsstorage.create(transactionInput);

                  return #ok("success to transfer ownership" # transactionId);
                };
              };

            };
          };
        };
      };

    };
  };
};
