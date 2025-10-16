import React from "react";
import { MainLayout } from "../../components/main-layout"
import { Asset } from "../../types/rwa";
import { LoaderComponent } from "../../components/LoaderComponent";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyResult } from "../../components/empty-result";
import { AssetGallery, AssetMainInfo, AssetNavigation } from "../../components/asset/asset-header";
import { AssetContentWrapper, assetdetailopt, AssetDetailTabs } from "../../components/asset/asset-content-handler";
import AssetOverview from "../../components/asset/asset-overview";
import AssetSupport from "../../components/asset/asset-support";
import AssetOwnershipHolder from "../../components/asset/asset-ownership";
import { AssetDividend } from "../../components/asset/asset-dividend-history";

export function AssetDetailScreen() {
    const [loadedData, setLoadedData] = React.useState<[Asset] | []>([]);
    const [selectedOpt, setSelectedOpt] = React.useState<assetdetailopt>(assetdetailopt.overview);

    const [isLoading, setIsLoading] = React.useState(true);
    const { id } = useParams<{ id: string }>();
    const { setNotificationData } = React.useContext(NotificationContext);
    const navigate = useNavigate()

    React.useEffect(() => {
        async function init() {
            setIsLoading(true);
            try {
                if (!id) {
                    return
                }
                const fetchedData = await backendService.getAsset(id);
                setLoadedData(fetchedData);
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

    if (isLoading) return <LoaderComponent fullScreen={true} text="Please wait, loading data..." />;

    if (loadedData.length === 0) return <EmptyResult
        title="Asset not found"
        description="We didn't find an asset with the specified ID. Please ensure the ID is correct or try again later."
        fullScreen={true}
        actionButton={
            <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl background-dark text-white transition"
            >
                Home
            </button>
        }
    />

    return (
        <MainLayout needProtection={true}>
            <div className="p-6 md:p-8 space-y-5">
                <AssetNavigation assetname={loadedData[0].name} />
                <div className="space-y-5 w-full md:flex md:space-y-0 md:space-x-5 px-4">
                    <AssetGallery />
                    <AssetMainInfo assetData={loadedData[0]} />
                </div>

                <div className="md:py-12 px-4">
                    <AssetDetailTabs selected={selectedOpt} onChange={setSelectedOpt} />
                    <AssetContentWrapper
                        current={selectedOpt}
                        listcontent={[
                            { name: assetdetailopt.overview, component: <AssetOverview data={loadedData[0]} /> },
                            { name: assetdetailopt.ownership, component: <AssetOwnershipHolder /> },
                            { name: assetdetailopt.devidendhistory, component: <AssetDividend /> },
                            { name: assetdetailopt.support, component: <AssetSupport /> },
                        ]}
                    />
                </div>
            </div>
        </MainLayout>
    );
}