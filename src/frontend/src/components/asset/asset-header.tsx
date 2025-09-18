import { Bot, ShoppingCart } from "lucide-react";
import { Asset } from "../../types/rwa";
import { getAssetStatusText } from "../../helper/rwa-helper";
import React from "react";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";

export function AssetNavigation({ assetname }: { assetname: string }) {
    return (
        <div className="space-x-2 text-gray-500">
            <span>Home</span>
            <span>{">"}</span>
            <span>Assets</span>
            <span>{">"}</span>
            <span>{assetname}</span>
        </div>
    );
}

export function AssetGallery() {
    return (
        <div className="w-full">
            <div className="w-full space-y-2">
                <div>
                    <div className="w-full h-[50vw] md:h-[30vw] rounded-md bg-gray-300" />
                </div>
                <div className="flex w-full items-center justify-between space-x-3">
                    <div className="w-full h-[10vw] md:h-[5vw] rounded-md bg-gray-400 flex justify-center items-center text-white">View 1</div>
                    <div className="w-full h-[10vw] md:h-[5vw] rounded-md bg-gray-400 flex justify-center items-center text-white">View 2</div>
                    <div className="w-full h-[10vw] md:h-[5vw] rounded-md bg-gray-400 flex justify-center items-center text-white">View 3</div>
                    <div className="w-full h-[10vw] md:h-[5vw] rounded-md bg-gray-400 flex justify-center items-center text-white">View 4</div>
                </div>
            </div>
        </div>
    );
}

export function AssetMainInfo(
    { assetData }: { assetData: Asset }
) {
    const { setModalKind } = React.useContext(ModalContext);
    return (
        <div className="w-full rounded-md border border-gray-300 p-5">
            <h1 className="text-4xl pb-2">{assetData.name}</h1>
            <p className="text-gray-600 pb-8">Asset ID: #{assetData.id}</p>
            <div className="flex space-x-3 items-center">
                <p className="p-2 bg-gray-300 rounded-md">{getAssetStatusText(assetData.assetStatus)}</p>
                <p className="text-xl">{assetData.pricePerToken} ICP</p>
            </div>
            <div className="w-full flex items-center space-x-4 pt-8">
                <div className="bg-gray-100 rounded-md flex flex-col items-center justify-center p-5 w-full">
                    <h1 className="text-2xl">{assetData.tokenLeft}</h1>
                    <p>Token Left</p>
                </div>
                <div className="bg-gray-100 rounded-md flex flex-col items-center justify-center p-5 w-full">
                    <h1 className="text-2xl">{assetData.totalToken}</h1>
                    <p>Total Token</p>
                </div>
            </div>
            <div className="py-5 space-y-3">
                <button
                    onClick={() => setModalKind(ModalKindEnum.proposedbuytoken)}
                    className="flex items-center space-x-3 text-white background-dark p-2 w-full justify-center"
                >
                    <ShoppingCart />
                    <p>Proposed to Buy</p>
                </button>
                <button className="flex items-center space-x-3 p-2 w-full justify-center border border-gray-300">
                    <Bot color="gray" />
                    <p className="text-gray-700">AI Examiner</p>
                </button>
            </div>
        </div>
    );
}