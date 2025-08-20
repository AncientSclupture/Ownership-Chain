import { Upload, X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";

export function AddDocumentsModal() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }
    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Asset Documents</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-5">
                        <label
                            htmlFor="file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-600">Klik untuk upload PDF</span>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        console.log("File dipilih:", file.name);
                                    }
                                }}
                            />
                        </label>
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor="docname">Document Name</label>
                            <input type="text" name="docname" id="docname" placeholder="ex. comp dividend" className="p-2 rounded-md border border-gray-200" />
                            <label htmlFor="docdesc">Document Description</label>
                            <input type="text" name="docdesc" id="docdesc" placeholder="ex. comp dividend in last 5 years" className="p-2 rounded-md border border-gray-200" />
                        </div>
                        <button
                            className="text-white text-sm background-dark p-2 rounded-md cursor-pointer"
                        >
                            Sign and Add Documents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EditPersonalInfoModal() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }
    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full h-[90%] md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Personal Info</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}