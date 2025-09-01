import { backend } from "../../../declarations/backend";
import { Asset, AssetStatus, AssetType, DocumentHash, IdentityNumberType, LocationType, Result, Rule, User } from "../../../declarations/backend/backend.did";


export const backendService = {

    async getUsers(): Promise<void> {
        try {
            const res = await backend.getUsers();
            console.log("hallo", res);
        } catch (error) {
            console.error('Error fetching all assets:', error);
        }
    },

    async getAssets(): Promise<Asset[] | null> {
        try {
            const res = await backend.getAllAssets();
            return res;
        } catch (error) {
            console.error('Error fetching all assets:', error);
            return null;
        }
    },

    async getAssetById(assetId: string): Promise<Asset | null> {
        try {
            const res = await backend.getAssetById(assetId);
            if (res.length > 0 && res[0]) {
                return res[0];
            }
            return null;

        } catch (error) {
            console.error('Error fetching all assets:', error);
            return null;

        }
    },

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
            const res = await backend.createAsset(
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

    async registUser(
        fullName: string,
        lastName: string,
        phone: string,
        country: string,
        city: string,
        publicKey: string,

        userIDNumber: string,
        userIdentity: IdentityNumberType,
    ): Promise<Result> {
        try {
            const res = await backend.registUser(
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

    async getUser(): Promise<User> {
        try {
            const res = await backend.getUsers();
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res[0];
        } catch (error) {
            throw error;
        }
    },

    async getAssetDetails(assetId: string): Promise<void> {
        try {
            const res = await backend.getAssetFullDetails(assetId);

            if ((res as any).err) {
                throw new Error((res as any).err);
            }

            console.log(res);
        } catch (error) {
            throw error;
        }
    },

    async proposedToken(
        assetId: string,
        token: bigint,
        pricePerToken: bigint
    ): Promise<Result> {
        try {
            const res = await backend.proposedBuyToken(assetId, token, pricePerToken);
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

};