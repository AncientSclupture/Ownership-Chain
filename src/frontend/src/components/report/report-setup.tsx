import { Files, FileUp, UserX } from "lucide-react";
import React from "react";

export enum ReportEnum {
    user = "user",
    asset = "asset",
}

export interface ReportFlowWrapper {
    name: ReportEnum;
    component: React.ReactNode;
}

export function ReportOptions(
    { reportOpt, setReportOpt }: {
        reportOpt: ReportEnum | null, setReportOpt: React.Dispatch<React.SetStateAction<ReportEnum | null>>
    }
) {

    function handleSetOpt(d: ReportEnum | null) {
        if (reportOpt === d) {
            setReportOpt(null);
            return
        }
        setReportOpt(d);
    }

    return (
        <div className="p-5 space-y-3 border border-gray-300 rounded-md">
            <div className="flex space-x-3 items-center">
                <Files size={24} />
                <h1 className="text-xl">Reporting Options</h1>
            </div>
            <div
                onClick={() => handleSetOpt(ReportEnum.asset)}
                className={`cursor-pointer border ${reportOpt === ReportEnum.asset ? 'bg-gray-200' : 'hover:bg-gray-100'} p-3 rounded-md border-gray-200 space-y-2`}
            >
                <div className="space-x-2 flex items-center text-gray-700 text-sm">
                    <FileUp size={18} />
                    <p>Asset Report</p>
                </div>
                <p className="text-sm">Reporting that include asset and token ownership</p>
            </div>
            <div
                onClick={() => handleSetOpt(ReportEnum.user)}
                className={`cursor-pointer border ${reportOpt === ReportEnum.user ? 'bg-gray-200' : 'hover:bg-gray-100'} p-3 rounded-md border-gray-200 space-y-2`}
            >
                <div className="space-x-2 flex items-center text-gray-700 text-sm">
                    <UserX size={18} />
                    <p>User Report</p>
                </div>
                <p className="text-sm">Reporting that include about user actifity</p>
            </div>
        </div>
    )
}

export function ReportFlowWrapper(
    { currentOpt, listcontent }: { currentOpt: ReportEnum | null, listcontent: ReportFlowWrapper[] }
) {
    if (currentOpt === null) return (
        <div className="mt-8 mb-4">
            <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                <div className="flex space-x-1 items-center justify-center">
                    <h1 className="text-gray-900 text-center">No Report Type Choosen!!</h1>
                    <p className="text-gray-600 text-center">Choose your report type</p>
                </div>
            </div>
        </div>
    )
    return (
        <div className="mt-8 mb-4">
            {listcontent.find(c => c.name === currentOpt)?.component}
        </div>
    );
}