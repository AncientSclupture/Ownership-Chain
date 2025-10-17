import { FileText, Hash, Signature } from "lucide-react";
import { Asset } from "../../types/rwa";
import { formatMotokoTime, ReduceCharacters } from "../../helper/rwa-helper";

export default function AssetCard({
    asset,
    credTarget,
    setCredTarget,
}: {
    asset: Asset;
    credTarget: [string, string];
    setCredTarget: React.Dispatch<React.SetStateAction<[string, string]>>
}) {
    return (
        <div className="mt-6 p-5 border border-gray-200 bg-gray-50 rounded-xl shadow-sm space-y-5">
            <div className="flex items-center gap-3 mb-3">
                <FileText className="text-indigo-600" size={22} />
                <h2 className="text-lg font-semibold text-gray-800">{asset.name}</h2>
            </div>

            <p className="text-gray-600">{asset.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="font-medium text-gray-700">Token:</span>
                    <p className="text-gray-600">{asset.totalToken}</p>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Created At:</span>
                    <p className="text-gray-600">{formatMotokoTime(asset.createdAt)}</p>
                </div>
            </div>

            {/* daftar document hash */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
                <h3 className="text-gray-700 font-semibold">Document Hash List</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {asset.documentHash.map((doc, idx) => (
                        <div
                            onClick={() => setCredTarget([doc.hash, doc.signature])}
                            key={idx}
                            className={`${credTarget[0] === doc.hash && credTarget[1] === doc.signature ? "bg-green-400 border-gray-200" : "bg-white border-gray-200"} p-4 border rounded-lg shadow-sm hover:shadow transition duration-200`}
                        >
                            <p className="text-sm text-gray-700 font-medium mb-1">
                                {idx + 1}. {doc.name}
                            </p>

                            <div className="space-y-1 text-sm">
                                <p className="text-gray-600 flex items-center gap-1">
                                    <Signature size={14} className="text-indigo-500" /> {ReduceCharacters(doc.signature, 20)}
                                </p>
                                <p className="text-gray-600 flex items-center gap-1 break-all">
                                    <Hash size={14} className="text-indigo-500" /> {ReduceCharacters(doc.hash, 20)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}