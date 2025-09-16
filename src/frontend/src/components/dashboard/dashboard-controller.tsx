import React from "react";

export enum DashboardOption {
    selfinfo = "selfinfo",
    assetownership = "assetownership",
    income = "income",
    reporting = "reporting",
    createasset = "createasset",
    voteable = "voteable",
}

export function NavigationDashboard(
    { dashboardOpt, setDashboardOpt }: { dashboardOpt: DashboardOption, setDashboardOpt: React.Dispatch<React.SetStateAction<DashboardOption>> }
) {
    return (
        <div className="p-5 md:p-8">
            <div className="text-gray-700 flex space-x-5 items-center w-full">
                <div
                    onClick={() => setDashboardOpt(DashboardOption.selfinfo)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.selfinfo
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    Self Information
                </div>
                <div
                    onClick={() => setDashboardOpt(DashboardOption.assetownership)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.assetownership
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    Asset and Ownership
                </div>
                <div
                    onClick={() => setDashboardOpt(DashboardOption.income)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.income
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    Income
                </div>
                <div
                    onClick={() => setDashboardOpt(DashboardOption.reporting)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.reporting
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    Reporting
                </div>
                <div
                    onClick={() => setDashboardOpt(DashboardOption.createasset)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.createasset
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    New Asset
                </div>
                <div
                    onClick={() => setDashboardOpt(DashboardOption.voteable)}
                    className={`cursor-pointer p-1 border-b ${dashboardOpt === DashboardOption.voteable
                        ? "border-black text-black"
                        : "border-transparent hover:text-black hover:border-black" // tidak aktif → transparan, muncul saat hover
                        }`}
                >
                    Voteable
                </div>
            </div>
        </div>
    )
}

export interface DashboardSectionWrapper {
    name: DashboardOption;
    component: React.ReactNode;
}

export default function DashboardComponentWrapper({ listcontent, current }: { current: DashboardOption, listcontent: DashboardSectionWrapper[] }) {
    return (
        <div className="bg-gray-50 px-2 py-5 md:px-8">
            {listcontent.find(c => c.name === current)?.component}
        </div>
    );
}
