import ReportsStorage "../storage/ReportsStorage";
import AssetStorage "../storage/AssetStorage";
import DataType "../data/dataType";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import UserStorage "../storage/UserStorage";

module {
  public class ReportServiceClass(
    reportsstorage : ReportsStorage.ReportStorageClass,
    assetsstorage : AssetStorage.AssetStorageClass,
    userstorage : UserStorage.UserStorageClass,
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

    public func createReport(
      caller : Principal,
      content : Text,
      description : Text,
      targetid : Text,
      evidence : ?DataType.TypeReportEvidence,
      reporttype : DataType.ReportType,
    ) : async Result.Result<Text, Text> {

      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {
              let report : DataType.Report = {
                id = targetid;
                complainer = caller;
                targetid = targetid;
                reportType = reporttype;
                content = content;
                description = description;
                reputation = user.kyc_level.riskScore;
                isDone = 0;
                isDoneTimeStamp = 0;
                evidence = evidence;

                created = Time.now();
              };

              switch (reportsstorage.create(report)) {
                case (null) { return #err("you already create the report") };
                case (_report) {
                  switch (evidence) {
                    case (null) {};
                    case (?ev) {
                      switch (ev.hashclarity) {
                        case (null) {
                          switch (ev.footPrintFlow) {
                            case (null) {};
                            case (_evfootPrintFlow) {
                              switch (assetsstorage.get(targetid)) {
                                case (null) {
                                  return #err("asset was not found");
                                };
                                case (?existasset) {
                                  let updatedAsset : DataType.Asset = {
                                    id = existasset.id;
                                    creator = existasset.creator;
                                    name = existasset.name;
                                    description = existasset.description;
                                    totalToken = existasset.totalToken;
                                    tokenLeft = existasset.tokenLeft;
                                    providedToken = existasset.providedToken;
                                    pendingToken = existasset.pendingToken;
                                    minTokenPurchased = existasset.minTokenPurchased;
                                    maxTokenPurchased = existasset.maxTokenPurchased;
                                    pricePerToken = existasset.pricePerToken;
                                    locationInfo = existasset.locationInfo;
                                    documentHash = existasset.documentHash;
                                    assetType = existasset.assetType;
                                    assetStatus = #Pending;
                                    rule = existasset.rule;
                                    riskScore = existasset.riskScore;

                                    createdAt = existasset.createdAt;
                                    updatedAt = existasset.updatedAt;
                                  };

                                  let _status = assetsstorage.update(existasset.id, updatedAsset);
                                };
                              };
                            };
                          };
                        };
                        case (_evhashclarity) {
                          switch (assetsstorage.get(targetid)) {
                            case (null) {
                              return #err("asset was not found");
                            };
                            case (?existasset) {
                              let updatedAsset : DataType.Asset = {
                                id = existasset.id;
                                creator = existasset.creator;
                                name = existasset.name;
                                description = existasset.description;
                                totalToken = existasset.totalToken;
                                tokenLeft = existasset.tokenLeft;
                                providedToken = existasset.providedToken;
                                pendingToken = existasset.pendingToken;
                                minTokenPurchased = existasset.minTokenPurchased;
                                maxTokenPurchased = existasset.maxTokenPurchased;
                                pricePerToken = existasset.pricePerToken;
                                locationInfo = existasset.locationInfo;
                                documentHash = existasset.documentHash;
                                assetType = existasset.assetType;
                                assetStatus = #Pending;
                                rule = existasset.rule;
                                riskScore = existasset.riskScore;

                                createdAt = existasset.createdAt;
                                updatedAt = existasset.updatedAt;
                              };

                              let _status = assetsstorage.update(existasset.id, updatedAsset);
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };

              return #ok("report created");
            };
          };
        };
      };
    };
  };
};
