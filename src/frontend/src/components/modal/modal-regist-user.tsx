import { X } from "lucide-react";
import { ModalContext } from "../../context/ModalContext";
import React from "react";

export function RegistUserModal() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    };
    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Asset</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}