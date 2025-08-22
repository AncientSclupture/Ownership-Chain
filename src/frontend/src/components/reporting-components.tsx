import { Files, FileScan, Footprints, Hash } from "lucide-react";
import { ContentReportCenterInterface, ReportCenterEnum } from "../types/ui";

export function ReportCenterContent({ selectedTab, contentLists }: { selectedTab: ReportCenterEnum; contentLists: ContentReportCenterInterface[] }) {
    return (
        <div>
            {contentLists.find(c => c.name === selectedTab)?.component}
        </div>
    )
}

export function PlagiarismReporting() {
    return (
        <div className="space-y-4">

            <div className="flex items-center space-x-2 mb-8">
                <Files />
                <h1 className="text-lg">Plagiarism Reporting Options</h1>
            </div>


            <div className="flex flex-col space-y-2">
                <label htmlFor="identity" className="text-gray-600">Asset id</label>
                <input type="text" name="identity" id="identity" placeholder="asset-id.." className="p-2 border rounded-md border-gray-400" />
            </div>

            <div className="space-y-4 w-full md:space-y-0 md:space-x-5 md:flex">
                <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                    <div className="flex items-center space-x-2">
                        <FileScan size={20} />
                        <h2>Straight Report</h2>
                    </div>
                    <p className="text-sm text-gray-600">Submit evidence directly</p>
                </div>

                <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                    <div className="flex items-center space-x-2">
                        <Hash size={20} />
                        <h2>Document Hash Clarity</h2>
                    </div>
                    <p className="text-sm text-gray-600">Compare document hash</p>
                </div>
            </div>

            <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="complainer">Complainer</label>
                    <input type="text" name="complainer" id="complainer" placeholder="me" className="p-2 border rounded-md border-gray-400" disabled />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="reporttype">Report type</label>
                    <select
                        name="reporttype"
                        id="complainer"
                        className="border border-gray-400 p-2 w-full rounded"
                    >
                        <option>Scam</option>
                        <option>Fraud</option>
                        <option>Legality</option>
                        <option>Plagiarism</option>
                        <option>Bankrupting</option>
                    </select>
                </div>
            </div>

            <button className="p-2 rounded-md background-dark text-white w-full cursor-pointer">Submit Report</button>
        </div>
    )
}

export function FraudReporting() {
    return (
        <div className="space-y-4">

            <div className="flex items-center space-x-2 mb-8">
                <Files />
                <h1 className="text-lg">Plagiarism Reporting Options</h1>
            </div>


            <div className="flex flex-col space-y-2">
                <label htmlFor="identity" className="text-gray-600">User target identity</label>
                <input type="text" name="identity" id="identity" placeholder="user-id.." className="p-2 border rounded-md border-gray-400" />
            </div>

            <div className="space-y-4 w-full md:space-y-0 md:space-x-5 md:flex">
                <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                    <div className="flex items-center space-x-2">
                        <FileScan size={20} />
                        <h2>Straight Report</h2>
                    </div>
                    <p className="text-sm text-gray-600">Submit evidence directly</p>
                </div>

                <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                    <div className="flex items-center space-x-2">
                        <Footprints size={20} />
                        <h2>User Flow Relation</h2>
                    </div>
                    <p className="text-sm text-gray-600">Use AI (graph neural network) to get the user footprints relations</p>
                </div>
            </div>

            <div className="p-4 rounded-md border border-gray-400 space-y-2 cursor-pointer w-full">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="complainer">Complainer</label>
                    <input type="text" name="complainer" id="complainer" placeholder="me" className="p-2 border rounded-md border-gray-400" disabled />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="reporttype">Report type</label>
                    <select
                        name="reporttype"
                        id="complainer"
                        className="border border-gray-400 p-2 w-full rounded"
                    >
                        <option>Scam</option>
                        <option>Fraud</option>
                    </select>
                </div>

                <button className="p-2 rounded-md background-dark text-white w-full cursor-pointer">Submit Report</button>
            </div>
        </div>
    )
}