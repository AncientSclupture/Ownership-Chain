import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as backend_idl } from "../../../declarations/backend";
import { canisterId as backend_id } from "../../../declarations/backend";
import type { Principal } from "@dfinity/principal";
import { setBackendActor, clearBackendActor } from "../services/backendService"; // ✅ aktifkan koneksi ke backend

type AuthContextType = {
    authClient: AuthClient | null;
    isAuthenticated: boolean;
    principal: string | null;
    actor: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    userPrincipal: Principal | null;
};

export const AuthContext = createContext<AuthContextType>({
    authClient: null,
    isAuthenticated: false,
    principal: null,
    actor: null,
    login: async () => { },
    logout: async () => { },
    isLoading: true,
    userPrincipal: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [principal, setPrincipal] = useState<string | null>(null);
    const [actor, setActor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userPrincipal, setUserPrincipal] = useState<Principal | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const client = await AuthClient.create();
            setAuthClient(client);

            // Restore session jika user masih login
            if (await client.isAuthenticated()) {
                await handleLoginSuccess(client);
            }

            setIsLoading(false);
        })();
    }, []);

    const handleLoginSuccess = async (client: AuthClient) => {
        const identity = client.getIdentity();
        const principalObj = identity.getPrincipal();
        const principalText = principalObj.toString();

        console.log("✅ Logged in principal:", principalText);

        setIsAuthenticated(true);
        setPrincipal(principalText);
        setUserPrincipal(principalObj);

        // Buat HttpAgent berdasarkan environment
        const DFX_NETWORK = import.meta.env.DFX_NETWORK || "local";
        const host = DFX_NETWORK === "ic" ? "https://icp-api.io" : "http://127.0.0.1:4943";

        const agent = new HttpAgent({ identity, host });

        if (DFX_NETWORK !== "ic") {
            try {
                await agent.fetchRootKey();
                console.log("🔑 Root key fetched for local development");
            } catch (err) {
                console.warn("⚠️ Failed to fetch root key:", err);
            }
        }

        // Buat actor yang terautentikasi
        const myActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
        });

        setActor(myActor);
        setBackendActor(myActor); // ✅ sinkron ke backendService
    };

    const login = async () => {
        if (!authClient) return;

        const DFX_NETWORK = import.meta.env.DFX_NETWORK || "local";
        const identityProvider =
            DFX_NETWORK === "ic"
                ? "https://identity.ic0.app"
                : `http://${import.meta.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

        await new Promise<void>((resolve, reject) => {
            authClient.login({
                identityProvider,
                onSuccess: async () => {
                    await handleLoginSuccess(authClient);
                    resolve();
                },
                onError: reject,
            });
        });
    };

    const logout = async () => {
        if (!authClient) return;

        await authClient.logout();
        setIsAuthenticated(false);
        setPrincipal(null);
        setActor(null);
        setUserPrincipal(null);

        clearBackendActor(); // ✅ pastikan backend pakai anonymous lagi
        console.log("🚪 Logged out successfully");
    };

    return (
        <AuthContext.Provider
            value={{
                userPrincipal,
                authClient,
                isAuthenticated,
                principal,
                actor,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
