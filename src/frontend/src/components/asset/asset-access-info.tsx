import { Radar } from "lucide-react";
import { Asset } from "../../types/rwa";
import { MapsLocation } from "../map-component";

export default function AccessInfoAsset(
    { assetData }: { assetData: Asset }
) {
    console.log(assetData)
    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Access Details</h1>
                {assetData.locationInfo.details.map((d, idx) =>
                    <div className="flex items-center space-x-2 py-2" key={idx}>
                        <Radar size={20} />
                        <p>{d}</p>
                    </div>
                )}
            </div>
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Asset Location Map</h1>
                <div className="w-full">
                    <MapsLocation lat={assetData.locationInfo.lat} long={assetData.locationInfo.long} />
                </div>
            </div>
        </div>
    )
}