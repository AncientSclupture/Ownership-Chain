import { Link } from "react-router-dom";
import { MainLayout } from "./main-layout";

export default function ErrorDataNotFetched() {
    return (
        <MainLayout>
            <div className="w-full h-screen flex justify-center items-center">
                <div className="space-y-8 text-center">
                    {/* Title */}
                    <div className="text-2xl font-bold text-gray-800">
                        Oops! Something went wrong
                    </div>

                    {/* Possible reasons */}
                    <div className="text-gray-600 text-base space-y-2">
                        <p className="italic">Possible reasons:</p>
                        <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                            <li>The page you are looking for was not found (404)</li>
                            <li>Your internet connection is unstable or offline</li>
                            <li>The server is temporarily unavailable</li>
                            <li>There was an unexpected error fetching the data</li>
                        </ul>
                    </div>

                    {/* Back button */}
                    <Link
                        to="/"
                        className="inline-block w-[60vw] md:w-[30vw] py-3 rounded-md background-dark text-white text-lg md:text-xl font-medium justify-center items-center transition hover:opacity-90"
                    >
                        Back To Home Screen
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}