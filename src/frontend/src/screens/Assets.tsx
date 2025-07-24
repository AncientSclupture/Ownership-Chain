import { ActivityLayout } from "../components/layout";
import React from "react";
import { UserProfile } from "../components/profile";
import { ProfileSettings, UserOptionsType } from "../components/profile-settings";
import { CreateAssetsModal } from "../components/create-assets-modal";

import { backendService } from "../services/backendService";
import { GetUserProfileResult } from "../types/rwa";
import { AssetVote, ShowingMyAssets, ShowingMyTransactions } from "../components/asset-profile-content";

function Assets() {
  const [load, setLoad] = React.useState(true);
  const [selectedType, setSelectedType] = React.useState<UserOptionsType>(UserOptionsType.MyAssets);
  const [data, setData] = React.useState<GetUserProfileResult | null>(null)
  const [openModal, setOpenModal] = React.useState(false);


  React.useEffect(() => {
    const callData = async () => {
      const retreivedData = await backendService.getProfiles();
      setData(retreivedData);

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
            <UserProfile setOpenModal={setOpenModal} userprof={data?.profile} />
            <ProfileSettings selectedType={selectedType} setSelectedType={setSelectedType} setOpenModal={setOpenModal} />
          </div>

          {/* Main Content */}
          <div className="w-full shadow-lg h-screen md:h-[80vh] hide-scrollbar border border-gray-300 rounded-lg p-2 md:order-1 overflow-y-auto">
            {/* Content based on selectedType */}
            <div className="text-center text-lg text-gray-600">
              {selectedType === UserOptionsType.MyAssets && <ShowingMyAssets />}
              {selectedType === UserOptionsType.Transactions && <ShowingMyTransactions />}
              {selectedType === UserOptionsType.Vote && <AssetVote />}
            </div>
          </div>

        </div>
      </div>
      <CreateAssetsModal openModal={openModal} setOpenModal={setOpenModal} />
    </ActivityLayout>
  );
}

export default Assets;
