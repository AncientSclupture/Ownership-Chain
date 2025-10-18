import React from "react";
import { EmptyResult } from "../empty-result";
import { Asset } from "../../types/rwa";
import { formatMotokoTime, getAssetStatusText, getAssetTypeText } from "../../helper/rwa-helper";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";

function ShareDevidend({ assetid }: { assetid: string }) {
    const { setassetid } = React.useContext(AssetOwnershipParsingDataContext);
    const { setModalKind } = React.useContext(ModalContext);
    return (
        <button
            onClick={() => {
                setassetid(assetid);
                setModalKind(ModalKindEnum.distributedividend);
            }}
            className="p-2 rounded-md background-dark text-white text-sm"
        >
            dividend
        </button>
    );
}

export default function AssetTable(
    { assets, setassetid }:
        { assets: Asset[], setassetid: React.Dispatch<React.SetStateAction<string>> }
) {
    const [searchTerm, setSearchTerm] = React.useState("");

    const [displayedAssets, setDisplayedAssets] = React.useState<Asset[]>(assets);

    React.useEffect(() => {
        const filteredData = displayedAssets.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedAssets(filteredData);
    }, [searchTerm]);

    return (
        <div className="w-full">
            {/* Search bar */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Assets List</h2>
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <p className="text-sm text-black">Click The Asset ID to see additional information for that asset.</p>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Token Left</th>
                            <th className="px-4 py-3 text-left">Created</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Distrubute</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayedAssets.length > 0 ? (
                            displayedAssets.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td onClick={() => setassetid(item.id)}
                                        className="px-4 py-3 text-gray-800 font-medium cursor-pointer">
                                        {item.id}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.tokenLeft}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatMotokoTime(item.createdAt)}</td>
                                    <td className="px-4 py-3 text-gray-800">{getAssetStatusText(item.assetStatus)}</td>
                                    <td className="px-4 py-3 text-gray-600">{getAssetTypeText(item.assetType)}</td>
                                    <td className="px-4 py-3 text-gray-600"><ShareDevidend assetid={item.id} /></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    <EmptyResult />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
