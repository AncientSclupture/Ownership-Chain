import React, { useState } from "react";
import { AssetDocument } from "../../types/rwa";
import { hashFile, signDocument } from "../../helper/rwa-helper";

export default function DocumentAsset({
    isDone,
    setIsDone,
    documentHash,
    setDocumentHash,
}: {
    isDone: boolean;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
    documentHash: AssetDocument[];
    setDocumentHash: React.Dispatch<React.SetStateAction<AssetDocument[]>>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pemFile, setPemFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAddDocument = async () => {
        if (!name || !pdfFile || !pemFile) {
            alert("Please fill all fields and select files");
            return;
        }

        setLoading(true);
        try {
            const signature = await signDocument(pdfFile, pemFile);
            const hash = await hashFile(pdfFile);

            const newDoc: AssetDocument = {
                name,
                signature,
                hash,
            };

            setDocumentHash([...documentHash, newDoc]);

            // Reset form
            setName("");
            setPdfFile(null);
            setPemFile(null);
        } catch (err) {
            console.error(err);
            alert("Failed to process document");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = (index: number) => {
        const updated = [...documentHash];
        updated.splice(index, 1);
        setDocumentHash(updated);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
                <span className={`${isDone ? "text-green-700" : "text-gray-800"} font-medium`}>
                    Asset Document Legalities
                </span>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-fit py-5 px-6" : "max-h-0 px-6"
                    }`}
            >
                {/* Name */}
                <input
                    type="text"
                    placeholder="Document Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                />

                {/* File Inputs */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="file"
                        accept=".pem"
                        onChange={(e) => setPemFile(e.target.files?.[0] || null)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 w-[15vw] md:w-[10vw]"
                    />
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 w-[15vw] md:w-[10vw]"
                    />
                </div>

                {/* Add Document Button */}
                <button
                    onClick={handleAddDocument}
                    disabled={loading}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                    {loading ? "Processing..." : "Add Document"}
                </button>

                {/* List of Added Documents */}
                {documentHash.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">Added Documents:</h4>
                        <ul className="space-y-2">
                            {documentHash.map((doc, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border p-3 rounded-md bg-gray-50"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{doc.name}</span>
                                        <span className="text-xs text-gray-500">
                                            Hash: {doc.hash.slice(0, 20)}...
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Signature: {doc.signature.slice(0, 20)}...
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteDocument(index)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Toggle Done */}
                <div className="mt-4">
                    <button
                        onClick={() => {
                            if (documentHash.length > 0) {setIsDone(!isDone);}
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${isDone
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-800 text-white hover:brightness-110"
                            }`}
                    >
                        {isDone ? "Mark as Not Done" : "Mark as Done"}
                    </button>
                </div>
            </div>
        </div>
    );
}
