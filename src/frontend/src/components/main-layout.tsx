import React from "react";
import Forbidden from "./forbiden";
import { Notification } from "./notification";
import { NavigationBar } from "./navbar";
import { AuthContext } from "../context/AuthContext";
import ModalWrapper from "./modal/modal-wrapper";
import { FooterNavigation } from "./footer";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLogout from "./modal/modal-logout";
import ModalProposedBuyToken from "./modal/modal-proposed-buy-token";

export function MainLayout({ needProtection = true, children }: { needProtection?: boolean, children: React.ReactNode }) {
    const { isAuthenticated, userPrincipal } = React.useContext(AuthContext);

    if (needProtection && (!isAuthenticated || !userPrincipal)) return <Forbidden />

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
                    { name: ModalKindEnum.proposedbuy, component: <ModalProposedBuyToken /> },
                ]}
            />

            <Notification />
        </div>
    )
};