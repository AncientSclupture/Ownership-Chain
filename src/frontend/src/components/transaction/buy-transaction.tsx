import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";

export function BuyTransaction() {
    const {assetid, ownershipid, price} = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");
    const [localprice, setPrice] = React.useState<bigint | null>(price);

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Buy Ownership</h2>
            <p className="text-gray-600 mb-6">
                Enter the details below to purchase a digital asset.
            </p>

            <div className="space-y-5 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset ID</label>
                    <input
                        type="text"
                        placeholder="Enter asset ID"
                        value={localassetid}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setassetId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ownership ID</label>
                    <input
                        type="text"
                        placeholder="Enter ownership ID"
                        value={localownershipid}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setownershipId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price Amount</label>
                    <input
                        type="text"
                        placeholder="Enter amount"
                        value={localprice !== null ? localprice.toString() : ""}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const v = e.target.value;
                            setPrice(v === "" ? null : BigInt(v));
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full background-dark text-white font-semibold py-2 rounded-lg transition"
                >
                    Confirm Purchase
                </button>
            </div>
        </div>
    );
}
