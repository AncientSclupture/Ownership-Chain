import { useParams } from "react-router-dom";
import { MainLayout } from "../components/main-layout";
import { AssetGallery, AssetMainInfo, AssetNavigation } from "../components/asset/asset-header";
import React from "react";
import { AssetContentWrapper, assetdetailopt, AssetDetailTabs } from "../components/asset/asset-content-handler";
import OverviewAsset from "../components/asset/asset-overview";
import TokenAsset from "../components/asset/token-asset";
import DevidendHolderAsset from "../components/asset/asset-holder";
import TotalDevidendAsset from "../components/asset/asset-dividend";
import AccessInfoAsset from "../components/asset/asset-access-info";
import { Asset as AssetData, Ownership, Transaction } from "../types/rwa";
import { backendService } from "../services/backendService";
import { LoaderComponent } from "../components/LoaderComponent";
import ErrorDataNotFetched from "../components/error-nodata";

function Asset() {
  const { assetid } = useParams<{ assetid: string }>();
  const [selectedOpt, setSelectedOpt] = React.useState<assetdetailopt>(assetdetailopt.overview);
  const [data, setData] = React.useState<[] | [{
    asset: AssetData;
    ownerships: Array<Ownership>;
    transactions: Array<Transaction>;
    dividends: Array<Transaction>;
  }] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (!assetid) {
          return
        }
        const res = await backendService.getAssetDetails(assetid)
        setData(res)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData()

  }, []);

  if (isLoading) return <LoaderComponent fullScreen={true} />

  if (!data || data.length === 0) {
    return <ErrorDataNotFetched />;
  }

  return (
    <MainLayout>
      <div className="p-5 md:p-2 space-y-5">

        <AssetNavigation assetname={data[0].asset.name} />

        <div className="space-y-5 w-full md:flex md:space-y-0 md:space-x-5 px-4">
          <AssetGallery />
          <AssetMainInfo assetData={data[0].asset} />
        </div>

        <div className="md:py-12 px-4">
          <AssetDetailTabs selected={selectedOpt} onChange={setSelectedOpt} />
          <AssetContentWrapper
            current={selectedOpt}
            listcontent={[
              { name: assetdetailopt.overview, component: <OverviewAsset assetData={data[0].asset} dividendData={data[0].dividends} /> },
              { name: assetdetailopt.token, component: <TokenAsset assetData={data[0].asset} ownershipData={data[0].ownerships} /> },
              { name: assetdetailopt.devidendholder, component: <DevidendHolderAsset ownershipData={data[0].ownerships} /> },
              { name: assetdetailopt.totaldevidend, component: <TotalDevidendAsset dividendData={data[0].dividends} /> },
              { name: assetdetailopt.accessinfo, component: <AccessInfoAsset assetData={data[0].asset} /> },
            ]}
          />
        </div>

      </div>
    </MainLayout>
  );
}

export default Asset;
