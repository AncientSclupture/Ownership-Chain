import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import DataType "../data/dataType";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

module {
  public class AssetSuportStorageClass() {
    // IMPORTANT NOTES: id key in assetsGuarantee hash is the same as the assetsStorage hash id key
    private var assetsSponsor = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.AssetSponsorship>>(100, Text.equal, Text.hash);

    // IMPORTANT NOTES: id key in assetsSponsor hash is the same as the assetsStorage hash id key
    private var assetsGuarantee = HashMap.HashMap<Text, DataType.AssetGuarantee>(100, Text.equal, Text.hash);

    public func initializeNewAssetSponsor(input : DataType.AssetSponsorship, caller : Principal) : Bool {
      var sponsorMap = switch (assetsSponsor.get(input.assetid)) {
        case (?m) m;
        case null TrieMap.TrieMap<Principal, DataType.AssetSponsorship>(Principal.equal, Principal.hash);
      };

      sponsorMap.put(caller, input);
      assetsSponsor.put(input.assetid, sponsorMap);
      true;
    };

    public func addNewSponsor(assetid : Text, input : DataType.AssetSponsorship, caller : Principal) : Bool {
      var sponsorMap = switch (assetsSponsor.get(assetid)) {
        case (?m) m;
        case null TrieMap.TrieMap<Principal, DataType.AssetSponsorship>(Principal.equal, Principal.hash);
      };

      sponsorMap.put(caller, input);
      assetsSponsor.put(assetid, sponsorMap);
      true;
    };

    public func createAssetGuarantee(input : DataType.AssetGuarantee) : Bool {
      assetsGuarantee.put(input.assetid, input);
      true;
    };

    public func getAssetGuarantee(assetid : Text) : ?DataType.AssetGuarantee {
      assetsGuarantee.get(assetid);
    };

    public func getAllAssetGuarantees() : [DataType.AssetGuarantee] {
      Iter.toArray(assetsGuarantee.vals());
    };

    public func getAllSponsorships() : [DataType.AssetSponsorship] {
      var all : [DataType.AssetSponsorship] = [];
      for (m in assetsSponsor.vals()) {
        let sponsors = Iter.toArray(m.vals());
        all := Array.append(all, sponsors);
      };
      all;
    };

    public func getSponsorsByAssetId(assetid : Text) : [DataType.AssetSponsorship] {
      switch (assetsSponsor.get(assetid)) {
        case (?m) {
          Iter.toArray(m.vals());
        };
        case null [];
      };
    };
  };
};
