import React from "react";
import { AssetRule } from "../../types/rwa";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";

export default function RuleAsset({
    isDone,
    setIsDone,
    rule,
    setRule,
    ownershipMaturityTime,
    setOwnershipMaturityTime,
}: {
    isDone: boolean;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
    rule: AssetRule[];
    setRule: React.Dispatch<React.SetStateAction<AssetRule[]>>;
    ownershipMaturityTime: bigint;
    setOwnershipMaturityTime: React.Dispatch<React.SetStateAction<bigint>>;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setModalKind, addrulemanagement } = React.useContext(ModalContext);

    React.useEffect(() => {
        setRule([...addrulemanagement.data]);
    }, [addrulemanagement.data, addrulemanagement.resetter, addrulemanagement.remover, addrulemanagement.setter]);

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
                <span
                    className={`${isDone ? "text-green-700" : "text-gray-800"} font-medium`}
                >
                    Asset Rules
                </span>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-fit py-5 px-6" : "max-h-0 px-6"
                    }`}
            >
                <div className="space-y-4">
                    {/* List of rules */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {rule.length === 0 && (
                            <p className="text-gray-500 text-sm">No rules added yet.</p>
                        )}
                        {rule.map((r, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{r.name}</p>
                                    <p className="text-sm text-gray-600">{r.content}</p>
                                </div>
                                <button
                                    onClick={() => addrulemanagement.remover(index)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setModalKind(ModalKindEnum.addrule)}
                        className="background-dark text-white hover:brightness-110 p-2 rounded-lg"
                    >
                        + Add Rule
                    </button>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Ownership Maturity Time
                        </label>
                        <input
                            type="text"
                            value={ownershipMaturityTime.toString()}
                            onChange={(e) => setOwnershipMaturityTime(BigInt(e.target.value))}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Button to mark the form as done */}
                    <button
                        onClick={() => setIsDone(!isDone)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${isDone
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "background-dark text-white hover:brightness-110"
                            }`}
                    >
                        {isDone ? "Mark as Not Done" : "Mark as Done"}
                    </button>
                </div>


            </div>
        </div>
    );
}