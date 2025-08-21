import React, { createContext, useState } from "react";
import { ModalKindEnum } from "../types/ui";
import { DocumentHashDataType } from "../types/rwa";

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    managementRuleDetail: {
        data: string[] | null,
        setter: (d: string) => void;
        remover: (d: string) => void;
    },
    managementAddDocument: {
        data: DocumentHashDataType[] | null,
        setter: (d: DocumentHashDataType) => void;
        remover: (d: string) => void;
    },
    setModalKind: (d: ModalKindEnum | null) => void;
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
    managementAddDocument: {
        data: null,
        setter: () => { },
        remover: () => { },
    },
    managementRuleDetail: {
        data: null,
        setter: () => { },
        remover: () => { },
    }
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [ruleDetail, setRuleDetailState] = useState<string[] | null>(null);
    const [documentHash, setDocumentHashState] = useState<DocumentHashDataType[]>([]);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    function addRuleDetail(detail: string) {
        setRuleDetailState((prev) => {
            if (!prev) return [detail];
            return [...prev, detail];
        });
    }

    function removeRuleDetail(detail: string) {
        setRuleDetailState((prev) => {
            if (!prev) return prev;
            return prev.filter((d) => d !== detail);
        });
    }

    function addDocumentHash(doc: DocumentHashDataType) {
        setDocumentHashState((prev) => {
            if (!prev) return [doc];
            return [...prev, doc];
        });
    }

    function removeDocument(name: string) {
        setDocumentHashState((prev) => {
            if (!prev) return prev;
            return prev.filter((d) => d.name !== name);
        });
    }

    return (
        <ModalContext.Provider
            value={{
                modalKind,
                managementAddDocument: { data: documentHash, setter: addDocumentHash, remover: removeDocument },
                managementRuleDetail: { data: ruleDetail, setter: addRuleDetail, remover: removeRuleDetail },
                setModalKind: setModalShowUp,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
