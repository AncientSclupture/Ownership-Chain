import { Bot, CloudUpload, Copy, FileDigit, FileInput, FileScan } from "lucide-react"
import React from "react";
import { Asset } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";

function DocumentAsset(
    { name, description, hash }: { name: string, description: string, hash: string }
) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setNotificationData } = React.useContext(NotificationContext);


    return (
        <div className="p-2 bg-gray-50 rounded-md space-y-2">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <FileDigit size={20} />
                <p className="text-sm">{name}</p>
            </div>
            <div className={`text-sm ${isOpen ? 'block' : 'hidden'} space-y-5`}>
                <p>{description}</p>
                <div className="flex items-center space-x-2">
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(hash);
                            setNotificationData({
                                title: `hash doc ${name} was copied`,
                                description: "",
                                position: "bottom-right"
                            })
                        }}
                    >
                        <Copy size={20} />
                    </button>
                    <code className="font-mono">{hash}</code>
                </div>
            </div>
        </div>
    )
}

export default function AssetReportFlow() {
    const [isLoading, setIsloading] = React.useState(false);

    const [showEvidence, setShowEvidence] = React.useState(false);
    const [showVerification, setShowVerification] = React.useState(false);
    const [showExaminer, setShowExaminer] = React.useState(false);
    const [showSubmission, setShowSubmission] = React.useState(false);

    const [retrievedAsset, setRetreivedAsset] = React.useState<Asset | null>(null);
    const [assetId, setAssetId] = React.useState("");
    const { setNotificationData } = React.useContext(NotificationContext);

    const [file, setFile] = React.useState<File | null>(null);
    const [description, setDescription] = React.useState("");
    const [name, setName] = React.useState("");

    async function handleSetAsset() {
        setIsloading(true);
        setShowVerification(false)
        setShowExaminer(false)
        setShowSubmission(false)
        try {
            const res = await backendService.getAssetById(assetId);
            if (!res) {
                setNotificationData({
                    title: "asset not found",
                    description: "",
                    position: "bottom-right"
                })
                throw Error("No asset Found")
            }
            setRetreivedAsset(res);
            setNotificationData({
                title: "asset was found",
                description: "",
                position: "bottom-right"
            })
            setShowEvidence(true);
        } catch (error) {
            setNotificationData({
                title: "something wrong happened",
                description: "",
                position: "bottom-right"
            })
        } finally {
            setIsloading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-8">

            {/* find asset */}
            <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                <div className="flex space-x-3 items-center">
                    <FileScan size={24} />
                    <h1 className="text-xl">Find Asset Target</h1>
                </div>
                <div className="p-4 space-y-3">
                    <div className="md:flex md:items-center md:space-x-5 md:space-y-0 space-y-2">
                        <div className="flex flex-col w-full">
                            <label htmlFor="assetid" className="text-gra">asset id</label>
                            <div className="flex items-center rounded-md border border-[#00081a] w-full">
                                <input
                                    type="text" name="assetid" id="assetid"
                                    className="w-full p-2"
                                    value={assetId}
                                    onChange={(e) => setAssetId(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    disabled={isLoading}
                                    onClick={() => handleSetAsset()}
                                    className="p-2 text-white background-dark rounded-r-md cursor-pointer"
                                >
                                    set
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label htmlFor="assetname" className="text-gra">asset name</label>
                            <div className="flex items-center rounded-md border border-[#00081a] w-full">
                                <input
                                    type="text" name="assetname" id="assetname"
                                    className="w-full p-2"
                                    value={retrievedAsset?.name}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    {!retrievedAsset &&
                        <div className="p-2 bg-gray-50 rounded-md space-y-2">
                            <p>Document not available, because the asset is not set yet!</p>
                        </div>
                    }
                    {retrievedAsset?.documentHash.map((d, idx) =>
                        <DocumentAsset key={idx}
                            name={d.name}
                            description={d.description}
                            hash={d.hash}
                        />
                    )}
                </div>
            </div >
            {/* find asset */}

            {/* report evidence */}
            {showEvidence &&
                <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                    <div className="flex space-x-3 items-center">
                        <FileScan size={24} />
                        <h1 className="text-xl">Add your Evidence</h1>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Upload area */}
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-500"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => document.getElementById("fileInput")?.click()}
                        >
                            <CloudUpload className="text-gray-500 mb-2" size={32} />
                            <p className="text-gray-600">
                                Drag and drop a file or <span className="text-blue-600">click to browse</span>
                            </p>
                            <p className="text-sm text-gray-400">
                                Supported: PDF (Max 10MB)
                            </p>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
                        </div>

                        {/* Preview file */}
                        {file && (
                            <div className="space-y-2">
                                <h2 className="text-sm font-semibold">Uploaded File:</h2>
                                <p className="text-sm text-gray-700">
                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                </p>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Describe the evidence and how it relates to plagiarism..."
                            />
                        </div>
                    </div>
                </div>
            }
            {/* report evidence */}

            {/* evidence verification */}
            {showVerification &&
                <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                    <div className="flex space-x-3 items-center">
                        <h1 className="text-xl">Document Hash Verification</h1>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 md:w-full">
                            {/* Input original hash */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Original Document Hash
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter original hash..."
                                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Input asset hash */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset Document Hash
                                </label>
                                <input
                                    type="text"
                                    placeholder="Asset document hash..."
                                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled
                                    value="0x7f9c8e3b2a1d..." // contoh static value
                                />
                            </div>
                        </div>
                        {/* Button verify */}
                        <div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2"
                            >
                                <span>Verify Hashes</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
            {/* evidence verification */}

            {/* ai examiner */}
            {showExaminer &&
                <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                    <div className="flex space-x-3 items-center">
                        <h1 className="text-xl font-semibold">AI Examiner Analysis</h1>
                    </div>

                    <div className="p-4 space-y-3">
                        {/* Run AI Analysis button */}
                        <button
                            type="button"
                            className="w-full py-3 bg-[#0d1321] text-white font-medium rounded-md flex items-center justify-center space-x-2 hover:bg-[#1a2235]"
                        >
                            <Bot />
                            <span>Run AI Analysis</span>
                        </button>

                        {/* Info box */}
                        <div className="p-4 bg-gray-50 rounded-md flex items-center space-x-2 text-gray-600 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <p className="font-medium">Analysis will take 2-3 minutes</p>
                                <p className="text-gray-500">
                                    AI will examine metadata, visual similarity, and blockchain history
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* ai examiner */}

            {/* report submission */}
            {showSubmission &&
                <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                    <div className="flex space-x-3 items-center">
                        <FileScan size={24} />
                        <h1 className="text-xl">Report Submission</h1>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex flex-col w-full">
                            <label htmlFor="reportname" className="text-gra">Reporting Name</label>
                            <div className="flex items-center rounded-md border border-[#00081a] w-full">
                                <input
                                    type="text" name="reportname" id="reportname"
                                    className="w-full p-2"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="p-3 rounded-md w-full text-white background-dark flex items-center space-x-2 justify-center">
                            <FileInput />
                            <p>Generate Report</p>
                        </button>
                    </div>
                </div>
            }
            {/* report submission */}

        </div>
    );
}