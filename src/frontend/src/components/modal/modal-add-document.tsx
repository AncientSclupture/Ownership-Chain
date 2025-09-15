import { X } from "lucide-react";
import { ModalContext } from "../../context/ModalContext";
import React from "react";
import { signDocument } from "../../helper/rwa-helper";
import { NotificationContext } from "../../context/NotificationContext";
import { DocumentHash } from "../../types/rwa";

export default function AddDocumentModal() {
    const { setModalKind, adddocumentmanagement } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext)

    const [pdfFile, setPdfFile] = React.useState<File | null>(null);
    const [pemFile, setPemFile] = React.useState<File | null>(null);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handlePemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPemFile(e.target.files[0]);
        }
    };

    function handleclose() {
        setModalKind(null);
        setPdfFile(null);
        setPemFile(null);
        setName("");
        setDescription("")
    }

    const handleSubmit = async () => {
        if (!pdfFile || !pemFile || name === "" || description === "") {
            setNotificationData({
                title: "fill in all the input",
                description: "",
                position: "bottom-right"
            })
            handleclose()
            return;
        }
        const signedDoc = await signDocument(pdfFile, pemFile)
        const createdData: DocumentHash = { name: name, description: description, hash: signedDoc }
        adddocumentmanagement.setter(createdData);
        setNotificationData({
            title: "document signed and add",
            description: "",
            position: "bottom-right"
        })
        handleclose()
    };

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

                    {/* Upload PDF */}
                    <div className="space-y-2">
                        <label className="block font-medium">Upload PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                        {pdfFile && (
                            <p className="text-sm text-gray-600">Selected: {pdfFile.name}</p>
                        )}
                    </div>

                    {/* Upload PEM */}
                    <div className="space-y-2">
                        <label className="block font-medium">Insert your private key</label>
                        <input
                            type="file"
                            accept=".pem"
                            onChange={handlePemChange}
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                        {pemFile && (
                            <p className="text-sm text-gray-600">Selected: {pemFile.name}</p>
                        )}
                    </div>


                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document name"
                            className="block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter document description"
                            rows={3}
                            className="block w-full border border-gray-300 rounded-md p-2 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full background-dark text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Add & Sign
                        </button>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center">
                        ⚠️ Make sure you sign with your <span className="font-semibold">own private key</span>
                        and not someone else's.
                    </p>
                </div>
            </div>
        </div>
    );
}
