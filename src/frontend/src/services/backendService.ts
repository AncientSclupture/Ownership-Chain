import { backend } from "../../../declarations/backend";
import { Asset, AssetStatus, AssetType, DocumentHash, IdentityNumberType, LocationType, Rule, UserOverviewResult } from "../../../declarations/backend/backend.did";
import { unwrapResult } from "../helper/rwa-helper";
import { AssetGuarantee, AssetSponsorship, Ownership, ProposalResult, Report, ReportType, Transaction, TypeReportEvidence } from "../types/rwa";
import type { Principal } from "@dfinity/principal";

export const backendService = {

    // done
    async getMyprofileInfo(): Promise<UserOverviewResult | null> {
        try {
            const res = await backend.getMyProfiles();
            return res.length === 0 ? null : res[0];
        } catch (error) {
            console.log(error)
            return null;
        }
    },

    // done
    async getAssets(): Promise<Asset[] | null> {
        try {
            const res = await backend.getAllAssets();
            return res;
        } catch (error) {
            console.error('Error fetching all assets:', error);
            return null;
        }
    },

    async getAssetbyRange(start: bigint, end: bigint): Promise<Asset[] | null> {
        try {
            const res = await backend.getAssetbyRange(start, end);
            return res;
        } catch (error) {
            throw (error)
        }
    },

    async getTotalAssetCount(): Promise<bigint> {
        try {
            const res = await backend.getAssetTotalCount();
            return res;
        } catch (error) {
            throw (error)
        }
    },

    // done
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
    ): Promise<string> {
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

            return unwrapResult(res);
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
    ): Promise<string> {
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

            return unwrapResult(res);
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
            const res = await backend.getAssetFullDetails(assetId);

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
    ): Promise<string> {
        try {
            const res = await backend.proposedBuyToken(assetId, token, pricePerToken);
            return unwrapResult(res);
        } catch (error) {
            throw error;
        }
    },

    // done
    async getPubKeyUser(): Promise<string | null> {
        try {
            const res = await backend.getUserPublicSignature();
            return res[0] ?? null;
        } catch (error) {
            console.log("get pub key: ", error);
            throw error;
        }
    },
    async getAssetDocumentHash(assetid: string): Promise<[DocumentHash[]] | []> {
        try {
            const res = await backend.getAssetSignature(assetid);
            console.log(res);
            return res;
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    async searchAsset(query: string, assetType: [] | [AssetStatus]): Promise<[] | [Asset]> {
        try {
            const res = await backend.seacrhAsset(query, assetType);
            console.log(query, assetType, res);
            return res;
        } catch (error) {
            console.log(error)
            throw (error)
        }
    },

    async getMyAssets(): Promise<Asset[]> {
        try {
            const res = await backend.getMyAssets();
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
            const res = await backend.getMyOwnerShip();
            if ((res as any).err) {
                throw new Error((res as any).err);
            }
            return res;
        } catch (error) {
            throw error;
        }
    },

    async changeAssetStatus(assetid: string, assetstatus: AssetStatus): Promise<string> {
        try {
            const res = await backend.changeAssetStatus(assetid, assetstatus);
            return unwrapResult(res);
        } catch (error) {
            throw error;
        }
    },

    async getMyAssetReport(): Promise<Report[]> {
        try {
            const res = await backend.getMyAssetReport()
            return res;
        } catch (error) {
            throw error;
        }
    },

    async getUserPublicKeybyPrincipal(user: Principal): Promise<[string] | []> {
        try {
            const res = await backend.getUserPublicKey(user);
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async createReport(
        content: string,
        description: string,
        targetid: string,
        evidence: [] | [TypeReportEvidence],
        reporttype: ReportType
    ): Promise<string> {
        try {
            const res = await backend.createReportAsset(content, description, targetid, evidence, reporttype);
            return unwrapResult(res);
        } catch (error) {
            throw error;
        }
    },

    async getReportById(id: string): Promise<Report[]> {
        try {
            const res = await backend.getReportById(id);
            return res;
        } catch (error) {
            throw (error)
        }
    },

    async solveReport(
        id: string,
        clarification: string,
        signaturedhash: [] | [string],
        submissionsignaturedhash: [] | [string]
    ): Promise<string> {
        try {
            const res = await backend.actionReport(id, clarification, signaturedhash, submissionsignaturedhash)
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async getProposalById(assetid: string): Promise<[ProposalResult[]] | []> {
        try {
            const res = await backend.getProposalbyAssetId(assetid);
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async getMyProposal(): Promise<[ProposalResult[]] | []> {
        try {
            const res = await backend.getMyProposal();
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async proceedDp(price: bigint, buyProposalId: string): Promise<string> {
        try {
            const res = await backend.proceedDownPayment(price, buyProposalId);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async finishedPayment(price: bigint, buyProposalId: string): Promise<string> {
        try {
            const res = await backend.finishedPayment(buyProposalId, price);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async approveBuyProposal(proposalId: string): Promise<string> {
        try {
            const res = await backend.approveBuyProposal(proposalId);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async initializeNewAssetSponsor(
        assetid: string,
        content: string,
        trustGuatantee: bigint,
    ): Promise<string> {
        try {
            const res = await backend.initializeNewAssetSponsor(assetid, content, trustGuatantee);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async addNewSponsor(
        assetid: string,
        content: string,
        trustGuatantee: bigint,
    ): Promise<string> {
        try {
            const res = await backend.addNewSponsor(assetid, content, trustGuatantee);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async createAssetGuarantee(
        assetid: string,
        content: string,
        amount: bigint,
    ): Promise<string> {
        try {
            const res = await backend.createAssetGuarantee(assetid, content, amount);
            return unwrapResult(res);
        } catch (error) {
            throw (error);
        }
    },

    async getAllSponsor(): Promise<AssetSponsorship[]> {
        try {
            const res = await backend.getAllSponsor();
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async getAllAssetGuarantees(): Promise<AssetGuarantee[]> {
        try {
            const res = await backend.getAllAssetGuarantees();
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async getAssetGuarantee(assetId: string): Promise<[] | [AssetGuarantee]> {
        try {
            const res = await backend.getAssetGuarantee(assetId);
            return res;
        } catch (error) {
            throw (error);
        }
    },

    async getSponsorsByAssetId(assetId: string): Promise<AssetSponsorship[]> {
        try {
            const res = await backend.getSponsorsByAssetId(assetId);
            return res;
        } catch (error) {
            throw (error);
        }
    },


};