export function AssetAndOwnerDashboard() {
    return (
        <div className="space-y-5">
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="text-gray-600 space-y-3">
                    <h1 className="text-xl">My Assets</h1>
                    <div className="grid grid-cols-4 gap-5 border-b border-gray-700 pb-2 px-4">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Token</div>
                        <div>Date Purchaed</div>
                    </div>
                </div>


            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="text-gray-600 space-y-3">
                    <h1 className="text-xl">My Ownership</h1>
                    <div className="grid grid-cols-4 gap-5 border-b border-gray-700 pb-2 px-4">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Token</div>
                        <div>Date Purchaed</div>
                    </div>
                </div>
            </div>
        </div>
    )
}