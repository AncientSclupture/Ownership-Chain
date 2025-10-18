import React from "react";
import { MainLayout } from "../../components/main-layout"
import TokenAsset from "../../components/create-asset/accordion-token";
import LocationAsset from "../../components/create-asset/accordion-location";
import DocumentAsset from "../../components/create-asset/accordion-document";
import RuleAsset from "../../components/create-asset/accordion-rule";
import TermAndConditionAsset from "../../components/create-asset/accordion-tnc";
import GeneralAssetInfo from "../../components/create-asset/accordion-general-info";
import { AssetDocument, AssetRule, CreateAssetInputApi, LocationType } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { text2AssetStatus, text2AssetType } from "../../helper/rwa-helper";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "../../components/LoaderComponent";

export function CreateAssetScreen() {
    const { setNotificationData } = React.useContext(NotificationContext)

    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const [readygen, setReadygen] = React.useState(false);
    const [readytoken, setReadytoken] = React.useState(false);
    const [readyloc, setReadyloc] = React.useState(false);
    const [readydoc, setReadydoc] = React.useState(false);
    const [readyrule, setReadyrule] = React.useState(false);
    const [readytnc, setReadytnc] = React.useState(false);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [assetType, setAssetType] = React.useState("");

    const [totalToken, setTotalToken] = React.useState<bigint>(BigInt(0));
    const [tokenLeft, setTokenLeft] = React.useState<bigint>(BigInt(0));
    const [minTokenPurchased, setMinTokenPurchased] = React.useState<bigint>(BigInt(0));
    const [maxTokenPurchased, setMaxTokenPurchased] = React.useState<bigint>(BigInt(0));
    const [pricePerToken, setPricePerToken] = React.useState<number>(0.0);

    const [locationInfo, setLocationInfo] = React.useState<[LocationType] | []>([]);

    const [documentHash, setDocumentHash] = React.useState<AssetDocument[]>([]);

    const [rule, setRule] = React.useState<AssetRule[]>([]);
    const [ownershipMaturityTime, setOwnershipMaturityTime] = React.useState<bigint>(BigInt(0));

    async function create() {
        try {
            setIsLoading(true);
            const insertedInput : CreateAssetInputApi = {
                name: name,
                description: description,
                assetType: text2AssetType(assetType),
                totalToken: totalToken,
                tokenLeft: tokenLeft,
                minTokenPurchased: minTokenPurchased,
                maxTokenPurchased: maxTokenPurchased,
                pricePerToken: pricePerToken,
                locationInfo: locationInfo,
                documentHash: documentHash,
                rule: rule,
                ownershipMaturityTime: ownershipMaturityTime,
                assetStatus: text2AssetStatus("Active"),
            }
            const res = await backendService.createAsset(insertedInput);

            console.log(res);

            if (res[0] === false) {
                throw new Error(res[1] ?? "Unknown error");
            }
            navigate("/market-place");
            setNotificationData({
                title: "Success",
                description: res[1],
                position: "bottom-right",
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({
                title: "Error",
                description: msg,
                position: "bottom-right",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <LoaderComponent text="please wait" fullScreen={true} />

    return (
        <MainLayout needProtection={true}>
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Asset</h1>
                    <p className="text-gray-600 mt-2">Fill in the details to create and mint your digital asset</p>
                </div>

                <div className="space-y-8">
                    {/* readygen */}
                    <GeneralAssetInfo
                        isDone={readygen} setIsDone={setReadygen}
                        name={name} setName={setName}
                        description={description} setDescription={setDescription}
                        assetType={assetType} setAssetType={setAssetType}
                    />

                    {/* readytoken */}
                    <TokenAsset
                        isDone={readytoken} setIsDone={setReadytoken}
                        totalToken={totalToken} setTotalToken={setTotalToken}
                        tokenLeft={tokenLeft} setTokenLeft={setTokenLeft}
                        minTokenPurchased={minTokenPurchased} setMinTokenPurchased={setMinTokenPurchased}
                        maxTokenPurchased={maxTokenPurchased} setMaxTokenPurchased={setMaxTokenPurchased}
                        pricePerToken={pricePerToken} setPricePerToken={setPricePerToken}
                    />

                    {/* readyloc */}
                    <LocationAsset
                        isDone={readyloc} setIsDone={setReadyloc}
                        setLocationInfo={setLocationInfo}
                    />

                    {/* readydoc */}
                    <DocumentAsset
                        isDone={readydoc} setIsDone={setReadydoc}
                        documentHash={documentHash} setDocumentHash={setDocumentHash}
                    />

                    {/* readyrule */}
                    <RuleAsset
                        isDone={readyrule} setIsDone={setReadyrule}
                        rule={rule} setRule={setRule}
                        ownershipMaturityTime={ownershipMaturityTime} setOwnershipMaturityTime={setOwnershipMaturityTime}
                    />

                    {/* readytnc */}
                    <TermAndConditionAsset
                        isDone={readytnc} setIsDone={setReadytnc}
                    />

                    {/* Submit Button */}
                    <div className="w-full">
                        <button
                            disabled={!(readygen && readytoken && readyloc && readydoc && readyrule && readytnc) || isLoading}
                            onClick={() => create()}
                            className={`px-6 py-3 rounded-md text-white font-medium ${readygen && readytoken && readyloc && readydoc && readyrule && readytnc
                                ? "background-dark hover:brightness-110"
                                : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? "Loading" : "Create Asset"}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}