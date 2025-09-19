import { formatMotokoTimeSpecific } from "../../helper/rwa-helper";
import { Transaction } from "../../types/rwa";
import { CustomizableLineChart } from "../chart-component";

interface dataDividendInterface {
    time: string;
    price: number;
}

export default function TotalDevidendAsset(
    { dividendData }: { dividendData: Array<Transaction> }
) {
    let dividendMapData: dataDividendInterface[] | undefined = dividendData
        .sort((a, b) => Number(a.timestamp - b.timestamp))
        .map((o) => ({
            time: formatMotokoTimeSpecific(o.timestamp),
            price: Number(o.totalPrice),
        }));


    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Asset Dividend Statistics</h1>
                <div className="w-full">
                    <CustomizableLineChart data={dividendMapData} />
                </div>
            </div>
        </div>
    )
}
