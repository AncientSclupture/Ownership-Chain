import { Check, X } from "lucide-react";
import { ModalContext } from "../../context/ModalContext";
import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function AskToLogoutModal() {
    const { setModalKind } = React.useContext(ModalContext);
    const { logout } = React.useContext(AuthContext);
    const { setNotificationData } = React.useContext(NotificationContext)

    let navigate = useNavigate();

    function logoutHandler() {
        try {
            logout();
            navigate("/");
            setNotificationData({
                title: 'successfully logged out',
                description: '',
                position: 'bottom-right'
            });
        } catch (error) {
            setNotificationData({
                title: 'falied to logged out',
                description: 'error happened',
                position: 'bottom-right'
            });
        } finally {
            setModalKind(null);
        }
    };
    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Logout</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => setModalKind(null)}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div>
                        <p className="text-gray-800 text-xl text-center mb-4">
                            Are you sure you want to log out?
                        </p>
                        <div className="space-y-1">
                            <p className="text-gray-600">Before logging out, please make sure that:</p>
                            <div className="flex items-center space-x-2">
                                <Check size={15} />
                                <p>All your progress has been saved</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Check size={15} />
                                <p>You don’t have any pending tasks</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Check size={15} />
                                <p>You’ve synced important data to your account</p>
                            </div>
                        </div>
                        <button
                            onClick={() => logoutHandler()}
                            className="p-2 mt-4 w-full text-white background-dark rounded-md cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}