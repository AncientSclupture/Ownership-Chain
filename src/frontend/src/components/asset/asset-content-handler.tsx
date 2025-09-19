export enum assetdetailopt {
    overview = "overview",
    token = "token",
    devidendholder = "devidendholder",
    totaldevidend = "totaldevidend",
    support = "support",
}

interface AssetDetailTabsProps {
    selected: assetdetailopt;
    onChange: (opt: assetdetailopt) => void;
}

// CHANGE ONLY THE OPTION CORESPOND TO THE assetdetailopt enum
export const AssetDetailTabs: React.FC<AssetDetailTabsProps> = ({ selected, onChange }) => {
    const options: { key: assetdetailopt; label: string }[] = [
        { key: assetdetailopt.overview, label: "Overview" },
        { key: assetdetailopt.token, label: "Token" },
        { key: assetdetailopt.devidendholder, label: "Devidend Holder" },
        { key: assetdetailopt.totaldevidend, label: "Total Devidend" },
        { key: assetdetailopt.support, label: "Asset Suport" },
    ];

    return (
        <div className="border-b border-gray-300 pb-3 px-3 w-full flex items-center space-x-12 text-gray-600">
            {options.map((opt) => (
                <button
                    key={opt.key}
                    onClick={() => onChange(opt.key)}
                    className={`cursor-pointer ${selected === opt.key ? "text-black font-semibold" : ""
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export interface AssetDetailComponentWrapperProps {
    name: assetdetailopt;
    component: React.ReactNode;
}

export function AssetContentWrapper(
    { current, listcontent }:
        { current: assetdetailopt, listcontent: AssetDetailComponentWrapperProps[] }
) {
    return (
        <div className="py-8">
            {listcontent.find(c => c.name === current)?.component}
        </div>
    );
}