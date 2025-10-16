import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";

export function DashboardLiquidationScreen() {
  return (
    <MainLayout needProtection={true}>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
          <div className="text-gray-600">
            <p>Pilih menu di sidebar untuk melihat detail lebih lanjut.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
