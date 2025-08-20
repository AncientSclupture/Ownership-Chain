import { ChevronDown, ChevronRight, FileLock2, X } from "lucide-react";
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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
                    <p>check</p>
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

export function DocumentAsset() {
    const { setModalKind } = React.useContext(ModalContext);
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileLock2 />
                        <div>
                            hallo name
                        </div>
                    </div>
                    <div className="p-2 bg-red-200 rounded-full flex items-center justify-center cursor-pointer" >
                        <X color="red" size={15} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileLock2 />
                        <div>
                            hallo name
                        </div>
                    </div>
                    <div className="p-2 bg-red-200 rounded-full flex items-center justify-center cursor-pointer" >
                        <X color="red" size={15} />
                    </div>
                </div>
            </div>
            <button
                onClick={() => setModalKind(ModalKindEnum.adddocument)}
                className="bg-black p-2 rounded-md text-white uppercase text-[10px] cursor-pointer"
            >
                add documents
            </button>
        </div>
    )
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