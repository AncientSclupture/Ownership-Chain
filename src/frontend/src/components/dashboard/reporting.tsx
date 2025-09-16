import React from "react"
import { backendService } from "../../services/backendService";
import { Report, Asset } from "../../types/rwa";
import { LoaderComponent } from "../LoaderComponent";
import { formatMotokoTime, getReportTypeText, ReduceCharacters } from "../../helper/rwa-helper";
import ProtectedPage from "../protected-component";
import { Signature } from "lucide-react";

function ReportComponent({ report }: { report: Report }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hashClarityVerification, setHashClarityVerification] = React.useState<boolean>(
        (report.evidence[0]?.hashclarity?.length ?? 0) > 0
    );

    const [evidenceVerification, setEvidenceVerification] = React.useState<boolean>(
        (report.evidence[0]?.evidencecontent?.length ?? 0) > 0
    );

    const [footprintVerification, setFootprintVerification] = React.useState<boolean>(
        (report.evidence[0]?.footPrintFlow?.length ?? 0) > 0
    );

    console.log(footprintVerification, setEvidenceVerification, setFootprintVerification, setHashClarityVerification)

    return (
        <div className="border border-gray-400 p-5 rounded-md">
            <div className="flex w-full justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{ReduceCharacters(report.content, 30)}</p>
                    <p className="text-sm">{ReduceCharacters(report.id, 30)}</p>
                </div>
                <p>{getReportTypeText(report.reportType)}</p>
            </div>
            <div className={`space-y-4 ${isOpen ? '' : 'hidden'}`}>
                <p className="text-sm text-gray-900">{formatMotokoTime(report.created)}</p>
                <div className="text-sm space-y-2">
                    <p>{report.content}</p>
                    <p>{report.description}</p>
                </div>
                <div>
                    {report.evidence.length !== 0 &&
                        <div className="space-y-3">
                            {report.evidence[0].footPrintFlow.length !== 0 &&
                                <div>
                                    <p>User Flow Foot Print is being scored as</p>
                                    <div>
                                        <p className="text-sm font-semibold">{report.evidence[0].footPrintFlow}</p>
                                    </div>
                                </div>
                            }
                            {report.evidence[0].hashclarity.length !== 0 &&
                                <div>
                                    <p>Reporter successfully verify your document! Is this realy your document?</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-red-700 text-sm font-semibold">{ReduceCharacters(report.evidence[0].hashclarity[0])}</p>
                                        <button className={`p-2 ${hashClarityVerification ? 'bg-gray-300' : 'bg-green-500'} rounded-md cursor-pointer`}><Signature /></button>
                                    </div>
                                </div>
                            }
                            {report.evidence[0].evidencecontent.length !== 0 &&
                                <div className="flex flex-col space-y-2">
                                    <p>Evidence that user proposed to you</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">{ReduceCharacters(report.evidence[0].evidencecontent[0])}</p>
                                        <button className={`p-2 ${evidenceVerification ? 'bg-gray-300' : 'bg-green-500'} rounded-md cursor-pointer`}><Signature /></button>
                                    </div>
                                </div>
                            }
                            <div className="space-y-2">
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="clafication">clarification</label>
                                    <textarea
                                        name="clafication" id="clafication"
                                        className="border border-gray-300 rounded-md p-2 resize-none h-[30vw] md:h-[12vw]"
                                    />
                                </div>
                            </div>
                            <button
                                className="p-2 text-white rounded-md background-dark w-full md:w-[10vw]"
                            >
                                Solve
                            </button>
                        </div>
                    }
                </div>

                <button
                    className="text-sm font-bold"
                >
                    Sign Every Hash to defend your self, with your private signature key
                </button>
            </div>
        </div >
    );
}

export function ReportingDashboard() {
    const [report, setReport] = React.useState<Report[]>([]);
    const [asset, setAsset] = React.useState<Asset | null>(null)
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await backendService.getMyAssetReport();
                console.log(res);
                if (res.length === 0) {
                    return;
                }
                const resAsset = await backendService.getAssetById(res[0].id)
                setAsset(resAsset)
                setReport(res)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();

    }, []);

    if (isLoading) {
        return <LoaderComponent fullScreen={true} />
    }

    if (!report === false && !asset) {
        return <ProtectedPage />
    }

    return (
        <div className="p-4 border border-gray-200 rounded-md bg-white">
            <h1 className="text-xl text-gray-600">Reporting Dashboard</h1>
            {report.length !== 0 ? (
                <div className="space-y-5 my-5">
                    {report.map((r, idx) =>
                        <ReportComponent report={r} key={idx} />
                    )}
                </div>
            ) : (
                <>
                    <div className="w-full flex justify-center items-center md:h-[12vw] bg-gray-200">no report data</div>
                </>
            )}
        </div>
    )
}