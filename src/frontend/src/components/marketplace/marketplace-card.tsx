import React from "react";
import { useAuth } from "../../context/AuthContext"
import { NotificationContext } from "../../context/NotificationContext";
import { AssetStatus } from "../../types/rwa";
import { getAssetStatusText, ReduceCharacters } from "../../helper/rwa-helper";

export default function MarketPlaceAssetCard(
    {name, description, tokenLeft, totalToken, price, status, id}: 
    {name: string, description: string, tokenLeft: bigint, totalToken: bigint, price: bigint, status: AssetStatus, id: string}
) {
    const { isAuthenticated } = useAuth();
    const { setNotificationData } = React.useContext(NotificationContext)

    function takelookhandler() {
        if (!isAuthenticated) {
            setNotificationData({
                title: "Not Allowed",
                description: "you are not allowed to view this asset detail, you need to login first with conect my self button !",
                position: "center-fit"
            })
        };
    };

    return (
        <div className="w-full rounded-md border border-gray-300" onClick={() => navigator.clipboard.writeText(id)}>
            <div className="w-full bg-gray-500 h-[32vw] md:h-[16vw] rounded-t-md" />
            <div className="p-4 space-y-3">
                <h1 className="text-xl font-thin capitalize">{name}</h1>
                <p className="md:text-sm">{ReduceCharacters(description, 40)}</p>
                <div className="text-sm flex justify-between items-center">
                    <p>Tokens: <span>{tokenLeft}</span>/<span>{totalToken}</span></p>
                    <p className="p-1 bg-gray-200 rounded-md">{getAssetStatusText(status)}</p>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <div>{price} ICP</div>
                    <button
                        onClick={() => takelookhandler()}
                        className="background-dark text-white p-2 rounded-md cursor-pointer"
                    >
                        Take a Look
                    </button>
                </div>
            </div>
        </div>
    )
}