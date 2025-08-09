import { backend } from "../../../declarations/backend";


export const backendService = {

    async getAllAssets(): Promise<void> {
        try {
            const res = await backend.getUsers();
            console.log("hallo", res);
        } catch (error) {
            console.error('Error fetching all assets:', error);
        }
    },

};
