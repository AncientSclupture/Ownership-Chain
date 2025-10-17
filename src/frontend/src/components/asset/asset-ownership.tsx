import React from "react";
import { useParams } from "react-router-dom";
import { EmptyResult } from "../empty-result";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";
import { AssetOwnership } from "../../types/rwa";
import UserOwnershipTable from "../dashboard/user-ownership";

export default function AssetOwnershipHolder() {
    const [loadedData, setLoadedData] = React.useState<AssetOwnership[]>([]);
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                if (!id) return;
                const res = await backendService.getAssetOwnerships(id);
                console.log("Ownership data:", res);
                setLoadedData(res);
            } catch (error) {
                console.error("Failed to fetch ownership data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (isLoading) return <LoaderComponent text="Please wait..." />;

    if (!loadedData || loadedData.length === 0) {
        return <EmptyResult title="No Holder yet" />;
    }

    return (
        <div className="space-y-6">
            <div className="p-6 md:px-10 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-4">
                    Ownership Holders for Asset{" "}
                    <span className="text-[#00081a]">{id}</span>
                </h1>
                <p className="text-gray-500 mb-6">
                    List of all current holders and their respective ownership details.
                    You can review their shares and associated metadata below.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <UserOwnershipTable ownerships={loadedData} />
                </div>
            </div>
        </div>
    );
}
