import { backend } from "../../../declarations/backend";
import { Asset, AssetStatus, AssetType, DocumentHash, LocationType, Result, Rule } from "../../../declarations/backend/backend.did";


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
            console.log(res);
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
            return await backend.createAsset(
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
            )
        } catch (error) {
            return { err: 'Failed to create asset: ' + (error as Error).message };
        }
    }

};
