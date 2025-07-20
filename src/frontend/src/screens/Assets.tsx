import { ActivityLayout } from "../components/layout";
import React from "react";
import { UserProfile } from "../components/profile";
import { ProfileSettings, PropertyTypes } from "../components/profile-settings";

function Assets() {
  const [load, setLoad] = React.useState(true);
  const [selectedType, setSelectedType] = React.useState<PropertyTypes>(PropertyTypes.MyAssets);

  React.useEffect(() => {
    const callData = async () => {
      // Simulate async loading
      setLoad(false);
    };

    callData();
  }, []);

  return (
    <ActivityLayout isLoadPage={load}>
      <div className="p-10 shadow-md min-h-[80vh]">
        <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center space-y-5 md:space-y-0 md:gap-4">
          {/* Sidebar Profile */}
          <div className="w-full md:w-[40%] shadow-lg min-h-[20vw] md:h-[80vh] border border-gray-300 rounded-lg p-5 md:order-2 md:space-y-5">
            <UserProfile />
            <ProfileSettings selectedType={selectedType} setSelectedType={setSelectedType} />
          </div>

          {/* Main Content */}
          <div className="w-full shadow-lg h-screen md:h-[80vh] border border-gray-300 rounded-lg p-2 md:order-1">
            {/* Content based on selectedType */}
            <p className="text-center text-lg text-gray-600">
              Showing: <strong>{selectedType}</strong>
            </p>
          </div>
        </div>
      </div>
    </ActivityLayout>
  );
}

export default Assets;
