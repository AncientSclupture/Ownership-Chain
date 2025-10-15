import React from "react";
import { MainLayout } from "../../components/main-layout";
import { Asset, AssetType } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import MarketPlaceAssetCard from "../../components/market-place/marketplace-card";
import { MarketPlacePagination, MarketPlaceSearchAsset, MarketPlaceTypeFilter } from "../../components/market-place/marketplace-filter";

export function AssetMarketPlaceScreen() {
    const [loadedData, setLoadedData] = React.useState<Asset[]>([]);
    const [displayedData, setDisplayedData] = React.useState<Asset[]>([]);
    const [assetType, setAssetType] = React.useState<AssetType[]>([]);
    const [totalAsset, setTotalAsset] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const TRESH_PAGE = 6;

    const [isLoading, setIsLoading] = React.useState(true);
    const { setNotificationData } = React.useContext(NotificationContext);

    React.useEffect(() => {
        let mounted = true;
        async function init() {
            setIsLoading(true);
            try {
                const total = await backendService.getTotalAsset();
                const totalNum = Number(total ?? 0);
                if (!mounted) return;
                setTotalAsset(totalNum);

                const initialPage = totalNum > 0 ? 1 : 0;
                setCurrentPage(initialPage);
                if (initialPage > 0) await fetchPage(initialPage, totalNum);
                else {
                    setLoadedData([]);
                    setDisplayedData([]);
                }
            } catch (error) {
                setNotificationData({
                    title: "Failed to load data",
                    description: "",
                    position: "bottom-right",
                    duration: 800,
                });
            } finally {
                if (mounted) setIsLoading(false);
            }
        }
        init();
        return () => { mounted = false; };
    }, []);

    async function fetchPage(page: number, knownTotalAsset?: number) {
        setIsLoading(true);
        try {
            const total = knownTotalAsset ?? totalAsset;
            const totalPages = total > 0 ? Math.ceil(total / TRESH_PAGE) : 0;

            let targetPage = page;
            if (totalPages === 0) targetPage = 0;
            else if (page < 1) targetPage = 1;
            else if (page > totalPages) targetPage = totalPages;

            if (targetPage === 0) {
                setLoadedData([]);
                setDisplayedData([]);
                setCurrentPage(0);
                return;
            }

            const start = (targetPage - 1) * TRESH_PAGE;
            const end = start + TRESH_PAGE;
            const fetchedData = await backendService.getAssetByRange(BigInt(start), BigInt(end));
            setLoadedData(fetchedData);
            setCurrentPage(targetPage);
        } catch (error) {
            setNotificationData({
                title: "Failed to load page",
                description: "",
                position: "bottom-right",
                duration: 800,
            });
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        if (!loadedData) {
            setDisplayedData([]);
            return;
        }

        if (assetType.length === 0) {
            setDisplayedData(loadedData);
            return;
        }

        const selectedTypes = assetType.map(t => Object.keys(t)[0]);
        const filtered = loadedData.filter(asset => {
            const assetTypeKey = Object.keys(asset.assetType)[0];
            return selectedTypes.includes(assetTypeKey);
        });
        setDisplayedData(filtered);
    }, [assetType, loadedData]);

    React.useEffect(() => {
        const totalPages = totalAsset > 0 ? Math.ceil(totalAsset / TRESH_PAGE) : 0;
        if (totalPages === 0 && currentPage !== 0) {
            fetchPage(0, totalAsset);
        } else if (totalPages > 0 && currentPage > totalPages) {
            fetchPage(totalPages, totalAsset);
        }
    }, [totalAsset]);

    if (isLoading) return <LoaderComponent fullScreen={true} text="Please wait, loading data..." />;

    const totalPages = totalAsset > 0 ? Math.ceil(totalAsset / TRESH_PAGE) : 0;

    return (
        <MainLayout needProtection={true}>
            <div className="bg-gray-100">
                <div className="p-10">
                    <div className="w-full space-y-4 text-center my-8">
                        <h1 className="text-5xl text-gray-800">Discover Digital Assets</h1>
                        <h2 className="text-xl text-gray-600">Buy, sell, and trade unique digital assets on our marketplace</h2>
                    </div>
                    <MarketPlaceSearchAsset />
                </div>

                <div className="bg-white p-8 md:p-4 space-y-8 md:space-y-0 md:flex space-x-10">
                    <MarketPlaceTypeFilter setAssetType={setAssetType} assetType={assetType} />

                    <div className="space-y-5 w-full">
                        <div className="text-gray-700">{totalAsset} assets</div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                            {displayedData.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-gray-500">No assets found.</div>
                            ) : (
                                displayedData.map((d, idx) => (
                                    <MarketPlaceAssetCard
                                        key={d.id ?? idx}
                                        id={d.id}
                                        name={d.name}
                                        description={d.description}
                                        status={d.assetStatus}
                                        price={d.pricePerToken}
                                        tokenLeft={d.tokenLeft}
                                        totalToken={d.totalToken}
                                    />
                                ))
                            )}
                        </div>

                        <MarketPlacePagination
                            isLoading={isLoading}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrev={() => fetchPage(currentPage - 1)}
                            onNext={() => fetchPage(currentPage + 1)}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}