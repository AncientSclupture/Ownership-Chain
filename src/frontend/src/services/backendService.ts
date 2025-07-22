import { backend } from "../../../declarations/backend";
import { Asset, AssetType, PlatformStats, Result } from "../types/rwa";

export const backendService = {
  /**
   * Retrieves all assets on the platform
   * @returns Promise with array of all assets
   */
  async getAllAssets(): Promise<Asset[]> {
    try {
      const res = await backend.getAllAssets();
      console.log(backend);
      return res;
    } catch (error) {
      console.error('Error fetching all assets:', error);
      return [];
    }
  },

  /**
    * Creates a new tokenized asset on the blockchain
    * @param name Asset name
    * @param description Asset description
    * @param assetType Type of asset (Property, Business, etc.)
    * @param totalValue Total value of the asset
    * @param totalSupply Total number of tokens to issue
    * @param location Optional location of the asset
    * @param documents Array of document hashes
    * @param metadata Additional metadata as key-value pairs
    * @returns Promise with the created asset ID or error message
    */

  async createAsset(
    name: string,
    description: string,
    assetType: AssetType,
    totalValue: number,
    totalSupply: number,
    location?: string,
    documents: string[] = [],
    metadata: Array<[string, string]> = []
  ): Promise<Result<string, string>> {
    try {
      return await backend.createAsset(
        name,
        description,
        assetType,
        BigInt(totalValue),
        BigInt(totalSupply),
        location ? [location] : [],
        documents,
        metadata
      );
    } catch (error) {
      console.error('Error creating asset:', error);
      return { err: 'Failed to create asset: ' + (error as Error).message };
    }
  },

  /**
   * Retrieves platform-wide statistics
   * @returns Promise with platform statistics
   */
  async getPlatformStats(): Promise<PlatformStats | null> {
    try {
      return await backend.getPlatformStats();
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return null;
    }
  },

};
