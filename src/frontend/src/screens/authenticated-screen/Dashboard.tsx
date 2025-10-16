import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { Asset } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import AssetTable from "../../components/dashboard/asset-table";
import AssetSupport from "../../components/dashboard/asset-support";

export function DashboardScreen() {
  const [loadedData, setLoadedData] = React.useState<Asset[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setNotificationData } = React.useContext(NotificationContext);
  const { userPrincipal } = React.useContext(AuthContext);

  const [assetid, setassetid] = React.useState<string>("");

  React.useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (!userPrincipal) throw new Error("User principal is null");
        const personalData = await backendService.getPersonalAset(userPrincipal);
        setLoadedData(personalData);
      } catch (error) {
        setNotificationData({
          title: "Failed to load data",
          description: "",
          position: "bottom-right",
          duration: 800,
        });
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  
  if (isLoading) return <LoaderComponent fullScreen={true} text="please wait..." />;

  return (
    <MainLayout needProtection={true}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Assets
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your digital assets, ownership, and performance metrics.
              </p>
            </div>

            <button className="px-4 py-2 background-dark text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition">
              + Create New Asset
            </button>
          </div>

          <div className="text-gray-700 space-y-2">
            <p className="text-base text-gray-600">
              Here you can track all assets you've created or invested in.
              Manage ownership, monitor token performance, and access detailed analytics.
            </p>
            <AssetTable assets={loadedData} setassetid={setassetid} />
            <AssetSupport assetid={assetid} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
