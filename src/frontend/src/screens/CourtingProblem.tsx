import { Gavel } from "lucide-react";
import { MainLayout } from "../components/main-layout";
import { useParams } from "react-router-dom";
import React from "react";
import { backendService } from "../services/backendService";
import { Report } from "../types/rwa";
import { LoaderComponent } from "../components/LoaderComponent";
import ErrorDataNotFetched from "../components/error-nodata";
import { CourtingProblemCard } from "../components/courtingproblem/courting-problem-card";

function CourtingProblem() {
  const { reportid } = useParams<{ reportid: string }>();
  const [fetchedReport, setFetchedReport] = React.useState<Report[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      if (!reportid) {
        return;
      }
      try {
        const res = await backendService.getReportById(reportid);
        setFetchedReport(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, [])

  if (isLoading) return <LoaderComponent fullScreen={true} />

  if (!fetchedReport || fetchedReport.length === 0) {
    return <ErrorDataNotFetched />;
  }

  return (
    <MainLayout>
      <div className="p-5">
        <div className="mt-8 space-y-4">
          <div className="p-5 space-y-3 border border-gray-300 rounded-md">
            <div className="flex space-x-3 items-center">
              <Gavel size={32} />
              <h1 className="text-3xl">Asset Reporting History</h1>
            </div>
            <p className="text-gray-600">Current problem that the asset facing</p>
          </div>
          <div className="p-5 space-y-3 border border-gray-300 rounded-md">
            {fetchedReport.map((r, idx) =>
              <CourtingProblemCard report={r} key={idx} />
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default CourtingProblem;