import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { ComplaintType } from "../../types/rwa";
import { text2ComplaintType } from "../../helper/rwa-helper";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";

export default function ModalCreateAssetComplaint() {
    const { setModalKind } = React.useContext(ModalContext);
    const [complaintType, setComplaintType] = React.useState<ComplaintType>(text2ComplaintType("Fraud"))
    const [reason, setReason] = React.useState<string>("");
    const { assetid, setassetid } = React.useContext(AssetOwnershipParsingDataContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [isloading, setIsloading] = React.useState(false);

    function reseter() {
        setReason("");
        setComplaintType(text2ComplaintType("Fraud"));
        setassetid(null)
        setModalKind(null);
    }

    const handleSendFileComplaint = async () => {
        try {
            setIsloading(true);
            if (!assetid) throw new Error("Invalid asset id, please try again")
            if (reason === "") throw new Error("Invalid reason, please try again")
            const complaintRes = await backendService.fileComplaint(assetid, reason, complaintType);
            if (complaintRes[0] === false) throw new Error(complaintRes[1]);
            setNotificationData({ title: "Error Buying Ownership", description: complaintRes[1], position: "bottom-right" })
            reseter()

        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "Error Sending Asset Complaint", description: msg, position: "bottom-right" })
        } finally {
            setIsloading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
                Hash Detected!!
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Reason For Complaining</label>
                    <textarea
                        placeholder="insert your reason here"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Complaint Type
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="Fraud">Fraud</option>
                        <option value="Plagiarism">Plagiarism</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Asset ID
                    </label>
                    <input
                        type="text"
                        disabled={true}
                        value={assetid ?? "not-setted"}
                        placeholder="Content and description of the rule"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6 w-full">
                    <button
                        disabled={isloading}
                        onClick={() => reseter()}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-800 disabled:opacity-50"
                    >
                        {isloading ? "loading.." : "Cancel"}
                    </button>
                    <button
                        onClick={handleSendFileComplaint}
                        disabled={isloading}
                        className="px-4 py-2 rounded-xl background-dark transition text-white disabled:opacity-50"
                    >
                        {isloading ? "loading.." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
