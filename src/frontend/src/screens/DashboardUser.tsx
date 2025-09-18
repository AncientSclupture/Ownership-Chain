import React from "react";
import { MainLayout } from "../components/main-layout";
import DashboardComponentWrapper, { DashboardOption, NavigationDashboard } from "../components/dashboard/dashboard-controller";
import { SelfInformationDashboard } from "../components/dashboard/self-information";
import { AssetAndOwnerDashboard } from "../components/dashboard/asset-and-ownership";
import { IncomeDashboard } from "../components/dashboard/income";
import { ReportingDashboard } from "../components/dashboard/reporting";
import { NewAsset } from "../components/dashboard/new-asset";
import { Proposal } from "../components/dashboard/proposal";

function DashboardUser() {

  const [dashboardOpt, setDashboardOpt] = React.useState<DashboardOption>(DashboardOption.selfinfo);

  return (
    <MainLayout>
      <div className="w-full space-y-2">
        <NavigationDashboard
          dashboardOpt={dashboardOpt}
          setDashboardOpt={setDashboardOpt}
        />
        <DashboardComponentWrapper
          current={dashboardOpt}
          listcontent={[
            { name: DashboardOption.selfinfo, component: <SelfInformationDashboard /> },
            { name: DashboardOption.assetownership, component: <AssetAndOwnerDashboard /> },
            { name: DashboardOption.income, component: <IncomeDashboard /> },
            { name: DashboardOption.reporting, component: <ReportingDashboard /> },
            { name: DashboardOption.createasset, component: <NewAsset /> },
            { name: DashboardOption.proposal, component: <Proposal /> },
          ]}
        />
      </div>
    </MainLayout>
  );
}

export default DashboardUser;
