import React from "react";
import { backendService } from "../services/backendService";
import { ChartDataInterface, ChartTransactionsAssets } from "./assets-type-chart";


interface UserAssetInterface {
    assetName: string;
    assetId: string;
    assetToken: bigint;
    assetStatus: string;
}

// load spiner
export function LoaderSpinner() {
    return (
        <div className="flex justify-center items-center h-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}


// simple assets card
function SimpleAssetCard({ data }: { data: UserAssetInterface }) {

    return (
        <div className="border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-[48%] p-3">
            <div className="text-start">
                <p className="font-bold flex items-center justify-center space-x-2"><span>{data.assetName}</span></p>
                <p className="text-sm font-mono">{data.assetId}</p>
                <p className="text-sm">Tokenowned: <span className="font-bold">{data.assetToken}</span></p>
                <p className="text-sm font-mono">{data.assetStatus}</p>
            </div>
        </div>
    );
}


export function ShowingMyAssets() {
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
                        assetStatus: statusText
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
                    <SimpleAssetCard key={idx} data={d} />
                )}
            </div>
        </div>
    )
}

function SimpleProposalCard() {
    return (
        <div className="border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-full p-3">
            <div className="w-full flex items-center">
                <div className="w-full flex flex-col items-start">
                    <p>Asset id</p>
                    <div className="flex items-center text-sm font-mono space-x-2">
                        <p>Token</p>
                        <span>{"|"}</span>
                        <p>Total Price</p>
                        <span>{"|"}</span>
                        <p>Date Proposed</p>
                    </div>
                </div>
                <button className="text-sm p-2 bg-blue-500 rounded-xl h-fit text-white cursor-pointer">Pay</button>
            </div>
        </div>
    )
}

enum Options {
    proposal = "proposal",
    transaction = "transaction",
}


function ProposalComp({ onChange }: { onChange: (d: Options) => void }) {
    return (
        <div className="w-full space-y-5">
            <div className="flex justify-between items-center" >
                <p className="text-lg font-semibold font-mono uppercase">My Proposal</p>
                <button onClick={() => onChange(Options.transaction)} className="text-sm cursor-pointer underline">view transactions</button>
            </div>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <SimpleProposalCard />
                    <SimpleProposalCard />
                    <SimpleProposalCard />
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

function AssetVoteCard() {
    return (
        <div className="border border-gray-300 rounded-xl hover:shadow-lg flex items-center space-x-5 w-full p-3">
            <div className="w-full flex items-center">
                <div className="w-full flex flex-col items-start space-y-2">
                    <p className="text-sm">Asset id has been proposed from <span className="font-bold">someone</span></p>
                    <div className="flex items-center text-sm font-mono space-x-2">
                        <p>Token</p>
                        <span>{"|"}</span>
                        <p>Total Price</p>
                        <span>{"|"}</span>
                        <p>Date Proposed</p>
                    </div>
                </div>
                <button className="text-sm p-2 bg-blue-500 rounded-xl h-fit text-white cursor-pointer">Approve</button>
            </div>
        </div>
    )
}

export function AssetVote() {
    return (
        <div className="w-full p-5 flex justify-center items-center">
            <div className="w-full flex flex-col gap-2 overflow-y-auto">
                <AssetVoteCard />
                <AssetVoteCard />
                <AssetVoteCard />
                <AssetVoteCard />
                <AssetVoteCard />
            </div>
        </div>
    )
}