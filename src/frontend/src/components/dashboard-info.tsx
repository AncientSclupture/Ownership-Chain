import { PlatformStats } from "../types/rwa";
import findwaylogo from "../assets/findwaylogo.png";
import { Link } from "react-router-dom";

export function DashboardInfo({retreivedData}: {retreivedData : PlatformStats | null}){
    return(
        <div className="bg-white border border-gray-200 shadow rounded-2xl p-5 space-y-5  ">
            <h1 className="text-lg font-semibold">Dashboard Summary</h1>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-500">Total Assets</p>
              <p>{retreivedData?.totalAssets}</p>
              <p className="text-gray-500">Transactions</p>
              <p>{retreivedData?.totalTransactions}</p>
              <p className="text-gray-500">Locked Value</p>
              <p>{retreivedData?.totalValueLocked}</p>
              <p className="text-gray-500">Total Users</p>
              <p>{retreivedData?.totalUsers}</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={findwaylogo} alt="FindWayLogo" className="w-[30%] aspect-square" />
              <p>
                Solution for High-value assets theft, unclear ownership, and
                lack of transparent and consistency shared ownership systems,
                leading to disputes and limiting fair, inclusive access
                to investment and co-ownership.
              </p>
            </div>
            <button className="font-semibold text-white p-2 bg-blue-500 rounded-lg hover:bg-blue-800 cursor-pointer">
              <Link to={'/marketplace'}>Explore Assets</Link>
            </button>
          </div>
    )
}