import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";
import { LoaderComponent } from "../LoaderComponent";
import { AssetOwnership } from "../../types/rwa";
import { formatMotokoTime } from "../../helper/rwa-helper";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";

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

export function TransferTransaction() {
    const { assetid, ownershipid } = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");
    const [localPrincipalId, setLocalPrincipalId] = React.useState<Principal | null>();
    const [loadedOwnership, setLoadedOwnership] = React.useState<AssetOwnership | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState("");

    const { setNotificationData } = React.useContext(NotificationContext);
    const navigate = useNavigate()

    const handleValidate = async () => {
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

    const handleTransfer = async () => {
        try {
            setIsLoading(true);
            if (!loadedOwnership) throw new Error("no ownership found");
            if (!localPrincipalId) throw new Error("Target Reciept Id cannot be null");
            const transactionRes = await backendService.transferOwnership(loadedOwnership.assetid, loadedOwnership.id, localPrincipalId);
            console.log(transactionRes);
            if (transactionRes[0] === false) throw new Error(transactionRes[1]);
            setNotificationData({ title: "Success Transfer Ownership", description: transactionRes[1], position: "bottom-right" })
            navigate("/protected-transferandsell");
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "Error Transfer Ownership", description: msg, position: "bottom-right" })
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputUserPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.trim();

        try {
            const principal = Principal.fromText(input);
            setLocalPrincipalId(principal);
            setError("");
        } catch (err) {
            setLocalPrincipalId(null);
            setError("Invalid Principal format");
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Asset</h2>
                <p className="text-gray-600 mb-6">
                    Send your owned digital asset to another wallet address.
                </p>

                <div className="space-y-5 max-w-lg">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Recipient Address
                        </label>

                        <input
                            type="text"
                            placeholder="Principal e.g. 4mw-23xg5-a4fg5-s2rsx-q7sl5-fhv25-6tox7-qzess-w6z6q-qqhtx-yae"
                            className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
                                }`}
                            onChange={handleInputUserPrincipalChange}
                        />

                        {error && <p className="text-sm mt-3 text-red-500">{error}</p>}

                        {localPrincipalId && (
                            <p className="text-sm mt-3 text-green-600">
                                ✅ Valid Principal: {localPrincipalId.toText()}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={loadedOwnership ? handleTransfer : handleValidate}
                        className="mt-4 w-full background-dark text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loadedOwnership ? "Send Asset" : "Validate"}
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
