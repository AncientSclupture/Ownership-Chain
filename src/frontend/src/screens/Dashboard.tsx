import React from "react";
import { ActivityLayout } from "../components/layout";
import { backendService } from "../services/backendService";
import { AssetType, PlatformStats } from "../types/rwa";

import { AssetsbyTypeChart } from "../components/assets-type-chart";
import { DashboardInfo } from "../components/dashboard-info";

function getAssetTypeName(assetType: AssetType): string {
  return Object.keys(assetType)[0];
}

function Dashboard() {
  const [load, setLoad] = React.useState(true);
  const [retreivedData, setRetrievedData] = React.useState<PlatformStats | null>(null);

  React.useEffect(() => {
    const callAssets = async () => {
      const data = await backendService.getPlatformStats();

      setRetrievedData(data);

      setLoad(false);
      console.log(data, retreivedData);
    }

    callAssets();

  }, [load]);

  const chartData = React.useMemo(() => {
    return retreivedData?.assetsByType.map(([type, nums]) => ({
      name: getAssetTypeName(type),
      nums: Number(nums),
    })) ?? [];
  }, [retreivedData]);

  return (
    <ActivityLayout isLoadPage={load}>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white border border-gray-200 shadow rounded-2xl p-5">
            <p className="text-lg font-semibold text-center mb-3">Assets by Type</p>
            <AssetsbyTypeChart data={chartData} />
          </div>

          {/* Info Box */}
          <DashboardInfo retreivedData={retreivedData} />
        </div>
      </div>
    </ActivityLayout>
  );
}
export default Dashboard;