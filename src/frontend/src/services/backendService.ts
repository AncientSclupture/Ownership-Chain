import { backend } from "../../../declarations/backend";
import { Asset, AssetType, GetUserProfileResult, Ownership, PlatformStats, Result, Transaction, UserProfile } from "../types/rwa";
import { Principal } from '@dfinity/principal';


export const backendService = {
  /**
   * Retrieves all assets on the platform
   * @returns Promise with array of all assets
   */
  async getAllAssets(): Promise<Asset[]> {
    try {
      const res = await backend.getAllAssets();
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

  /**
   * Retrieves user profiles
   * @returns Promise with platform statistics
   */
  async getProfiles(): Promise<GetUserProfileResult | null> {
    try {
      const data = await backend.getUserProfile();
      return data[0] ?? null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  /**
   * Retrieves asset information by ID
   * @param assetId Asset ID to retrieve
   * @returns Promise with asset data or null if not found
   */
  async getAsset(assetId: string): Promise<Asset | null> {
    try {
      const result = await backend.getAsset(assetId);
      return result[0] ?? null;
    } catch (error) {
      console.error('Error fetching asset:', error);
      return null;
    }
  },

  /**
   * Purchases tokens for fractional ownership
   * @param assetId Asset ID to buy tokens for
   * @param amount Number of tokens to buy
   * @param pricePerToken Price per token
   * @returns Promise with transaction ID or error message
   */
  async buyTokens(
    assetId: string,
    amount: number,
    pricePerToken: number
  ): Promise<Result<string, string>> {
    try {
      return await backend.buyTokens(
        assetId,
        BigInt(amount),
        BigInt(pricePerToken)
      );
    } catch (error) {
      console.error('Error buying tokens:', error);
      return { err: 'Failed to buy tokens: ' + (error as Error).message };
    }
  },

  /**
   * Retrieves all transactions for a specific user
   * @returns Promise with array of user transactions
   */
  async getUserTransactions(): Promise<Transaction[]> {
    try {
      return await backend.getUserTransactions();
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  },

  /**
   * Retrieves all assets owned by a user
   * @returns Promise with array of user's asset holdings
   */
  async getUserAssets(): Promise<Array<[string, bigint]>> {
    try {
      return await backend.getUserAssets();
    } catch (error) {
      console.error('Error fetching user assets:', error);
      return [];
    }
  },

  /**
 * Retrieves all owners of a specific asset
 * @param assetId Asset ID
 * @returns Promise with array of ownership records
 */
  async getAssetOwners(assetId: string): Promise<Array<[Principal, Ownership]>> {
    try {
      return await backend.getAssetOwners(assetId);
    } catch (error) {
      console.error('Error fetching asset owners:', error);
      return [];
    }
  },

  /**
* Retrieves user profile information
* @param user Principal of the user
* @returns Promise with user profile or null if not found
*/
  async getUserProfilebyId(user: Principal): Promise<UserProfile | null> {
    try {
      const result = await backend.getUserProfilebyId(user);
      return result[0] ?? null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  /**
 * Retrieves all transactions for a specific asset
 * @param assetId Asset ID
 * @returns Promise with array of asset transactions
 */
  async getAssetTransactions(assetId: string): Promise<Transaction[]> {
    try {
      return await backend.getAssetTransactions(assetId);
    } catch (error) {
      console.error('Error fetching asset transactions:', error);
      return [];
    }
  },

};
