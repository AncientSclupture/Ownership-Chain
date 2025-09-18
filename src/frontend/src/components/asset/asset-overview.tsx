import { Check, HardDriveDownload, OctagonAlert, X } from "lucide-react";
import { Asset, Rule, Transaction } from "../../types/rwa";
import React from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { formatMotokoTime } from "../../helper/rwa-helper";

function DocumentComponent({ name, hash }: { name: string, hash: string }) {

    const { setNotificationData } = React.useContext(NotificationContext);

    function handleCopy() {
        navigator.clipboard.writeText(hash);
        setNotificationData({
            title: `${name} hash successfully copy`,
            description: "you can use the hash to verify the document assets",
            position: "bottom-right"
        })
    }
    return (
        <div className="p-3 bg-gray-200 rounded-md flex justify-between items-center">
            <p className="text-sm">{name}</p>
            <button className="cursor-pointer" onClick={() => handleCopy()}>
                <HardDriveDownload size={20} />
            </button>
        </div>
    );
}

function RuleComponent({ rule }: { rule: Rule }) {
    const sellSharingText = rule.sellSharing ? `This asset is allowing you to sell the ownership, with maximum price ${rule.sellSharingPrice} ICP`
        : `This asset is not allowing the holder to sell their ownership asset token, instead you can transfer to the creator or event to the other ownership asset holder.`;

    const needDonePayemntText = rule.needDownPayment ? `This asset need done payment first to propose buy token ownership, with done payment is ${rule.minDownPaymentPercentage * 100}% of the total payment. `
        : ``;

    const donePaymentMaturityTime = `This Done payment mustbe done with in ${rule.downPaymentMaturityTime} days.`

    const donePaymentCashback = `The cahsback is ${rule.downPaymentCashback * 100}% from your done payment price that you have been paid.`

    const maturityTime = rule.ownerShipMaturityTime !== BigInt(0) ? `This asset ownership maturity time is ${rule.ownerShipMaturityTime} days`
        : `You owned this ownership with no maturity time`;

    return (
        <div className="text-gray-800 space-y-2">
            <div className="flex items-center space-x-2">
                <div>{rule.sellSharing ? <Check size={20} /> : <X size={20} />}</div>
                <p>{sellSharingText}</p>
            </div>
            <div className="flex items-center space-x-2">
                <div>{rule.needDownPayment ? <Check size={20} /> : <X size={20} />}</div>
                <p>{needDonePayemntText}</p>
            </div>
            {rule.needDownPayment &&
                <div className="flex items-center space-x-2">
                    <div>{rule.needDownPayment ? <Check size={20} /> : <X size={20} />}</div>
                    <p>{donePaymentMaturityTime}</p>
                </div>
            }
            {rule.needDownPayment &&
                <div className="flex items-center space-x-2">
                    <div>{rule.needDownPayment ? <Check size={20} /> : <X size={20} />}</div>
                    <p>{donePaymentCashback}</p>
                </div>
            }
            <div className="flex items-center space-x-2">
                <div>{rule.needDownPayment ? <Check size={20} /> : <X size={20} />}</div>
                <p>{maturityTime}</p>
            </div>
            {rule.details.map((d, idx) =>
                <div className="flex items-center space-x-2" key={idx}>
                    <OctagonAlert size={20} />
                    <p>{d}</p>
                </div>
            )}

        </div>
    );
}

export default function OverviewAsset(
    { assetData, dividendData }: { assetData: Asset, dividendData: Array<Transaction> | undefined }
) {
    console.log(assetData, dividendData);
    return (
        <div className="space-y-8">
            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Description</h1>
                <div className="text-gray-800">
                    {assetData.description}
                </div>
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Rules & Legalities</h1>
                <RuleComponent rule={assetData.rule} />
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Documentation</h1>
                <div className="w-full space-y-2">
                    {assetData.documentHash.map((doc, idx) =>
                        <DocumentComponent key={idx} hash={doc.hash} name={doc.name} />
                    )}
                </div>
            </div>

            <div className="p-4 md:px-8 border border-gray-300 rounded-md">
                <h1 className="text-xl text-gray-500 py-5">Last 5 Dividends</h1>
                <div className="w-full space-y-2">
                    {/* heaader */}
                    <div className="text-gray-600 border-b border-gray-300 grid grid-cols-3">
                        <p>Date</p>
                        <p>Amount</p>
                        <p>Details</p>
                    </div>
                    {!dividendData || dividendData.length === 0 && <div>No Dividend yet</div>}
                    {dividendData?.map((d, idx) => (
                        <div className="text-gray-600 grid grid-cols-3" key={idx}>
                            <p>{formatMotokoTime(d.timestamp)}</p>
                            <p>{d.totalPrice}</p>
                            <p>{d.details[0]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}