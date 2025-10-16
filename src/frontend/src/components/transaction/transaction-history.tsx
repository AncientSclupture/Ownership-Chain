export function TransactionHistory() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
            <p className="text-gray-600 mb-6">Review all past asset transactions.</p>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 border-b text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Asset ID</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3">2025-10-16</td>
                            <td className="px-4 py-3">Buy</td>
                            <td className="px-4 py-3">#AS12345</td>
                            <td className="px-4 py-3">10</td>
                            <td className="px-4 py-3 text-green-600 font-medium">Completed</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3">2025-10-12</td>
                            <td className="px-4 py-3">Transfer</td>
                            <td className="px-4 py-3">#AS87234</td>
                            <td className="px-4 py-3">3</td>
                            <td className="px-4 py-3 text-yellow-600 font-medium">Pending</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
