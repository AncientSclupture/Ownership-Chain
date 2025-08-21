import { ChevronDown, ChevronRight, FileLock2, Plus, X } from "lucide-react";
import { AccordionProps, ModalKindEnum } from "../types/ui";
import { AccessInfoMaps } from "./map/asset-detals-map";
import React from "react";
import { ModalContext } from "../context/ModalContext";

export function CreateAssetAccordion({ title, isOpen, onToggle, children }: AccordionProps) {
    return (
        <div className="p-5 bg-white rounded-lg shadow-sm">
            <div
                onClick={onToggle}
                className="cursor-pointer flex w-full items-center justify-between"
            >
                <p className="font-medium">{title}</p>
                <span className="transition-transform duration-200">
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </span>
            </div>
            {isOpen && <div className="transition-all duration-200 mt-3">{children}</div>}
        </div>
    );
}

export function OverviewIdentity() {
    return (
        <div className="space-y-4">
            {/* name */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Name</p>
                </div>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="put your asset name here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* name */}

            {/* description */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Description</p>
                </div>
                <textarea
                    name="description"
                    id="description"
                    placeholder="put your asset description here"
                    className="p-2 border border-gray-400 rounded-md w-full resize-none"
                    rows={5}

                />
            </div>
            {/* description */}

            {/* type */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Types</p>
                </div>
                <select
                    className="border border-gray-400 p-2 w-full rounded"
                >
                    <option>Property</option>
                    <option>Business</option>
                    <option>Artwork</option>
                    <option>Vehicle</option>
                    <option>Equipment</option>
                    <option>Other</option>
                </select>
            </div>
            {/* type */}

            {/* status */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Asset Status</p>
                </div>
                <select
                    className="border border-gray-400 p-2 w-full rounded"
                >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                    <option>Open</option>
                </select>
            </div>
            {/* status */}
        </div>
    );
}

export function TokenAsset() {
    return (
        <div className="space-y-4">
            {/* total token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Total Token</p>
                </div>
                <input
                    type="text"
                    name="totaltoken"
                    id="totaltoken"
                    placeholder="set your total token here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* total token */}

            {/* provided token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Provided Token</p>
                </div>
                <input
                    type="text"
                    name="providedtoken"
                    id="providedtoken"
                    placeholder="set your token provided here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* provided token */}

            {/* minimal token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Minimal Token</p>
                </div>
                <input
                    type="text"
                    name="mintoken"
                    id="mintoken"
                    placeholder="set your minimal token purchased here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* minimal token */}

            {/* maximal token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Maximal Token</p>
                </div>
                <input
                    type="text"
                    name="maxtoken"
                    id="maxtoken"
                    placeholder="set your maximal token purchased here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* maximal token */}

            {/* price per token */}
            <div>
                <div className="flex justify-between items-center pr-2">
                    <p>Price per Token</p>
                </div>
                <input
                    type="text"
                    name="tokenprice"
                    id="tokenprice"
                    placeholder="set your token price here"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            {/* price per token */}

        </div>
    );
}

function ComponentDocs({ name, onremove }: { name: string, onremove: (d: string) => void }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <FileLock2 size={18} />
                <div className="font-mono text-sm">
                    {name}
                </div>
            </div>
            <button
                onClick={() => onremove(name)}
                className="p-1 bg-red-200 rounded-full flex items-center justify-center cursor-pointer"
            >
                <X color="red" size={15} />
            </button>
        </div>
    );
}

export function DocumentAsset() {
    const { setModalKind, managementAddDocument } = React.useContext(ModalContext);
    const documentsData = managementAddDocument.data || [];
    return (
        <div className="space-y-4">
            {documentsData.length === 0 && (
                <p className="text-[12px]">You need to add at least one document</p>
            )}

            {documentsData.length > 0 && (
                <div className="space-y-2">
                    {documentsData.map((data, idx) => (
                        <ComponentDocs
                            key={idx}
                            name={data.name}
                            onremove={managementAddDocument.remover}
                        />
                    ))}
                </div>
            )}

            <button
                onClick={() => setModalKind(ModalKindEnum.adddocument)}
                className="bg-black p-2 rounded-md text-white uppercase text-[10px] cursor-pointer"
            >
                add documents
            </button>
        </div>
    );
}


export function LocationAsset() {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    name="lat"
                    id="lat"
                    placeholder="latitude"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
                <input
                    type="text"
                    name="long"
                    id="long"
                    placeholder="longitude"
                    className="p-2 border border-gray-400 rounded-md w-full"
                />
            </div>
            <AccessInfoMaps lat={10} long={-8} />
            <textarea
                name="locationdetails"
                id="locationdetails"
                placeholder="put your location details here"
                className="p-2 border border-gray-400 rounded-md w-full resize-none"
                rows={6}
            />
        </div>
    )
}

function SimpleToggle(
    { val, setVal }:
        { val: boolean, setVal: (v: boolean) => void }
) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={val}
                onChange={(e) => setVal(e.target.checked)}
                className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        </label>
    );
}

export function RuleAssetHolder() {
    const [sellSharing, setSellSharing] = React.useState(false);
    const [needDp, setNeedDp] = React.useState(false);
    const { setModalKind } = React.useContext(ModalContext);
    return (
        <div className="space-y-4">
            <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                <p>Allowed Asset holder to sell their token</p>
                <SimpleToggle val={sellSharing} setVal={setSellSharing} />
            </div>
            {sellSharing &&
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${sellSharing ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <div className="px-2 space-y-3">
                        <input
                            type="text"
                            name="sellprice"
                            id="sellprice"
                            placeholder="Sell Shring Price"
                            className="p-2 border border-gray-200 rounded-lg"
                        />
                        <div>
                            <div className="flex justify-between items-center pr-2">
                                <p>Token Holder need vote first to sell their sharing</p>
                            </div>
                            <select
                                className="border border-gray-400 p-2 w-full rounded"
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                    </div>
                </div>
            }

            <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                <p>To Buy This Asset Token the buyer need to proceed Down Payment First</p>
                <SimpleToggle val={needDp} setVal={setNeedDp} />
            </div>
            {needDp &&
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${needDp ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <div className="px-2 space-y-3">
                        <input
                            type="text"
                            name="sellprice"
                            id="sellprice"
                            placeholder="Minimal Down Payment Percentage Price (%)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                        <input
                            type="text"
                            name="sellprice"
                            id="sellprice"
                            placeholder="Down Payment Cashback Percentage (%)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                        <input
                            type="text"
                            name="dpmaturity"
                            id="dpmaturity"
                            placeholder="Down Payment Maturity Time or Deadline (day)"
                            className="p-2 w-full border border-gray-200 rounded-lg"
                        />
                    </div>
                </div>
            }
            <div className="border-b px-2 py-3 border-gray-300">
                <label
                    htmlFor="fpmaturity"
                >
                    After Approval Proposal Succeded, buyer must finished remaining payment until
                </label>
                <input
                    type="text"
                    name="fpmaturity"
                    id="fpmaturity"
                    placeholder="... (days)"
                    className="p-2 w-full border border-gray-200 rounded-lg"
                />
            </div>

            <div className="border-b px-2 py-3 border-gray-300">
                <label
                    htmlFor="ownershipmaturity"
                >
                    Every Token Holder will have their own token in this asset until
                </label>
                <input
                    type="text"
                    name="ownershipmaturity"
                    id="ownershipmaturity"
                    placeholder="... (days)"
                    className="p-2 w-full border border-gray-200 rounded-lg"
                />
            </div>
            <div>
                <div className="border-b px-2 py-3 border-gray-300 flex items-center justify-between">
                    <p >Add Another Details here</p>
                    <button className="p-1 rounded-full background-dark cursor-pointer" onClick={() => setModalKind(ModalKindEnum.addruledetails)}>
                        <Plus size={12} color="white" />
                    </button>
                </div>
            </div>

        </div>
    );
}

export function TermsAndCondition() {
    return (
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
    );
}