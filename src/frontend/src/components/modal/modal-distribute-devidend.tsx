import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";

export default function ModalDistributeDevidendAsset() {
    const { setModalKind } = React.useContext(ModalContext);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [amount, setAmount] = React.useState<number>(0);
    const { assetid } = React.useContext(AssetOwnershipParsingDataContext);


    const handleClose = () => {
        setAmount(0);
        setModalKind(null);
    };

    const handleSendSupport = async () => {
        try {
            setIsLoading(true);
            if (!assetid) throw new Error("asset id is not setted up well");
            const res = await backendService.shareDevidend(assetid, amount);
            if (res[0] === false) throw new Error(res[1]);
            setNotificationData({ title: "Success Distribute Asset Devidend", description: res[1], position: "bottom-right" })
            handleClose();
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "Error Distribute Asset Devidend", description: msg, position: "bottom-right" })
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <LoaderComponent fullScreen={true} text="Processing Transaction" />

    return (
        <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
                Distribute devidend asset
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Asset Id</label>
                    <input
                        type="text"
                        disabled={true}
                        value={assetid ?? "not-settedup"}
                        placeholder="Enter asset ID"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Amount (ICP Coin)
                    </label>
                    <input
                        type="number"
                        value={amount.toString()}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Content and description of the rule"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6 w-full">
                    <button
                        disabled={isLoading}
                        onClick={handleClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-800 disabled:opacity-50"
                    >
                        {isLoading ? "loading" : "Cancel"}
                    </button>
                    <button
                        onClick={handleSendSupport}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl background-dark transition text-white disabled:opacity-50"
                    >
                        {isLoading ? "loading" : "Distrubute"}
                    </button>
                </div>
            </div>
        </div>
    );
}
