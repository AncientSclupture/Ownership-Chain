import React from "react";
import { EmptyResult } from "../empty-result";
import { AssetOwnership } from "../../types/rwa";
import { formatMotokoTime } from "../../helper/rwa-helper";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";

export function HandleOpenOwnership({
    assetid,
    ownershipid,
    status,
}: {
    assetid: string;
    ownershipid: string;
    status: boolean;
}) {
    const [isloading, setIsloading] = React.useState(false);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [issuccess, setIssuccess] = React.useState(status);

    async function handleOpenData() {
        if (issuccess) return; // kalau sudah open, hentikan eksekusi
        try {
            setIsloading(true);
            const res = await backendService.openMyOwnership(assetid, ownershipid);
            if (res[0] === false) throw new Error(res[1]);

            setNotificationData({
                title: "Success",
                description: res[1],
                position: "bottom-right",
            });
            setIssuccess(true);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({
                title: "Error while opening ownership for sale",
                description: msg,
                position: "bottom-right",
            });
        } finally {
            setIsloading(false);
        }
    }

    return (
        <div
            className={`py-2 rounded-md text-white text-center font-medium transition-colors ${issuccess
                ? "bg-green-600"
                : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                }`}
        >
            <button
                onClick={handleOpenData}
                disabled={isloading || issuccess}
                className="w-full disabled:opacity-70"
            >
                {isloading
                    ? "Loading..."
                    : issuccess
                        ? "Already Opened"
                        : "Open for Sale"}
            </button>
        </div>
    );
}


export default function UserOwnershipTable(
    { ownerships, setSelectedId, notshowopen }:
        { ownerships: AssetOwnership[]; setSelectedId?: (d: string) => void | null; notshowopen?: boolean }
) {
    const [searchTerm, setSearchTerm] = React.useState("");

    const [displayedAssets, setDisplayedAssets] = React.useState<AssetOwnership[]>(ownerships);

    React.useEffect(() => {
        const filteredData = displayedAssets.filter((item) =>
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedAssets(filteredData);
    }, [searchTerm]);

    return (
        <div className="w-full">
            {/* Search bar */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Ownership List</h2>
                <input
                    type="text"
                    placeholder="Search by id..."
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Table */}
            {setSelectedId && (
                <p className="text-sm text-gray-600 mb-2">
                    Click on an <span className="font-semibold">ID</span> to select and preview the corresponding asset proposal,
                    as you are an ownership holder of that asset.
                </p>
            )}
            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Asset id</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Token</th>
                            <th className="px-4 py-3 text-left">Time</th>
                            <th className="px-4 py-3 text-left">Expired At</th>
                            {notshowopen && <th className="px-4 py-3 text-left"></th>}
                            {!notshowopen && <th className="px-4 py-3 text-left">status</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayedAssets.length > 0 ? (
                            displayedAssets.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td
                                        className="px-4 py-3 text-gray-800">
                                        {item.id}
                                    </td>
                                    <td
                                        onClick={() => setSelectedId?.(item.assetid)}
                                        className={`px-4 py-3 text-gray-800 font-medium ${setSelectedId ? "cursor-pointer hover:text-blue-600 transition" : ""
                                            }`}
                                    >
                                        {item.assetid}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">{item.buyingprice}</td>
                                    <td className="px-4 py-3 text-gray-800">{item.tokenhold}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatMotokoTime(item.holdat)}</td>
                                    <td className="px-4 py-3 text-gray-800">{formatMotokoTime(item.upuntil)}</td>
                                    {notshowopen && <td className="px-4 py-3 text-gray-800"><HandleOpenOwnership assetid={item.assetid} ownershipid={item.id} status={item.openForSale} /></td>}
                                    {!notshowopen && <th className="px-4 py-3 text-left">{item.openForSale ? "Open" : "Not for asle"}</th>}
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
