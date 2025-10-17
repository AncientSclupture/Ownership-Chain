import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import DataType "../data/dataType";
import InputType "../data/inputType";

module ComplaintStorage {
  public class ComplaintStorageClass() {
    private var complaintStorage = HashMap.HashMap<Text, HashMap.HashMap<Text, DataType.Complaint>>(10, Text.equal, Text.hash);
    private var complaintCounter : Nat = 0;

    public func createComplaint(insertedinput : InputType.ComplaintInput) : Text {
      let complainerId = "cmp-" # Nat.toText(complaintCounter);

      let newComplain : DataType.Complaint = {
        id = complainerId;
        reporter = insertedinput.reporter;
        reason = insertedinput.reason;
        complaintType = insertedinput.complaintType;
        assetid = insertedinput.assetid;
        resolved = false;
        createdAt = Time.now();
      };

      let innerMap = switch (complaintStorage.get(insertedinput.assetid)) {
        case (?map) map;
        case (null) HashMap.HashMap<Text, DataType.Complaint>(10, Text.equal, Text.hash);
      };

      innerMap.put(complainerId, newComplain);
      complaintStorage.put(insertedinput.assetid, innerMap);
      complaintCounter += 1;
      return ("Complaint successfully created with id: " # complainerId);
    };

    public func solveComplain(assetid : Text, complaintid : Text) : (Text, Bool) {
      switch (complaintStorage.get(assetid)) {
        case (null) { return ("asset have no complain yet", false) };
        case (?innermap) {
          switch (innermap.get(complaintid)) {
            case (null) { return ("Complaint is not found", false) };
            case (?complaintdata) {
              let resolvedComplain : DataType.Complaint = {
                id = complaintdata.id;
                reporter = complaintdata.reporter;
                reason = complaintdata.reason;
                complaintType = complaintdata.complaintType;
                assetid = complaintdata.assetid;
                resolved = true;
                createdAt = complaintdata.createdAt;
              };
              innermap.put(complaintid, resolvedComplain);
              return ("Complain resolved", true);
            };
          };
        };
      };
    };

    public func getComplaintByAssetid(assetid : Text) : [DataType.Complaint] {
      switch (complaintStorage.get(assetid)) {
        case (null) {
          // Tidak ada complaint untuk assetid ini
          return [];
        };
        case (?innerMap) {
          var result : [DataType.Complaint] = [];
          for ((_, complaint) in innerMap.entries()) {
            result := Array.append(result, [complaint]);
          };
          return result;
        };
      };
    };

    public func getComplaint(assetid : Text, complaintid : Text) : ?DataType.Complaint {
      switch (complaintStorage.get(assetid)) {
        case (null) { return null };
        case (?innerMap) {
          switch (innerMap.get(complaintid)) {
            case (null) { return null };
            case (?complaint) { return ?complaint };
          };
        };
      };
    };

  };
};
