import React, { createContext, useState } from "react";
import { AssetRule } from "../types/rwa";

export enum ModalKindEnum {
    logout = "logout",
    proposedbuy = "proposedbuy",
    addrule = "addrule",
    createassetcomplaint = "createassetcomplaint",
    supportasset = "supportasset",
    createkyc = "createkyc",
    addpubkey = "addpubkey",
    distributedividend = "distributedividend",
    aireview = "aireview",
}

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    setModalKind: (d: ModalKindEnum | null) => void;
    addrulemanagement: {
        data: AssetRule[];
        setter: (d: AssetRule) => void;
        remover: (index: number) => void;
        resetter: () => void;
    };
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
    addrulemanagement: {
        data: [],
        setter: () => { },
        remover: () => { },
        resetter: () => { },
    },
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [addruleData, setAddruleData] = useState<AssetRule[]>([]);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    function addruleSetter(d: AssetRule) {
        setAddruleData((prev) => [...prev, d]);
    }

    function addruleRemover(index: number) {
        setAddruleData((prev) => prev.filter((_, i) => i !== index));
    }

    function addruleResetter() {
        setAddruleData([]);
    }


    return (
        <ModalContext.Provider
            value={{
                modalKind,
                setModalKind: setModalShowUp,
                addrulemanagement: {
                    data: addruleData,
                    setter: addruleSetter,
                    remover: addruleRemover,
                    resetter: addruleResetter,
                }
            }}
        >
            {children}
        </ModalContext.Provider >
    );
}