import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import DataType "../data/dataType";
import InputType "../data/inputType";

module AssetProposalStorage {
  public class AssetProposalClass() {
    private var assetproposalStorage = HashMap.HashMap<Text, HashMap.HashMap<Text, DataType.AssetProposal>>(10, Text.equal, Text.hash);
    private var assetproposalCounter : Nat = 0;

    public func initiateProposal(input : InputType.AssetProposalInput) : (Text, Bool) {
      let proposalId = "prs-" # Nat.toText(assetproposalCounter);

      let newProposal : DataType.AssetProposal = {
        id = proposalId;
        from = input.from;
        assetid = input.assetid;
        token = input.token;
        pricePerToken = input.pricePerToken;
        votes = [];
        createdAt = Time.now();
      };

      let innerMap = switch (assetproposalStorage.get(input.assetid)) {
        case (?map) map;
        case (null) HashMap.HashMap<Text, DataType.AssetProposal>(10, Text.equal, Text.hash);
      };

      innerMap.put(proposalId, newProposal);
      assetproposalStorage.put(input.assetid, innerMap);
      
      assetproposalCounter += 1;
      return ("Proposal successfully created with id: " # proposalId, true);
    };

    public func getProposal(assetid : Text, proposalid : Text) : ?DataType.AssetProposal {
      switch (assetproposalStorage.get(assetid)) {
        case (null) { return null };
        case (?innerMap) {
          switch (innerMap.get(proposalid)) {
            case (null) return null;
            case (?proposal) return ?proposal;
          };
        };
      };
    };

    public func getAllProposalAsset(assetid : Text) : [DataType.AssetProposal] {
      switch (assetproposalStorage.get(assetid)) {
        case (null) return [];
        case (?innerMap) {
          var result : [DataType.AssetProposal] = [];
          for ((_, proposal) in innerMap.entries()) {
            result := Array.append(result, [proposal]);
          };
          return result;
        };
      };
    };

    public func voteProposal(assetid : Text, proposalid : Text, voter : Principal, votevalue : Float) : (Text, Bool) {
      switch (assetproposalStorage.get(assetid)) {
        case (null) { return ("Asset proposal not found", false) };
        case (?innerMap) {
          switch (innerMap.get(proposalid)) {
            case (null) { return ("Proposal not found", false) };
            case (?proposal) {
              var updatedVotes = proposal.votes;
              var alreadyVoted = false;

              for ((p, _t) in updatedVotes.vals()) {
                if (p == voter) { alreadyVoted := true };
              };

              if (alreadyVoted) {
                return ("You have already voted for this proposal", false);
              };

              updatedVotes := Array.append(updatedVotes, [(voter, votevalue)]);

              let updatedProposal : DataType.AssetProposal = {
                id = proposal.id;
                from = proposal.from;
                assetid = proposal.assetid;
                token = proposal.token;
                pricePerToken = proposal.pricePerToken;
                votes = updatedVotes;
                createdAt = Time.now();
              };

              innerMap.put(proposalid, updatedProposal);
              assetproposalStorage.put(assetid, innerMap);

              return ("Vote successfully added", true);
            };
          };
        };
      };
    };

    public func getMyProposal(user : Principal) : [DataType.AssetProposal] {
      var result : [DataType.AssetProposal] = [];

      for ((_, innerMap) in assetproposalStorage.entries()) {
        for ((_, proposal) in innerMap.entries()) {
          if (proposal.from == user) {
            result := Array.append(result, [proposal]);
          };
        };
      };

      return result;
    }
  };
};
