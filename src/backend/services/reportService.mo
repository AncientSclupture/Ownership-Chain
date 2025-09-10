import ReportsStorage "../storage/ReportsStorage";
import AssetStorage "../storage/AssetStorage";
import DataType "../data/dataType";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";

module {
  public class ReportServiceClass(
    reportsstorage : ReportsStorage.ReportStorageClass,
    assetsstorage : AssetStorage.AssetStorageClass,
  ) {
    public func getMyAssetReport(caller : Principal) : async [DataType.Report] {
      let reportsBuffer = Buffer.Buffer<DataType.Report>(10);

      for (subMap in Iter.fromArray(reportsstorage.getAll())) {
        for (report in subMap.vals()) {
          switch (assetsstorage.get(report.targetid)) {
            case (null) {};
            case (?asset) {
              if (asset.creator == caller) {
                reportsBuffer.add(report);
              };
            };
          };
        };
      };

      return Buffer.toArray(reportsBuffer);
    };
  };
};
