import React from "react";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ModalContext, ModalKindEnum } from "../context/ModalContext";
import { ChevronDown, Menu, X } from "lucide-react";
import { ReduceCharacters } from "../helper/rwa-helper";

export function NavigationBar() {
    const { setNotificationData } = React.useContext(NotificationContext);
    const { isAuthenticated, login, principal } = React.useContext(AuthContext);
    const { setModalKind } = React.useContext(ModalContext);
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    function handleDirect(slash: string) {
        if (slash === "/") {
            navigate(slash);
            setShowDropdown(false);
            setShowMobileMenu(false);
            return;
        }

        if (!isAuthenticated) {
            setNotificationData({
                title: "Cannot direct to another page",
                description: "You need to login first. Use 'Connect My Self' button to login!",
                position: "bottom-right",
            });
            return;
        }

        navigate(slash);
        setShowDropdown(false);
        setShowMobileMenu(false);
    }

    function handleConnectMe() {
        if (!isAuthenticated) {
            login();
        } else {
            setModalKind(ModalKindEnum.logout);
        }
        setShowMobileMenu(false);
    }

    return (
        <nav className="background-dark text-white px-6 py-4 flex items-center justify-between relative">
            {/* Logo */}
            <div
                className="text-xl font-semibold cursor-pointer"
                onClick={() => handleDirect("/")}
            >
                OwnershipChainer
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                <div
                    onClick={() => handleDirect("/market-place")}
                    className="cursor-pointer hover:text-gray-300"
                >
                    Browse
                </div>
                <div
                    onClick={() => handleDirect("/protected-dashboard")}
                    className="cursor-pointer hover:text-gray-300"
                >
                    Dashboard
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-1 cursor-pointer hover:text-gray-300 select-none"
                    >
                        <span>Actions</span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
                    </div>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50">
                            <div
                                onClick={() => handleDirect("/action-create")}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Create Asset
                            </div>
                            <div
                                onClick={() => handleDirect("/action-luquidation")}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Liquidation Resolve
                            </div>
                            <div
                                onClick={() => handleDirect("/action-transaction")}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Transactions
                            </div>
                            <div
                                onClick={() => handleDirect("/action-voting")}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Voting
                            </div>
                        </div>
                    )}
                </div>

                {/* Connect Button */}
                <div
                    onClick={handleConnectMe}
                    className={`bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-500 cursor-pointer text-white ${isAuthenticated ? 'text-sm' : ''}`}
                >
                    {isAuthenticated && principal ? ReduceCharacters(principal, 5) : "Connect"}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div
                className="md:hidden cursor-pointer"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </div>

            {/* Mobile Dropdown Menu */}
            {showMobileMenu && (
                <div className="absolute top-full left-0 w-full background-dark border-t border-gray-800 flex flex-col space-y-2 py-4 px-6 md:hidden z-50">
                    <div
                        onClick={() => handleDirect("/market-place")}
                        className="hover:text-gray-300 cursor-pointer"
                    >
                        Browse
                    </div>
                    <div
                        onClick={() => handleDirect("/protected-dashboard")}
                        className="hover:text-gray-300 cursor-pointer"
                    >
                        Dashboard
                    </div>

                    {/* Nested Dropdown in Mobile */}
                    <div>
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex justify-between items-center cursor-pointer hover:text-gray-300"
                        >
                            <span>Actions</span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
                            />
                        </div>
                        {showDropdown && (
                            <div className="mt-2 ml-4 flex flex-col space-y-1">
                                <div
                                    onClick={() => handleDirect("/action-create")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    Create Asset
                                </div>
                                <div
                                    onClick={() => handleDirect("/action-luquidation")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    Liquidation Resolve
                                </div>
                                <div
                                    onClick={() => handleDirect("/action-transaction")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    Transactions
                                </div>
                                <div
                                    onClick={() => handleDirect("/action-voting")}
                                    className="hover:text-gray-300 cursor-pointer"
                                >
                                    Voting
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        onClick={handleConnectMe}
                        className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-500 cursor-pointer text-center mt-2"
                    >
                        {isAuthenticated && principal ? ReduceCharacters(principal, 5) : "Connect"}
                    </div>
                </div>
            )}
        </nav>
    );
}
