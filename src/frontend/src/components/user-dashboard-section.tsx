import React from "react";
import { CreateAssetStep, FormDataCreateAseet, ModalKindEnum } from "../types/ui";
import { CreateAssetAccordion, DocumentAsset, LocationAsset, OverviewIdentity, RuleAssetHolder, TermsAndCondition, TokenAsset } from "./create-assets-component";
import { ModalContext } from "../context/ModalContext";
import { CustomizableBarChart, CustomizableLineChart } from "./chart/asset-detail-chart";
import { DocumentHashDataType } from "../types/rwa";

export function AboutMeSection() {
    const { setModalKind } = React.useContext(ModalContext);
    return (
        <div className="px-2 space-y-10">
            <div>
                <div className="space-y-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-semibold">Personal Information</h1>
                            <p>user id</p>
                        </div>
                        <button
                            className="cursor-pointer bg-black p-2 text-[12px] text-white rounded-xl"
                            onClick={() => setModalKind(ModalKindEnum.personalinfo)}
                        >
                            Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <p>First name</p>
                        <p>First name value</p>
                        <p>Last name</p>
                        <p>Last name value</p>
                        <p>phone</p>
                        <p>phone value</p>
                        <p>Country</p>
                        <p>Country value</p>
                        <p>City</p>
                        <p>City value</p>
                        <p>Identity code</p>
                        <p>Identity code value</p>
                    </div>
                </div>
            </div>
            <div className="flex items-start justify-between space-x-2 md:space-x-10">
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Transactions</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total</p>
                        <p>value</p>
                        <p>Buy</p>
                        <p>value</p>
                        <p>Sell</p>
                        <p>value</p>
                        <p>Transfer</p>
                        <p>value</p>
                        <p>Dividend</p>
                        <p>value</p>
                    </div>
                </div>
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Owership</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total Ownership</p>
                        <p>value</p>
                        <p>Total Token</p>
                        <p>value</p>
                    </div>
                </div>
                <div className="w-full p-2 border border-gray-300">
                    <div className="p-2 w-full bg-gray-200 text-center rounded-md border border-gray-300">Asset</div>
                    <div className="grid grid-cols-2 p-2 gap-2 text-sm">
                        <p>Total Asset</p>
                        <p>value</p>
                        <p>Total Token</p>
                        <p>value</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AssetListSection() {
    return (
        <div>Hallo This is Asset Lists Section</div>
    );
}

export function ProposalsSection() {
    return (
        <div>Hallo This is Proposals Section</div>
    );
}

export function CreateAssetSection() {
    const [stepProgress, setStepProgress] = React.useState<CreateAssetStep>(CreateAssetStep.overview)
    const { managementAddDocument } = React.useContext(ModalContext);

    const [formData, setFormData] = React.useState<FormDataCreateAseet>({
        name: "",
        description: "",
        assetType: "Property",
        assetStatus: "Active",

        totalToken: 0,
        providedToken: 0,
        minTokenPurchased: 0,
        maxTokenPurchased: 0,
        pricePerToken: 0,

        locationInfo: { lat: 0, long: 0, details: [""] },
        documentHash: [],

        rule: {
            sellSharing: false,
            sellSharingNeedVote: false,
            sellSharingPrice: 0,
            needDownPayment: false,
            minDownPaymentPercentage: 0,
            downPaymentCashback: 0,
            downPaymentMaturityTime: 0,
            paymentMaturityTime: 0,
            ownerShipMaturityTime: 0,
            details: [""],
        },

        agreement: false,
    });

    React.useEffect(() => {
        if (managementAddDocument?.data) {
            setFormData((prev) => {
                return {
                    ...prev,
                    documentHash: managementAddDocument.data as DocumentHashDataType[],
                };
            });
        }
    }, [managementAddDocument?.data]);

    React.useEffect(() => {
        console.log(formData)
    }, [formData])

    return (
        <div className="p-2 space-y-5">
            <CreateAssetAccordion
                title="Asset Overview and Identity"
                isOpen={stepProgress === CreateAssetStep.overview}
                onToggle={() => setStepProgress(CreateAssetStep.overview)}
            >
                <OverviewIdentity formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Token"
                isOpen={stepProgress === CreateAssetStep.token}
                onToggle={() => setStepProgress(CreateAssetStep.token)}
            >
                <TokenAsset formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Documents"
                isOpen={stepProgress === CreateAssetStep.document}
                onToggle={() => setStepProgress(CreateAssetStep.document)}
            >
                <DocumentAsset />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Location"
                isOpen={stepProgress === CreateAssetStep.location}
                onToggle={() => setStepProgress(CreateAssetStep.location)}
            >
                <LocationAsset formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Rules"
                isOpen={stepProgress === CreateAssetStep.rule}
                onToggle={() => setStepProgress(CreateAssetStep.rule)}
            >
                <RuleAssetHolder formData={formData} setFormData={setFormData} />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Terms and Condition"
                isOpen={stepProgress === CreateAssetStep.tag}
                onToggle={() => setStepProgress(CreateAssetStep.tag)}
            >
                <TermsAndCondition formData={formData} />
            </CreateAssetAccordion>
        </div>
    );
}


export function DividendSection() {

    const data2 = [
        { date: 'date-1', usd: 2400 },
        { date: 'date-2', usd: 4200 },
        { date: 'date-3', usd: 2012 },
        { date: 'date-4', usd: 1023 },
        { date: 'date-5', usd: -201 },
        { date: 'date-6', usd: 2012 },
        { date: 'date-7', usd: 1023 },
    ];

    const aiSummary = `
    The dividend transactions over the last 7 periods show a generally stable trend 
    with notable peaks on date-2 (USD 4200) and dips on date-5 (USD -201). 
    Overall performance remains positive with consistent payouts.`;

    return (
        <div className="w-full flex items-center justify-center flex-col">
            <h1 className="text-xl pb-10">Dividend Transaction</h1>
            <div className="w-full md:h-[25vw] h-[50vw]">
                <CustomizableLineChart data={data2} />
            </div>
            <div className="w-full p-5">
                <h2 className="font-normal">Summary</h2>
                <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>

            </div>
        </div>
    );
}

export function TransactionSection() {
    const data2 = [
        { date: 'date-1', usd: 2400 },
        { date: 'date-2', usd: 4200 },
        { date: 'date-3', usd: 2012 },
        { date: 'date-4', usd: 1023 },
        { date: 'date-6', usd: 2012 },
        { date: 'date-7', usd: 1023 },
    ];

    const aiSummary = `
    The dividend transactions over the last 7 periods show a generally stable trend 
    with notable peaks on date-2 (USD 4200) and dips on date-5 (USD -201). 
    Overall performance remains positive with consistent payouts.`;

    return (
        <div className="w-full flex items-center justify-center flex-col">
            <h1 className="text-xl pb-10">my Transaction</h1>
            <div className="w-full md:h-[25vw] h-[50vw]">
                <CustomizableBarChart data={data2} />
            </div>
            <div className="w-full p-5">
                <h2 className="font-normal">Summary</h2>
                <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>

            </div>
        </div>
    );
}

export function ReportingSection() {
    return (
        <div>Hallo This is Reporting Section</div>
    );
}