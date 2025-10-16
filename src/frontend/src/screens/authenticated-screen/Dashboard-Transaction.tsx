import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { Asset } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import AssetTable from "../../components/dashboard/asset-table";
import AssetTransaction from "../../components/dashboard/asset-transaction";

export function DashboardTransactionScreen() {
  const [loadedData, setLoadedData] = React.useState<Asset[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setNotificationData } = React.useContext(NotificationContext);
  const { userPrincipal } = React.useContext(AuthContext);
  
  const [assetid, setassetid] = React.useState<string>("asset-0");

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

  if (isLoading) return <LoaderComponent />;

  return (
    <MainLayout needProtection={true}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Transactions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your digital assets transactions
              </p>
            </div>
          </div>

          <div className="text-gray-700 space-y-2">
            <AssetTable assets={loadedData} setassetid={setassetid} />
            <AssetTransaction assetid={assetid} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
