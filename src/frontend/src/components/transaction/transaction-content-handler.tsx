export enum transactiondetailopt {
    buy = "buy",
    transfer = "transfer",
    history = "history",
    cashback = "cashback",
}

interface TransactionTabsProps {
    selected: transactiondetailopt;
    onChange: (opt: transactiondetailopt) => void;
}

// CHANGE ONLY THE OPTION CORESPOND TO THE transactiondetailopt enum
export const AssetDetailTabs: React.FC<TransactionTabsProps> = ({ selected, onChange }) => {
    const options: { key: transactiondetailopt; label: string }[] = [
        { key: transactiondetailopt.buy, label: "Buy" },
        { key: transactiondetailopt.transfer, label: "Transfer" },
        { key: transactiondetailopt.history, label: "History" },
        { key: transactiondetailopt.cashback, label: "Cashback" },
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

export interface TransactionWrapperProps {
    name: transactiondetailopt;
    component: React.ReactNode;
}

export function TransactionWrapper(
    { current, listcontent }:
        { current: transactiondetailopt, listcontent: TransactionWrapperProps[] }
) {
    return (
        <div className="py-8">
            {listcontent.find(c => c.name === current)?.component}
        </div>
    );
}