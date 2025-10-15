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
export interface _SERVICE {
  'createAsset' : ActorMethod<[CreateAssetInputApi], string>,
  'fileComplaint' : ActorMethod<[string, string, ComplaintType], string>,
  'finishPayment' : ActorMethod<[string, string], string>,
  'getAllAssets' : ActorMethod<[], Array<Asset>>,
  'getAsset' : ActorMethod<[string], [] | [Asset]>,
  'getAssetComplaints' : ActorMethod<[string], Array<Complaint>>,
  'getAssetProposals' : ActorMethod<[string], Array<AssetProposal>>,
  'getMyOwnerships' : ActorMethod<[Principal], Array<AssetOwnership>>,
  'getMyProposals' : ActorMethod<[Principal], Array<AssetProposal>>,
  'processLiquidation' : ActorMethod<[string, bigint], string>,
  'proposeAssetPurchase' : ActorMethod<[string, bigint, bigint], string>,
  'resolveComplaint' : ActorMethod<[string, string], string>,
  'supportAsset' : ActorMethod<[string, bigint], string>,
  'transferOwnership' : ActorMethod<
    [string, string, bigint, Principal],
    string
  >,
  'voteProposal' : ActorMethod<[string, string], string>,
  'withdrawDPCashback' : ActorMethod<[string, string, bigint], string>,
  'withdrawFromTreasury' : ActorMethod<[string, string, bigint], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
