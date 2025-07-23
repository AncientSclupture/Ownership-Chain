import React from "react";
import { Asset } from "../types/rwa";
import { reduceSentences } from "./asset-card";
import { AssetsbyTypeChart as BoxChart, ChartDataInterface, ChartDevidentsAssets, ChartTransactionsAssets } from "./assets-type-chart";

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
                    Buy This Token Asset
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
    { data, title, totalToken, date }:
        { data: ChartDataInterface[], title: string, totalToken: number, date: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
                <p className="break-all font-mono text-xs text-center">
                    since <span className="font-bold">{date}</span>, total tokens: <span className="font-bold">{totalToken}</span>
                </p>
            </div>
            {/* chart */}
            <BoxChart data={data} />
        </div>
    )
}

function ComponentsChartTransaction(
    { data, title, totalToken, date }:
        { data: ChartDataInterface[], title: string, totalToken: number, date: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
                <p className="break-all font-mono text-xs text-center">
                    since <span className="font-bold">{date}</span>, total tokens: <span className="font-bold">{totalToken}</span>
                </p>
            </div>
            {/* chart */}
            <ChartTransactionsAssets data={data} />
        </div>
    )
}

function ComponentsChartDevident(
    { data, title, totalToken, date }:
        { data: ChartDataInterface[], title: string, totalToken: number, date: string }
) {
    return (
        <div>
            {/* title */}
            <div>
                <p className="text-center font-bold text-2xl">{title}</p>
                <p className="break-all font-mono text-xs text-center">
                    since <span className="font-bold">{date}</span>, total tokens: <span className="font-bold">{totalToken}</span>
                </p>
            </div>
            {/* chart */}
            <ChartDevidentsAssets data={data} />
        </div>
    )
}


export function MarketPlaceAssetStatistics() {
    const [option, setOption] = React.useState<Options>(Options.ownership);

    const data = [
        { name: 'anon 1', nums: 10 },
        { name: 'anon 2', nums: 40 },
        { name: 'anon 3', nums: 30 },
        { name: 'anon 4', nums: 20 },
        { name: 'anon 5', nums: 40 },
        { name: 'anon 6', nums: 60 },
        { name: 'anon 7', nums: 10 },
        { name: 'anon 8', nums: 90 },
    ];
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
                title={"OwnerShip Sharing"}
                data={data}
                date="OwnerShips"
                totalToken={120}
            />}
            {option === Options.transactions && <ComponentsChartTransaction
                title={"Assets Transctions"}
                data={data}
                date="12/12/2025"
                totalToken={120}
            />}
            {option === Options.devident && <ComponentsChartDevident
                title={"Devident History"}
                data={data}
                date="12/12/2025"
                totalToken={120} />}
        </div>
    )
}