import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";

export function TransferTransaction() {
    const { assetid, ownershipid } = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Asset</h2>
            <p className="text-gray-600 mb-6">
                Send your owned digital asset to another wallet address.
            </p>

            <form className="space-y-5 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setassetId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset ID</label>
                    <input
                        type="text"
                        placeholder="Enter asset ID"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={localassetid}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setassetId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ownership ID</label>
                    <input
                        type="text"
                        placeholder="Enter ownership ID"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={localownershipid}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setownershipId(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full background-dark text-white font-semibold py-2 rounded-lg transition"
                >
                    Send Asset
                </button>
            </form>
        </div>
    );
}
