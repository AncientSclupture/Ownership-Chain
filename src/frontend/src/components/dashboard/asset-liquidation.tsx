import React from "react";
import { EmptyResult } from "../empty-result";
import { Asset } from "../../types/rwa";
import { getAssetStatusText, getAssetTypeText } from "../../helper/rwa-helper";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";

export default function AssetLiquidationCards({ assets }: { assets: Asset[] }) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredAssets, setFilteredAssets] = React.useState<Asset[]>(assets);
    const [isloading, setIsloading] = React.useState(false);
    const { setNotificationData } = React.useContext(NotificationContext);

    const navigate = useNavigate();

    React.useEffect(() => {
        const data = assets.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAssets(data);
    }, [searchTerm, assets]);

    const handleInactive = async (assetId: string) => {
        console.log(`Asset ${assetId} will be set to inactive`);
        try {
            setIsloading(true);
            const res = await backendService.inactiveAsset(assetId);
            if (res[0] === false) throw new Error(res[1]);
            setNotificationData({ title: "Success inactivate asset", description: res[1], position: "bottom-right" })
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "Error while inactivate asset", description: msg, position: "bottom-right" })
        } finally {
            setIsloading(false);
        }
    };

    if (isloading) return <LoaderComponent fullScreen={true} />

    return (
        <div className="w-full">
            {/* Header + Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Assets</h2>
                <input
                    type="text"
                    placeholder="Search asset by name..."
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Card Grid */}
            {filteredAssets.length === 0 ? (
                <EmptyResult />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAssets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
                        >
                            {/* Asset Info */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-semibold text-gray-800">
                                        {asset.name}
                                    </h3>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {getAssetTypeText(asset.assetType)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium text-gray-700">ID:</span>{" "}
                                    {asset.id}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium text-gray-700">Created:</span>{" "}
                                    {asset.createdAt}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium text-gray-700">Token Left:</span>{" "}
                                    {asset.tokenLeft}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Status:</span>{" "}
                                    {getAssetStatusText(asset.assetStatus)}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-4 flex justify-between">
                                <button
                                    disabled={isloading}
                                    onClick={() => navigate(`/protected-asset/${asset.id}`)}
                                    className="px-4 py-2 rounded-lg bg-gray-300 text-black text-sm font-medium transition"
                                >
                                    {isloading ? "loading" : "Details"}
                                </button>
                                <button
                                    disabled={isloading || getAssetStatusText(asset.assetStatus) === "Inactive"}
                                    onClick={() => handleInactive(asset.id)}
                                    className="px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-medium transition"
                                >
                                    {isloading ? "loading" : getAssetStatusText(asset.assetStatus) === "Inactive" ? "already inactive" : "Inactive"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
