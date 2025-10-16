import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { AssetProposal } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../../components/LoaderComponent";
import Forbidden from "../../components/forbiden";
import UserProposalTable from "../../components/dashboard/user-proposal";

export function DashboardProposalScreen() {
  const [loadedData, setLoadedData] = React.useState<AssetProposal[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setNotificationData } = React.useContext(NotificationContext);
  const { isAuthenticated, userPrincipal } = React.useContext(AuthContext);

  React.useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (!userPrincipal) throw new Error("User principal is null");
        const data = await backendService.getMyProposals(userPrincipal);
        setLoadedData(data);
        console.log(data)
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
                Asset Proposal
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your asset purchase proposals and their statuses.
              </p>
            </div>
          </div>

          <div className="text-gray-700 space-y-2">
            <p className="text-base text-gray-600">
              Here you can track all assets proposal you've created.
              If the progress shows 50% or more, you can proceed to purchase the asset.
            </p>
            <UserProposalTable proposals={loadedData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
