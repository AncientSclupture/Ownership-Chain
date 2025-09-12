import React, { createContext, useState } from "react";
import { Asset } from "../types/rwa";

export enum ModalKindEnum {
    findassetsearch = "findassetsearch",
    logout = "logout",
}

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    setModalKind: (d: ModalKindEnum | null) => void;
    findassetmanagement: {
        data: [] | [Asset];
        setter: (d: [Asset] | []) => void;
        reseter: () => void;
    }
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
    findassetmanagement: {
        data: [],
        setter: () => { },
        reseter: () => { }
    }
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [findassetmanagementData, setFindassetmanagementData] = React.useState<[] | [Asset]>([]);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    const setterfindassetmanagement = (d: [Asset] | []) => {
        setFindassetmanagementData(d);
    };

    return (
        <ModalContext.Provider
            value={{
                findassetmanagement: {
                    data: findassetmanagementData,
                    reseter: () => setFindassetmanagementData([]),
                    setter: setterfindassetmanagement
                },
                modalKind,
                setModalKind: setModalShowUp,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}