import { describe, beforeEach, afterEach, it, expect, inject } from "vitest";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PocketIc, type Actor } from "@dfinity/pic";
import { Principal } from "@dfinity/principal";

// Import generated types for your canister
import {
  type _SERVICE,
  idlFactory,
  type Asset,
  type AssetType,
  type AssetStatus,
  type UserProfile,
  type Transaction,
  type Ownership,
  type Result,
  type Result_1,
  type Result_2,
} from "../../src/declarations/backend/backend.did.js";

// Define the path to your canister's WASM file
export const WASM_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  ".dfx",
  "local",
  "canisters",
  "backend",
  "backend.wasm",
);

// Helper function to create test asset data
const createTestAsset = () => ({
  name: "Test Property",
  description: "A beautiful test property for tokenization",
  assetType: { Property: null } as AssetType,
  totalValue: BigInt(1000000), // 1M tokens
  totalSupply: BigInt(10000), // 10K tokens
  location: ["Jakarta, Indonesia"] as [] | [string],
  documents: ["QmTestHash1", "QmTestHash2"],
  metadata: [["category", "residential"], ["year_built", "2020"]] as Array<[string, string]>,
});

describe("RWA Tokenization Backend Tests", () => {
  let pic: PocketIc;
  let canisterId: Principal;
  let actor: Actor<_SERVICE>;
  let secondActor: Actor<_SERVICE>;

  beforeEach(async () => {
    pic = await PocketIc.create(inject("PIC_URL"));

    const fixture = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: WASM_PATH,
    });

    actor = fixture.actor;
    canisterId = fixture.canisterId;

    // Create a second actor with different identity for multi-user tests
    secondActor = pic.createActor<_SERVICE>(idlFactory, canisterId);
  });

  afterEach(async () => {
    await pic?.tearDown();
  });
  describe("User Profile Management", () => {
    it("should create a user profile successfully", async () => {
      const result = await actor.createUserProfile(
        ["John Doe"],
        ["johndoe"]
      );

      expect(result).toHaveProperty("ok");
    });

    it("should prevent duplicate profile creation", async () => {
      // Create first profile
      await actor.createUserProfile(["John Doe"], ["johndoe"]);

      // Try to create another profile with same user
      const result = await actor.createUserProfile(
        ["Jane Doe"],
        ["janedoe"]
      );

      expect(result).toHaveProperty("err");
      expect(result.err).toContain("already exists");
    });

    it("should retrieve user profile", async () => {
      // Create profile first
      await actor.createUserProfile(["John Doe"], ["johndoe"]);

      const profile = await actor.getUserProfile();

      expect(profile).toBeDefined();
      expect(profile[0]).toBeDefined();
      expect(profile[0]?.profile.name[0]).toBe("John Doe");
      expect(profile[0]?.profile.alias[0]).toBe("johndoe");
    });

    it("should handle anonymous user profile creation", async () => {
      // Don't create explicit profile, just call getUserProfile
      const profile = await actor.getUserProfile();

      expect(profile).toBeDefined();
      expect(profile[0]).toBeDefined();
      expect(profile[0]?.profile.name).toEqual([]);
      expect(profile[0]?.profile.verified).toBe(false);
    });
  });

  describe("Asset Management", () => {
    it("should create an asset successfully", async () => {
      const testAsset = createTestAsset();

      const result = await actor.createAsset(
        testAsset.name,
        testAsset.description,
        testAsset.assetType,
        testAsset.totalValue,
        testAsset.totalSupply,
        testAsset.location,
        testAsset.documents,
        testAsset.metadata
      );

      expect(result).toHaveProperty("ok");
      expect((result as Result_1).ok).toMatch(/^ASSET_\d+$/);
    });

    it("should reject asset creation with zero supply", async () => {
      const testAsset = createTestAsset();

      const result = await actor.createAsset(
        testAsset.name,
        testAsset.description,
        testAsset.assetType,
        testAsset.totalValue,
        BigInt(0), // Zero supply
        testAsset.location,
        testAsset.documents,
        testAsset.metadata
      );

      expect(result).toHaveProperty("err");
      expect(result.err).toContain("must be greater than 0");
    });

    it("should retrieve created asset", async () => {
      const testAsset = createTestAsset();

      const createResult = await actor.createAsset(
        testAsset.name,
        testAsset.description,
        testAsset.assetType,
        testAsset.totalValue,
        testAsset.totalSupply,
        testAsset.location,
        testAsset.documents,
        testAsset.metadata
      );

      expect(createResult).toHaveProperty("ok");
      const assetId = (createResult as Result_1).ok as string;

      const asset = await actor.getAsset(assetId);

      expect(asset).toBeDefined();
      expect(asset.length).toBe(1);
      expect(asset[0]?.name).toBe(testAsset.name);
      expect(asset[0]?.description).toBe(testAsset.description);
      expect(asset[0]?.totalValue).toBe(testAsset.totalValue);
      expect(asset[0]?.totalSupply).toBe(testAsset.totalSupply);
    });

    it("should list all assets", async () => {
      const testAsset1 = createTestAsset();
      const testAsset2 = { ...createTestAsset(), name: "Test Business" };

      await actor.createAsset(
        testAsset1.name,
        testAsset1.description,
        testAsset1.assetType,
        testAsset1.totalValue,
        testAsset1.totalSupply,
        testAsset1.location,
        testAsset1.documents,
        testAsset1.metadata
      );

      await actor.createAsset(
        testAsset2.name,
        testAsset2.description,
        { Business: null } as AssetType,
        testAsset2.totalValue,
        testAsset2.totalSupply,
        testAsset2.location,
        testAsset2.documents,
        testAsset2.metadata
      );

      const assets = await actor.getAllAssets();

      expect(assets).toHaveLength(2);
      expect(assets.map(a => a.name)).toContain(testAsset1.name);
      expect(assets.map(a => a.name)).toContain(testAsset2.name);
    });

    it("should filter assets by type", async () => {
      const propertyAsset = createTestAsset();
      const businessAsset = { ...createTestAsset(), name: "Test Business" };

      await actor.createAsset(
        propertyAsset.name,
        propertyAsset.description,
        { Property: null },
        propertyAsset.totalValue,
        propertyAsset.totalSupply,
        propertyAsset.location,
        propertyAsset.documents,
        propertyAsset.metadata
      );

      await actor.createAsset(
        businessAsset.name,
        businessAsset.description,
        { Business: null } as AssetType,
        businessAsset.totalValue,
        businessAsset.totalSupply,
        businessAsset.location,
        businessAsset.documents,
        businessAsset.metadata
      );

      const properties = await actor.getAssetsByType({ Property: null } as AssetType);
      const businesses = await actor.getAssetsByType({ Business: null } as AssetType);

      expect(properties).toHaveLength(1);
      expect(businesses).toHaveLength(1);
      expect(properties[0].name).toBe(propertyAsset.name);
      expect(businesses[0].name).toBe(businessAsset.name);
    });
  });

  describe("Ownership Management", () => {
    let assetId: string;

    beforeEach(async () => {
      const testAsset = createTestAsset();
      const result = await actor.createAsset(
        testAsset.name,
        testAsset.description,
        testAsset.assetType,
        testAsset.totalValue,
        testAsset.totalSupply,
        testAsset.location,
        testAsset.documents,
        testAsset.metadata
      );
      assetId = (result as Result_1).ok as string;
    });

    it("should show initial ownership for asset creator", async () => {
      const owners = await actor.getAssetOwners(assetId);

      expect(owners).toHaveLength(1);
      expect(owners[0][1].amount).toBe(BigInt(10000)); // Full supply
      expect(owners[0][1].percentage).toBe(100.0);
    });

    it("should track user assets", async () => {
      const userAssets = await actor.getUserAssets();

      expect(userAssets).toHaveLength(1);
      expect(userAssets[0][0]).toBe(assetId);
      expect(userAssets[0][1]).toBe(BigInt(10000));
      expect(userAssets[0][2]).toBe(true); // Is original owner
    });
  });

  describe("Platform Statistics", () => {
    it("should return initial empty statistics", async () => {
      const stats = await actor.getPlatformStats();

      expect(stats.totalAssets).toBe(BigInt(0));
      expect(stats.totalUsers).toBe(BigInt(0));
      expect(stats.totalTransactions).toBe(BigInt(0));
      expect(stats.totalValueLocked).toBe(BigInt(0));
    });

    it("should update statistics after asset creation", async () => {
      const testAsset = createTestAsset();

      await actor.createAsset(
        testAsset.name,
        testAsset.description,
        testAsset.assetType,
        testAsset.totalValue,
        testAsset.totalSupply,
        testAsset.location,
        testAsset.documents,
        testAsset.metadata
      );

      const stats = await actor.getPlatformStats();

      expect(stats.totalAssets).toBe(BigInt(1));
      expect(stats.totalUsers).toBe(BigInt(1));
      expect(stats.totalValueLocked).toBe(testAsset.totalValue);

      // Check asset type breakdown
      const propertyCount = stats.assetsByType.find(
        ([type, _]) => 'Property' in type
      )?.[1];
      expect(propertyCount).toBe(BigInt(1));
    });
  });

});