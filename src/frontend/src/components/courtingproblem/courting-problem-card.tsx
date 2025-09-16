import React from "react";
import { Report } from "../../types/rwa";
import { formatMotokoTime, getReportTypeText, ReduceCharacters } from "../../helper/rwa-helper";

export function CourtingProblemCard({ report }: { report: Report }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="rounded-md border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <p className="text-lg">{report.content}</p>
                    <p className="text-[12px]">{formatMotokoTime(report.created)}</p>
                </div>
                <p className="text-sm font-semibold">{getReportTypeText(report.reportType)}</p>
            </div>
            <div className={`space-y-2 ${isOpen ? '' : 'hidden'} `}>
                <p className="text-sm">{report.description}</p>
                <div className="space-y-2">
                    {report.evidence.length !== 0 ? (
                        <div className="flex items-center space-x-4">
                            <p className="p-2 text-sm bg-black rounded-md w-fit text-white">Evidence</p>
                            {report.evidence[0].footPrintFlow.length !== 0 &&
                                < div className="flex items-center space-x-1">
                                    <p className="p-2 text-sm bg-gray-100 w-fit rounded-md">hash clarity founded</p>
                                    <p className="p-2 text-sm bg-gray-50 w-fit rounded-md">{ }</p>
                                </div>
                            }

                            {report.evidence[0].hashclarity.length !== 0 &&
                                <div className="flex items-center space-x-1">
                                    <p className="p-2 text-sm bg-gray-100 w-fit rounded-md">hash clarity founded</p>
                                    <p className="p-2 text-sm bg-gray-50 w-fit rounded-md">{ReduceCharacters(report.evidence[0].hashclarity[0] ?? '')}</p>
                                </div>
                            }
                        </div>
                    ) : (
                        <div>
                            <p className="p-2 text-sm bg-gray-400 rounded-md w-fit">No Evidence</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}