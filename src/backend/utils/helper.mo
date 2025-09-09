import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import HashMap "mo:base/HashMap";

module {
  public func assetID(assetType : DataType.AssetType) : Text {
    let now = Time.now();
    let secs = now / 1_000;

    let typeText = switch (assetType) {
      case (#Property) "prop";
      case (#Business) "bns";
      case (#Artwork) "art";
      case (#Vehicle) "vehc";
      case (#Equipment) "eqp";
    };

    return "asset_" # typeText # "_" # Int.toText(secs);
  };

  public func transactionID(transactionType : DataType.TransactionType, id : Nat) : Text {
    let typeText = switch (transactionType) {
      case (#Buy) "buy";
      case (#Sell) "sell";
      case (#Transfer) "trans";
      case (#Dividend) "div";
      case (#Downpayment) "dp";
      case (#Extending) "extd";
      case (#Redeem) "rdm";
      case (#DownpaymentCashBack) "dpcs";
    };

    return "tnx_" # typeText # "_" # Nat.toText(id);
  };

  public func ownershipID(id : Nat, assetType: DataType.AssetType) : Text {
    let typeText = switch (assetType) {
      case (#Property) "prop";
      case (#Business) "bns";
      case (#Artwork) "art";
      case (#Vehicle) "vehc";
      case (#Equipment) "eqp";
    };

    return "ow" # typeText # "_" # Nat.toText(id);
  };

  public func isExpired(
    createdTime : Int,
    maturityPeriod : Nat,
  ) : Bool {
    let now = Time.now();
    let expiredDownPayemntTimeNs : Nat = maturityPeriod * 24 * 60 * 60 * 1_000_000_000;

    let paymentDeadline = createdTime + expiredDownPayemntTimeNs;

    return now > paymentDeadline;
  };

  public func calculateTotalApprovalPercentage(approvals : HashMap.HashMap<Principal, Float>) : Float {
    var total : Float = 0.0;
    for ((_, percentage) in approvals.entries()) {
      total += percentage;
    };
    total;
  };
};
