import { backend } from "../../../declarations/backend";
import {
  Asset,
  AssetStatus,
  AssetType,
  DocumentHash,
  IdentityNumberType,
  LocationType,
  Rule,
} from "../../../declarations/backend/backend.did";
import { Ownership, Transaction } from "../types/rwa";
import { backendService } from "./backendService";

jest.mock("../../../declarations/backend", () => ({
  backend: {
    getMyProfiles: jest.fn(),
    getAllAssets: jest.fn(),
    getAssetById: jest.fn(),
    getAssetbyRange: jest.fn(),
    getAssetTotalCount: jest.fn(),
    createAsset: jest.fn(),
    registUser: jest.fn(),
    getAssetFullDetails: jest.fn(),
    proposedBuyToken: jest.fn(),
    getUserPublicSignature: jest.fn(),
    getAssetSignature: jest.fn(),
    seacrhAsset: jest.fn(),
  },
}));

const mockedBackend = backend as jest.Mocked<typeof backend>;

describe("backendService Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMyprofileInfo", () => {
    it("returns first user if available", async () => {
      mockedBackend.getMyProfiles.mockResolvedValue([{ id: "u1", name: "User1" } as any]);
      const result = await backendService.getMyprofileInfo();
      expect(result).toEqual({ id: "u1", name: "User1" });
    });

    it("returns null if empty", async () => {
      mockedBackend.getMyProfiles.mockResolvedValue([]);
      const result = await backendService.getMyprofileInfo();
      expect(result).toBeNull();
    });
  });

  describe("getAssets", () => {
    it("returns asset list", async () => {
      mockedBackend.getAllAssets.mockResolvedValue([{ id: "a1" } as any]);
      const result = await backendService.getAssets();
      expect(result).toEqual([{ id: "a1" }]);
    });

    it("returns null on error", async () => {
      mockedBackend.getAllAssets.mockRejectedValue(new Error("err"));
      const result = await backendService.getAssets();
      expect(result).toBeNull();
    });
  });

  describe("getAssetById", () => {
    it("returns first asset", async () => {
      mockedBackend.getAssetById.mockResolvedValue([{ id: "a1" } as any]);
      const result = await backendService.getAssetById("a1");
      expect(result).toEqual({ id: "a1" });
    });

    it("returns null if not found", async () => {
      mockedBackend.getAssetById.mockResolvedValue([]);
      const result = await backendService.getAssetById("x");
      expect(result).toBeNull();
    });
  });

  describe("getAssetbyRange", () => {
    it("returns range list", async () => {
      mockedBackend.getAssetbyRange.mockResolvedValue([{ id: "a2" } as any]);
      const res = await backendService.getAssetbyRange(0n, 10n);
      expect(res).toEqual([{ id: "a2" }]);
    });

    it("throws if backend error", async () => {
      mockedBackend.getAssetbyRange.mockRejectedValue(new Error("range fail"));
      await expect(backendService.getAssetbyRange(0n, 10n)).rejects.toThrow("range fail");
    });
  });

  describe("getTotalAssetCount", () => {
    it("returns total", async () => {
      mockedBackend.getAssetTotalCount.mockResolvedValue(42n);
      const res = await backendService.getTotalAssetCount();
      expect(res).toBe(42n);
    });

    it("throws if backend error", async () => {
      mockedBackend.getAssetTotalCount.mockRejectedValue(new Error("count fail"));
      await expect(backendService.getTotalAssetCount()).rejects.toThrow("count fail");
    });
  });

  describe("createAsset", () => {
    it("returns result if ok", async () => {
      mockedBackend.createAsset.mockResolvedValue({ ok: "done" } as any);
      const res = await backendService.createAsset(
        "n",
        "d",
        10n,
        5n,
        1n,
        2n,
        100n,
        {} as LocationType,
        [] as DocumentHash[],
        {} as AssetType,
        {} as AssetStatus,
        {} as Rule
      );
      expect(res).toEqual({ ok: "done" });
    });

    it("throws if error", async () => {
      mockedBackend.createAsset.mockResolvedValue({ err: "fail" } as any);
      await expect(
        backendService.createAsset(
          "n",
          "d",
          10n,
          5n,
          1n,
          2n,
          100n,
          {} as LocationType,
          [] as DocumentHash[],
          {} as AssetType,
          {} as AssetStatus,
          {} as Rule
        )
      ).rejects.toThrow("fail");
    });
  });

  describe("registUser", () => {
    it("returns success result", async () => {
      mockedBackend.registUser.mockResolvedValue({ ok: "user" } as any);
      const res = await backendService.registUser(
        "f",
        "l",
        "p",
        "c",
        "ct",
        "idn",
        {} as IdentityNumberType,
        "pk"
      );
      expect(res).toEqual({ ok: "user" });
    });

    it("throws if backend error", async () => {
      mockedBackend.registUser.mockResolvedValue({ err: "bad" } as any);
      await expect(
        backendService.registUser(
          "f",
          "l",
          "p",
          "c",
          "ct",
          "idn",
          {} as IdentityNumberType,
          "pk"
        )
      ).rejects.toThrow("bad");
    });
  });

  describe("getAssetDetails", () => {
    it("returns asset details", async () => {
      const details = [{
        asset: { id: "a1" } as Asset,
        ownerships: [] as Ownership[],
        transactions: [] as Transaction[],
        dividends: [] as Transaction[],
      }];
      mockedBackend.getAssetFullDetails.mockResolvedValue(details as any);
      const res = await backendService.getAssetDetails("a1");
      expect(res[0]?.asset).toEqual({ id: "a1" });
    });

    it("throws if backend error", async () => {
      mockedBackend.getAssetFullDetails.mockResolvedValue({ err: "notfound" } as any);
      await expect(backendService.getAssetDetails("a1")).rejects.toThrow("notfound");
    });
  });

  describe("proposedToken", () => {
    it("returns ok if success", async () => {
      mockedBackend.proposedBuyToken.mockResolvedValue({ ok: "buy" } as any);
      const res = await backendService.proposedToken("a1", 1n, 100n);
      expect(res).toEqual({ ok: "buy" });
    });

    it("throws if backend error", async () => {
      mockedBackend.proposedBuyToken.mockResolvedValue({ err: "denied" } as any);
      await expect(backendService.proposedToken("a1", 1n, 100n)).rejects.toThrow("denied");
    });
  });

  describe("getPubKeyUser", () => {
    it("returns pubkey", async () => {
      mockedBackend.getUserPublicSignature.mockResolvedValue(["PUBKEY"]);
      const res = await backendService.getPubKeyUser();
      expect(res).toBe("PUBKEY");
    });

    it("returns null if empty", async () => {
      mockedBackend.getUserPublicSignature.mockResolvedValue([]);
      const res = await backendService.getPubKeyUser();
      expect(res).toBeNull();
    });
  });

  describe("getAssetDocumentHash", () => {
    it("returns hash list", async () => {
      mockedBackend.getAssetSignature.mockResolvedValue([[{ hash: "doc" } as DocumentHash]]);
      const res = await backendService.getAssetDocumentHash("a1");
      expect(res[0]?.[0]?.hash).toBe("doc");
    });
  });

  describe("searchAsset", () => {
    it("returns search results", async () => {
      mockedBackend.seacrhAsset.mockResolvedValue([{ id: "a2" } as any]);
      const res = await backendService.searchAsset("Cari", []);
      expect(res).toEqual([{ id: "a2" }]);
    });

    it("throws if backend error", async () => {
      mockedBackend.seacrhAsset.mockRejectedValue(new Error("Backend error"));
      await expect(backendService.searchAsset("Cari", [])).rejects.toThrow("Backend error");
    });
  });
});
