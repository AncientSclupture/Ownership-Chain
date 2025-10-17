import React from "react";
import { Upload, FileCheck2, ShieldCheck, Search } from "lucide-react";
import { Asset } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import AssetCard from "./complaint-asset-card";
import { EmptyResult } from "../empty-result";
import { signDocument, hashFile } from "../../helper/rwa-helper"
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { AssetOwnershipParsingDataContext } from "../../context/AssetOwnershipParsingContext";

export default function ComplaintAssetForm() {
    const [assetFound, setAssetFound] = React.useState<boolean>(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [loadedAsset, setLoadedAsset] = React.useState<Asset | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { setNotificationData } = React.useContext(NotificationContext);
    const { setModalKind } = React.useContext(ModalContext);
    const [credTarget, setCredTarget] = React.useState<[string, string]>(["", ""]);
    const [documentFile, setDocumentFile] = React.useState<File | null>(null);
    const [privateKeyFile, setPrivateKeyFile] = React.useState<File | null>(null);
    const { setassetid } = React.useContext(AssetOwnershipParsingDataContext);

    const handleVerify = async () => {
        if (!documentFile || !privateKeyFile) {
            setNotificationData({
                title: "Failed Hash and Sign Document Data",
                description: "Please select both document and private key files.",
                position: "bottom-right",
            });
            return;
        }

        try {
            const documentHash = await hashFile(documentFile);
            const signature = await signDocument(documentFile, privateKeyFile);

            console.log("Document Hash:", documentHash);
            console.log("Signature:", signature);

            if (credTarget[0] === documentHash && credTarget[1] === signature) {
                setNotificationData({
                    title: "Success Hash and Sign Document Data and Anomaly Detected",
                    description: "valid hash and signature",
                    position: "bottom-right",
                });
                setassetid(searchTerm);
                setModalKind(ModalKindEnum.createassetcomplaint);
            } else {
                setNotificationData({
                    title: "Success Hash and Sign Document Data and No Anomaly Detected",
                    description: "invalid hash and signature",
                    position: "bottom-right",
                });
            }


        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({
                title: "Error Hash and Signing Data",
                description: msg,
                position: "bottom-right",
            });
        }
    };

    async function fetchAsset() {
        try {
            if (!searchTerm.trim()) {
                setNotificationData({
                    title: "Missing Input",
                    description: "Please enter an asset name, ID, or hash.",
                    position: "bottom-right",
                });
                return;
            }
            setIsLoading(true);
            const res = await backendService.getAsset(searchTerm);
            if (res.length === 0) throw new Error("Asset Not Found");
            setLoadedAsset(res[0]);
            setAssetFound(true);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({
                title: "Error Fetching Data",
                description: msg,
                position: "bottom-right",
            });
            setLoadedAsset(null);
            setAssetFound(false);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        setAssetFound(!!loadedAsset);
    }, [loadedAsset]);

    return (
        <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 space-y-8">
            <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <Search className="text-indigo-600" size={22} />
                    Find Asset
                </h1>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter asset name, ID, or hash..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        onClick={fetchAsset}
                        className="background-dark text-white font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition duration-200 flex items-center gap-2"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </div>

                <div className="mt-6">
                    {isLoading ? (
                        <LoaderComponent />
                    ) : loadedAsset ? (
                        <AssetCard asset={loadedAsset} setCredTarget={setCredTarget} credTarget={credTarget} />
                    ) : (
                        !isLoading && <EmptyResult description="No asset found. Try searching another keyword." />
                    )}
                </div>
            </div>

            <div className={`${assetFound ? "" : "hidden"}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-600" size={22} />
                            Document Hash Verification
                        </h1>
                        <p className="text-gray-500 mt-1 max-w-xl">
                            Upload a valid document to verify ownership of this asset. Make sure it matches
                            your <span className="font-medium text-gray-700">private key</span> and
                            <span className="font-medium text-gray-700">signature key</span>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full md:space-x-10">
                    {/* Document File Upload */}
                    <div className="p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3 mb-4 w-full">
                        <Upload className="text-indigo-500" size={36} />
                        <div className="text-center">
                            <p className="text-gray-700 font-medium">Click or drag PDF file to upload</p>
                            <p className="text-sm text-gray-500">Only .pdf files are accepted</p>
                        </div>
                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute opacity-0 md:w-[42vw] md:h-[12vw] w-[78vw] h-[23vw] cursor-pointer"
                            onChange={(e) => {
                                if (e.target.files?.[0]) setDocumentFile(e.target.files[0]);
                            }}
                        />
                    </div>

                    {/* Private Key File Upload */}
                    <div className="p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3 mb-6 w-full">
                        <Upload className="text-indigo-500" size={36} />
                        <div className="text-center">
                            <p className="text-gray-700 font-medium">Click or drag PEM file to upload</p>
                            <p className="text-sm text-gray-500">Only .pem files are accepted</p>
                        </div>
                        <input
                            type="file"
                            accept=".pem"
                            className="absolute opacity-0 md:w-[42vw] md:h-[12vw] w-[78vw] h-[23vw] cursor-pointer"
                            onChange={(e) => {
                                if (e.target.files?.[0]) setPrivateKeyFile(e.target.files[0]);
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={credTarget[0] === "" || credTarget[1] === ""}
                        className={`flex items-center gap-2 background-dark rounded-md text-white font-medium px-5 py-2.5 duration-200`}
                        onClick={handleVerify}
                    >
                        <FileCheck2 size={18} />
                        {credTarget[0] !== "" && credTarget[1] !== "" ? "Verify Document" : "Disabled"}
                    </button>
                </div>
            </div>
        </div>
    );
}
