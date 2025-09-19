import { ReduceCharacters } from "../../helper/rwa-helper";
import { Ownership } from "../../types/rwa";
import { CustomizableBarChart } from "../chart-component";

interface dataHolderPercentage {
    id: string;
    holder: number;
}

export default function DevidendHolderAsset(
    { ownershipData }: { ownershipData: Array<Ownership> }
) {
    let holderData: dataHolderPercentage[] | undefined = ownershipData.map((o) => ({
        id: ReduceCharacters(o.owner.toText(), 5),
        holder: Number(o.percentage * 100),
    }));

    if (holderData.length === 0) {
        holderData = undefined;
    }

    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Dividend Holder Statistic in (%)</h1>
                <div className="w-full">
                    <CustomizableBarChart data={holderData} />
                </div>
            </div>
        </div>
    )
}