import { BadgeCent, Coins, HandCoins, UserStar } from "lucide-react";
import { Asset, Ownership } from "../../types/rwa";
import { CustomizableLineChart } from "../chart-component";

interface dataHolderInterface {
    id: string;
    price: number;
}

export default function TokenAsset(
    { assetData, ownershipData }: { assetData: Asset, ownershipData: Array<Ownership> }
) {
    let holderData: dataHolderInterface[] | undefined = ownershipData.map((o, idx) => ({
        id: idx.toString(),
        price: Number(o.purchasePrice),
    }));

    // NOTE IF holderData.length === 1 the holder is only the creator so the price pucrhased is invalid
    if (holderData.length === 1) {
        holderData = undefined;
    }

    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Token Overview</h1>
                {assetData.minTokenPurchased === assetData.maxTokenPurchased &&
                    <div className="my-2">
                        If you eager to buy this token asset ownership, you can only puchased <span className="font-semibold">{assetData.minTokenPurchased} tokens </span>
                        with <span className="font-semibold">{assetData.pricePerToken}</span> ICP for each token.
                    </div>
                }
                {assetData.minTokenPurchased !== assetData.maxTokenPurchased &&
                    <div className="my-2">
                        If you eager to buy this token asset ownership, you need at least <span className="font-semibold">{assetData.minTokenPurchased} tokens </span>
                        and with maximum token you can puchased is <span className="font-semibold">{assetData.maxTokenPurchased} tokens </span>
                        with <span className="font-semibold">{assetData.pricePerToken}</span> ICP for each token.
                    </div>
                }
                <div className="my-2">
                    May be the price per token is <span className="font-semibold">{assetData.pricePerToken}</span> ICP, but you can propose to buy with the price as you want.
                    And your proposal will be voting with current ownership holder until at least 51%.
                    Untill that you have to finished your payment and clain your ownership token in this asset.
                </div>

                <div className="my-2">
                    If there is a dividend sharing of the asset, the token asset holder will get the sharing based on their ownership token.
                </div>
            </div>
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Token Info</h1>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Coins size={20} />
                        <p className="text-gray-800">
                            This asset has <span className="font-bold">{assetData.totalToken}</span> tokens in total
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <HandCoins size={20} />
                        <p className="text-gray-800">
                            This asset provided <span className="font-bold">{assetData.providedToken}</span> token in total
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserStar size={20} />
                        <p className="text-gray-800">
                            Because of that, the creator or the owner asset have <span className="font-bold">{assetData.totalToken - assetData.providedToken}</span> tokens
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BadgeCent size={20} />
                        <p className="text-gray-800">
                            Token left for this asset is <span className="font-bold">{assetData.tokenLeft}</span> tokens
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BadgeCent size={20} />
                        <p className="text-gray-800">
                            Pending Token for this asset is <span className="font-bold">{assetData.pendingToken}</span> tokens, this means that another bidder proposed {assetData.pendingToken} is <span className="font-semibold">under approval</span> of current ownwership holder
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Current Token Holder Price</h1>
                <div className="w-full">
                    <CustomizableLineChart data={holderData} />
                </div>
            </div>
        </div>
    )
}