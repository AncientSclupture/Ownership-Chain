import React from "react";
import { AssetType } from "../types/rwa";
import { FormDetails, FormDocument, FormSharingRules, FormTermsAndConditions, FormTypes, Step } from "./steps-form";
import { backendService } from "../services/backendService";

const steps = [
    "Asset Details",
    "Choose Type",
    "Upload Documents",
    "Set Sharing Rules",
    "Terms & Conditions",
];

interface formDataInterface {
    name: string;
    description: string;
    assetType: AssetType;
    totalValue: number;
    totalSupply: number;
    location: string;
    documents: string[];
    metadata: Array<[string, string]>;
}

export function CreateAssetsModal(
    { openModal, setOpenModal }:
        { openModal: boolean, setOpenModal: (d: boolean) => void }
) {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [agree, setAgree] = React.useState(false);
    const [completedSteps, setCompletedSteps] = React.useState<boolean[]>(
        Array(steps.length).fill(false)
    );

    // formsData
    const [formData, setFormData] = React.useState<formDataInterface | null>(null);

    const handleOkClick = () => {
        if (!validateStep()) {
            alert("Please complete the required fields before proceeding.");
            return;
        }

        const updated = [...completedSteps];
        updated[currentStep] = true;
        setCompletedSteps(updated);

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }

        console.log(formData);
    };

    const handleCancle = () => {
        setOpenModal(false);
        setCurrentStep(0);
        setCompletedSteps(Array(steps.length).fill(false));
        setFormData(null);
    }

    const updateFormData = (newData: Partial<formDataInterface>) => {
        setFormData((prev) => ({ ...prev, ...newData } as formDataInterface));
    };

    const handleSubmit = async () => {
        if (!formData) {
            alert("Missing form data");
            return;
        }

        const result = await backendService.createAsset(
            formData.name,
            formData.description,
            formData.assetType,
            formData.totalValue,
            formData.totalSupply,
            formData.location,
            formData.documents,
            formData.metadata
        );

        if (!validateStep()) {
            alert("Please complete all required fields.");
            return;
        }

        if ("ok" in result) {
            alert("Asset created successfully! ID: " + result.ok);
            setOpenModal(false);
            setCurrentStep(0);
            setCompletedSteps(Array(steps.length).fill(false));
            setFormData(null); // Reset form
        } else {
            alert("Failed to create asset: " + result.err);
        }
    };

    const validateStep = (): boolean => {
        if (!formData) return false;

        switch (currentStep) {
            case 0:
                return !!formData.name && !!formData.description;
            case 1:
                return formData.assetType !== undefined;
            case 2:
                return formData.documents.length > 0;
            case 3:
                return (
                    formData.totalValue > 0 &&
                    formData.totalSupply > 0 &&
                    !!formData.location &&
                    formData.metadata.length > 0
                );
            case 4:
                return agree;
            default:
                return false;
        }
    };

    return (
        <div className={`fixed top-0 bg-white/50 z-[99] w-full h-screen ${openModal ? "" : "hidden"}`}>
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[90vw] h-[60vw] md:w-[60vw] md:h-[40vw] bg-white border border-gray-400 rounded-lg p-5 space-y-2">
                    {/* header and close */}
                    <div className="flex justify-between items-center">
                        <p className="font-bold">Create New Assets</p>
                        <div className="underline cursor-pointer text-red-500" onClick={handleCancle}>Terminate and Exit</div>
                    </div>
                    <div>
                        {/* Stepper */}
                        <div className="flex justify-center mb-6">
                            {steps.map((_, stepId) => (
                                <Step
                                    key={stepId}
                                    isSelect={currentStep === stepId}
                                    isLast={stepId === steps.length - 1}
                                    isDone={completedSteps[stepId]}
                                    onClick={() => {
                                        if (
                                            stepId <= currentStep ||
                                            completedSteps[stepId - 1]
                                        ) {
                                            setCurrentStep(stepId);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="mt-6 p-4 rounded-md border border-gray-300 md:h-[25vw] h-[32vw] flex items-center justify-center text-xl text-gray-700">
                            {currentStep === 0 && <FormDetails
                                name={formData?.name || ""}
                                desc={formData?.description || ""}
                                onChange={(data) => updateFormData(data)}
                            />}
                            {currentStep === 1 && <FormTypes
                                type={formData?.assetType}
                                onChange={(val) => updateFormData({ assetType: val })}
                            />
                            }
                            {currentStep === 2 && <FormDocument
                                doc={formData?.documents || []}
                                onChange={(newDocs) => updateFormData({ documents: newDocs })}
                            />}
                            {currentStep === 3 && (
                                <FormSharingRules
                                    totalValue={formData?.totalValue || 0}
                                    totalSupply={formData?.totalSupply || 0}
                                    location={formData?.location || ""}
                                    metadata={formData?.metadata || []}
                                    onChange={(data) => updateFormData(data)}
                                />
                            )}

                            {currentStep === 4 && (
                                <FormTermsAndConditions
                                    agreed={agree}
                                    onChange={setAgree}
                                />
                            )}

                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            {currentStep === steps.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                                >
                                    Agree and Submit
                                </button>

                            ) : (
                                <button
                                    onClick={handleOkClick}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer"
                                >
                                    OK and Next
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}