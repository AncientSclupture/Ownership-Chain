import React from "react"

export function BuyTokenModal(
    { openModal, setOpenModal, asset_id }:
        { openModal: boolean, setOpenModal: (d: boolean) => void, asset_id: string }
) {
    const [tokenValue, setTokenValue] = React.useState(0);
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
                            onClick={() => setOpenModal(false)}
                            className="text-sm text-red-500 font-semibold hover:underline"
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
                            type="number"
                            min={1}
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={tokenValue}
                            // onChange={(e) => setTokenValue(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">
                            By proceeding, you agree to purchase tokens for this asset as stated above.
                        </p>
                    </div>

                    {/* Action */}
                    <div className="mt-6">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                        >
                            Proceed to Wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}