import React from "react";
import { NavigationBar } from "./navbar";
import { FooterNavigation } from "./footer";
import { Notification } from "./notification";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import FindAssetModal from "./modal/modal-find-asset";
import AskToLogoutModal from "./modal/modal-ask-logout";
import { AuthContext } from "../context/AuthContext";
import ProtectedPage from "./protected-component";

export function MainLayout({ index = false, children }: { index?: boolean, children: React.ReactNode }) {
    const { isAuthenticated } = React.useContext(AuthContext);

    if (!isAuthenticated && !index) {
        return <ProtectedPage />
    }

    return (
        <div className="w-full overflow-hidden min-h-screen">
            <NavigationBar />
            <div className="min-h-screen">{children}</div>
            <FooterNavigation />

            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.findassetsearch, component: <FindAssetModal /> },
                    { name: ModalKindEnum.logout, component: <AskToLogoutModal /> }
                ]}
            />
            <Notification />
        </div>
    );
}