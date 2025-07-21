import { Link } from "react-router-dom";
import { Asset } from "../types/rwa";

export function reduceSentences(sent: string, num: number = 200) {
    return sent.length <= num ? sent : sent.slice(0, num) + "...";
}

export function AssetCard({
    id,
    name,
    description,
    totalValue,
    status,
    createdAt,
    location,
    totalSupply
}: Asset) {
    const statusText = Object.keys(status)[0] || "Unknown";
    const readableDate = new Date(Number(createdAt / 1_000_000n)).toLocaleDateString();
    const locationText = location.join(", ") || "Not specified";

    return (
        <div className="p-5 shadow-sm hover:shadow-2xl rounded-md space-y-3 border-[1px] border-gray-200 md:flex md:flex-col md:h-[26vw] md:justify-between">
            {/* header card */}
            <div className="w-full flex items-center justify-between">
                <p className="capitalize text-[3vw] md:text-[1.5vw]">{name}</p>
                <p className="text-[2vw] md:text-[1vw] font-bold p-1.5 text-blue-600 rounded-lg">{id}</p>
            </div>

            {/* content card */}
            <div className="space-y-2 md:text-[1.2vw] md:h-[85%]">
                <p className="text-gray-600 md:h-[35%] ">
                    {reduceSentences(description)}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                    <p className="font-semibold">Value</p>
                    <p>{totalValue}</p>
                    <p className="font-semibold">Created In</p>
                    <p>{readableDate}</p>
                    <p className="font-semibold">Status</p>
                    <p>{statusText}</p>
                    <p className="font-semibold">Supply</p>
                    <p>{totalSupply}</p>
                    <p className="font-semibold">Locations</p>
                    <p>{locationText}</p>
                </div>
            </div>

            {/* footer card */}
            <button className="font-semibold text-white p-2 w-full bg-blue-500 rounded-lg hover:bg-blue-800 cursor-pointer">
                <Link to={`/marketplace/:${id}`}>Intrested To Buy</Link>
            </button>
        </div>
    );
}
