import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { backendService } from "../../services/backendService";
import { useParams } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";

export default function ModalProposedBuyToken() {
    const { id } = useParams<{ id: string }>();

    const { setModalKind } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [token, setToken] = React.useState("");
    const [pricePerToken, setPricePerToken] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<[boolean, string]>([false, ""]);

    const handleCancel = () => {
        setModalKind(null);
    };

    const handlePropose = async () => {
        if (!token || !pricePerToken || !amount || !id) {
            setResult([false, "All fields are required!"]);
            return;
        }

        setLoading(true);
        try {
            const res = await backendService.proposeAssetPurchase(
                id,
                BigInt(token),
                BigInt(pricePerToken),
                BigInt(amount)
            );
            setResult(res);
            setModalKind(null);
            setNotificationData({
                title: "Success",
                description: result[1],
                position: "bottom-right",
                duration: 800,
            })
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({
                title: "Failed",
                description: msg,
                position: "bottom-right",
                duration: 800,
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
                Propose Asset Purchase
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Token</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Enter token amount"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Price per Token
                    </label>
                    <input
                        type="text"
                        value={pricePerToken}
                        onChange={(e) => setPricePerToken(e.target.value)}
                        placeholder="Enter price per token"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Done Payment</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
            </div>

            {result && (
                <p className="text-sm text-center text-gray-600 bg-gray-50 p-2 rounded-md">
                    {result}
                </p>
            )}

            <div className="flex justify-center gap-4 mt-6 w-full">
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-800 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePropose}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl background-dark transition text-white disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Propose"}
                </button>
            </div>
        </div>
    );
}
