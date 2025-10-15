import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as backend_idl } from "../../../declarations/backend";
import { canisterId as backend_id } from "../../../declarations/backend";

type AuthContextType = {
    authClient: AuthClient | null;
    isAuthenticated: boolean;
    principal: string | null;
    actor: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    authClient: null,
    isAuthenticated: false,
    principal: null,
    actor: null,
    login: async () => { },
    logout: async () => { },
    isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [principal, setPrincipal] = useState<string | null>(null);
    const [actor, setActor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const client = await AuthClient.create();
            setAuthClient(client);

            if (await client.isAuthenticated()) {
                await handleLoginSuccess(client);
            }

            setIsLoading(false);

        })();
    }, []);

    const handleLoginSuccess = async (client: AuthClient) => {
        setIsAuthenticated(true);
        const identity = client.getIdentity();
        const principalText = identity.getPrincipal().toString();
        console.log("✅ Logged in principal:", principalText);
        setPrincipal(identity.getPrincipal().toString());

        const agent = new HttpAgent({ identity });

        if (process.env.DFX_NETWORK !== "ic") {
            await agent.fetchRootKey();
        }

        const myActor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
        });

        setActor(myActor);

        // setBackendActor(myActor);
    };

    const login = async () => {
        if (!authClient) return;

        await new Promise<void>((resolve, reject) => {
            authClient.login({
                identityProvider:
                    process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
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

        // clearBackendActor();
    };

    return (
        <AuthContext.Provider value={{
            authClient,
            isAuthenticated,
            principal,
            actor,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);