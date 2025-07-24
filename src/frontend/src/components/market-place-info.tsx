import React from "react";
import { Asset } from "../types/rwa";
import { reduceSentences } from "./asset-card";
import { AssetsbyTypeChart as BoxChart, ChartDataInterface, ChartDevidentsAssets, ChartTransactionsAssets, DividentChartDataInterface } from "./assets-type-chart";
import { backendService } from "../services/backendService";
import { Principal } from '@dfinity/principal';

export function MarketPlaceAssetInformation(
    { asset, setOpenModal }:
        { asset: Asset | null, setOpenModal: (d: boolean) => void; }
) {

    const typeText = asset && Object.keys(asset.assetType)[0];

    const statusText = asset && Object.keys(asset.status)[0] || "Unknown";
    const readableDate = asset && new Date(Number(asset?.createdAt / 1_000_000n)).toLocaleDateString();
    const locationText = asset?.location.join(", ") || "Not specified";

    return (
        <div className="md:w-[40%] space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold uppercase">{asset?.name}</h1>
                <p className="text-sm text-gray-500 break-all">{asset?.id}</p>
            </div>

            {/* Description */}
            <div className="border p-4 rounded-md bg-gray-50 min-h-[120px]">
                <p className="text-gray-700 text-sm leading-relaxed">
                    {reduceSentences(asset?.description ?? "No Description Provided", 268)}
                </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 md:w-[50%]">

                <p className="text-gray-500">Total Value</p>
                <p className="font-medium">{asset?.totalValue.toString()}</p>

                <p className="text-gray-500">Total Supply</p>
                <p className="font-medium">{asset?.totalSupply.toString()}</p>

                <p className="text-gray-500">Origin</p>
                <p className="font-medium break-all">[{locationText}]</p>

                <p className="text-gray-500">Status</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold w-fit">
                    {statusText}
                </span>

                <p className="text-gray-500">Asset Type</p>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold w-fit">
                    {typeText}
                </span>


                <p className="text-gray-500">Created At</p>
                <p className="font-medium">{readableDate}</p>

                <div className="col-span-2">
                    <p className="text-gray-500">Document Hash</p>
                    <p className={`break-all font-mono text-xs ${asset?.documents[0] ? "" : "text-red-500"}`}>{asset?.documents[0] ?? "None"}</p>
                </div>
            </div>

            <div>
                <button
                    className="p-2 bg-blue-500 rounded-md text-white cursor-pointer"
                    onClick={() => setOpenModal(true)}
                >
                    Propose Token Asset
                </button>
            </div>
        </div>
    );
}

enum Options {
    ownership = "ownership",
    devident = "devident",
    transactions = "transactions"
}

function ComponentsChartSharing(
    { data, title }:
        { data: ChartDataInterface[], title: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
            </div>
            {/* chart */}
            <BoxChart data={data} />
        </div>
    )
}

function ComponentsChartTransaction(
    { data, title }:
        { data: ChartDataInterface[], title: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
            </div>
            {/* chart */}
            <ChartTransactionsAssets data={data} />
        </div>
    )
}

function ComponentsChartDevident(
    { data, title }:
        { data: DividentChartDataInterface[], title: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
            </div>
            {/* chart */}
            <ChartDevidentsAssets data={data} />
        </div>
    )
}

export function MarketPlaceAssetStatistics({ asset_id }: { asset_id: string }) {
    const [option, setOption] = React.useState<Options>(Options.ownership);
    const [ownershipData, setOwnerShipData] = React.useState<ChartDataInterface[] | null>(null);
    const [assetTransactionsData, setAssetTransactionsData] = React.useState<ChartDataInterface[] | null>(null);
    const [assetDevidenData, setAssetDevidenData] = React.useState<DividentChartDataInterface[] | null>(null);

    React.useEffect(() => {
        const callData = async () => {
            const ownershipRetreivedData = await backendService.getAssetOwners(asset_id);
            const transactionRetreivedData = await backendService.getAssetTransactions(asset_id);


            const processedOwnerShipData = await Promise.all(
                ownershipRetreivedData.map(async (ownerData, idx) => {

                    const owner: Principal = ownerData[0];
                    const ownerProfile = await backendService.getUserProfilebyId(owner);

                    const temp: ChartDataInterface = {
                        name: ownerProfile?.alias[0] ?? `no-name ${idx + 1}`,
                        nums: ownerData[1].percentage
                    };
                    return temp;
                })
            );

            const processedAssetTransactionData = transactionRetreivedData
                .filter((transaction) => {
                    const transactionType = Object.keys(transaction.transactionType)[0];
                    return transactionType === "Buy" || transactionType === "Sell";
                })
                .map((transaction) => {
                    const timestamp = Number(transaction.timestamp) / 1_000_000;

                    const readableDate = new Date(timestamp).toLocaleString("id-EN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    });

                    const temp: ChartDataInterface = {
                        name: `${readableDate}`,
                        nums: Number(transaction.amount),
                    };

                    return temp;
                });

            const groupedMap = new Map<string, { name: string; nums: number }[]>();


            transactionRetreivedData
                .filter((transaction) => {
                    const transactionType = Object.keys(transaction.transactionType)[0];
                    return transactionType === "Dividend";
                })
                .forEach((transaction) => {
                    const timestamp = Number(transaction.timestamp) / 1_000_000;
                    const readableDate = new Date(timestamp).toLocaleString("id-EN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    });

                    const item = { name: transaction.to.toString().slice(0, 5) + "...", nums: Number(transaction.totalPrice) };

                    if (!groupedMap.has(readableDate)) {
                        groupedMap.set(readableDate, [item]);
                    } else {
                        groupedMap.get(readableDate)?.push(item);
                    }
                });

            const processedDevidentData: DividentChartDataInterface[] = Array.from(groupedMap.entries()).map(
                ([name, grup]) => ({
                    name,
                    grup
                })
            );

            setOwnerShipData(processedOwnerShipData);
            setAssetTransactionsData(processedAssetTransactionData);
            setAssetDevidenData(processedDevidentData);
            console.log(processedDevidentData);
        };

        callData();
    }, [])

    return (
        <div className="md:w-[60%] h-screen space-y-5 md:space-y-10">
            {/* selector options */}
            <div className="w-full flex justify-end items-center">
                <div className="flex space-x-2 p-2 rounded-md overflow-x-auto">
                    {Object.values(Options).map((type) => (
                        <div
                            className={`text-sm lowercase p-2 rounded-md cursor-pointer ${option === type ? 'font-bold bg-blue-800 text-white' : ''}`}
                            onClick={() => setOption(type)}
                            key={type}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>
            {option === Options.ownership && <ComponentsChartSharing
                title={"OwnerShip Sharing %"}
                data={ownershipData ?? []}
            />}
            {option === Options.transactions && <ComponentsChartTransaction
                title={"Token Assets Transctions (Sell | Buy)"}
                data={assetTransactionsData ?? []}
            />}
            {option === Options.devident && <ComponentsChartDevident
                title={"Devident History (USD)"}
                data={assetDevidenData ?? []}
            />}
        </div>
    )
}