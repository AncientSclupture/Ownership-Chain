import React from "react";
import { Link } from 'react-router-dom';

export function NavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [openNavbar, setOpenNavbar] = React.useState(false);

    return (
        <nav className={`w-full fixed top-5 z-50 justify-center items-center`}>
            <div className="w-full flex justify-center items-center">
                <div className="w-[80vw] bg-white rounded shadow-lg">
                    <div className="px-5 py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-2 md:w-[70%]">
                            <h1
                                className="font-bold text-lg cursor-pointer"
                                onClick={() => setOpenNavbar(!openNavbar)}
                            >
                                <span className="text-primary-dark">OwnerShip</span>{" "}
                                <span className="text-primary">Chainner</span>
                            </h1>
                        </div>

                        <div className="hidden md:flex space-x-6 text-gray-700 mr-4">
                            <Link to={"/"}>Marketplace</Link>
                            {!isLoggedIn && <Link to={"/auth"}>Login</Link>}
                            {isLoggedIn && <Link to={"/dashboard"}>Dashboard</Link>}
                            {isLoggedIn && <Link to={"/report"}>Courting</Link>}
                        </div>

                        <div
                            onClick={() => console.log("Theme toggle clicked")}
                            className="cursor-pointer hidden"
                        >
                            <label className="inline-flex items-center cursor-pointer space-x-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Light</span>
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Dark</span>
                            </label>
                        </div>
                    </div>

                    <div
                        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${openNavbar ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="bg-white px-5 pb-4 pt-2 space-y-3 border-t border-gray-200">
                            <Link to={'/'} className="block">
                                Marketplace
                            </Link>
                            {!isLoggedIn &&
                                <Link to={'/auth'} className="block">
                                    Login
                                </Link>
                            }
                            {isLoggedIn && <Link to={'/dashboard'} className="block">Dashboard</Link>}
                            {isLoggedIn && <Link to={'/report'} className="block">Courting</Link>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
