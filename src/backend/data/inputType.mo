import DataType "dataType";

module {
  public type AssetInput = {
    name : Text;
    description : Text;
    totalToken : Nat;
    providedToken : Nat;
    minTokenPurchased : Nat;
    maxTokenPurchased : Nat;
    pricePerToken : Nat;
    locationInfo : DataType.LocationType;
    documentHash : [DataType.DocumentHash];
    assetType : DataType.AssetType;
    assetStatus : DataType.AssetStatus;
    rule : DataType.Rule;
  };

};
