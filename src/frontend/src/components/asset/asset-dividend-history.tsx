import React from "react"
import { Transaction } from "../../types/rwa"
import { backendService } from "../../services/backendService";
import { useParams } from "react-router-dom";
import { LoaderComponent } from "../LoaderComponent";
import { formatMotokoTimeSpecific } from "../../helper/rwa-helper";
import { CustomizableLineChart } from "../chart-component";


export function transformDataForLineChart(loadedData: any[]) {
    if (!Array.isArray(loadedData)) return [];

    const sorted = [...loadedData].sort(
        (a, b) => Number(a.createdAt) - Number(b.createdAt)
    );

    const grouped = sorted.reduce((acc, item) => {
        const formattedTime = formatMotokoTimeSpecific(BigInt(item.createdAt));

        if (!acc[formattedTime]) {
            acc[formattedTime] = {
                name: formattedTime,
                totalAmount: 0,
                count: 0,
            };
        }

        acc[formattedTime].totalAmount += Number(item.totalprice || 0);
        acc[formattedTime].count += 1;

        return acc;
    }, {} as Record<string, { name: string; totalAmount: number; count: number }>);

    return Object.values(grouped);
}


export function AssetDividend() {
    const [loadedData, setLoadedData] = React.useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { id } = useParams<{ id: string }>();

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                if (!id) return;
                const res = await backendService.getAssetDividend(id);
                console.log("Dividend data:", res);
                setLoadedData(res);
            } catch (error) {
                console.error("Failed to fetch dividend data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (isLoading) return <LoaderComponent text="Please wait..." />;

    return (
        <div className="space-y-6">
            <div className="p-6 md:px-10 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-4">
                    Asset Dividend
                </h1>
                <p className="mb-6 leading-relaxed">
                    This section provides a detailed breakdown of all current asset holders and
                    their respective ownership shares. Dividends are distributed proportionally
                    based on each holder’s token allocation. Review each participant’s share and
                    verify distribution metrics before executing a payout or report.
                </p>

                <div className="p-4 rounded-lg">
                    {loadedData.length !== 0 ? (
                        <CustomizableLineChart
                            data={transformDataForLineChart(loadedData)}
                            xAxisKey="name"
                            lines={[
                                { key: 'totalAmount', color: '#8884d8', name: 'Total Amount' },
                                { key: 'name', color: '#82ca9d', name: 'Date' },
                                { key: 'count', color: '#82ca9d', name: 'Dividend Counts' }
                            ]}
                        />
                    ) : (<p className="text-sm text-gray-500">There is no Dividend in this asset</p>)}
                </div>
            </div>
        </div>
    )
}