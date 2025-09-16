import ReportsStorage "../storage/ReportsStorage";
import AssetStorage "../storage/AssetStorage";
import DataType "../data/dataType";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import UserStorage "../storage/UserStorage";
import ReportActionsStrorage "../storage/ReportActionsStrorage";

module {
  public class ReportServiceClass(
    reportsstorage : ReportsStorage.ReportStorageClass,
    assetsstorage : AssetStorage.AssetStorageClass,
    userstorage : UserStorage.UserStorageClass,
    reportsactionstorage : ReportActionsStrorage.ReportActionStorageClass,
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

    private func getReportMatchHash(hash : ?Text) : ?DataType.Report {
      switch (hash) {
        case (null) { return null };
        case (?h) {
          for ((assetId, reportMap) in reportsstorage.getEntries()) {
            for ((principal, report) in reportMap.entries()) {
              switch (report.evidence) {
                case (null) {};
                case (?ev) {
                  switch (ev.hashclarity) {
                    case (?hc) {
                      if (hc == h) {
                        return ?report;
                      };
                    };
                    case (null) {};
                  };
                };
              };
            };
          };
          return null;
        };
      };
    };

    public func solveReport(
      caller : Principal,
      reportId : Text,
      clarification : Text,
      signaturedhash : ?Text,
      submissionsignaturedhash : ?Text,
    ) : async Result.Result<Text, Text> {
      switch (userstorage.get(caller)) {
        case (null) { return #err("user is not regitered") };
        case (?user) {
          switch (user.kyc_level.status) {
            case (#Pending) { return #err("your account is pending") };
            case (#Rejected) { return #err("your account is rejected") };
            case (#Verivied) {
              switch (assetsstorage.get(reportId)) {
                case (null) { return #err("no asset was found") };
                case (?asset) {
                  if (asset.creator == caller) {
                    switch (reportsstorage.get(reportId)) {
                      case (null) { return #err("the report was not found") };
                      case (?reportMap) {
                        // Validasi signaturedhash
                        switch (getReportMatchHash(signaturedhash)) {
                          case (null) {
                            return #err("signature hash not found in any report");
                          };
                          case (_matchedReport) {
                            // Cari semua report dengan signaturedhash yang sama
                            let matchingReports = getReportsWithSameHash(signaturedhash);

                            // Proses setiap report yang cocok
                            var updatedCount = 0;
                            for (report in matchingReports.vals()) {
                              // Cek apakah submissionsignaturedhash cocok dengan signaturedhash dari report
                              switch (report.evidence) {
                                case (null) {};
                                case (?ev) {
                                  switch (ev.hashclarity, submissionsignaturedhash) {
                                    case (?reportHash, ?submissionHash) {
                                      if (reportHash == submissionHash) {
                                        let updatedReport : DataType.Report = {
                                          id = report.id;
                                          complainer = report.complainer;
                                          targetid = report.targetid;
                                          reportType = report.reportType;
                                          content = report.content;
                                          description = report.description;
                                          reputation = report.reputation;
                                          isDone = 1;
                                          isDoneTimeStamp = Time.now();
                                          evidence = report.evidence;
                                          created = report.created;
                                        };

                                        switch (reportsstorage.get(report.targetid)) {
                                          case (null) {};
                                          case (?targetReportMap) {
                                            targetReportMap.put(report.complainer, updatedReport);
                                            let _updateStatus = reportsstorage.update(report.targetid, targetReportMap);
                                            updatedCount += 1;
                                          };
                                        };
                                      };
                                    };
                                    case (_, _) {};
                                  };
                                };
                              };
                            };

                            let reportAction : DataType.ReportAction = {
                              id = reportId;
                              reportId = reportId;
                              clarification = ?clarification;
                              reportActionType = #NotGuilty;
                              created = Time.now();
                            };

                            let _actionResult = reportsactionstorage.create(caller, reportAction);

                            let remainingReports = getRemainingActiveReports(reportId);

                            if (remainingReports.size() == 0) {
                              let updatedAsset : DataType.Asset = {
                                id = asset.id;
                                creator = asset.creator;
                                name = asset.name;
                                description = asset.description;
                                totalToken = asset.totalToken;
                                tokenLeft = asset.tokenLeft;
                                providedToken = asset.providedToken;
                                pendingToken = asset.pendingToken;
                                minTokenPurchased = asset.minTokenPurchased;
                                maxTokenPurchased = asset.maxTokenPurchased;
                                pricePerToken = asset.pricePerToken;
                                locationInfo = asset.locationInfo;
                                documentHash = asset.documentHash;
                                assetType = asset.assetType;
                                assetStatus = #Active; // Change to Active
                                rule = asset.rule;
                                riskScore = asset.riskScore;
                                createdAt = asset.createdAt;
                                updatedAt = Time.now();
                              };

                              let _updateAssetStatus = assetsstorage.update(asset.id, updatedAsset);
                              return #ok("Report solved successfully. All reports completed. Asset status changed to Active.");
                            } else {
                              return #ok("Report solved successfully. Some reports still pending.");
                            };
                          };
                        };
                      };
                    };
                  };
                  return #err("you are not the creator of the asset");
                };
              };
            };
          };
        };
      };
    };

    private func getReportsWithSameHash(hash : ?Text) : [DataType.Report] {
      let reportsBuffer = Buffer.Buffer<DataType.Report>(10);

      switch (hash) {
        case (null) { return Buffer.toArray(reportsBuffer) };
        case (?h) {
          for ((assetId, reportMap) in reportsstorage.getEntries()) {
            for ((principal, report) in reportMap.entries()) {
              switch (report.evidence) {
                case (null) {};
                case (?ev) {
                  switch (ev.hashclarity) {
                    case (?hc) {
                      if (hc == h and report.isDone == 0) {
                        // Only get reports that are not done yet
                        reportsBuffer.add(report);
                      };
                    };
                    case (null) {};
                  };
                };
              };
            };
          };
        };
      };

      Buffer.toArray(reportsBuffer);
    };

    private func getRemainingActiveReports(assetId : Text) : [DataType.Report] {
      let activeReportsBuffer = Buffer.Buffer<DataType.Report>(10);

      switch (reportsstorage.get(assetId)) {
        case (null) { return Buffer.toArray(activeReportsBuffer) };
        case (?reportMap) {
          for ((principal, report) in reportMap.entries()) {
            if (report.isDone == 0) {
              activeReportsBuffer.add(report);
            };
          };
        };
      };

      Buffer.toArray(activeReportsBuffer);
    };
  };
};
