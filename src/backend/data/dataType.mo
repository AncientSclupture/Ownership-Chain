import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Bool "mo:base/Bool";

module {
  public type AssetType = {
    #Physical;
    #Digital;
    #Hybrid;
  };

  public type AssetStatus = {
    #Active;
    #Pending;
    #Inactive;
  };

  public type AssetDocument = {
    name : Text;
    hash : Text;
    signature : Text;
  };

  public type AssetRule = {
    name : Text;
    content : Text;
  };

  public type LocationType = {
    lat : Float;
    long : Float;
    details : [Text];
  };

  public type Asset = {
    id : Text;
    creator : Principal;
    name: Text;
    description : Text;

    totalToken : Nat;
    tokenLeft : Nat;
    pendingToken : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Float;

    locationInfo : ?LocationType;
    documentHash : [AssetDocument];

    assetType : AssetType;
    assetStatus : AssetStatus;
    rule : [AssetRule];

    ownershipMaturityTime : Int;

    createdAt : Int;
    updatedAt : Int;
  };

  public type AssetOwnership = {
    id : Text;
    assetid : Text;
    owner : Principal;
    tokenhold : Nat;
    openForSale : Bool;
    buyingprice : Float; // price per token
    upuntil : Int;
    holdat : Int;
  };

  public type TransactionStatus = {
    #Done;
    #Progress;
    #Cancled;
  };

  public type TransactionType = {
    // current ownership open the ownership status into open and the seller will buy
    #Buy;
    #Transfer;
    #Donepayment;
    #DonepaymentCashback;
    #Supportasset;
    #Liquidation;
    #Dividend;
  };

  public type Transaction = {
    id : Text;
    assetid : Text;
    to : Principal;
    from : Principal;
    totalprice : Float; // transaction total price (just the total)
    transactionType : TransactionType;
    status : TransactionStatus;
    createdAt : Int;
  };

  // by default just set into 1 week
  public type AssetProposal = {
    id : Text;
    from : Principal;
    assetid : Text;
    token : Nat;
    pricePerToken : Float;
    votes: [(Principal, Float)]; // principal voting value is based on token that they're holding

    createdAt : Int;
  };

  public type TresuryType = {
    #Donepayment;
    #AssetSupport;
  };

  public type TreasuryLedger = {
    assetid : Text; // can be done payment transaction id or support asset id
    tsid: Text;
    description : Text;
    treasuryledgerType: TresuryType;
    priceamount : Float;
    from: Principal;
    createdAt : Int;
  };

  public type ComplaintType = {
    #Fraud;
    #Plagiarism;
  };

  public type Complaint = {
    id : Text;
    reporter : Principal;
    reason : Text;
    complaintType: ComplaintType;
    assetid : Text;
    resolved : Bool;
    createdAt : Int;
  };

  public type UserStatus = {
    #Approve;
    #Suspended;
  };

  public type User = {
    principalAddress: Principal;
    surname: Text;
    mockBalance: Float;
    publickey: ?Text;
    userStatus: UserStatus;
  };

};
