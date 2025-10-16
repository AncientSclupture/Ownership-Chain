import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { Asset } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import AssetLiquidationCards from "../../components/dashboard/asset-liquidation";

export function DashboardLiquidationScreen() {
  const [loadedData, setLoadedData] = React.useState<Asset[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setNotificationData } = React.useContext(NotificationContext);
  const { userPrincipal } = React.useContext(AuthContext);

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

  if (isLoading)
    return <LoaderComponent fullScreen={true} text="Please wait..." />;

  return (
    <MainLayout needProtection={true}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Asset Liquidation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and deactivate your assets when they are no longer active or tradable.
              </p>
            </div>
          </div>

          <div className="text-gray-700 space-y-2">
            <p className="text-base text-gray-600">
              This section allows you to review and manage your existing assets.  
              You can deactivate or liquidate assets that are no longer operational,  
              monitor their performance history, and maintain your digital asset portfolio efficiently.
            </p>

            <AssetLiquidationCards assets={loadedData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
