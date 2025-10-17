import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";
import { AssetProposal } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import { formatMotokoTime } from "../../helper/rwa-helper";

function CardProposal({ proposal, isLoading }: { proposal: AssetProposal, isLoading: boolean }) {

    if (isLoading) return <LoaderComponent />;

    return (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Proposal Details</h3>
            <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Proposal ID:</span> {proposal.id}</p>
                <p className="text-gray-600"><span className="font-medium">From:</span> {proposal.from.toText()}</p>
                <p className="text-gray-600"><span className="font-medium">Created At:</span> {formatMotokoTime(proposal.createdAt)}</p>
                <p className="text-gray-600"><span className="font-medium">Token Amount:</span> {proposal.token}</p>
                <p className="text-gray-600"><span className="font-medium">Price per Token:</span> {proposal.pricePerToken}</p>
                {/* <p className="text-gray-600"><span className="font-medium">Status:</span> {getTransactionStatusText(proposal.status)}</p> */}
            </div>
            <button></button>
        </div>
    );
}


export function FinishPaymentTransaction() {
    const { assetid, ownershipid, price } = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");
    const [localprice, setPrice] = React.useState<bigint | null>(price);

    const [loadedProposal, setLoadedProposal] = React.useState<AssetProposal | null>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const proposalRes = await backendService.getProposal(localassetid, localownershipid);
            console.log("Ownership Res:", proposalRes);
            if (proposalRes.length === 0) throw new Error("No ownership found");
            setLoadedProposal(proposalRes[0]);
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
                const ownershipRes = await backendService.getTransactionByTransactionId(localassetid, localownershipid);
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Finished Your Proposal Payment</h2>
                <p className="text-gray-600 mb-6">
                    Pay Remaining amount to claim the asset holder or ownership, after the voting process is done.
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
                        <label className="block text-sm font-medium text-gray-700">Proposal ID</label>
                        <input
                            type="text"
                            placeholder="Enter proposal ID"
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localownershipid}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setownershipId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
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
                {loadedProposal && <CardProposal proposal={loadedProposal} isLoading={isLoading} />}
            </div>
        </div>
    );
}
