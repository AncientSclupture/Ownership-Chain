import React from "react";
import { MainLayout } from "../../components/main-layout";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Asset, TreasuryLedger } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { getAssetStatusText } from "../../helper/rwa-helper";

export function LiquidationScreen() {
    const [assetId, setAssetId] = React.useState("");
    const [assetData, setAssetData] = React.useState<Asset | null>(null);
    const [assetTreasury, setAsstTreasury] = React.useState<TreasuryLedger[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleFetchAsset = async () => {
        try {
            setIsLoading(true);
            const res = await backendService.getAsset(assetId);
            if (res.length === 0) throw new Error("Asset not found");
            setAssetData(res[0]);

            const tresuryRes = await backendService.getAllTreasuryByAssetId(assetId);
            setAsstTreasury(tresuryRes);
        } catch (error) {
            setAssetData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLiquidate = async () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Funds from ${assetData?.name} have been successfully liquidated!`);
            setAssetData(null);
            setAssetId("");
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <MainLayout needProtection={true}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        Liquidation Funding Center
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                        Manage and liquidate funds from inactive digital assets held in the treasury.
                    </p>
                </div>

                {/* Search / Input Section */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Liquidated Asset</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Enter Asset ID..."
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleFetchAsset}
                            disabled={!assetId || isLoading}
                            className={`px-5 py-2 rounded-lg font-medium text-white transition ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "background-dark text-white hover:brightness-110"
                                }`}
                        >
                            {isLoading ? "Fetching..." : "Search"}
                        </button>
                    </div>
                </div>

                {assetData && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{assetData.name}</h2>
                                <p className="text-gray-500 text-sm mt-1">Asset ID: {assetData.id}</p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getAssetStatusText(assetData.assetStatus) === "Inactive"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {getAssetStatusText(assetData.assetStatus)}
                            </span>
                        </div>

                        {/* Treasury Info */}
                        {/* Treasury Info */}
                        <div className="border rounded-lg p-5 bg-gray-50">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">
                                Treasury Balance
                            </h3>

                            <p className="text-2xl font-semibold text-gray-900">
                                ICP{" "}{assetTreasury
                                    .reduce((sum, t) => sum + Number(t.priceamount || 0), 0)
                                    .toLocaleString()}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Based on {assetTreasury.length} recorded transactions.
                            </p>
                        </div>


                        {/* Warning + Button */}
                        {getAssetStatusText(assetData.assetStatus) === "Inactive" ? (
                            <div className="mt-8">
                                <div className="flex items-center bg-yellow-50 text-yellow-700 p-3 rounded-lg border border-yellow-200 mb-5">
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    <p className="text-sm">
                                        Once liquidated, all remaining funds will be transferred from the treasury and this asset cannot be reactivated.
                                    </p>
                                </div>
                                <button
                                    onClick={handleLiquidate}
                                    disabled={isProcessing}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition ${isProcessing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        "Liquidate Funds"
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-8 text-sm text-gray-500">
                                This asset is currently <strong>not inactive</strong> and cannot do liquidation funding.
                            </div>
                        )}
                    </div>
                )}

                {!assetData && !isLoading && (
                    <div className="text-center text-gray-400 mt-16 text-sm">
                        Enter an Asset ID above to begin liquidation.
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
