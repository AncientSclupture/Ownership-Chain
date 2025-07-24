import React from "react";
import { backendService } from "../services/backendService";
import { ChartDataInterface, ChartTransactionsAssets } from "./assets-type-chart";
import { Proposal, VotableProposal } from "../types/rwa";


interface UserAssetInterface {
    assetName: string;
    assetId: string;
    assetToken: bigint;
    assetStatus: string;
    isOwner: boolean;
}

// load spiner
export function LoaderSpinner() {
    return (
        <div className="flex justify-center items-center h-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

export function DistributeDividendModal({
    openModal,
    setOpenModal,
    asset_id
}: {
    openModal: boolean;
    setOpenModal: (d: boolean) => void;
    asset_id: string;
}) {
    const [devidenValue, setDevidenValue] = React.useState(0);

    const handleCancle = () => {
        setDevidenValue(0);
        setOpenModal(false);
    }

    const handlePurchase = async () => {
        const proposeResp = await backendService.distributeDividend(asset_id, BigInt(devidenValue));

        if ("ok" in proposeResp) {
            alert("Divdend Has Been Distributed Successfully!!" + proposeResp.ok);
            setOpenModal(false);
        } else {
            alert("Failed to create asset: " + proposeResp.err);
        }
        setDevidenValue(0);
        setOpenModal(false);
    }

    return (
        <div className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${openModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}>
            <div className="flex items-center justify-center h-full w-full">
                <div className="bg-white w-[90vw] max-w-xl p-8 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl text-gray-800">Distribute Assets <span className="font-bold">{asset_id}</span> Dividen</h2>
                        <button
                            onClick={handleCancle}
                            className="text-sm text-red-500 font-semibold hover:underline cursor-pointer"
                        >
                            Exit
                        </button>
                    </div>

                    {/* Agreement Section */}
                    <div className="space-y-4 text-gray-700">
                        <p>Enter the amount of devident that this assets gained (in USD):</p>
                        <input
                            type="text"
                            min={1}
                            value={devidenValue}
                            onChange={(e) => {
                                const value = BigInt(e.target.value)
                                setDevidenValue(Number(value));
                            }}
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p>
                            The total amount you'll pay is:{" "}
                            <span className="text-sm font-mono font-bold">${devidenValue}</span>
                        </p>

                        <p className="text-sm text-gray-500">
                            By proceeding, you agree to purchase tokens for this asset as stated above.
                        </p>

                        {/* Action */}
                        <div className="mt-6">
                            <button
                                onClick={handlePurchase}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

function SimpleAssetCard({ data, setOpenModalDividend, setSelectedAssetId }: { data: UserAssetInterface, setOpenModalDividend: (d: boolean) => void, setSelectedAssetId: (d: string) => void }) {
    const handleOpenModal = () => {
        if (data.isOwner) {
            setOpenModalDividend(true);
            setSelectedAssetId(data.assetId);
        } else {
            setOpenModalDividend(false);
        }
    }

    return (
        <div className={`border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-[48%] p-3 ${data.isOwner ? 'cursor-pointer' : ''}`} onClick={handleOpenModal}>
            <div className="text-start">
                <p className="font-bold flex items-center justify-center space-x-2"><span>{data.assetName}</span></p>
                <p className="text-sm font-mono">{data.assetId}</p>
                <p className="text-sm">Tokenowned: <span className="font-bold">{data.assetToken}</span></p>
                <p className="text-sm font-mono">{data.assetStatus}</p>
            </div>
        </div>
    );
}

export function ShowingMyAssets({ setOpenModalDividend, setSelectedAssetId }: { setOpenModalDividend: (d: boolean) => void, setSelectedAssetId: (d: string) => void, }) {
    const [assetUser, setAssetuser] = React.useState<UserAssetInterface[] | null>(null);
    const [loadAssets, setLoadAssets] = React.useState(true);

    React.useEffect(() => {
        const callData = async () => {
            const retreivedData = await backendService.getUserAssets();

            const processedData = await Promise.all(
                retreivedData.map(async (d) => {
                    const id = d[0];
                    const token = d[1];
                    const assets = await backendService.getAsset(id);

                    const statusText = assets && Object.keys(assets?.status)[0] || "Unknown";

                    const temp: UserAssetInterface = {
                        assetId: id,
                        assetName: assets?.name ?? "no name",
                        assetToken: token,
                        assetStatus: statusText,
                        isOwner: d[2]
                    };

                    return temp;
                })
            );

            setAssetuser(processedData);
            setLoadAssets(false);
        };

        callData();
    }, []);

    if (loadAssets) return (
        <div className="w-full p-5 flex justify-center items-center">
            <LoaderSpinner />
        </div>
    )


    return (
        <div className="w-full p-5 flex justify-center items-center">
            <div className="w-full flex flex-wrap gap-2 overflow-y-auto">
                {assetUser?.map((d, idx) =>
                    <SimpleAssetCard key={idx} data={d} setOpenModalDividend={setOpenModalDividend} setSelectedAssetId={setSelectedAssetId} />
                )}
            </div>
        </div>
    )
}

function SimpleProposalCard({ data }: { data: Proposal }) {
    const timestamp = Number(data.createdAt) / 1_000_000;

    const readableDate = new Date(timestamp).toLocaleString("id-ID", {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const handleConfirmBuy = async () => {
        const respData = await backendService.confirmBuyProposal(data.id);
        if ("ok" in respData) {
            alert("Proposal has been created successfully! ID: " + respData.ok);
        } else {
            alert("Failed to create asset: " + respData.err);
        }
    }

    return (
        <div className="border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-full p-3">
            <div className="w-full flex items-center">
                <div className="w-full flex flex-col items-start">
                    <p>{data.assetId}</p>
                    <div className="flex items-center text-sm font-mono space-x-2">
                        <p>{data.amount}</p>
                        <span>{"|"}</span>
                        <p>{data.totalPrice}</p>
                        <span>{"|"}</span>
                        <p>{readableDate}</p>
                    </div>
                </div>
                {!data.isApproved && <p className="text-sm font-mono font-bold text-blue-600">{data.currentApprovalPercentage}% Approven</p>}
                {data.isApproved && <button onClick={handleConfirmBuy} className="text-sm p-2 bg-blue-500 rounded-xl h-fit text-white cursor-pointer">Pay</button>}
            </div>
        </div>
    )
}

enum Options {
    proposal = "proposal",
    transaction = "transaction",
}

function ProposalComp({ onChange }: { onChange: (d: Options) => void }) {
    const [proposalData, setProposalData] = React.useState<Proposal[] | null>(null);
    React.useEffect(() => {
        const callData = async () => {
            const retreivedPropsalData = await backendService.getMyProposals();
            setProposalData(retreivedPropsalData);
        }

        callData();

    }, []);

    return (
        <div className="w-full space-y-5">
            <div className="flex justify-between items-center" >
                <p className="text-lg font-semibold font-mono uppercase">My Proposal</p>
                <button onClick={() => onChange(Options.transaction)} className="text-sm cursor-pointer underline">view transactions</button>
            </div>
            <div className="">
                {proposalData?.length === 0 && <p className="text-center">No Proposal Created</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {proposalData?.map((propsal, idx) => (
                        <SimpleProposalCard key={idx} data={propsal} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function TransactionComp({ data, onChange }: { data: ChartDataInterface[], onChange: (d: Options) => void }) {
    return (
        <div className="w-[95%]">
            <div className="flex justify-between items-center" >
                <p className="text-lg font-semibold font-mono uppercase">Transaction History</p>
                <button onClick={() => onChange(Options.proposal)} className="text-sm cursor-pointer underline">your proposal</button>
            </div>

            <ChartTransactionsAssets data={data} />
        </div>
    )
}

export function ShowingMyTransactions() {
    const [loadAssets, setLoadAssets] = React.useState(true);
    const [selectedOption, setSelectedOption] = React.useState<Options>(Options.transaction);
    const [transactionData, setTransactionData] = React.useState<ChartDataInterface[] | null>(null);

    React.useEffect(() => {
        const callData = async () => {
            const retreivedData = await backendService.getUserTransactions();

            if (retreivedData.length === 0) {
                setLoadAssets(false);
                return;
            }

            const processedData = await Promise.all(
                retreivedData.map(async (data) => {
                    const timestamp = Number(data.timestamp) / 1_000_000;

                    const readableDate = new Date(timestamp).toLocaleString("id-ID", {
                        year: "numeric",
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    });


                    const temp: ChartDataInterface = {
                        name: readableDate,
                        nums: Number(data.totalPrice)
                    };

                    return temp;
                })
            );

            setTransactionData(processedData)
            setLoadAssets(false);
        };

        callData();
    }, []);

    if (loadAssets) return (
        <div className="w-full p-5 flex justify-center items-center">
            <LoaderSpinner />
        </div>
    )

    return (
        <div className="w-full p-5 flex justify-center items-center">
            <div className="w-full flex flex-col gap-2 overflow-y-auto">
                {selectedOption === Options.proposal && <ProposalComp onChange={setSelectedOption} />}
                {selectedOption === Options.transaction && <TransactionComp data={transactionData ?? []} onChange={setSelectedOption} />}
            </div>
        </div>
    )
}

function AssetVoteCard({ data }: { data: VotableProposal }) {
    const timestamp = Number(data.createdAt) / 1_000_000;

    const readableDate = new Date(timestamp).toLocaleString("id-ID", {
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const handleApprove = async () => {
        const respData = await backendService.approveBuyProposal(data.id);
        if ("ok" in respData) {
            alert("Proposal has been created successfully! ID: " + respData.ok);
        } else {
            alert("Failed to create asset: " + respData.err);
        }
    }

    return (
        <div className="border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-full p-3">
            <div className="w-full flex items-center">
                <div className="w-full flex flex-col items-start space-y-2">
                    <p className="text-sm">Asset id has been proposed from <span className="font-bold">{data.buyer.toString().slice(0, 5) + "..."}</span></p>
                    <div className="flex items-center text-sm font-mono space-x-2">
                        <p>{data.amount}</p>
                        <span>{"|"}</span>
                        <p>{data.totalPrice}$ with <span className="font-bold">{data.pricePerToken}$/token</span></p>
                        <span>{"|"}</span>
                        <p>{readableDate}</p>
                    </div>
                </div>
                <button onClick={handleApprove} className="text-sm p-2 bg-blue-500 rounded-xl h-fit text-white cursor-pointer">Approve</button>
            </div>
        </div>
    )
}

export function AssetVote() {
    const [votableproposalData, setVotableProposalData] = React.useState<VotableProposal[] | null>(null);
    React.useEffect(() => {
        const callData = async () => {
            const retreiveVotabledPropsalData = await backendService.getVotableProposals();
            setVotableProposalData(retreiveVotabledPropsalData);
            console.log(retreiveVotabledPropsalData);
        }

        callData();

    }, [])

    return (
        <div className="w-full p-5 flex justify-center items-center">
            <div className="w-full flex flex-col gap-2 overflow-y-auto">
                {votableproposalData?.map((votableproposal, idx) => (
                    <AssetVoteCard key={idx} data={votableproposal} />
                ))}
                {votableproposalData?.length === 0 && <p className="text-center">No Vote Needed</p>}

            </div>
        </div>
    )
}