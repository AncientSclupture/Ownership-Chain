import React from "react";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";
import { TreasuryLedger } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import { formatMotokoTime, getTreasuryLedgerText } from "../../helper/rwa-helper";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";

function CardTransaction({ treasury, isLoading }: { treasury: TreasuryLedger, isLoading: boolean }) {

    if (isLoading) return <LoaderComponent />;

    return (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Donepayment Treasury Details</h3>
            <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Ownership ID:</span> {treasury.assetid}</p>
                <p className="text-gray-600"><span className="font-medium">Description:</span> {treasury.description}</p>
                <p className="text-gray-600"><span className="font-medium">Owner:</span> {treasury.from.toText()}</p>
                <p className="text-gray-600"><span className="font-medium">Acquired At:</span> {formatMotokoTime(treasury.createdAt)}</p>
                <p className="text-gray-600"><span className="font-medium">Price:</span> {treasury.priceamount}</p>
                <p className="text-gray-600"><span className="font-medium">Type:</span> {getTreasuryLedgerText(treasury.treasuryledgerType)}</p>
            </div>
        </div>
    );
}


export function CashbackTransaction() {
    const { assetid, ownershipid, price } = React.useContext(AssetOwnershipParsingDataContext);

    const [localassetid, setassetId] = React.useState<string>(assetid || "");
    const [localownershipid, setownershipId] = React.useState<string>(ownershipid || "");
    const [proposalid, setProposalid] = React.useState<string | null>(null);
    const [localprice, setPrice] = React.useState<number | null>(price);
    const [loeadedTreasury, setLoadedTreasury] = React.useState<TreasuryLedger | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { setNotificationData } = React.useContext(NotificationContext);

    const navigate = useNavigate()

    const handlevalidate = async () => {
        try {
            setIsLoading(true);
            const transactionRes = await backendService.getTreasuryByAssetId(localassetid, localownershipid);
            console.log("Transaction Res:", transactionRes);
            console.log("kontol")
            if (transactionRes.length === 0) throw new Error("No ownership found");
            setLoadedTreasury(transactionRes[0]);
        } catch (error) {
            console.error("Error fetching ownership:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrawCahsBack = async () => {
        try {
            setIsLoading(true);
            if (!loeadedTreasury) throw new Error("no transaction found");
            if (!localprice) throw new Error("no amount detected");
            if (!proposalid) throw new Error("no proposal detected");
            const transactionRes = await backendService.withdrawDPCashback(localassetid, loeadedTreasury.tsid, proposalid, localprice);
            console.log(transactionRes);
            if (transactionRes[0] === false) throw new Error(transactionRes[1]);
            setNotificationData({ title: "Success To Withdraw Done payment Cashback", description: transactionRes[1], position: "bottom-right" })
            navigate("/protected-transferandsell");
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "Error To Withdraw Done payment Cashback", description: msg, position: "bottom-right" })
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        async function init() {
            if (!localassetid || !localownershipid) return;
            try {
                setIsLoading(true);
                const ownershipRes = await backendService.getTreasuryByAssetId(localassetid, localownershipid);
                if (ownershipRes.length === 0) throw new Error("No treasury found");
            } catch (error) {
                console.error("Error fetching treasury:", error);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, []);

    return (
        <div className="flex md:flex-row flex-col items-start justify-between">
            <div className="md:w-[50%]">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Get Cahsback Proposal Done Payment</h2>
                <p className="text-gray-600 mb-6">
                    Withdraw your cashback from uncompleted proposals. Enter the asset and transaction details below to proceed.
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
                        <label className="block text-sm font-medium text-gray-700">Treasury ID</label>
                        <input
                            type="text"
                            placeholder="Enter Treasury ID"
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={localownershipid}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setownershipId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Proposal ID</label>
                        <input
                            type="text"
                            placeholder="Enter asset ID"
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={proposalid ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposalid(e.target.value)}
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
                                setPrice(v === "" ? null : Number(v));
                            }}
                        />
                    </div>
                    <button
                        onClick={loeadedTreasury ? handleDrawCahsBack : handlevalidate}
                        className="mt-4 w-full background-dark text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loeadedTreasury ? "Claim" : "Validate"}
                    </button>
                </div>
            </div>

            {/* card is being here */}
            <div className="md:w-[50%]">
                {loeadedTreasury && <CardTransaction treasury={loeadedTreasury} isLoading={isLoading} />}
            </div>
        </div>
    );
}
