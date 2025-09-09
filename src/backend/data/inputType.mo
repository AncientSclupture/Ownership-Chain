import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import DataType "dataType";

module {

  public type AssetInput = {
    creator : Principal;
    name : Text;
    description : Text;
    totalToken : Nat;
    tokenLeft : Nat;
    providedToken : Nat;
    pendingToken : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Nat;
    locationInfo : DataType.LocationType;
    documentHash : [DataType.DocumentHash];
    assetType : DataType.AssetType;
    assetStatus : DataType.AssetStatus;
    rule : DataType.Rule;
    riskScore : Float;

    createdAt : Int;
    updatedAt : Int;
  };

  public type BuyProposalInput = {
    assetId : Text;
    buyer : Principal;
    amount : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    approvals : HashMap.HashMap<Principal, Float>;
    createdAt : Int;
    downPaymentStatus : Bool;
    downPaymentTimeStamp : Int;
  };

  public type InvestorProposalInput = {
    assetId : Text;
    investor : Principal;
    amount : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    approvals : HashMap.HashMap<Principal, Float>;
    createdAt : Int;
  };

  public type TransactionInput = {
    assetId : Text;
    from : Principal;
    to : Principal;
    totalPurchasedToken : Nat;
    pricePerToken : Nat;
    totalPrice : Nat;
    transactionType : DataType.TransactionType;
    transactionStatus : DataType.TransactionStatus;
    details : ?Text;

    timestamp : Int;
  };

   public type OwnershipInput = {
    id : Text;
    owner : Principal;
    tokenOwned : Nat;
    percentage : Float;
    purchaseDate : Int;
    purchasePrice : Nat;
    maturityDate : Int;
  };
  
};
