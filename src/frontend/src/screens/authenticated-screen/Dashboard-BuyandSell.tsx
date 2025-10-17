import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { AssetOwnership } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import Forbidden from "../../components/forbiden";
import UserOwnershipTable from "../../components/dashboard/user-ownership";

export function DashboardBuyandSellScreen() {
  const [loadedData, setLoadedData] = React.useState<AssetOwnership[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setNotificationData } = React.useContext(NotificationContext);
  const { isAuthenticated, userPrincipal } = React.useContext(AuthContext);

  React.useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (!userPrincipal) throw new Error("User principal is null");
        const data = await backendService.getMyOwnerships(userPrincipal);
        setLoadedData(data);
      } catch (error) {
        setNotificationData({
          title: "Failed to load data",
          description: "",
          position: "bottom-right",
          duration: 800,
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  if (isLoading) return <LoaderComponent />;

  if (!isAuthenticated || !userPrincipal) return <Forbidden />

  console.log(loadedData);

  return (
    <MainLayout needProtection={true}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Ownerships
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                You can open your asset ownership status tobe open for sale, and wait the other to buy your ownership
              </p>
            </div>
          </div>

          <div className="text-gray-700 space-y-2">
            <UserOwnershipTable ownerships={loadedData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
