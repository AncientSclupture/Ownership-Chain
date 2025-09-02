import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";

export function ReportPlagiarism() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div>Hallo This is Straigh Report Plagiarism</div>
                </div>
            </div>
        </div>
    )
}

export function ReportUser() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div>Hallo This is Straigh Report User</div>
                </div>
            </div>
        </div>
    )
}

export function DocHash() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div>Hallo This Document Hash Clarity</div>
                </div>
            </div>
        </div>
    )
}

export function UserFootPrint() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div>User FootPrint</div>
                </div>
            </div>
        </div>
    )
}