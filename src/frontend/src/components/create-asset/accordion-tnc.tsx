import React from "react";

export default function TermAndConditionAsset({
    isDone,
    setIsDone,
}: {
    isDone: boolean;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isOpen, setIsOpen] = React.useState(false);

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
                    Terms and Conditions
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
                <div className="space-y-6 text-sm leading-relaxed">
                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">By submitting this document and asset, I consciously declare that:</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>
                                If at any point it is proven that my asset constitutes plagiarism, fraud,
                                manipulation, or any form of scam, all ownership rights to the asset may be revoked
                                without compensation, and I agree to accept any administrative sanctions or penalties as required.
                            </li>
                            <li>
                                I am fully responsible for completing all administrative obligations,
                                including dividend distribution, profit sharing, and business closure in the event of
                                bankruptcy or liquidation.
                            </li>
                            <li>
                                I take full responsibility for the control and management of the asset,
                                and I am required to comply with all regulations and provisions that I have
                                established in the <span className="font-semibold">Asset Rules</span> section.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">I hereby truthfully declare that:</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>All documents I upload are accurate, valid, and their authenticity can be accounted for.</li>
                            <li>I have set the location, type, and total token amount with full awareness and responsibility.</li>
                            <li>I understand that any mistakes in data entry or negligence are entirely my own responsibility.</li>
                        </ul>
                    </div>

                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">Additional Terms</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>I acknowledge that there are market, legal, and technological risks that may affect the value and sustainability of the asset.</li>
                            <li>I agree to provide clarification, additional evidence, or supporting documents if requested by an authorized party.</li>
                            <li>I accept that any violation of these terms and conditions may result in suspension, freezing, or removal of the asset.</li>
                            <li>By submitting, I confirm that I have read, understood, and agreed to all the applicable terms & conditions.</li>
                        </ul>
                    </div>
                </div>

                {/* Button to mark the form as done */}
                <button
                    onClick={() => setIsDone(!isDone)}
                    className={`px-4 mt-5 py-2 rounded-md text-sm font-medium ${isDone
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "background-dark text-white hover:brightness-110"
                        }`}
                >
                    {isDone ? "Mark as Not Done" : "Mark as Done"}
                </button>
            </div>
        </div>
    );
}