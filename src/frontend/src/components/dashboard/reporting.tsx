import React from "react"
import { backendService } from "../../services/backendService";
import { Report } from "../../types/rwa";
import { LoaderComponent } from "../LoaderComponent";
import { ReduceCharacters } from "../../helper/rwa-helper";

export function ReportingDashboard() {
    const [report, setReport] = React.useState<Report[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await backendService.getMyAssetReport();
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

    return (
        <div className="p-4 border border-gray-200 rounded-md bg-white">
            <h1 className="text-xl text-gray-600">Reporting Dashboard</h1>
            {report.length !== 0 ? (
                <>
                    <div className="my-5">
                        <div className="pb-2 border-b border-gray-600 grid grid-cols-4 px-5 gap-5">
                            <div>Report ID</div>
                            <div>Report Name</div>
                            <div>Asset Report</div>
                            <div>Action</div>
                        </div>
                    </div>
                    <div className="my-5">
                        {report.map((r, idx) =>
                            <div className="pb-1 border-b border-gray-600 grid grid-cols-4 px-5 gap-5" key={idx}>
                                <div>{r.id}</div>
                                <div>{r.content}</div>
                                <div>{ReduceCharacters(r.description)}</div>
                                <div>
                                    <button>Go To</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full flex justify-center items-center md:h-[12vw] bg-gray-200">no report data</div>
                </>
            )}
        </div>
    )
}