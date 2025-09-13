import React, { createContext, useState } from "react";
import { Asset, IdentityNumberType } from "../types/rwa";

export enum ModalKindEnum {
    findassetsearch = "findassetsearch",
    logout = "logout",
    registuser = "registuser",
}

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    setModalKind: (d: ModalKindEnum | null) => void;
    isDoneRegist: boolean | null;
    setIsdoneRegist: (d: boolean | null) => void;
    findassetmanagement: {
        data: [] | [Asset];
        setter: (d: [Asset] | []) => void;
        reseter: () => void;
    };
    createusermanagement: {
        data: { fullName: string, lastName: string, phone: string, country: string, city: string, userIDNumber: string, userIdentity: IdentityNumberType, publicKey: string, } | null;
        setter: (d: { fullName: string, lastName: string, phone: string, country: string, city: string, userIDNumber: string, userIdentity: IdentityNumberType, publicKey: string, } | null) => void;
        reseter: () => void;
    }
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
    isDoneRegist: null,
    setIsdoneRegist: () => {},
    findassetmanagement: {
        data: [],
        setter: () => { },
        reseter: () => { }
    },
    createusermanagement: {
        data: null,
        setter: () => { },
        reseter: () => { }
    }
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [findassetmanagementData, setFindassetmanagementData] = React.useState<[] | [Asset]>([]);
    const [registUsermanagementData, setRegistmanagementUserData] = React.useState<
        { fullName: string, lastName: string, phone: string, country: string, city: string, userIDNumber: string, userIdentity: IdentityNumberType, publicKey: string, }
        | null
    >(null);
    const [isDoneRegist, setIsDoneRegist] = React.useState<boolean | null>(null);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    const setterfindassetmanagement = (d: [Asset] | []) => {
        setFindassetmanagementData(d);
    };

    const setterregistusermanagement = (d: { fullName: string, lastName: string, phone: string, country: string, city: string, userIDNumber: string, userIdentity: IdentityNumberType, publicKey: string, } | null) => {
        setRegistmanagementUserData(d);
    }

    const changeregiststatus = (d: boolean | null) => {
        setIsDoneRegist(d)
    }

    return (
        <ModalContext.Provider
            value={{
                findassetmanagement: {
                    data: findassetmanagementData,
                    reseter: () => setFindassetmanagementData([]),
                    setter: setterfindassetmanagement
                },
                createusermanagement: {
                    data: registUsermanagementData,
                    reseter: () => setRegistmanagementUserData(null),
                    setter: setterregistusermanagement
                },
                modalKind,
                setModalKind: setModalShowUp,
                isDoneRegist: isDoneRegist,
                setIsdoneRegist: changeregiststatus
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}