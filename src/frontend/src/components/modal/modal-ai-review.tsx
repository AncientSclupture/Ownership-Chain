import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { useNavigate, useParams } from "react-router-dom";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import { formatAiReview } from "../../helper/rwa-helper";

export function ModalAIReview() {
    const { setModalKind } = React.useContext(ModalContext);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = React.useState(true);
    const [aiResult, setAiResult] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);

    const handleClose = () => setModalKind(null);
    const handleGoToComplaint = () => {
        setModalKind(null);
        navigate("/protected-complaint");
    };

    React.useEffect(() => {
        async function init() {
            try {
                if (!id) throw new Error("Asset ID is missing");
                setLoading(true);
                setError(null);
                const res = await backendService.getAiReview(id);
                setAiResult(res || "AI tidak memberikan hasil untuk aset ini.");
            } catch (err: any) {
                console.error("Error fetching AI review:", err);
                setError(err?.message || "Gagal memuat hasil AI review.");
            } finally {
                setLoading(false);
            }
        }

        init();
    }, [id]);

    // Loader view
    if (loading)
        return (
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg text-center animate-fadeIn">
                <LoaderComponent />
                <p className="mt-4 text-gray-500 text-sm">
                    Loading AI analysis results...
                </p>
            </div>
        );

    // Error view
    if (error)
        return (
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg text-center animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-2 text-red-600">
                    There is an error happened
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
                >
                    Close
                </button>
            </div>
        );

    // Normal view
    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-[95vw] max-w-2xl animate-fadeIn max-h-[85vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    AI Asset Review
                </h2>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>
            </div>

            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                Here are the results of the AI's automated analysis and assessment of this asset:
            </p>

            <div
                className="text-gray-800 text-sm md:text-base leading-relaxed space-y-4 rounded-xl p-5 bg-gray-50 mb-6"
                dangerouslySetInnerHTML={{ __html: formatAiReview(aiResult) }}
            />

            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
                >
                    Cancle
                </button>
                <button
                    onClick={handleGoToComplaint}
                    className="px-5 py-2.5 rounded-xl background-dark text-white transition font-medium shadow-sm"
                >
                    Send Complaint
                </button>
            </div>
        </div>
    );
}
