import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";

export default function AddRuleDetailsModal() {
    const { setModalKind, adddruledetailmanagement } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [rule, setRule] = React.useState("")

    function handleclose() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Add Document Asset</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="rule">Rule</label>
                        <textarea
                            name="rule" id="rule"
                            className="p-2 w-full rounded-md border border-gray-300 resize-none h-[30vw] md:h-[10vw]"
                            value={rule}
                            onChange={(e) => setRule(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            adddruledetailmanagement.setter(rule);
                            setRule("");
                            setNotificationData({
                                title: "rule added",
                                description: "",
                                position: "bottom-right"
                            })
                            setModalKind(null);
                            return;
                        }}
                        className="p-2 background-dark text-white rounded-md w-full"
                    >
                        Add Rule Details
                    </button>
                </div>
            </div>
        </div>
    )
}