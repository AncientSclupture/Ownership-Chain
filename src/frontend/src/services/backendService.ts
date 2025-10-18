// import { backend } from "../../../declarations/backend";
import { Asset, AssetOwnership, AssetProposal, ComplaintType, CreateAssetInputApi, Transaction, TreasuryLedger, User } from "../types/rwa";
import type { Principal } from '@dfinity/principal';
import { idlFactory } from "../../../declarations/backend/backend.did.js";
import { Actor, HttpAgent } from "@dfinity/agent";

// Updated environment variable names and fallback values
const BACKEND_CANISTER_ID =
    process.env.CANISTER_ID_BACKEND || "bkyz2-fmaaa-aaaaa-qaaaq-cai";

const DFX_NETWORK = process.env.DFX_NETWORK || "local";
const IC_HOST =
    DFX_NETWORK === "ic"
        ? "https://icp-api.io"
        : "http://127.0.0.1:4943";

let currentActor: any = null;
let isActorInitialized = false;
let agent: HttpAgent | null = null;

const initializeActor = async (identity?: any) => {
    try {
        console.log(`Initializing actor with canister ID: ${BACKEND_CANISTER_ID}`);
        console.log(`Using host: ${IC_HOST}`);

        // Create HTTP Agent
        agent = new HttpAgent({
            host: IC_HOST,
            identity: identity || null
        });

        // Fetch root key only for local development
        if (process.env.DFX_NETWORK !== "ic" && identity) {
            try {
                await agent.fetchRootKey();
                console.log("Root key fetched for local development");
            } catch (error) {
                console.warn("Failed to fetch root key:", error);
            }
        }

        const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId: BACKEND_CANISTER_ID,
        });

        console.log("Actor created successfully:", actor);
        return actor;
    } catch (error) {
        console.error("Failed to initialize actor:", error);
        throw error;
    }
};

export const setBackendActor = async (actor?: any) => {
    try {
        if (actor) {
            currentActor = actor;
            isActorInitialized = true;
            console.log('Backend service actor set from AuthContext');
            return;
        }

        currentActor = await initializeActor();
        isActorInitialized = true;
        console.log('Backend service actor updated');
    } catch (error) {
        console.error("Failed to set backend actor:", error);
        throw error;
    }
};

export const clearBackendActor = () => {
    currentActor = null;
    isActorInitialized = false;
    agent = null;
    console.log('Backend service actor cleared');
};

const getActor = async () => {
    if (currentActor && isActorInitialized) {
        console.log('🔒 Using authenticated actor');
        return currentActor;
    }

    console.log('👤 Using anonymous actor (fallback)');
    return await initializeActor();
};

export const backendService = {
    async getAssetByRange(start: bigint, end: bigint): Promise<Asset[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAssetByRange(start, end);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getTotalAsset(): Promise<bigint> {
        try {
            const actor = await getActor();
            const res = await actor.getTotalAsset();
            return res;
        } catch (error) {
            return BigInt(0);
        }
    },

    async getAllAssets(): Promise<Asset[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAllAssets();
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAsset(id: string): Promise<[Asset] | []> {
        try {
            const actor = await getActor();
            const res = await actor.getAsset(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAssetOwnerships(id: string): Promise<AssetOwnership[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAssetOwnerships(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAllTreasuryByAssetId(id: string): Promise<TreasuryLedger[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAllTreasuryByAssetId(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getTreasuryByAssetId(assetid: string, treasuryid: string): Promise<[TreasuryLedger] | []> {
        try {
            const actor = await getActor();
            const res = await actor.getTreasuryByAssetId(assetid, treasuryid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getPersonalAset(user: Principal): Promise<Asset[]> {
        try {
            const actor = await getActor();
            const res = await actor.getPersonalAset(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getMyProposals(user: Principal): Promise<AssetProposal[]> {
        try {
            const actor = await getActor();
            const res = await actor.getMyProposals(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAssetProposals(assetid: string): Promise<AssetProposal[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAssetProposals(assetid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getProposal(assetid: string, proposalid: string): Promise<[] | [AssetProposal]> {
        try {
            const actor = await getActor();
            const res = await actor.getProposal(assetid, proposalid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getMyOwnerships(user: Principal): Promise<AssetOwnership[]> {
        try {
            const actor = await getActor();
            const res = await actor.getMyOwnerships(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAllTransactionsByAssetId(id: string): Promise<Transaction[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAllTransactionsByAssetId(id);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getOwnershipById(assetid: string, ownershipid: string): Promise<[AssetOwnership] | []> {
        try {
            const actor = await getActor();
            const res = await actor.getOwnershipById(assetid, ownershipid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getTransactionByTransactionId(assetid: string, transactionid: string): Promise<[Transaction] | []> {
        try {
            const actor = await getActor();
            const res = await actor.getTransactionByTransactionId(assetid, transactionid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getAssetDividend(assetid: string): Promise<Transaction[]> {
        try {
            const actor = await getActor();
            const res = await actor.getAssetDividend(assetid);
            return res;
        } catch (error) {
            return [];
        }
    },

    async getDevBalance(): Promise<number> {
        try {
            const actor = await getActor();
            const res = await actor.getDevBalance();
            return res;
        } catch (error) {
            return 0.0;
        }
    },

    async myBalance(): Promise<number> {
        try {
            const actor = await getActor();
            const res = await actor.myBalance();
            return res;
        } catch (error) {
            return 0.0;
        }
    },

    async totalRegisteredUser(): Promise<bigint> {
        try {
            const actor = await getActor();
            const res = await actor.totalRegisteredUser();
            return res;
        } catch (error) {
            return BigInt(0);
        }
    },

    async getRegisteredUser(user: Principal): Promise<[User] | []> {
        try {
            const actor = await getActor();
            const res = await actor.getRegisteredUser(user);
            return res;
        } catch (error) {
            return [];
        }
    },

    async registKyc(surname: string, publickey: [] | [string]): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.registKyc(surname, publickey);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async addPublicKey(publickey: string): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.addPublicKey(publickey);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async getBalanceForDemo(): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.getBalanceForDemo();
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async voteProposal(assetid: string, proposalid: string): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.voteProposal(assetid, proposalid);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async createAsset(insertedinput: CreateAssetInputApi): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.createAsset(insertedinput);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async proposeAssetPurchase(id: string, token: bigint, pricePerToken: number, amount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.proposeAssetPurchase(id, token, pricePerToken, amount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async finishPayment(assetid: string, proposalid: string, amount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.finishPayment(assetid, proposalid, amount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async withdrawDPCashback(assetid: string, tsid: string, proposalid: string, amount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.withdrawDPCashback(assetid, tsid, proposalid, amount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async transferOwnership(assetid: string, ownershipid: string, to: Principal): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.transferOwnership(assetid, ownershipid, to);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async buyOwnership(assetid: string, ownershipid: string, amount: number, from: Principal): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.buyOwnership(assetid, ownershipid, amount, from);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async processLiquidation(assetid: string, liquidationAmount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.processLiquidation(assetid, liquidationAmount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async fileComplaint(assetid: string, reason: string, complaintType: ComplaintType): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.fileComplaint(assetid, reason, complaintType);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async supportAsset(assetid: string, amount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.supportAsset(assetid, amount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async shareDevidend(assetid: string, amount: number): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.shareDevidend(assetid, amount);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async inactiveAsset(assetid: string): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.inactiveAsset(assetid);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },

    async openMyOwnership(assetid: string, ownershipid: string,): Promise<[boolean, string]> {
        try {
            const actor = await getActor();
            const res = await actor.openMyOwnership(assetid, ownershipid);
            return res;
        } catch (error) {
            return error instanceof Error ? [false, error.message] : [false, String(error)];
        }
    },
};