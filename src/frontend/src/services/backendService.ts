import { backend } from "../../../declarations/backend";
import { Asset, AssetOwnership, AssetProposal, CreateAssetInputApi, Transaction, TreasuryLedger } from "../types/rwa";
import type { Principal } from '@dfinity/principal';
// import { idlFactory } from "../../../declarations/backend/backend.did.js";
// import { Actor, HttpAgent } from "@dfinity/agent";

// // Updated environment variable names and fallback values
// const BACKEND_CANISTER_ID = process.env.CANISTER_ID_BACKEND || "23all-uiaaa-aaaac-qb3ma-cai";
// const IC_HOST = process.env.DFX_NETWORK || "https://icp-api.io";

// let currentActor: any = null;
// let isActorInitialized = false;
// let agent: HttpAgent | null = null;

// const initializeActor = async (identity?: any) => {
//     try {
//         console.log(`Initializing actor with canister ID: ${BACKEND_CANISTER_ID}`);
//         console.log(`Using host: ${IC_HOST}`);
        
//         // Create HTTP Agent
//         agent = new HttpAgent({
//             host: IC_HOST,
//             identity: identity || null
//         });

//         // Fetch root key only for local development
//         if (import.meta.env.VITE_DFX_NETWORK !== "ic" && identity) {
//             try {
//                 await agent.fetchRootKey();
//                 console.log("Root key fetched for local development");
//             } catch (error) {
//                 console.warn("Failed to fetch root key:", error);
//             }
//         }

//         const actor = Actor.createActor(idlFactory, {
//             agent,
//             canisterId: BACKEND_CANISTER_ID,
//         });
        
//         console.log("Actor created successfully:", actor);
//         return actor;
//     } catch (error) {
//         console.error("Failed to initialize actor:", error);
//         throw error;
//     }
// };

// export const setBackendActor = async (actor?: any) => {
//     try {
//         if (actor) {
//             currentActor = actor;
//             isActorInitialized = true;
//             console.log('Backend service actor set from AuthContext');
//             return;
//         }

//         currentActor = await initializeActor();
//         isActorInitialized = true;
//         console.log('Backend service actor updated');
//     } catch (error) {
//         console.error("Failed to set backend actor:", error);
//         throw error;
//     }
// };

// export const clearBackendActor = () => {
//     currentActor = null;
//     isActorInitialized = false;
//     agent = null;
//     console.log('Backend service actor cleared');
// };

// const getActor = async ()  => {
//     if (currentActor && isActorInitialized) {
//         console.log('🔒 Using authenticated actor');
//         return currentActor;
//     }

//     console.log('👤 Using anonymous actor (fallback)');
//     return await initializeActor();
// };

export const backendService = {
    async createAsset(insertedinput: CreateAssetInputApi): Promise<string | null> {
        try {
            // const actor = await getActor();
            // const res = await actor.createAsset(insertedinput);
            const res = await backend.createAsset(insertedinput);
            return res;
        } catch (error) {
            return error instanceof Error ? error.message : String(error);
        }
    },

    async proposeAssetPurchase(id: string, token: bigint, pricePerToken: bigint, amount:bigint): Promise<string | null> {
        try {
            // const actor = await getActor();
            // const res = await actor.proposeAssetPurchase(insertedinput);
            const res = await backend.proposeAssetPurchase(id, token, pricePerToken, amount );
            return res;
        } catch (error) {
            return error instanceof Error ? error.message : String(error);
        }
    },

    async getAssetByRange(start: bigint, end: bigint): Promise<Asset[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAssetByRange(start, end);
            const res = await backend.getAssetByRange(start, end);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getTotalAsset(): Promise<bigint> {
        try {
            // const actor = await getActor();
            // const res = await actor.getTotalAsset();
            const res = await backend.getTotalAsset();
            return res;
        } catch (error) {
            return BigInt(0);
        }
    },

    async getAllAssets(): Promise<Asset[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAllAssets();
            const res = await backend.getAllAssets();
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAsset(id: string): Promise<[Asset] | []> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAsset(id);
            const res = await backend.getAsset(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAssetOwnerships(id: string): Promise<AssetOwnership[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAssetOwnerships(id);
            const res = await backend.getAssetOwnerships(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAllTreasuryByAssetId(id: string): Promise<TreasuryLedger[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAllTreasuryByAssetId(id);
            const res = await backend.getAllTreasuryByAssetId(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getPersonalAset(user: Principal): Promise<Asset[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getPersonalAset(user);
            const res = await backend.getPersonalAset(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getMyProposals(user: Principal): Promise<AssetProposal[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getMyProposals(user);
            const res = await backend.getMyProposals(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAssetProposals(assetid: string): Promise<AssetProposal[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAssetProposals(user);
            const res = await backend.getAssetProposals(assetid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getMyOwnerships(user: Principal): Promise<AssetOwnership[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getMyOwnerships(user);
            const res = await backend.getMyOwnerships(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAllTransactionsByAssetId(id: string): Promise<Transaction[]> {
        try {
            // const actor = await getActor();
            // const res = await actor.getAllTransactionsByAssetId(user);
            const res = await backend.getAllTransactionsByAssetId(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getOwnershipById(assetid : string, ownershipid : string) : Promise<[AssetOwnership] | []> {
        try {
            // const actor = await getActor();
            // const res = await actor.getOwnershipById(assetid, ownershipid);
            const res = await backend.getOwnershipById(assetid, ownershipid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getTransactionByTransactionId(assetid : string, transactionid : string) : Promise<[Transaction] | []> {
        try {
            // const actor = await getActor();
            // const res = await actor.getTransactionByTransactionId(assetid, transactionid);
            const res = await backend.getTransactionByTransactionId(assetid, transactionid);
            return res;
        } catch (error) {
            return [];
        }
    },
};