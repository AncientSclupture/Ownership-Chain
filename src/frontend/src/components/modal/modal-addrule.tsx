import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";

export default function ModalAddAssetRule() {
    const { setModalKind, addrulemanagement } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [name, setName] = React.useState("");
    const [content, setContent] = React.useState("");

    const handleCancel = () => {
        setName("");
        setContent("");
        setModalKind(null);
    };

    const handleAddRule = () => {
        if (name.trim() === "" || content.trim() === "") {
            setNotificationData({
                title: "error",
                description: "Please fill in all fields.",
                position: "bottom-right"
            });
            return;
        }

        addrulemanagement.setter({ name, content });

        setNotificationData({
            title: "Success",
            description: "Rule added successfully!",
            position: "bottom-right"
        });
        handleCancel();
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
                Add New Rules Info
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Rule Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of the rule"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Rule Content
                    </label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content and description of the rule"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6 w-full">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddRule}
                        className="px-4 py-2 rounded-xl background-dark transition text-white disabled:opacity-50"
                    >
                        Add rule
                    </button>
                </div>
            </div>
        </div>
    );
}
