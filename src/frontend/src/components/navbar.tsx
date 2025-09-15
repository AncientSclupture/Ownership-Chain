import React from "react";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import { ModalContext, ModalKindEnum } from "../context/ModalContext";

export function NavigationBar() {
    const { setNotificationData } = React.useContext(NotificationContext);
    const { isAuthenticated, login } = React.useContext(AuthContext);
    const { setModalKind } = React.useContext(ModalContext);

    let navigate = useNavigate();

    function handleDirect(slash: string) {
        if (slash == "/") {
            navigate(slash);
            return;
        }

        if (!isAuthenticated) {
            setNotificationData({
                title: "cannot direct another page or screen",
                description: "you need to login fisrt, use connect my slef button to login!",
                position: "bottom-right"
            })
            return
        };

        navigate(slash)
    }

    function handleConnectMe() {
        if (!isAuthenticated) {
            login()
            return;
        } else {
            setModalKind(ModalKindEnum.logout);
        }
    };

    return (
        <div className="px-8 py-5 flex items-center justify-between background-dark text-white">
            <div className="text-xl">OwnershipChainer</div>
            <div className="flex items-center space-x-8">
                <div
                    onClick={() => handleDirect("/")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    Browse
                </div>
                <div
                    onClick={() => handleDirect("/dashboard")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    My Assets
                </div>
                <div
                    onClick={() => handleDirect("/report")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    Court
                </div>
                <div
                    onClick={() => handleConnectMe()}
                    className="bg-gray-700 p-2 md:px-3 rounded-md hover:bg-gray-400 cursor-pointer text-white"
                >
                    {isAuthenticated ? 'Connected' : 'Connect My Self'}
                </div>
            </div>
        </div>
    );
}