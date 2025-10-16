import type { Principal } from '@dfinity/principal';
import React, { createContext, useState } from "react";

export type AssetOwnershipParsingDatatype = {
    assetid: string | null;
    ownershipid: string | null;
    transactionid: string | null;
    targetprincipal: Principal | null;
    price: bigint | null;
    setassetid: (d: string) => void;
    setownershipid: (d: string) => void;
    settransactionid: (d: string) => void;
    settargetprincipal: (d: Principal | null) => void;
    setprice: (d: bigint) => void;
}

export const AssetOwnershipParsingDataContext = createContext<AssetOwnershipParsingDatatype>({
    assetid: null,
    ownershipid: null,
    targetprincipal: null,
    transactionid: null,
    price: null,
    setassetid: () => {},
    setownershipid: () => {},
    settargetprincipal: () => {},
    setprice: () => {},
    settransactionid: () => {},
})

export const AssetOwnershipParsingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assetid, setAssetid] = useState<string | null>(null);
    const [ownershipid, setOwnershipid] = useState<string | null>(null);
    const [targetprincipal, setTargetprincipal] = useState<Principal | null>(null);
    const [price, setPrice] = useState<bigint | null>(null);
    const [transactionid, setTransactionId] = useState<string | null>(null);

    function setassetid(d: string) {
        setAssetid(d);
    }

    function setownershipid(d: string) {
        setOwnershipid(d);
    }

    function settargetprincipal(d: Principal | null) {
        setTargetprincipal(d);
    }

    function setprice(d: bigint) {
        setPrice(d);
    }

    function settransactionid(d: string) {
        setTransactionId(d);
    }

    return (
        <AssetOwnershipParsingDataContext.Provider
            value={{
                assetid,
                ownershipid,
                targetprincipal,
                price,
                transactionid,
                setassetid,
                setownershipid,
                settargetprincipal,
                setprice,
                settransactionid,
            }}
        >
            {children}
        </AssetOwnershipParsingDataContext.Provider >
    );
}