import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";
import { useParams } from "react-router-dom";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";

export default function ProposedBuyModal() {
    const { assetid } = useParams<{ assetid: string }>();
    const { setModalKind } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [isLoading, setIsLoading] = React.useState(false);
    const [tokenAmount, setTokenAmount] = React.useState<bigint>(BigInt(0));
    const [tokenPrice, setTokenPrice] = React.useState<bigint>(BigInt(0));

    function handleclose() {
        setModalKind(null);
        setTokenAmount(BigInt(0));
        setTokenPrice(BigInt(0));
    }

    async function proposeHandler() {
        setIsLoading(true);
        if (!assetid) {
            return;
        }
        try {
            console.log(assetid);
            const res = await backendService.proposedToken(assetid, tokenAmount, tokenPrice);
            console.log(res);
            setNotificationData({ title: "success to proposed token", description: `${res}`, position: "bottom-right" })
        } catch (error) {
            setNotificationData({ title: "failed to proposed token", description: `${error}`, position: "bottom-right" })
            console.log(error);
        } finally {
            setIsLoading(false);
            setModalKind(null);
        }
    }

    if (isLoading) return <LoaderComponent text="processing the transaction" fullScreen={true} />

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl">Proposed to buy this token</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label htmlFor="amount">Token Amount</label>
                        <input
                            type="text" name="amount" id="amount"
                            className="p-2 border border-gray-300 rounded-md"
                            value={tokenAmount.toString()}
                            onChange={(e) => setTokenAmount(BigInt(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label htmlFor="price">Proposed Price per Token</label>
                        <input
                            type="text" name="price" id="price"
                            className="p-2 border border-gray-300 rounded-md"
                            value={tokenPrice.toString()}
                            onChange={(e) => setTokenPrice(BigInt(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={() => proposeHandler()}
                        className="p-2 background-dark text-white rounded-md w-full"
                    >
                        Proposed
                    </button>
                </div>
            </div>
        </div>
    )
}