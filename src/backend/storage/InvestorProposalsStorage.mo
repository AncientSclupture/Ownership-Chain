import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import InputType "../data/inputType";

module InvestorProposalStorage {
  public class InvestorProposalStorageClass() {
    private var investorsProposalsStorage = HashMap.HashMap<Text, DataType.InvestorProposal>(100, Text.equal, Text.hash);
    private var investorsProposalsCounter : Nat = 0;

    public func create(insertedproposal : InputType.InvestorProposalInput) : Text {
      let id = "ip_" # Nat.toText(investorsProposalsCounter);

      let proposal : DataType.InvestorProposal = {
        id = id;
        assetId =insertedproposal.assetId;
        investor =insertedproposal.investor;
        amount =insertedproposal.amount;
        pricePerToken =insertedproposal.pricePerToken;
        totalPrice =insertedproposal.totalPrice;
        approvals =insertedproposal.approvals;
        createdAt =insertedproposal.createdAt;
      };

      investorsProposalsCounter += 1;
      investorsProposalsStorage.put(id, proposal);
      id;
    };

    public func get(id : Text) : ?DataType.InvestorProposal {
      investorsProposalsStorage.get(id);
    };

    public func getAll() : [DataType.InvestorProposal] {
      Iter.toArray(investorsProposalsStorage.vals());
    };

    public func update(id : Text, proposal : DataType.InvestorProposal) : Bool {
      switch (investorsProposalsStorage.get(id)) {
        case (?_existing) {
          investorsProposalsStorage.put(id, proposal);
          true;
        };
        case null { false };
      };
    };
  };
};
