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
  'pricePerToken' : number,
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
  'buyingprice' : number,
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
  'pricePerToken' : number,
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
  'pricePerToken' : number,
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
  'totalprice' : number,
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
  'priceamount' : number,
}
export type TresuryType = { 'AssetSupport' : null } |
  { 'Donepayment' : null };
export interface User {
  'principalAddress' : Principal,
  'publickey' : [] | [string],
  'surname' : string,
  'mockBalance' : number,
  'userStatus' : UserStatus,
}
export type UserStatus = { 'Approve' : null } |
  { 'Suspended' : null };
export interface _SERVICE {
  'addPublicKey' : ActorMethod<[string], [boolean, string]>,
  'buyOwnership' : ActorMethod<
    [string, string, number, Principal],
    [boolean, string]
  >,
  'createAsset' : ActorMethod<[CreateAssetInputApi], [boolean, string]>,
  'fileComplaint' : ActorMethod<
    [string, string, ComplaintType],
    [boolean, string]
  >,
  'finishPayment' : ActorMethod<[string, string, number], [boolean, string]>,
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
  'getBalanceForDemo' : ActorMethod<[], [boolean, string]>,
  'getDevBalance' : ActorMethod<[], number>,
  'getMyOwnerships' : ActorMethod<[Principal], Array<AssetOwnership>>,
  'getMyProposals' : ActorMethod<[Principal], Array<AssetProposal>>,
  'getOwnershipById' : ActorMethod<[string, string], [] | [AssetOwnership]>,
  'getPersonalAset' : ActorMethod<[Principal], Array<Asset>>,
  'getProposal' : ActorMethod<[string, string], [] | [AssetProposal]>,
  'getRegisteredUser' : ActorMethod<[Principal], [] | [User]>,
  'getTotalAsset' : ActorMethod<[], bigint>,
  'getTransactionByTransactionId' : ActorMethod<
    [string, string],
    [] | [Transaction]
  >,
  'getTreasuryByAssetId' : ActorMethod<[string, string], [] | [TreasuryLedger]>,
  'inactiveAsset' : ActorMethod<[string], [boolean, string]>,
  'myBalance' : ActorMethod<[], number>,
  'openMyOwnership' : ActorMethod<[string, string], [boolean, string]>,
  'processLiquidation' : ActorMethod<[string], [boolean, string]>,
  'proposeAssetPurchase' : ActorMethod<
    [string, bigint, number, number],
    [boolean, string]
  >,
  'registKyc' : ActorMethod<[string, [] | [string]], [boolean, string]>,
  'resolveComplaint' : ActorMethod<[string, string], string>,
  'shareDevidend' : ActorMethod<[string, number], [boolean, string]>,
  'supportAsset' : ActorMethod<[string, number], [boolean, string]>,
  'totalRegisteredUser' : ActorMethod<[], bigint>,
  'transferOwnership' : ActorMethod<
    [string, string, Principal],
    [boolean, string]
  >,
  'voteProposal' : ActorMethod<[string, string], [boolean, string]>,
  'withdrawDPCashback' : ActorMethod<
    [string, string, string, number],
    [boolean, string]
  >,
  'withdrawFromTreasury' : ActorMethod<[string, string, number], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
