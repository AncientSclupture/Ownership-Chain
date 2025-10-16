import React from "react";
import { Asset, AssetRule } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { FileText, HardDriveDownload, MapPin, Radar } from "lucide-react";
import { MapsLocation } from "../map-component";

function DocumentComponent({ name, hash }: { name: string, hash: string }) {
    const { setNotificationData } = React.useContext(NotificationContext);

    function handleCopy() {
        navigator.clipboard.writeText(hash);
        setNotificationData({
            title: `${name} hash successfully copied`,
            description: "You can use the hash to verify the document assets",
            position: "bottom-right"
        })
    }

    return (
        <div className="p-3 bg-gray-200 rounded-md flex justify-between items-center">
            <p className="text-sm">{name}</p>
            <button className="cursor-pointer" onClick={() => handleCopy()}>
                <HardDriveDownload size={20} />
            </button>
        </div>
    );
}

function RuleComponent({ rules, maturityTime, mintoken, maxtoken }: { rules: AssetRule[], maturityTime: bigint, mintoken:bigint, maxtoken:bigint }) {
    if (!rules || rules.length === 0) {
        return (
            <div className="text-gray-500 text-sm italic">
                No additional rules have been defined for this asset.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div
                className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm"
            >
                <div className="flex-shrink-0 mt-1 text-gray-500">
                    <FileText size={20} />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Done Payment (default)</h3>
                    <p className="text-gray-600 text-sm mt-1">Done Payment must be 20% from total payment</p>
                </div>
            </div>
            <div
                className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm"
            >
                <div className="flex-shrink-0 mt-1 text-gray-500">
                    <FileText size={20} />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Ownership Maturity Time</h3>
                    <p className="text-gray-600 text-sm mt-1">{maturityTime === BigInt(0) ? "This asset allowed you to own the asset forever" : `This asset allowed you to own the asset ${maturityTime} days`}</p>
                </div>
            </div>
            <div
                className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm"
            >
                <div className="flex-shrink-0 mt-1 text-gray-500">
                    <FileText size={20} />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Minimal Token Purchased</h3>
                    <p className="text-gray-600 text-sm mt-1">{`Minimal token purchased you should buy in this asset ${mintoken} token`}</p>
                </div>
            </div>
            <div
                className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm"
            >
                <div className="flex-shrink-0 mt-1 text-gray-500">
                    <FileText size={20} />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium text-gray-800">Maximal Token Purchased</h3>
                    <p className="text-gray-600 text-sm mt-1">{`Maximal token purchased you can buy in this asset ${maxtoken} token`}</p>
                </div>
            </div>
            {rules.map((rule, index) => (
                <div
                    key={index}
                    className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-200 shadow-sm"
                >
                    <div className="flex-shrink-0 mt-1 text-gray-500">
                        <FileText size={20} />
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-800">{rule.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{rule.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AssetOverview({ data }: { data: Asset }) {
    const locations = data.locationInfo || [];

    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Description</h1>
                <div className="text-gray-800">
                    {data.description}
                </div>
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Rules</h1>
                <RuleComponent rules={data.rule} maturityTime={data.ownershipMaturityTime} mintoken={data.minTokenPurchased} maxtoken={data.maxTokenPurchased} />
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Documentation Legality</h1>
                <div className="w-full space-y-2">
                    {data.documentHash.map((doc, idx) =>
                        <DocumentComponent key={idx} hash={doc.hash} name={doc.name} />
                    )}
                </div>
            </div>

            {locations.length > 0 ? (
                locations.map((loc, index) => (
                    <div key={index} className="space-y-8">
                        {/* Access Details */}
                        <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                            <div className="flex items-center justify-between pb-3">
                                <h1 className="text-xl text-gray-500">Access Details #{index + 1}</h1>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <MapPin size={16} />
                                    <span>{`${loc.lat}, ${loc.long}`}</span>
                                </div>
                            </div>

                            {loc.details && loc.details.length > 0 ? (
                                <div className="space-y-2">
                                    {loc.details.map((d: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2 text-gray-700">
                                            <Radar size={20} className="text-blue-500" />
                                            <p>{d}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No access details available.</p>
                            )}
                        </div>

                        {/* Map */}
                        <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                            <h1 className="text-xl text-gray-500 py-5">Asset Location Map #{index + 1}</h1>
                            <div className="w-full">
                                <MapsLocation lat={loc.lat} long={loc.long} />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                    <p className="text-gray-500 italic">No location data available.</p>
                </div>
            )}
        </div>
    );
}