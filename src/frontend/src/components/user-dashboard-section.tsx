import React from "react";
import { CreateAssetStep, ModalKindEnum } from "../types/ui";
import { CreateAssetAccordion, DocumentAsset, LocationAsset, OverviewIdentity, TokenAsset } from "./create-assets-component";
import { ModalContext } from "../context/ModalContext";

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

    const onHandleToggle = () => {
        setStepProgress(CreateAssetStep.overview)
    }
    return (
        <div className="p-2 space-y-5">
            <CreateAssetAccordion
                title="Asset Overview and Identity"
                isOpen={stepProgress === CreateAssetStep.overview}
                onToggle={onHandleToggle}
            >
                <OverviewIdentity />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Token"
                isOpen={stepProgress === CreateAssetStep.token}
                onToggle={() => setStepProgress(CreateAssetStep.token)}
            >
                <TokenAsset />
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
                <LocationAsset />
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Asset Rules"
                isOpen={stepProgress === CreateAssetStep.rule}
                onToggle={() => setStepProgress(CreateAssetStep.rule)}
            >
                another form content
            </CreateAssetAccordion>

            <CreateAssetAccordion
                title="Terms and Condition"
                isOpen={stepProgress === CreateAssetStep.tag}
                onToggle={() => setStepProgress(CreateAssetStep.tag)}
            >
                another form content
            </CreateAssetAccordion>
        </div>
    );
}


export function DividendSection() {
    return (
        <div>Hallo This is Dividend Section</div>
    );
}

export function TransactionSection() {
    return (
        <div>Hallo This is Transactions Section</div>
    );
}

export function ReportingSection() {
    return (
        <div>Hallo This is Reporting Section</div>
    );
}