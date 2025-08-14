import React from "react";
import { MainLayout } from "../layout/main-layout";
import { ContentDashboard, DashboardMenu, SidebarDashboard, SidebarItem } from "../components/user-dashboard-component";
import { UserDashboardMenus } from "../types/ui";

function DashboardUser() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [selectedMenu, setSelectedMenu] = React.useState<UserDashboardMenus>(UserDashboardMenus.AboutMe);

  return (
    <MainLayout>
      <div className="pt-15 flex min-h-screen relative">
        <div className="w-full h-[91dvh] flex relative">
          <SidebarDashboard
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          >
            <div className="py-2 space-y-3">
              {DashboardMenu.map((menus, idx) =>
                <SidebarItem
                  key={idx}
                  content={menus}
                  selectedMenu={selectedMenu}
                  setSelectedMenu={setSelectedMenu}
                />

              )}
            </div>
          </SidebarDashboard>

          <ContentDashboard
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          >
            <div>hallo world {selectedMenu}</div>
          </ContentDashboard>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardUser;
