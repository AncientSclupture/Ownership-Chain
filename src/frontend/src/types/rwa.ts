import { Principal } from '@dfinity/principal';

export interface Asset {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  totalValue: bigint;
  totalSupply: bigint;
  owner: Principal;
  status: AssetStatus;
  createdAt: bigint;
  updatedAt: bigint;
  location: [] | [string];
  documents: string[];
  metadata: Array<[string, string]>;
}

export interface Proposal {
  id: string;
  votersDetails: Array<[Principal, number, boolean]>;
  isApproved: boolean;
  assetId: string;
  createdAt: bigint;
  assetName: [] | [string];
  canConfirm: boolean;
  pricePerToken: bigint;
  currentApprovalPercentage: number;
  totalPrice: bigint;
  amount: bigint;
}

export interface VotableProposal {
  id: string;
  assetId: string;
  createdAt: bigint;
  buyer: Principal;
  pricePerToken: bigint;
  totalPrice: bigint;
  amount: bigint;
}


export interface Ownership {
  assetId: string;
  owner: Principal;
  amount: bigint;
  percentage: number;
  purchaseDate: bigint;
  purchasePrice: bigint;
}

export interface Transaction {
  id: string;
  assetId: string;
  from: Principal;
  to: Principal;
  amount: bigint;
  pricePerToken: bigint;
  totalPrice: bigint;
  transactionType: TransactionType;
  timestamp: bigint;
  status: TransactionStatus;
}

export interface UserProfile {
  principal: Principal;
  name: [] | [string];
  alias: [] | [string];
  verified: boolean;
  createdAt: bigint;
  totalAssets: bigint;
  totalValue: bigint;
}

export interface GetUserProfileResult {
  assets: [string, bigint, bigint][];
  recentTransactions: Transaction[];
  profile: UserProfile;
}

export interface PlatformStats {
  totalAssets: bigint;
  totalUsers: bigint;
  totalTransactions: bigint;
  totalValueLocked: bigint;
  assetsByType: Array<[AssetType, bigint]>;
}

export type AssetType = 
  | { Property: null }
  | { Business: null }
  | { Artwork: null }
  | { Vehicle: null }
  | { Equipment: null }
  | { Other: string };

export type AssetStatus = 
  | { Active: null }
  | { Inactive: null }
  | { UnderMaintenance: null }
  | { Sold: null }
  | { Pending: null };

export type TransactionType = 
  | { Buy: null }
  | { Sell: null }
  | { Transfer: null }
  | { Dividend: null }
  | { Maintenance: null };

export type TransactionStatus = 
  | { Pending: null }
  | { Completed: null }
  | { Failed: null }
  | { Cancelled: null };

export type Result<T, E> = { ok: T } | { err: E };

export type Result_2 =
  | { ok: bigint }
  | { err: string };
