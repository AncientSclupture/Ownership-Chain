import { AssetType } from "../types/rwa";
import React from "react";


export function Step({
    isSelect = false,
    isLast = false,
    isDone = false,
    onClick,
}: {
    isSelect?: boolean;
    isDone?: boolean;
    isLast?: boolean;
    onClick?: () => void;
}) {
    const outerColor = isSelect
        ? "bg-blue-500"
        : isDone
            ? "bg-green-500"
            : "bg-gray-300";
    const innerColor = isSelect
        ? "bg-blue-900"
        : isDone
            ? "bg-green-900"
            : "bg-gray-500";

    const stepLineColor = isDone
        ? "bg-green-500"
        : "bg-gray-300";

    return (
        <div className="w-fit cursor-pointer" onClick={onClick}>
            <div className="flex items-center">
                <div
                    className={`md:w-[2.5vw] md:h-[2.5vw] w-[5vw] h-[5vw] rounded-full flex justify-center items-center ${outerColor}`}
                >
                    <div className={`md:w-[2vw] md:h-[2vw] w-[4vw] h-[4vw] rounded-full ${innerColor}`} />
                </div>
                {!isLast && <div className={`h-2 md:w-[3vw] w-[6vw] ${stepLineColor}`} />}
            </div>
        </div>
    );
}

export function FormDetails({
    name,
    desc,
    location = "",
    onChange
}: {
    name: string;
    desc: string;
    location?: string;
    onChange: (data: { name: string; description: string, loc?: string }) => void;
}) {
    return (
        <div className="space-y-4 w-full">
            <p className="text-gray-500 font-semibold">What is the name of your asset?</p>
            <input
                type="text"
                placeholder="Asset name"
                value={name}
                onChange={(e) => onChange({ name: e.target.value, description: desc, loc: location })}
                className="w-full p-2 border rounded"
            />
            <p className="text-gray-500 font-semibold">Describe your asset here</p>
            <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => onChange({ name, description: e.target.value })}
                className="w-full p-2 border rounded"
            />
        </div>
    );
}

const assetOptions: Array<{ label: string; value: AssetType }> = [
    { label: "Property", value: { Property: null } },
    { label: "Business", value: { Business: null } },
    { label: "Artwork", value: { Artwork: null } },
    { label: "Vehicle", value: { Vehicle: null } },
    { label: "Equipment", value: { Equipment: null } },
    { label: "Other", value: { Other: "" } },
];

export function FormTypes({
    type,
    onChange,
}: {
    type: AssetType | undefined;
    onChange: (value: AssetType) => void;
}) {
    const getSelected = (v: AssetType) =>
        JSON.stringify(v) === JSON.stringify(type);

    return (
        <div className="space-y-4 w-full">
            <p className="text-lg font-medium">Select Asset Type:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {assetOptions.map((opt) => (
                    <button
                        key={opt.label}
                        className={`p-3 border rounded ${getSelected(opt.value)
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800"
                            }`}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* If selected "Other", show input */}
            {type && "Other" in type && (
                <input
                    type="text"
                    className="mt-4 p-2 border rounded w-full"
                    placeholder="Enter other type"
                    value={type.Other}
                    onChange={(e) =>
                        onChange({ Other: e.target.value })
                    }
                />
            )}
        </div>
    );
}


export function FormDocument({
    doc,
    onChange,
}: {
    doc: string[];
    onChange: (docs: string[]) => void;
}) {
    const [hashResult, setHashResult] = React.useState<string>("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        // Baca file dan hash dengan SHA-256
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        console.log(arrayBuffer);

        setHashResult(hashHex);

        // Simpan hash ke formData melalui onChange
        onChange([...doc, hashHex]);
    };

    return (
        <div className="w-full h-full flex flex-col justify-evenly">
            <div className="w-full">
                <p className="mb-2">Upload PDF Document</p>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="text-sm w-full bg-gray-100 border rounded p-2"
                />
            </div>

            <div className="mt-4">
                <p className="mb-1">Hash Signature (auto-generated):</p>
                <input
                    type="text"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={hashResult}
                    readOnly
                />
            </div>
        </div>
    );
}

export function SharingRules() {
    return (
        <div>Sharing Rules</div>
    )
}

export function FormSharingRules({
    totalValue,
    totalSupply,
    location,
    metadata,
    onChange,
}: {
    totalValue: number;
    totalSupply: number;
    location?: string;
    metadata: Array<[string, string]>;
    onChange: (data: {
        totalValue: number;
        totalSupply: number;
        location?: string;
        metadata: Array<[string, string]>;
    }) => void;
}) {
    const [localMeta, setLocalMeta] = React.useState<[string, string][]>(metadata);

    const updateMeta = (index: number, key: string, value: string) => {
        const updated = [...localMeta];
        updated[index] = [key, value];
        setLocalMeta(updated);
        onChange({ totalValue, totalSupply, location, metadata: updated });
    };

    const addMetaField = () => {
        const updated: [string, string][] = [...localMeta, ["", ""]];
        setLocalMeta(updated);
        onChange({ totalValue, totalSupply, location, metadata: updated });
    };

    const removeMetaField = (index: number) => {
        const updated = [...localMeta];
        updated.splice(index, 1);
        setLocalMeta(updated);
        onChange({ totalValue, totalSupply, location, metadata: updated });
    };

    return (
        <div className="space-y-4 w-full flex flex-col justify-start h-full">
            <div className="flex items-center space-x-2">
                {/* value */}
                <div>
                    <label>Total Value</label>
                    <input
                        type="number"
                        value={totalValue}
                        onChange={(e) =>
                            onChange({
                                totalValue: Number(e.target.value),
                                totalSupply,
                                location,
                                metadata: localMeta,
                            })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Enter total value"
                    />
                </div>
                {/* supply */}
                <div>
                    <label>Total Supply</label>
                    <input
                        type="number"
                        value={totalSupply}
                        onChange={(e) =>
                            onChange({
                                totalValue,
                                totalSupply: Number(e.target.value),
                                location,
                                metadata: localMeta,
                            })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Enter total supply"
                    />
                </div>
                {/* location */}
                <div>
                    <label>Location (Optional)</label>
                    <input
                        type="text"
                        value={location || ""}
                        onChange={(e) =>
                            onChange({
                                totalValue,
                                totalSupply,
                                location: e.target.value,
                                metadata: localMeta,
                            })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Enter location"
                    />
                </div>
            </div>

            <div>
                <label>Metadata</label>
                <div className="space-y-2">
                    {localMeta.map(([k, v], idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Key"
                                value={k}
                                onChange={(e) =>
                                    updateMeta(idx, e.target.value, v)
                                }
                                className="p-2 border rounded w-1/2"
                            />
                            <input
                                type="text"
                                placeholder="Value"
                                value={v}
                                onChange={(e) =>
                                    updateMeta(idx, k, e.target.value)
                                }
                                className="p-2 border rounded w-1/2"
                            />
                            <button
                                onClick={() => removeMetaField(idx)}
                                className="text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addMetaField}
                        className="text-sm text-blue-600 underline mt-2"
                    >
                        + Add Metadata
                    </button>
                </div>
            </div>
        </div>
    );
}
export function FormTermsAndConditions({
    agreed,
    onChange,
}: {
    agreed: boolean;
    onChange: (agreed: boolean) => void;
}) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-2">
                <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <label htmlFor="agree" className="">
                    I agree to the terms and conditions
                </label>
            </div>
        </div>
    );
}
