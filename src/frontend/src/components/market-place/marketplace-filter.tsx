import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AssetType } from "../../types/rwa";
import { isSameAssetType, text2AssetType } from "../../helper/rwa-helper";

export function MarketPlaceSearchAsset() {
    const [seacrhQuery, setSeacrhQuery] = React.useState("");

    return (
        <div className="w-full flex items-center justify-center">
            <div className="shadow-lg w-full md:w-[60vw] rounded-md border border-gray-300 my-8 bg-white">
                <div className="p-4 space-y-5 w-full md:flex md:items-center md:space-x-3 md:space-y-0">
                    <input
                        type="text" name="search" id="search"
                        className="border border-gray-300 w-full rounded-md p-2 md:w-full"
                        placeholder="cosmic girls"
                        value={seacrhQuery}
                        onChange={(e) => setSeacrhQuery(e.target.value)}
                    />
                    <button
                        className="background-dark p-2 rounded-md w-full flex items-center justify-center space-x-3 cursor-pointer md:w-[15%]"
                    >
                        <Search size={20} color="white" />
                        <p className="text-white">Search</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export function MarketPlaceTypeFilter(
    { assetType, setAssetType }: { assetType: AssetType[], setAssetType: React.Dispatch<React.SetStateAction<AssetType[]>> }
) {
    function handleTypeFilter(value: string) {
        const newType = text2AssetType(value);

        setAssetType((prev) => {
            const exists = prev.some((t) => isSameAssetType(t, newType));

            if (exists) {
                // kalau sudah ada, berarti user mau uncheck
                return prev.filter((t) => !isSameAssetType(t, newType));
            } else {
                // kalau belum ada, tambahkan ke daftar aktif
                return [...prev, newType];
            }
        });
    }

    const isChecked = (typeName: string) => {
        const type = text2AssetType(typeName);
        return assetType.some((t) => isSameAssetType(t, type));
    };

    return (
        <div>
            <div className="w-full border border-gray-300 rounded-md p-5 md:w-[20vw]">
                <h1 className="text-xl text-gray-500 mb-7">Asset Types</h1>
                <div className="space-y-4">
                    {["Physical", "Digital", "Hybrid"].map((typeName) => (
                        <div key={typeName} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={typeName}
                                className="w-5 h-5"
                                checked={isChecked(typeName)}
                                onChange={() => handleTypeFilter(typeName)}
                            />
                            <label htmlFor={typeName}>{typeName}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export function MarketPlacePagination({
    currentPage,
    totalPages,
    isLoading,
    onPrev,
    onNext,
}: {
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    onPrev: () => void;
    onNext: () => void;
}) {
    // Display page label nicely. If no pages, show 0 / 0
    const displayCurrent = totalPages === 0 ? 0 : currentPage;
    const displayTotal = totalPages;

    const prevDisabled = isLoading || displayTotal === 0 || displayCurrent <= 1;
    const nextDisabled = isLoading || displayTotal === 0 || displayCurrent >= displayTotal;

    return (
        <div className="w-full flex items-center justify-center my-10">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => { if (!prevDisabled) onPrev(); }}
                    disabled={prevDisabled}
                    className={`md:min-w-[3.2vw] min-w-[8vw] aspect-square rounded-md flex items-center justify-center ${
                        prevDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                    <ChevronLeft color="white" />
                </button>

                <div className="px-4 py-2 text-gray-800 font-semibold">
                    {displayCurrent} / {displayTotal}
                </div>

                <button
                    onClick={() => { if (!nextDisabled) onNext(); }}
                    disabled={nextDisabled}
                    className={`md:min-w-[3.2vw] min-w-[8vw] aspect-square rounded-md flex items-center justify-center ${
                        nextDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                    <ChevronRight color="white" />
                </button>
            </div>
        </div>
    );
}
