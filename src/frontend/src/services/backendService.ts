import { backend } from "../../../declarations/backend";
import { Asset, AssetStatus, AssetType, DocumentHash, IdentityNumberType, LocationType, Result, Rule, UserOverviewResult } from "../../../declarations/backend/backend.did";
import { Ownership, Report, Transaction } from "../types/rwa";

let currentActor: any = null;
let isActorInitialized = false;

export const setBackendActor = (actor: any) => {
    currentActor = actor;
    isActorInitialized = true;
    console.log('✅ Backend service actor updated');
};

export const clearBackendActor = () => {
    currentActor = null;
    isActorInitialized = false;
    console.log('Backend service actor cleared');
};

const getActor = () => {
    if (currentActor && isActorInitialized) {
        console.log('🔐 Using authenticated actor');
        return currentActor;
    }

    console.log('Using anonymous actor (fallback)');
    return backend;
};

export const backendService = {

    // done
    async getMyprofileInfo(): Promise<UserOverviewResult | null> {
        try {
            const actor = getActor();
            const res = await actor.getMyProfiles();
            return res.length === 0 ? null : res[0];
        } catch (error) {
            console.log(error)
            return null;
        }
    },

    // done
    async getAssets(): Promise<Asset[] | null> {
        try {
            const actor = getActor();
            const res = await actor.getAllAssets();
            return res;
        } catch (error) {
            console.error('Error fetching all assets:', error);
            return null;
        }
    },

    async getAssetbyRange(start: bigint, end: bigint): Promise<Asset[] | null> {
        try {
            const actor = getActor();
            const res = await actor.getAssetbyRange(start, end);
            return res;
        } catch (error) {
            throw (error)
        }
    },

    async getTotalAssetCount(): Promise<bigint> {
        try {
            const actor = getActor();
            const res = await actor.getAssetTotalCount();
            return res;
        } catch (error) {
            throw (error)
        }
    },

    // done
    async getAssetById(assetId: string): Promise<Asset | null> {
        try {
            const actor = getActor();
            const res = await actor.getAssetById(assetId);
            if (res.length > 0 && res[0]) {
                return res[0];
            }
            return null;

        } catch (error) {
            console.error('Error fetching all assets:', error);
            return null;

        }
    },

    // done
    async createAsset(
        name: string,
        description: string,
        totalToken: bigint,
        providedToken: bigint,
        minTokenPurchased: bigint,
        maxTokenPurchased: bigint,
        pricePerToken: bigint,
        locationInfo: LocationType,
        documentHash: Array<DocumentHash>,
        assetType: AssetType,
        assetStatus: AssetStatus,
        rule: Rule,
    ): Promise<Result> {
        try {
            const actor = getActor();
            const res = await actor.createAsset(
                name,
                description,
                totalToken,
                providedToken,
                minTokenPurchased,
                maxTokenPurchased,
                pricePerToken,
                locationInfo,
                documentHash,
                assetType,
                assetStatus,
                rule
            );

            if ((res as any).err) {
                throw new Error((res as any).err);
            }

            return res;
        } catch (error) {
            throw error;
        }
    },

    // done
    async registUser(
        fullName: string,
        lastName: string,
        phone: string,
        country: string,
        city: string,
        userIDNumber: string,
        userIdentity: IdentityNumberType,
        publicKey: string,
    ): Promise<Result> {
        try {
            const actor = getActor();
            console.log('🔍 FRONTEND - Registering user with current actor');

            const res = await actor.registUser(
                fullName,
                lastName,
                phone,
                country,
                city,
                userIDNumber,
                userIdentity,
                publicKey
            );

            if ((res as any).err) {
                throw new Error((res as any).err);
            }

            return res;
        } catch (error) {
            throw error;
        }
    },

    // done
    async getAssetDetails(assetId: string): Promise<[] | [{
        asset: Asset;
        ownerships: Array<Ownership>;
        transactions: Array<Transaction>;
        dividends: Array<Transaction>;
    }]> {
        try {
            const actor = getActor();
            const res = await actor.getAssetFullDetails(assetId);

            if ((res as any).err) {
                throw new Error((res as any).err);
            }

            console.log(res);
            return res

        } catch (error) {
            throw error;
        }
    },

    // done
    async proposedToken(
        assetId: string,
        token: bigint,
        pricePerToken: bigint
    ): Promise<Result> {
        try {
            const actor = getActor();
            const res = await actor.proposedBuyToken(assetId, token, pricePerToken);
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res;
        } catch (error) {
            throw error;
        }
    },

    // done
    async getPubKeyUser(): Promise<string | null> {
        try {
            const actor = getActor();
            const res = await actor.getUserPublicSignature();
            return res[0] ?? null;
        } catch (error) {
            console.log("get pub key: ", error);
            throw error;
        }
    },

    async getAssetDocumentHash(assetid: string): Promise<[DocumentHash[]] | []> {
        try {
            const actor = getActor();
            const res = await actor.getAssetSignature(assetid);
            console.log(res);
            return res;
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    async searchAsset(query: string, assetType: [] | [AssetStatus]): Promise<[] | [Asset]> {
        try {
            const actor = getActor();
            const res = await actor.seacrhAsset(query, assetType);
            console.log(query, assetType, res);
            return res;
        } catch (error) {
            console.log(error)
            throw (error)
        }
    },

    async getMyAssets(): Promise<Asset[]> {
        try {
            const actor = getActor();
            const res = await actor.getMyAssets();
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res;
        } catch (error) {
            throw error;
        }
    },

    async getMyOwnerships(): Promise<Ownership[]> {
        try {
            const actor = getActor();
            const res = await actor.getMyOwnerShip();
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res;
        } catch (error) {
            throw error;
        }
    },

    async changeAssetStatus(assetid: string, assetstatus: AssetStatus): Promise<Result> {
        try {
            const actor = getActor();
            const res = await actor.changeAssetStatus(assetid, assetstatus);
            return res;
        } catch (error) {
            throw error;
        }
    },

    async getMyAssetReport(): Promise<Report[]> {
        try {
            const actor = getActor();
            const res = await actor.getMyAssetReport()
            return res;
        } catch (error) {
            throw error;
        }
    }

};