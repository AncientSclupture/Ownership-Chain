import { FileLock } from "lucide-react";
import { MainLayout } from "../../components/main-layout";
import ComplaintAssetForm from "../../components/complaint-asset/complaint-asset";

export default function ComplaintAssetScreen() {
    return (
        <MainLayout needProtection={true}>
            <div className="p-10">
                <div className="flex items-center space-x-1">
                    <p className="text-gray-600 cursor-pointer hover:text-gray-900">Home</p>
                    <p className="font-semibold">{">"}</p>
                    <p className="text-gray-600 cursor-pointer hover:text-gray-900">Assets</p>
                    <p className="font-semibold">{">"}</p>
                    <p className="text-gray-600 cursor-pointer hover:text-gray-900">Report Center</p>
                </div>

                <div className="mt-8">
                    <div className="p-5 space-y-3 border border-gray-300 rounded-md">
                        <div className="flex space-x-3 items-center">
                            <FileLock size={32} />
                            <h1 className="text-3xl">Ownership Reporting Center</h1>
                        </div>
                        <p className="text-gray-600">Report issues with assets to maintain marketplace integrity</p>
                    </div>
                </div>

                <div className="mt-8 mb-4">
                    <ComplaintAssetForm />
                </div>
            </div>
        </MainLayout>
    )
}