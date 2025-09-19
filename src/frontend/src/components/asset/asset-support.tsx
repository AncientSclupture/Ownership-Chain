import React from "react"
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";
import { useParams } from "react-router-dom";
import { AssetGuarantee, AssetSponsorship } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { formatMotokoTime } from "../../helper/rwa-helper";

export default function AssetSupport() {
    const { assetid } = useParams<{ assetid: string }>();

    const [isLoading, setIsLoading] = React.useState(true);
    const [sponsorship, setSponsorShip] = React.useState<AssetSponsorship[]>([]);
    const [guarantee, setGuarantee] = React.useState<[] | [AssetGuarantee]>([]);

    const { setNotificationData } = React.useContext(NotificationContext);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                if (!assetid) {
                    return
                }
                const sponsorData = await backendService.getSponsorsByAssetId(assetid)
                setSponsorShip(sponsorData);
                const guaranteeData = await backendService.getAssetGuarantee(assetid);
                setGuarantee(guaranteeData);
            } catch (error) {
                setNotificationData({ title: "failed to fetch data", description: "", position: "bottom-right" })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) return <LoaderComponent fullScreen={true} text="loading data..." />

    return (
        <div className="space-y-8">
            {/* Sponsorship Section */}
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-700 font-semibold py-5">Asset Sponsorship</h1>
                <div className="w-full space-y-4">
                    {sponsorship.length > 0 ? (
                        sponsorship.map((s, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{s.content}</p>
                                    <p className="text-sm text-gray-500">Asset ID: {s.assetid}</p>
                                    <p className="text-xs text-gray-400">
                                        {formatMotokoTime(s.timestamp)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-green-600">
                                        {Number(s.trustGuatantee) / 100_000_000} ICP
                                    </p>
                                    <p className="text-sm text-gray-500">Trust Guarantee</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No sponsorship data available for this asset.</p>
                    )}
                </div>
            </div>

            {/* Guarantee Section */}
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-700 font-semibold py-5">Asset Guarantee</h1>
                <div className="w-full space-y-4">
                    {guarantee.length > 0 ? (
                        guarantee.map((g, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{g.content}</p>
                                    <p className="text-sm text-gray-500">Asset ID: {g.assetid}</p>
                                    <p className="text-xs text-gray-400">
                                        {formatMotokoTime(g.timestamp)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-blue-600">
                                        {Number(g.amount) / 100_000_000} ICP
                                    </p>
                                    <p className="text-sm text-gray-500">Guarantee Amount</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No guarantee data available for this asset.</p>
                    )}
                </div>
            </div>
        </div>
    )
}


// export default function AssetSupport() {
//     const { assetid } = useParams<{ assetid: string }>();

//     const [isLoading, setIsLoading] = React.useState(true);
//     const [sponsorship, setSponsorShip] = React.useState<AssetSponsorship[]>([]);
//     const [guarantee, setGuarantee] = React.useState<[] | [AssetGuarantee]>([]);

//     const { setNotificationData } = React.useContext(NotificationContext);

//     React.useEffect(() => {
//         async function fetchData() {
//             setIsLoading(true)
//             try {
//                 if (!assetid) {
//                     return
//                 }
//                 const sponsorData = await backendService.getSponsorsByAssetId(assetid)
//                 setSponsorShip(sponsorData);
//                 const guaranteeData = await backendService.getAssetGuarantee(assetid);
//                 setGuarantee(guaranteeData);
//             } catch (error) {
//                 setNotificationData({ title: "failed to fetch data", description: "", position: "bottom-right" })
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchData()
//     }, [])

//     if (isLoading) return <LoaderComponent fullScreen={true} text="loading data..." />

//     return (
//         <div className="space-y-8">
//             <div className="p-4 md:px-8 border border-gray-300 rounded-md">
//                 <h1 className="text-xl text-gray-500 py-5">Asset Sponsorship</h1>
//                 <div className="w-full">
//                 </div>
//             </div>
//             <div className="p-4 md:px-8 border border-gray-300 rounded-md">
//                 <h1 className="text-xl text-gray-500 py-5">Asset Guarantee</h1>
//                 <div className="w-full">
//                 </div>
//             </div>
//         </div>
//     )
// }