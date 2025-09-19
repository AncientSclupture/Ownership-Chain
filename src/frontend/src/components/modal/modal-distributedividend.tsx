import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";

export default function DistributeDividendModal() {
    const { setModalKind, assetidmanagement } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const [price, setPrice] = React.useState<bigint>(BigInt(0));

    function handleclose() {
        setModalKind(null);
        setPrice(BigInt(0));
        assetidmanagement.reseter();
    }

    async function proposeHandler() {
        setIsLoading(true);
        try {
            const res = await backendService.distributeDividend(assetidmanagement.data, price);
            setNotificationData({ title: "success to distribute dividend", description: `${res}`, position: "bottom-right" })
        } catch (error) {
            setNotificationData({ title: "failed to distribute dividend", description: "", position: "bottom-right" })
        } finally {
            setIsLoading(false);
            setModalKind(null);
            assetidmanagement.reseter();
        }
    }

    if (isLoading) return <LoaderComponent text="processing the transaction" fullScreen={true} />

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl">Distribute dividend to all asset holder</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label htmlFor="amount">Price (icp)</label>
                        <input
                            type="text" name="amount" id="amount"
                            className="p-2 border border-gray-300 rounded-md"
                            value={price.toString()}
                            onChange={(e) => setPrice(BigInt(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={() => proposeHandler()}
                        className="p-2 background-dark text-white rounded-md w-full"
                    >
                        Proceed Transaction
                    </button>
                </div>
            </div>
        </div>
    )
}