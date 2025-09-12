import React from "react";

import { MainLayout } from "../components/main-layout";
import { Asset, AssetType } from "../types/rwa";
import MarketPlaceAssetCard from "../components/marketplace/marketplace-card";
import { backendService } from "../services/backendService";
import { LoaderComponent } from "../components/LoaderComponent";
import { MarketPlacePagination, MarketPlaceSearchAsset, MarketPlaceTypeFilter } from "../components/marketplace/marketplace-filter";
import { isSameAssetType } from "../helper/rwa-helper";

function MarketPlace() {
  const [storedData, setStoredData] = React.useState<Asset[] | null>([]);
  const [showedData, setShowedData] = React.useState<Asset[] | null>(null);
  const [filteredData, setFilteredData] = React.useState<Asset[] | null>(null);

  const [assetCount, setAssetCount] = React.useState<bigint>(BigInt(0));
  const [paginationNumber, setPagination] = React.useState<bigint>(BigInt(0));
  const [assetType, setAssetType] = React.useState<AssetType[]>([]);
  const [load, setLoad] = React.useState(true);
  const TOTAL_ITEM = 6;

  React.useEffect(() => {
    async function fetchData() {
      const totalAssetCount = await backendService.getTotalAssetCount();
      setAssetCount(totalAssetCount);

      const resAsset = await backendService.getAssetbyRange(paginationNumber, paginationNumber + BigInt(TOTAL_ITEM));
      setShowedData(resAsset);
      setStoredData(resAsset);
      setLoad(false)
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    async function fetchAddData() {
      setLoad(true);
      try {
        const start = Number(paginationNumber) * TOTAL_ITEM;
        const end = start + TOTAL_ITEM;

        let safeStoredData = storedData ?? [];

        if (safeStoredData.length < end) {
          const res = await backendService.getAssetbyRange(
            BigInt(start),
            BigInt(end)
          );

          safeStoredData = [...safeStoredData, ...(res ?? [])];
          setStoredData(safeStoredData);
        }

        setShowedData(safeStoredData.slice(start, end));
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    }

    if (assetCount > BigInt(0)) {
      fetchAddData();
    }
  }, [paginationNumber, assetCount]);

  React.useEffect(() => {
    let safeStoredData = showedData ?? [];
    let filtered: Asset[];

    if (assetType.length === 0) {
      filtered = safeStoredData;
    } else {
      filtered = safeStoredData.filter((asset) => 
        assetType.some((t) => isSameAssetType(t, asset.assetType))
      );
      console.log(filtered)
    }

    setFilteredData(filtered);

  }, [assetType, paginationNumber, showedData]);

  if (load) return <LoaderComponent fullScreen={true} />

  return (
    <MainLayout index>
      <div className="bg-gray-100">
        <div className="p-10">
          <div className="w-full space-y-4 text-center my-8">
            <h1 className="text-5xl text-gray-800">Discover Digital Assets</h1>
            <h2 className="text-xl text-gray-600">Buy, sell, and trade unique digital assets on our marketplace</h2>
          </div>

          <MarketPlaceSearchAsset />
        </div>

        <div className="bg-white p-4 space-y-8 md:space-y-0 md:flex space-x-10">
          <MarketPlaceTypeFilter
            setAssetType={setAssetType}
          />

          <div className="space-y-5 w-full">
            <div className="text-gray-700">
              {assetCount} assets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
              {filteredData?.map((d, idx) =>
                <MarketPlaceAssetCard
                  key={idx}
                  id={d.id}
                  name={d.name}
                  description={d.description}
                  price={d.pricePerToken}
                  status={d.assetStatus}
                  tokenLeft={d.tokenLeft}
                  totalToken={d.totalToken}
                />
              )}
            </div>

            <MarketPlacePagination
              assetCount={assetCount}
              paginationNumber={paginationNumber}
              setPagination={setPagination}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MarketPlace;
