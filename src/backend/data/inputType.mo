import DataType "dataType";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Float "mo:base/Float";

module {
  public type CreateAssetInput = {
    creator : Principal;
    name : Text;
    description : Text;

    totalToken : Nat;
    tokenLeft : Nat;
    pendingToken : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Float;

    locationInfo : ?DataType.LocationType;
    documentHash : [DataType.AssetDocument];

    assetType : DataType.AssetType;
    assetStatus : DataType.AssetStatus;
    rule : [DataType.AssetRule];

    ownershipMaturityTime : Int;
  };

  public type CreateAssetInputApi = {
    name : Text;
    description : Text;

    totalToken : Nat;
    tokenLeft : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Float;

    locationInfo : ?DataType.LocationType;
    documentHash : [DataType.AssetDocument];

    assetType : DataType.AssetType;
    assetStatus : DataType.AssetStatus;
    rule : [DataType.AssetRule];

    ownershipMaturityTime : Int;
  };

  public type CreateOwnershipInput = {
    assetid : Text;
    owner : Principal;
    tokenhold : Nat;
    openForSale : Bool;
    buyingprice : Float; // price per token
    upuntil : Int;
    holdat : Int;
  };

  public type CreateTreasuryLedgerInput = {
    assetid : Text; // can be done payment transaction id or support asset id
    description : Text;
    treasuryledgerType : DataType.TresuryType;
    priceamount : Float;
    from : Principal;
  };

  public type AssetProposalInput = {
    from : Principal;
    assetid : Text;
    token : Nat;
    pricePerToken : Float;
  };

  public type ComplaintInput = {
    reporter : Principal;
    reason : Text;
    complaintType : DataType.ComplaintType;
    assetid : Text;
    resolved : Bool;
  };

  public type TransactionInput = {
    assetid : Text;
    to : Principal;
    from : Principal;
    totalprice : Float; // transaction total price (just the total)
    transactionType : DataType.TransactionType;
    status : DataType.TransactionStatus;
  };

};
