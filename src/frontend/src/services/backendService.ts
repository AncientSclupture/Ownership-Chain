import { backend } from "../../../declarations/backend";
import { Asset, AssetType, GetUserProfileResult, Ownership, PlatformStats, Proposal, Result, Result_2, Transaction, UserProfile, VotableProposal } from "../types/rwa";
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
   * Propose to buy tokens for fractional ownership
   * @param assetId Asset ID to buy tokens for
   * @param amount Number of tokens to buy
   * @param pricePerToken Price per token
   * @returns Promise with transaction ID or error message
   */
  async proposeToBuy(
    assetId: string,
    amount: number,
    pricePerToken: number
  ): Promise<Result<string, string>> {
    try {
      return await backend.proposeBuyTokens(
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
  async getUserAssets(): Promise<Array<[string, bigint, boolean]>> {
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


  /**
  * Retrieves all proposals created by the current user.
  * 
  * Each proposal contains information about a token purchase request for a specific asset,
  * including the voting details from other asset holders, approval status, and pricing.
  * 
  * @returns Promise resolving to an array of user's proposals with the following structure:
  * - id: Unique identifier of the proposal
  * - votersDetails: Array of tuples [Principal, number, boolean] representing voter's identity,
  *   their ownership percentage, and whether they approved the proposal
  * - isApproved: Indicates whether the proposal has been approved (based on >50% votes)
  * - assetId: ID of the asset related to the proposal
  * - createdAt: Timestamp of when the proposal was created (as bigint)
  * - assetName: Optional name of the asset ([string] or empty [])
  * - canConfirm: Whether the user is allowed to finalize the proposal
  * - pricePerToken: Price per token in smallest unit (e.g., e8s for ICP)
  * - currentApprovalPercentage: Current total approval percentage from voters
  * - totalPrice: Total price proposed for the token purchase
  * - amount: Total number of tokens proposed to be purchased
  */
  async getMyProposals(): Promise<Proposal[]> {
    try {
      const result = await backend.getMyProposals();
      return result;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return [];
    }
  },

  /**
  * Retrieves all proposals that the current user is eligible to vote on.
  * 
  * @returns Promise resolving to an array of votable proposals
  */
  async getVotableProposals(): Promise<VotableProposal[]> {
    try {
      const result = await backend.getVotableProposals();
      return result;
    } catch (error) {
      console.error("Error fetching votable proposals:", error);
      return [];
    }
  },

  /**
  * Approves a buy token proposal with the given proposal ID.
  * @param proposalId - The ID of the proposal to approve
  * @returns Promise resolving to either:
  *   - { ok: string } on success with a message
  *   - { err: string } on failure with an error description
  */
  async approveBuyProposal(proposalId: string): Promise<Result<string, string>> {
    try {
      const result = await backend.approveBuyProposal(proposalId);
      return result;
    } catch (error) {
      console.error("Error approving proposal:", error);
      return { err: "Failed to approve proposal due to unexpected error." };
    }
  },

  /**
 * Confirmation a buy token proposal with the given proposal ID.
 * @param proposalId - The ID of the proposal to approve
 * @returns Promise resolving to either:
 *   - { ok: string } on success with a message
 *   - { err: string } on failure with an error description
 */
  async confirmBuyProposal(proposalId: string): Promise<Result<string, string>> {
    try {
      const result = await backend.confirmBuyProposal(proposalId);
      return result;
    } catch (error) {
      console.error("Error approving proposal:", error);
      return { err: "Failed to approve proposal due to unexpected error." };
    }
  },

  /**
   * Distributes dividend tokens to all holders of a specific asset.
   *
   * Only the original asset owner can invoke this function.
   *
   * @param assetId - The ID of the asset to distribute dividends for
   * @param totalDividend - The total dividend amount to be distributed
   * @returns Promise resolving to:
   *   - { ok: bigint } - Number of recipients who successfully received dividends
   *   - { err: string } - Error message if the operation failed
   */
  async distributeDividend(assetId: string, totalDividend: bigint): Promise<Result_2> {
    try {
      const result = await backend.distributeDividend(assetId, totalDividend);
      return result;
    } catch (error) {
      console.error("Error distributing dividend:", error);
      return { err: "Unexpected error during dividend distribution" };
    }
  }

};
