import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'id' : string,
  'documentHash' : Array<AssetDocument>,
  'creator' : Principal,
  'totalToken' : bigint,
  'ownershipMaturityTime' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'rule' : Array<AssetRule>,
  'description' : string,
  'maxTokenPurchased' : bigint,
  'updatedAt' : bigint,
  'assetStatus' : AssetStatus,
  'tokenLeft' : bigint,
  'assetType' : AssetType,
  'pricePerToken' : bigint,
  'locationInfo' : [] | [LocationType],
  'pendingToken' : bigint,
  'minTokenPurchased' : bigint,
}
export interface AssetDocument {
  'signature' : string,
  'hash' : string,
  'name' : string,
}
export interface AssetOwnership {
  'id' : string,
  'buyingprice' : bigint,
  'assetid' : string,
  'owner' : Principal,
  'openForSale' : boolean,
  'upuntil' : bigint,
  'tokenhold' : bigint,
  'holdat' : bigint,
}
export interface AssetProposal {
  'id' : string,
  'token' : bigint,
  'assetid' : string,
  'votes' : Array<[Principal, number]>,
  'from' : Principal,
  'createdAt' : bigint,
  'pricePerToken' : bigint,
}
export interface AssetRule { 'content' : string, 'name' : string }
export type AssetStatus = { 'Inactive' : null } |
  { 'Active' : null } |
  { 'Pending' : null };
export type AssetType = { 'Digital' : null } |
  { 'Physical' : null } |
  { 'Hybrid' : null };
export interface Complaint {
  'id' : string,
  'resolved' : boolean,
  'complaintType' : ComplaintType,
  'assetid' : string,
  'createdAt' : bigint,
  'reporter' : Principal,
  'reason' : string,
}
export type ComplaintType = { 'Fraud' : null } |
  { 'Plagiarism' : null };
export interface CreateAssetInputApi {
  'documentHash' : Array<AssetDocument>,
  'totalToken' : bigint,
  'ownershipMaturityTime' : bigint,
  'name' : string,
  'rule' : Array<AssetRule>,
  'description' : string,
  'maxTokenPurchased' : bigint,
  'assetStatus' : AssetStatus,
  'tokenLeft' : bigint,
  'assetType' : AssetType,
  'pricePerToken' : bigint,
  'locationInfo' : [] | [LocationType],
  'minTokenPurchased' : bigint,
}
export interface LocationType {
  'lat' : number,
  'long' : number,
  'details' : Array<string>,
}
export interface Transaction {
  'id' : string,
  'to' : Principal,
  'status' : TransactionStatus,
  'transactionType' : TransactionType,
  'assetid' : string,
  'totalprice' : bigint,
  'from' : Principal,
  'createdAt' : bigint,
}
export type TransactionStatus = { 'Done' : null } |
  { 'Cancled' : null } |
  { 'Progress' : null };
export type TransactionType = { 'Buy' : null } |
  { 'Dividend' : null } |
  { 'Supportasset' : null } |
  { 'Liquidation' : null } |
  { 'Transfer' : null } |
  { 'Donepayment' : null } |
  { 'DonepaymentCashback' : null };
export interface TreasuryLedger {
  'assetid' : string,
  'from' : Principal,
  'createdAt' : bigint,
  'tsid' : string,
  'description' : string,
  'treasuryledgerType' : TresuryType,
  'priceamount' : bigint,
}
export type TresuryType = { 'AssetSupport' : null } |
  { 'Donepayment' : null };
export interface _SERVICE {
  'buyOwnership' : ActorMethod<
    [string, string, bigint, Principal],
    [boolean, string]
  >,
  'createAsset' : ActorMethod<[CreateAssetInputApi], [boolean, string]>,
  'fileComplaint' : ActorMethod<
    [string, string, ComplaintType],
    [boolean, string]
  >,
  'finishPayment' : ActorMethod<[string, string, bigint], [boolean, string]>,
  'getAllAssets' : ActorMethod<[], Array<Asset>>,
  'getAllTransactionsByAssetId' : ActorMethod<[string], Array<Transaction>>,
  'getAllTreasury' : ActorMethod<[], Array<TreasuryLedger>>,
  'getAllTreasuryByAssetId' : ActorMethod<[string], Array<TreasuryLedger>>,
  'getAsset' : ActorMethod<[string], [] | [Asset]>,
  'getAssetByRange' : ActorMethod<[bigint, bigint], Array<Asset>>,
  'getAssetComplaints' : ActorMethod<[string], Array<Complaint>>,
  'getAssetDividend' : ActorMethod<[string], Array<Transaction>>,
  'getAssetOwnerships' : ActorMethod<[string], Array<AssetOwnership>>,
  'getAssetProposals' : ActorMethod<[string], Array<AssetProposal>>,
  'getMyOwnerships' : ActorMethod<[Principal], Array<AssetOwnership>>,
  'getMyProposals' : ActorMethod<[Principal], Array<AssetProposal>>,
  'getOwnershipById' : ActorMethod<[string, string], [] | [AssetOwnership]>,
  'getPersonalAset' : ActorMethod<[Principal], Array<Asset>>,
  'getTotalAsset' : ActorMethod<[], bigint>,
  'getTransactionByTransactionId' : ActorMethod<
    [string, string],
    [] | [Transaction]
  >,
  'processLiquidation' : ActorMethod<[string, bigint], [boolean, string]>,
  'proposeAssetPurchase' : ActorMethod<
    [string, bigint, bigint, bigint],
    [boolean, string]
  >,
  'resolveComplaint' : ActorMethod<[string, string], string>,
  'supportAsset' : ActorMethod<[string, bigint], [boolean, string]>,
  'transferOwnership' : ActorMethod<
    [string, string, Principal],
    [boolean, string]
  >,
  'voteProposal' : ActorMethod<[string, string], [boolean, string]>,
  'withdrawDPCashback' : ActorMethod<
    [string, string, bigint],
    [boolean, string]
  >,
  'withdrawFromTreasury' : ActorMethod<[string, string, bigint], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
