import { FileLock } from "lucide-react";
import { MainLayout } from "../components/main-layout";
import React from "react";
import { ReportEnum, ReportFlowWrapper, ReportOptions } from "../components/report/report-setup";
import AssetReportFlow from "../components/report/report-asset";
import UserReportFlow from "../components/report/report-user";

function Courting() {
  const [reportOpt, setReportOpt] = React.useState<ReportEnum | null>(null);

  return (
    <MainLayout>
      <div className="p-5">

        {/* TODO: BUAT NAVIGASINYA */}
        <div className="flex items-center space-x-1">
          <p className="text-gray-600 cursor-pointer hover:text-gray-900">Home</p>
          <p className="font-semibold">{">"}</p>
          <p className="text-gray-600 cursor-pointer hover:text-gray-900">Assets</p>
          <p className="font-semibold">{">"}</p>
          <p className="text-gray-600 cursor-pointer hover:text-gray-900">Report Center</p>
        </div>

        <div className="mt-8">
          <div className="p-5 space-y-3 border border-gray-300 rounded-md">
            <div className="flex space-x-3 items-center">
              <FileLock size={32} />
              <h1 className="text-3xl">Ownership Reporting Center</h1>
            </div>
            <p className="text-gray-600">Report issues with assets to maintain marketplace integrity</p>
          </div>
        </div>

        <div className="mt-8">
          <ReportOptions reportOpt={reportOpt} setReportOpt={setReportOpt} />
        </div>

        <ReportFlowWrapper
          currentOpt={reportOpt}
          listcontent={[
            { name: ReportEnum.asset, component: <AssetReportFlow /> },
            { name: ReportEnum.user, component: <UserReportFlow /> },
          ]}
        />

      </div>
    </MainLayout>
  );
}

export default Courting;
