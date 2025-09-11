import React from "react";
import { NavigationBar } from "./navbar";
import { FooterNavigation } from "./footer";
import { Notification } from "./notification";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import FindAssetModal from "./modal/modal-find-asset";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-hidden min-h-screen">
            <NavigationBar />
            <div className="min-h-screen">{children}</div>
            <FooterNavigation />

            <ModalWrapper
                listcontent={[
                    {name: ModalKindEnum.findassetsearch, component: <FindAssetModal />}
                ]}
            />
            <Notification />
        </div>
    );
}