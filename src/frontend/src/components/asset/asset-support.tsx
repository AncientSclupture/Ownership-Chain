import React from "react";
import { useParams } from "react-router-dom";
import { EmptyResult } from "../empty-result";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";
import { TreasuryLedger } from "../../types/rwa";

export default function AssetSupport() {
    const [loadedData, setLoadedData] = React.useState<TreasuryLedger[]>([]);
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                if (!id) return;
                const res = await backendService.getAllTreasuryByAssetId(id);
                console.log("Treasury data:", res);
                setLoadedData(res);
            } catch (error) {
                console.error("Failed to fetch treasury data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (isLoading) return <LoaderComponent text="Please wait..." />;

    if (!loadedData || loadedData.length === 0) {
        return <EmptyResult />;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-700 font-semibold mb-4">
                    Treasury Support for Asset <span className="text-[#00081a]">{id}</span>
                </h1>

                {/* Treasury List */}
                <div className="space-y-4">
                    {loadedData.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200 hover:bg-gray-100 transition"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-800">
                                    {item.description}
                                </h2>
                                <span className="text-sm text-gray-500">
                                    #{item.tsid}
                                </span>
                            </div>

                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <p>
                                    <strong>From:</strong>{" "}
                                    <span className="font-mono text-gray-700">
                                        {item.from.toText() || "-"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Asset ID:</strong> {item.assetid}
                                </p>
                                <p>
                                    <strong>Amount:</strong>{" "}
                                    <span className="text-green-600 font-semibold">
                                        {item.priceamount}
                                    </span>
                                </p>
                                <p>
                                    <strong>Type:</strong>{" "}
                                    {item.treasuryledgerType
                                        ? Object.keys(item.treasuryledgerType)[0]
                                        : "-"}
                                </p>
                                <p>
                                    <strong>Created At:</strong>{" "}
                                    {new Date(
                                        Number(item.createdAt) / 1_000_000
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rules Section */}
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-700 font-semibold mb-3">Support Treasury Details</h1>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>All support transactions are transparently logged and verifiable on-chain.</li>
                    <li>Each support entry is uniquely tied to a treasury ledger ID for traceability.</li>
                    <li>Supported assets can serve as collateral in cases of cashback donepayment, asset fraud, or liquidation events (including bankruptcy or standard liquidation).</li>
                    <li>Tokenized amounts and transaction records are immutable once confirmed.</li>
                </ul>
            </div>

            {/* Documentation Section */}
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-700 font-semibold mb-3">Security</h1>
                <p className="text-gray-600 text-sm">
                    All treasury and support-related activities are securely recorded on-chain and
                    can be audited at any time. Supported assets may act as a legal or financial guarantee
                    during refund or liquidation processes. For official audit reports or legal verification
                    of support contributions, please contact the project administrator or compliance department.
                </p>
            </div>

        </div>
    );
}
