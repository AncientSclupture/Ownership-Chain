import { backend } from "../../../declarations/backend";
import { Asset } from "../../../declarations/backend/backend.did";


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

};
