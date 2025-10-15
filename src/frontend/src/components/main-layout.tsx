import React from "react";
import { Notification } from "./notification";
import { NavigationBar } from "./navbar";
import { AuthContext } from "../context/AuthContext";
import ModalWrapper from "./modal/modal-wrapper";
import { FooterNavigation } from "./footer";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLogout from "./modal/modal-logout";
import { useNavigate } from "react-router-dom";

export function MainLayout({ needProtection = true, children }: { needProtection?: boolean, children: React.ReactNode }) {
    const { isAuthenticated, actor, isLoading } = React.useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoading && needProtection && (!isAuthenticated || !actor)) {
            console.log("🔒 Redirect karena belum login...");
            navigate("/");
        }
    }, [needProtection, isAuthenticated, actor, isLoading, navigate]);

    return (
        <div className="flex flex-col w-full min-h-screen">
            <NavigationBar />
            <div className="min-h-screen">
                {children}
            </div>
            <FooterNavigation />

            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.logout, component: <ModalLogout /> },
                ]}
            />

            <Notification />
        </div>
    )
};