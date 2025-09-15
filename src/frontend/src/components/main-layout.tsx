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
import { LoaderComponent } from "./LoaderComponent";
import { RegistUserModal } from "./modal/modal-regist-user";
import AddDocumentModal from "./modal/modal-add-document";
import AddRuleDetailsModal from "./modal/modal-add-rule-details";
import AddLocationDetailsModal from "./modal/modal-add-locaion";

export function MainLayout({ index = false, children }: { index?: boolean, children: React.ReactNode }) {

    const { isAuthenticated, isLoading } = React.useContext(AuthContext);

    if (isLoading) {
        return (
            <LoaderComponent fullScreen text="Please Wait" />
        );
    }

    if (isAuthenticated === false && !index && !isLoading) {
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
                    { name: ModalKindEnum.logout, component: <AskToLogoutModal /> },
                    { name: ModalKindEnum.registuser, component: <RegistUserModal /> },
                    { name: ModalKindEnum.adddocument, component: <AddDocumentModal /> },
                    { name: ModalKindEnum.addruledetails, component: <AddRuleDetailsModal /> },
                    { name: ModalKindEnum.addlocationdetails, component: <AddLocationDetailsModal /> },
                ]}
            />
            <Notification />
        </div>
    );
}