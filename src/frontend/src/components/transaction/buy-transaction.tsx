import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import { AssetOwnership } from "../../types/rwa";
import { formatMotokoTime } from "../../helper/rwa-helper";

function CardOwnership({ ownership, isLoading }: { ownership: AssetOwnership, isLoading: boolean }) {

    if (isLoading) return <LoaderComponent />;

    return (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ownership Details</h3>
            <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Ownership ID:</span> {ownership.id}</p>
                <p className="text-gray-600"><span className="font-medium">Owner:</span> {ownership.owner.toText()}</p>
                <p className="text-gray-600"><span className="font-medium">Acquired At:</span> {formatMotokoTime(ownership.holdat)}</p>
                <p className="text-gray-600"><span className="font-medium">Price:</span> {ownership.buyingprice}</p>
                <p className="text-gray-600"><span className="font-medium">Status:</span> {ownership.openForSale ? "Open For Sale" : "Not For Sale"}</p>
            </div>
        </div>
    );
}

export function BuyTransaction() {
    const { assetid, ownershipid, price } = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");
    const [localprice, setPrice] = React.useState<bigint | null>(price);

    const [loadedOwnership, setLoadedOwnership] = React.useState<AssetOwnership | null>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const ownershipRes = await backendService.getOwnershipById(localassetid, localownershipid);
            console.log("Ownership Res:", ownershipRes);
            if (ownershipRes.length === 0) throw new Error("No ownership found");
            setLoadedOwnership(ownershipRes[0]);
        } catch (error) {
            console.error("Error fetching ownership:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        async function init() {
            if (!localassetid || !localownershipid) return;
            try {
                setIsLoading(true);
                const ownershipRes = await backendService.getOwnershipById(localassetid, localownershipid);
                if (ownershipRes.length === 0) throw new Error("No ownership found");
            } catch (error) {
                console.error("Error fetching ownership:", error);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, []);

    return (
        <div className="flex md:flex-row flex-col items-start justify-between">
            <div className="md:w-[50%]">
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
                        onClick={handleSubmit}
                        className="mt-4 w-full background-dark text-white font-semibold py-2 rounded-lg transition"
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>

            {/* card is being here */}
            <div className="md:w-[50%]">
                {loadedOwnership && <CardOwnership ownership={loadedOwnership} isLoading={isLoading} />}
            </div>
        </div>
    );
}
