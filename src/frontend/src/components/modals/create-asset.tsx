import { Upload, X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { DocumentHashDataType } from "../../types/rwa";

export function AddDocumentsModal() {
    const { setModalKind, managementAddDocument } = React.useContext(ModalContext);
    const [file, setFile] = React.useState<File | null>(null);
    const [docName, setDocName] = React.useState("");
    const [docDesc, setDocDesc] = React.useState("");

    function closeButtonHandler() {
        setModalKind(null);
        setFile(null);
        setDocName("");
        setDocDesc("");
    }

    function handleAddDocument() {
        const newDoc: DocumentHashDataType = {
            hash: file?.name || 'abcd',
            name: docName,
            description: docDesc,
        };

        managementAddDocument.setter(newDoc);

        closeButtonHandler();
    }


    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Asset Documents</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
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
                                    const f = e.target.files?.[0] || null;
                                    setFile(f);
                                    console.log("Selected file:", f);
                                }}
                            />
                        </label>
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor="docname">Document Name</label>
                            <input
                                type="text"
                                name="docname"
                                id="docname"
                                placeholder="ex. comp dividend"
                                className="p-2 rounded-md border border-gray-200"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                            />
                            <label htmlFor="docdesc">Document Description</label>
                            <input
                                type="text"
                                name="docdesc"
                                id="docdesc"
                                placeholder="ex. comp dividend in last 5 years"
                                className="p-2 rounded-md border border-gray-200"
                                value={docDesc}
                                onChange={(e) => setDocDesc(e.target.value)}
                            />
                        </div>
                        <button
                            className="text-white text-sm background-dark p-2 rounded-md cursor-pointer"
                            onClick={handleAddDocument}
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

export function AddRuleDetails() {
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
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="ruledetails"
                            id="ruledetails"
                            placeholder="some rule and details about the token asset"
                            className="p-2 border border-gray-300 rounded-md w-full"
                        />
                        <button className="text-sm text-white background-dark p-2 rounded-md w-full cursor-pointer">Set Rule Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}