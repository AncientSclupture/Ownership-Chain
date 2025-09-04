import { CircleX, FileCheck, Upload } from "lucide-react";
import React from "react";
import { ReduceCharacters } from "../utils/rwa-hepler";

export function AgainsPlagiarism({ hashComplain }: { hashComplain: [string] | [] | undefined }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hashComp, setHashComp] = React.useState<[string] | [] | undefined>(hashComplain);
    const [pubKey, setPubkey] = React.useState<string>("");
    const [privKey, setPrivKey] = React.useState<File | null>(null);
    const [isMatchHash, setIsMatchHash] = React.useState(false)
    const [isMatchSignature, setIsMatchSignature] = React.useState(false)

    return (
        <div className="w-full">
            <div className={`p-4 rounded-md border border-gray-300 w-full ${isOpen ? 'space-y-4' : 'space-y-0'}`}>
                <div
                    className="cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Document Hash Clarity
                </div>
                <div className={`space-y-3 ${isOpen ? 'block' : 'hidden space-y-0'}`}>
                    <div className="space-y-1">
                        <p className="font-semibold">
                            hashcomplainer
                        </p>
                        <div className="flex border border-gray-300 rounded-md p-2">
                            <input
                                type="text" name="hashcomplainer" id="hashcomplainer"
                                className="w-full"
                                disabled
                                placeholder="hashvalue"
                                value={hashComplain ? ReduceCharacters(hashComplain?.toString(), 25) : ''}
                            />
                            {isMatchHash ? <FileCheck /> : <CircleX color="red" />}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">
                            docsignature
                        </p>
                        <div className="flex border border-gray-300 rounded-md p-2">
                            <input
                                type="text" name="docsignature" id="docsignature"
                                className="w-full"
                                disabled
                                placeholder="doc signature"
                            />
                            {isMatchHash ? <FileCheck /> : <CircleX color="red" />}
                        </div>
                    </div>
                    <label
                        htmlFor="file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 rounded-lg border-gray-300 ${privKey ? 'bg-blue-300' : 'border-dashed cursor-pointer hover:bg-gray-50'}`}
                    >
                        <Upload className={`${!privKey ? 'w-8 h-8 text-gray-400' : 'hidden'}`} />
                        <span className="mt-2 text-sm text-gray-600">
                            {!privKey ? "Click to upload your privatekey" : privKey.name}
                        </span>
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="text"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                setPrivKey(f);
                            }}
                        />
                    </label>
                </div>

            </div>
        </div>
    );
}

export function AgainsUserFlow() {
    return (
        <div className="w-full">
            <div className="p-4 rounded-md border border-gray-300 w-full cursor-pointer">
                against user flow fraud analysis
            </div>
        </div>
    );
}