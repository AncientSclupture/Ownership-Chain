import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'id' : string,
  'documentHash' : Array<DocumentHash>,
  'creator' : Principal,
  'totalToken' : bigint,
  'providedToken' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'rule' : Rule,
  'description' : string,
  'maxTokenPurchased' : bigint,
  'updatedAt' : bigint,
  'assetStatus' : AssetStatus,
  'tokenLeft' : bigint,
  'assetType' : AssetType,
  'pricePerToken' : bigint,
  'locationInfo' : LocationType,
  'pendingToken' : bigint,
  'minTokenPurchased' : bigint,
  'riskScore' : number,
}
export type AssetStatus = { 'Open' : null } |
  { 'Inactive' : null } |
  { 'Active' : null } |
  { 'Pending' : null };
export type AssetType = { 'Artwork' : null } |
  { 'Business' : null } |
  { 'Vehicle' : null } |
  { 'Property' : null } |
  { 'Equipment' : null };
export interface DocumentHash {
  'hash' : string,
  'name' : string,
  'description' : string,
}
export type IdentityNumberType = { 'IdentityNumber' : null } |
  { 'LiscenseNumber' : null } |
  { 'Pasport' : null };
export type KycStatus = { 'Rejected' : null } |
  { 'Verivied' : null } |
  { 'Pending' : null };
export interface LocationType {
  'lat' : number,
  'long' : number,
  'details' : Array<string>,
}
export interface Ownership {
  'id' : string,
  'purchasePrice' : bigint,
  'maturityDate' : bigint,
  'purchaseDate' : bigint,
  'owner' : Principal,
  'tokenOwned' : bigint,
  'percentage' : number,
}
export interface Report {
  'id' : string,
  'created' : bigint,
  'content' : string,
  'description' : string,
  'isDone' : bigint,
  'reputation' : bigint,
  'reportType' : ReportType,
  'evidence' : [] | [TypeReportEvidence],
  'complainer' : Principal,
  'isDoneTimeStamp' : bigint,
  'targetid' : string,
}
export type ReportType = { 'Scam' : null } |
  { 'Fraud' : null } |
  { 'Plagiarism' : null } |
  { 'Legality' : null } |
  { 'Bankrupting' : null };
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface Rule {
  'downPaymentMaturityTime' : bigint,
  'sellSharing' : boolean,
  'sellSharingPrice' : bigint,
  'sellSharingNeedVote' : boolean,
  'ownerShipMaturityTime' : bigint,
  'downPaymentCashback' : number,
  'details' : Array<string>,
  'paymentMaturityTime' : bigint,
  'minDownPaymentPercentage' : number,
  'needDownPayment' : boolean,
}
export interface Transaction {
  'id' : string,
  'to' : Principal,
  'transactionType' : TransactionType,
  'assetId' : string,
  'from' : Principal,
  'totalPurchasedToken' : bigint,
  'timestamp' : bigint,
  'details' : [] | [string],
  'pricePerToken' : bigint,
  'transactionStatus' : TransactionStatus,
  'totalPrice' : bigint,
}
export type TransactionStatus = { 'Failed' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export type TransactionType = { 'Buy' : null } |
  { 'Dividend' : null } |
  { 'Downpayment' : null } |
  { 'Redeem' : null } |
  { 'Sell' : null } |
  { 'Extending' : null } |
  { 'DownpaymentCashBack' : null } |
  { 'Transfer' : null };
export interface TypeReportEvidence {
  'hashclarity' : [] | [string],
  'footPrintFlow' : [] | [bigint],
}
export interface User {
  'id' : string,
  'country' : string,
  'timeStamp' : bigint,
  'publickey' : string,
  'city' : string,
  'userIdentity' : IdentityNumberType,
  'fullName' : string,
  'kyc_level' : UserKyc,
  'phone' : string,
  'lastName' : string,
  'userIDNumber' : string,
}
export interface UserKyc { 'status' : KycStatus, 'riskScore' : bigint }
export interface UserOverviewResult {
  'asset' : { 'token' : bigint, 'total' : bigint },
  'ownership' : { 'token' : bigint, 'total' : bigint },
  'transaction' : {
    'buy' : bigint,
    'total' : bigint,
    'dividend' : bigint,
    'sell' : bigint,
    'transfer' : bigint,
  },
  'userIdentity' : User,
}
export interface _SERVICE {
  'approveBuyProposal' : ActorMethod<[string], Result>,
  'approveInvestorProposal' : ActorMethod<[string], Result>,
  'askAI' : ActorMethod<[string], string>,
  'changeAssetStatus' : ActorMethod<[string, AssetStatus], Result>,
  'createAsset' : ActorMethod<
    [
      string,
      string,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      LocationType,
      Array<DocumentHash>,
      AssetType,
      AssetStatus,
      Rule,
    ],
    Result
  >,
  'createIvestorProposal' : ActorMethod<
    [string, Principal, bigint, bigint],
    Result
  >,
  'finishTheInvitation' : ActorMethod<[string, bigint], Result>,
  'finishedPayment' : ActorMethod<[string, bigint], Result>,
  'getAllAssets' : ActorMethod<[], Array<Asset>>,
  'getAssetById' : ActorMethod<[string], [] | [Asset]>,
  'getAssetFullDetails' : ActorMethod<
    [string],
    [] | [
      {
        'asset' : Asset,
        'ownerships' : Array<Ownership>,
        'transactions' : Array<Transaction>,
        'dividends' : Array<Transaction>,
      }
    ]
  >,
  'getAssetSignature' : ActorMethod<[string], [] | [Array<DocumentHash>]>,
  'getMyAssetReport' : ActorMethod<[], Array<Report>>,
  'getMyAssets' : ActorMethod<[], Array<Asset>>,
  'getMyOwnerShip' : ActorMethod<[], Array<Ownership>>,
  'getMyProfiles' : ActorMethod<[], [] | [UserOverviewResult]>,
  'getUserPublicSignature' : ActorMethod<[], [] | [string]>,
  'proceedDownPayment' : ActorMethod<[bigint, string], Result>,
  'proposedBuyToken' : ActorMethod<[string, bigint, bigint], Result>,
  'registUser' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      IdentityNumberType,
      string,
    ],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
