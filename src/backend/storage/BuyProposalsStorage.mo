import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import InputType "../data/inputType";

module BuyProposalStorage {
  public class BuyProposalStorageClass() {
    private var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(100, Text.equal, Text.hash);
    private var buyProposalsCounter : Nat = 0;

    public func create(insertedproposal : InputType.BuyProposalInput) : Text {
      let id = "bp_" # Nat.toText(buyProposalsCounter);
      let proposal : DataType.BuyProposal = {
        id = id;
        assetId = insertedproposal.assetId;
        buyer = insertedproposal.buyer;
        amount = insertedproposal.amount;
        pricePerToken = insertedproposal.pricePerToken;
        totalPrice = insertedproposal.totalPrice;
        approvals = insertedproposal.approvals;
        createdAt = insertedproposal.createdAt;
        downPaymentStatus = insertedproposal.downPaymentStatus;
        downPaymentTimeStamp = insertedproposal.downPaymentTimeStamp;
      };
      buyProposalsCounter += 1;
      buyProposalsStorage.put(id, proposal);
      id;
    };

    public func get(id : Text) : ?DataType.BuyProposal {
      buyProposalsStorage.get(id);
    };

    public func getAll() : [DataType.BuyProposal] {
      Iter.toArray(buyProposalsStorage.vals());
    };

    public func update(id : Text, proposal : DataType.BuyProposal) : Bool {
      switch (buyProposalsStorage.get(id)) {
        case (?_existing) {
          buyProposalsStorage.put(id, proposal);
          true;
        };
        case null { false };
      };
    };
  };
};
