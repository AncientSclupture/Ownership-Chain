import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { AuthContext } from "../../context/AuthContext";

export default function ModalLogout() {
    const { setModalKind } = React.useContext(ModalContext);
    const { logout } = React.useContext(AuthContext)

    const handleCancel = () => {
        setModalKind(null);
    };

    const handleLogout = async () => {
        setModalKind(null);
        await logout();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Logout Confirmation</h2>
            <p className="text-gray-600">Are you sure to logout from this account?</p>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-gray-800"
                >
                    Cancle
                </button>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-white"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
