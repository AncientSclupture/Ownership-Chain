import { backend } from "../../../declarations/backend";
import { Asset } from "../types/rwa";

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
};
