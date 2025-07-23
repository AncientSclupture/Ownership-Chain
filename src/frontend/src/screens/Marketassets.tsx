import React from "react";
import { ActivityLayout } from "../components/layout";
import { useParams } from "react-router-dom";
import { NotFound } from "../components/not-found";
import { Asset } from "../types/rwa";
import { backendService } from "../services/backendService";
import { MarketPlaceAssetInformation, MarketPlaceAssetStatistics } from "../components/market-place-info";
import { BuyTokenModal } from "../components/buy-token-modal";

function Markeatasset() {
  const { id } = useParams();
  const [load, setLoad] = React.useState(true);
  const [found, setFound] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const [asset, setAsset] = React.useState<Asset | null>(null);

  React.useEffect(() => {
    const callData = async () => {

      // in case : react router dom is not functional anymore
      if (!id) {
        setLoad(false);
        setFound(false);
        return;
      }

      const retrievedAssetData = await backendService.getAsset(id);
      setAsset(retrievedAssetData);
      setLoad(false);

      if (!retrievedAssetData) { setFound(false); return; }

      setFound(true);
    };

    callData();
  }, []);

  if (!found) return <ActivityLayout isLoadPage={load}><NotFound /></ActivityLayout>
  
  // in case : react router dom is not functional anymore
  if (!id) return <ActivityLayout isLoadPage={false}><NotFound /></ActivityLayout>;


  return (
    <ActivityLayout isLoadPage={load}>
      <div className="w-full min-h-screen px-5 py-10 md:p-10 flex justify-center md:items-center items-start">
        <div className="w-full p-6 bg-white border border-gray-300 shadow-lg rounded-xl space-y-4 md:flex md:items-start md:space-y-0 md:space-x-6">
          <MarketPlaceAssetInformation asset={asset ?? null} setOpenModal={setOpenModal} />
          <MarketPlaceAssetStatistics asset_id={id} />
        </div>
      </div>
      <BuyTokenModal openModal={openModal} setOpenModal={setOpenModal} asset_id={id} />
    </ActivityLayout>
  );
}
export default Markeatasset;
