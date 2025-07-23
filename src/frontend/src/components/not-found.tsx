import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="w-full flex h-[88vh] justify-center items-center">
            <div className="p-10 rounded-lg border border-gray-300 shadow-lg flex flex-col items-start space-y-8">
                <p className="text-2xl font-bold">Not Found</p>
                <div className="text-gray-500 space-y-2">
                    <p>The Assets you looking for is not found, or not available</p>
                    <p>or May Be you redirect to the wrong place</p>
                </div>
                <div className="font-semibol bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-500"><Link to={"/marketplace"}>Back To Market Place</Link></div>
            </div>
        </div>
    )
}