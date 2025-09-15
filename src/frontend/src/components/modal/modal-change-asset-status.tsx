import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { text2AssetStatus } from "../../helper/rwa-helper";
import { LoaderComponent } from "../LoaderComponent";

export default function ChangeAssetStatusModal() {
    const [isLoading, setIsloading] = React.useState(false);
    const { setModalKind, assetidmanagement } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [assetid, setAssetId] = React.useState(assetidmanagement.data);
    const [status, setStatus] = React.useState("Open");

    function handleclose() {
        setModalKind(null);
        assetidmanagement.reseter()
    }

    async function handleChangeAssetStatus() {
        try {
            setIsloading(true)
            const res = await backendService.changeAssetStatus(assetid, text2AssetStatus(status));
            setNotificationData({
                title: "success to chnage asset status",
                description: `${res}`,
                position: "bottom-right"
            })
            setModalKind(null);
        } catch (error) {
            setNotificationData({
                title: "failed to chnage asset status",
                description: `${error}`,
                position: "bottom-right"
            })
        } finally {
            setIsloading(false);
        }
    }

    if (isLoading) {
        return <LoaderComponent fullScreen={true} />
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Change Assets Status Modal</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="assetid">Asset Id</label>
                        <input
                            type="text"
                            name="assetid" id="assetid"
                            className="p-2 w-full rounded-md border border-gray-300"
                            value={assetid}
                            onChange={(e) => setAssetId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="assetid">Asset Type</label>

                        <select
                            name="assetid" id="assetid"
                            className="p-2 w-full rounded-md border border-gray-300"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>
                    <button
                        onClick={() => handleChangeAssetStatus()}
                        className="p-2 background-dark text-white rounded-md w-full"
                    >
                        Set Rule Status
                    </button>
                </div>
            </div>
        </div>
    )
}