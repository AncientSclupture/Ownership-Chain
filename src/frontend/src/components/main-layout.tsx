import React from "react";
import Forbidden from "./forbiden";
import { Notification } from "./notification";
import { NavigationBar } from "./navbar";
import { AuthContext } from "../context/AuthContext";
import ModalWrapper from "./modal/modal-wrapper";
import { FooterNavigation } from "./footer";

export function MainLayout({ needProtection = true, children }: { needProtection?: boolean, children: React.ReactNode }) {
    const { isAuthenticated } = React.useContext(AuthContext);

    if (needProtection && !isAuthenticated) return <Forbidden />

    return (
        <div className="flex flex-col w-full min-h-screen">
            <NavigationBar />
            <div className="min-h-screen">
                {children}
            </div>
            <FooterNavigation />

            <ModalWrapper
                listcontent={[]}
            />

            <Notification />
        </div>
    )
};