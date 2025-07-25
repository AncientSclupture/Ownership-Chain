import React from "react";
import { backendService } from "../services/backendService";

export function BuyTokenModal({
    openModal,
    setOpenModal,
    asset_id,
}: {
    openModal: boolean;
    setOpenModal: (d: boolean) => void;
    asset_id: string;
}) {
    const [tokenValue, setTokenValue] = React.useState(0);
    const [tokenPrice, setTokenPrice] = React.useState(0);

    const totalPrice = tokenValue * tokenPrice;

    const handleCancle = () => {
        setTokenPrice(0);
        setTokenValue(0);
        setOpenModal(false);
    }

    const handlePurchase = async () => {
        const proposeResp = await backendService.proposeToBuy(asset_id, tokenValue, tokenValue);

        if ("ok" in proposeResp) {
            alert("Proposal has been created successfully! ID: " + proposeResp.ok);
            setOpenModal(false);
        } else {
            alert("Failed to create asset: " + proposeResp.err);
        }
        setTokenPrice(0);
        setTokenValue(0);
    }

    return (
        <div
            className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${openModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="flex items-center justify-center h-full w-full">
                <div className="bg-white w-[90vw] max-w-xl p-8 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Confirm Your Purchase</h2>
                        <button
                            onClick={handleCancle}
                            className="text-sm text-red-500 font-semibold hover:underline cursor-pointer"
                        >
                            Exit
                        </button>
                    </div>

                    {/* Agreement Section */}
                    <div className="space-y-4 text-gray-700">
                        <p>
                            You are about to buy tokens for the asset:{" "}
                            <span className="font-semibold text-black">{asset_id}</span>
                        </p>
                        <p>Enter the amount of tokens you want to purchase:</p>
                        <input
                            type="text"
                            min={1}
                            value={tokenValue}
                            onChange={(e) => {
                                const value = BigInt(e.target.value)
                                setTokenValue(Number(value));
                            }}
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p>Enter Your Proposed Token Price (in USD):</p>
                        <input
                            type="text"
                            min={1}
                            value={tokenPrice}
                            onChange={(e) => {
                                const value = BigInt(e.target.value)
                                setTokenPrice(Number(value));
                            }}
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p>
                            The total amount you'll pay is:{" "}
                            <span className="text-sm font-mono font-bold">${totalPrice}</span>
                        </p>

                        <p className="text-sm text-gray-500">
                            By proceeding, you agree to purchase tokens for this asset as stated above.
                        </p>
                    </div>

                    {/* Action */}
                    <div className="mt-6">
                        <button
                            onClick={handlePurchase}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                            Proposed to Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
