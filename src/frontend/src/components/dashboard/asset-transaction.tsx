import React from "react";
import { LoaderComponent } from "../LoaderComponent";
import { Transaction } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { getTransactionText } from "../../helper/rwa-helper";
import { CustomizableBarChart } from "../chart-component";

function transformDataForBarChart(data: Transaction[]) {
    const grouped = data.reduce((acc, item) => {
        const type = getTransactionText(item.transactionType);

        if (!acc[type]) {
            acc[type] = {
                name: type,
                totalAmount: 0,
                count: 0
            };
        }

        acc[type].totalAmount += Number(item.totalprice || 0);
        acc[type].count += 1;

        return acc;
    }, {} as Record<string, { name: string; totalAmount: number; count: number }>);

    return Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount);
}

export default function AssetTransaction({ assetid }: { assetid: string }) {
    const [loadedData, setLoadedData] = React.useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        async function init() {
            setIsLoading(true);
            try {
                if (!assetid) return;
                const fetchedData = await backendService.getAllTransactionsByAssetId(assetid);
                console.log(fetchedData);
                setLoadedData(fetchedData);
            } catch (error) {
                setLoadedData([]);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, [assetid]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Selected Asset Transaction</h2>
            </div>
            <div>
                {isLoading ? (
                    <LoaderComponent />
                ) : loadedData.length > 0 ? (
                    <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Support Information for Asset ID: {assetid}</h3>
                        <CustomizableBarChart
                            data={transformDataForBarChart(loadedData)}
                            xAxisKey="name"
                            bars={[
                                { key: 'totalAmount', color: '#8884d8', name: 'Total Amount' },
                                { key: 'count', color: '#82ca9d', name: 'Transaction Count' }
                            ]}
                        />
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No asset selected. Please select an asset to view support information.</p>
                )}
            </div>
        </div>
    );
}