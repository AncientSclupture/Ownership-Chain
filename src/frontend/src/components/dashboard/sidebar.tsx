import { Home, Wallet, BarChart3, User, AlertTriangle, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { label: "My Asset", icon: <Home size={18} />, path: "/protected-dashboard" },
  { label: "Dividends", icon: <BarChart3 size={18} />, path: "/protected-dividend" },
  { label: "Buy & Sell", icon: <Wallet size={18} />, path: "/protected-buyandsell" },
  { label: "Proposal", icon: <FileText size={18} />, path: "/protected-proposal" },
  { label: "Profile & Portfolio", icon: <User size={18} />, path: "/protected-profile" },
  { label: "Liquidation", icon: <AlertTriangle size={18} />, path: "/protected-liquidation" },
];

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 px-2">Dashboard</h2>
      <nav className="flex flex-col space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-100 text-[#00081a] font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
