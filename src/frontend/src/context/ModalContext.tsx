import React, { createContext, useState } from "react";
import { Asset, DocumentHash } from "../types/rwa";

export enum ModalKindEnum {
    findassetsearch = "findassetsearch",
    logout = "logout",
    registuser = "registuser",
    adddocument = "adddocument",
    addruledetails = "addruledetails",
    addlocationdetails = "addlocationdetails",
    changeassetstatus = "changeassetstatus",
    verifyhashclarity = "verifyhashclarity",
    verifyevidenceclarity = "verifyevidenceclarity",
    proposedbuytoken = "proposedbuytoken",
    proceeddp = "proceeddp",
    finishedpayment = "finishedpayment",
    supportasset = "supportasset",
    distriutedividend = "distriutedividend",
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
    adddocumentmanagement: {
        data: Array<DocumentHash>;
        setter: (d: DocumentHash) => void;
        remover: (d: string) => void;
        reseter: () => void;
    },
    adddruledetailmanagement: {
        data: Array<string>;
        setter: (d: string) => void;
        remover: (d: string) => void;
        reseter: () => void;
    },
    locationdetailmanagement: {
        data: Array<string>;
        setter: (d: string) => void;
        remover: (d: string) => void;
        reseter: () => void;
    },
    assetidmanagement: {
        data: string,
        setter: (id: string) => void,
        reseter: () => void;
    },
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
    isDoneRegist: null,
    setIsdoneRegist: () => { },
    findassetmanagement: {
        data: [],
        setter: () => { },
        reseter: () => { }
    },
    adddocumentmanagement: {
        data: [{ name: '', description: '', hash: '' }],
        setter: () => { },
        remover: () => { },
        reseter: () => { }
    },
    adddruledetailmanagement: {
        data: [],
        setter: () => { },
        remover: () => { },
        reseter: () => { }
    },
    locationdetailmanagement: {
        data: [],
        setter: () => { },
        remover: () => { },
        reseter: () => { }
    },
    assetidmanagement: {
        data: "",
        setter: () => { },
        reseter: () => { }
    },
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [findassetmanagementData, setFindassetmanagementData] = React.useState<[] | [Asset]>([]);
    const [isDoneRegist, setIsDoneRegist] = React.useState<boolean | null>(null);
    const [adddocumentmanagementData, setAdddocumentmanagementData] = React.useState<Array<DocumentHash> | []>([]);
    const [adddruledetailmanagementData, setAdddruledetailmanagementData] = React.useState<Array<string> | []>([]);
    const [locationdetailmanagementdata, setLocationdetailmanagementdata] = React.useState<Array<string> | []>([]);
    const [assetidmanagementData, setChangestatusassetData] = React.useState<string>("")

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    const setterfindassetmanagement = (d: [Asset] | []) => {
        setFindassetmanagementData(d);
    };

    const changeregiststatus = (d: boolean | null) => {
        setIsDoneRegist(d)
    }

    const setadddocumentdata = (d: DocumentHash) => {
        console.log(d);
        setAdddocumentmanagementData(prev => [...prev, d])
    }

    const removeadddocumentdata = (name: string) => {
        setAdddocumentmanagementData(prev => prev.filter(doc => doc.name !== name));
    }

    const setruledetaildata = (d: string) => {
        setAdddruledetailmanagementData(prev => [...prev, d])
    }

    const removeruledetaildata = (targetName: string) => {
        setAdddruledetailmanagementData(prev =>
            prev.filter(item => item !== targetName)
        );
    };

    const setlocationdetaildata = (d: string) => {
        setLocationdetailmanagementdata(prev => [...prev, d])
    }

    const removelocationdetaildata = (targetName: string) => {
        setLocationdetailmanagementdata(prev =>
            prev.filter(item => item !== targetName)
        );
    };

    const setchangestatusassetdata = (id: string) => {
        setChangestatusassetData(id);
    }

    return (
        <ModalContext.Provider
            value={{
                findassetmanagement: {
                    data: findassetmanagementData,
                    reseter: () => setFindassetmanagementData([]),
                    setter: setterfindassetmanagement
                },
                adddocumentmanagement: {
                    data: adddocumentmanagementData,
                    setter: setadddocumentdata,
                    remover: removeadddocumentdata,
                    reseter: () => setAdddocumentmanagementData([])
                },
                adddruledetailmanagement: {
                    data: adddruledetailmanagementData,
                    setter: setruledetaildata,
                    remover: removeruledetaildata,
                    reseter: () => setAdddruledetailmanagementData([]),
                },
                locationdetailmanagement: {
                    data: locationdetailmanagementdata,
                    setter: setlocationdetaildata,
                    remover: removelocationdetaildata,
                    reseter: () => setAdddruledetailmanagementData([]),
                },
                assetidmanagement: {
                    data: assetidmanagementData,
                    setter: setchangestatusassetdata,
                    reseter: () => setChangestatusassetData(""),
                },
                modalKind,
                setModalKind: setModalShowUp,
                isDoneRegist: isDoneRegist,
                setIsdoneRegist: changeregiststatus
            }}
        >
            {children}
        </ModalContext.Provider >
    );
}