import { MainLayout } from "../layout/main-layout"
import { AssetMainContent, AssetSecondaryContent } from "../components/asset-details-component";
import { useParams } from "react-router-dom";
import React from "react";
import { backendService } from "../services/backendService";
import { Asset as AssetData } from "../../../declarations/backend/backend.did";
import { Loader } from "../components/loader-component";


function Asset() {
  const { assetid } = useParams<{ assetid: string }>();
  const [data, setData] = React.useState<AssetData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetch() {
      if (!assetid) return null;
      const res = await backendService.getAssetById(assetid);
      setData(res);
    }
    fetch()
    setIsLoading(false);
  }, []);

  if (!assetid) return <div>Failed to load data</div>

  if (isLoading) return <Loader fullScreen />

  return (
    <MainLayout>
      <div className="px-5 pt-15 pb-5 md:px-20 space-y-5 md:space-y-10">
        {/* main content */}
        <AssetMainContent data={data} />
        {/* secondary content */}
        <div>
          <AssetSecondaryContent
            mainData={data}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Asset;
