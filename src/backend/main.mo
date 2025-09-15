import LLMService "services/llmService";
import Text "mo:base/Text";
import Result "mo:base/Result";
import UserStorage "storage/UserStorage";
import TransactionStorage "storage/TransactionStorage";
import OwnershipsStorage "storage/ownershipsStorage";
import BuyProposalsStorage "storage/BuyProposalsStorage";
import InvestorProposalsStorage "storage/InvestorProposalsStorage";
import AssetService "services/assetService";
import AssetStorage "storage/AssetStorage";
import ProposalService "services/proposalService";
import UserService "services/userService";
import DataType "data/dataType";
import ReportService "services/reportService";
import ReportsStorage "storage/ReportsStorage";

persistent actor {
  // storage
  private transient let assetStorage = AssetStorage.AssetStorageClass();
  private transient let userStorage = UserStorage.UserStorageClass();
  private transient let transactionStorage = TransactionStorage.TransactionStorageClass();
  private transient let ownershipStorage = OwnershipsStorage.OwnershipStorageClass();
  private transient let buyproposalStorage = BuyProposalsStorage.BuyProposalStorageClass();
  private transient let investorStorage = InvestorProposalsStorage.InvestorProposalStorageClass();
  private transient let reportStorage = ReportsStorage.ReportStorageClass();

  // service
  private transient let llm = LLMService.LLMServiceClass();
  private transient let assetservice = AssetService.AssetServiceClass(assetStorage, ownershipStorage, userStorage);
  private transient let proposalservice = ProposalService.ProposalService(assetStorage, ownershipStorage, userStorage, transactionStorage, buyproposalStorage, investorStorage);
  private transient let userservice = UserService.UserServiceClass(userStorage, assetStorage, ownershipStorage, transactionStorage);
  private transient let reportservice = ReportService.ReportServiceClass(reportStorage, assetStorage, userStorage);

  // llm api
  public func askAI(question : Text) : async Text {
    await llm.getInfo(question);
  };

  // user api
  public shared (msg) func registUser(
    fullName : Text,
    lastName : Text,
    phone : Text,
    country : Text,
    city : Text,
    userIDNumber : Text,
    userIdentity : DataType.IdentityNumberType,
    publicsignature : Text,
  ) : async Result.Result<Text, Text> {
    await userservice.registUser(fullName, lastName, phone, country, city, userIDNumber, userIdentity, publicsignature, msg.caller);
  };

  public shared (msg) func getMyAssets() : async [DataType.Asset] {
    await userservice.getMyAssets(msg.caller);
  };

  public shared (msg) func getMyOwnerShip() : async [DataType.Ownership] {
    await userservice.getMyOwnerShip(msg.caller);
  };

  public shared (msg) func getMyProfiles() : async ?DataType.UserOverviewResult {
    await userservice.getMyProfiles(msg.caller);
  };

  public func getAssetFullDetails(assetId : Text) : async ?{
    asset : DataType.Asset;
    ownerships : [DataType.Ownership];
    transactions : [DataType.Transaction];
    dividends : [DataType.Transaction];
  } {
    await userservice.getAssetFullDetails(assetId);
  };

  public shared (msg) func getUserPublicSignature() : async ?Text {
    switch (userStorage.get(msg.caller)) {
      case (null) { return null };
      case (?user) { return ?user.publickey };
    };
  };

  public func getUserPublicKey(user : Principal) : async ?Text {
    switch (userStorage.get(user)) {
      case (null) { return null };
      case (?user) { return ?user.publickey };
    };
  };

  // asset api
  public func getAllAssets() : async [DataType.Asset] {
    assetStorage.getAll();
  };

  public func getAssetById(assetId : Text) : async ?DataType.Asset {
    assetStorage.get(assetId);
  };

  public func getAssetbyRange(startIndex : Nat, endIndex : Nat) : async [DataType.Asset] {
    assetStorage.getRange(startIndex, endIndex);
  };

  public func getAssetTotalCount() : async Nat {
    assetStorage.getTotalCount();
  };

  public func seacrhAsset(name : Text, assetType : ?DataType.AssetStatus) : async ?DataType.Asset {
    await assetservice.searchAssetByNameTypeStatus(name, assetType);
  };

  public shared (msg) func createAsset(
    name : Text,
    description : Text,
    totalToken : Nat,
    providedToken : Nat,
    minTokenPurchased : Nat,
    maxTokenPurchased : Nat,
    pricePerToken : Nat,
    locationInfo : DataType.LocationType,
    documentHash : [DataType.DocumentHash],
    assetType : DataType.AssetType,
    assetStatus : DataType.AssetStatus,
    rule : DataType.Rule,
  ) : async Result.Result<Text, Text> {
    await assetservice.createAsset(name, description, totalToken, providedToken, minTokenPurchased, maxTokenPurchased, pricePerToken, locationInfo, documentHash, assetType, assetStatus, rule, msg.caller);
  };

  public shared (msg) func changeAssetStatus(
    id : Text,
    status : DataType.AssetStatus,
  ) : async Result.Result<Text, Text> {
    await assetservice.changeAssetStatus(id, status, msg.caller);
  };

  // proposal api
  public shared (msg) func proposedBuyToken(
    assetId : Text,
    amount : Nat,
    pricePerToken : Nat,
  ) : async Result.Result<Text, Text> {
    await proposalservice.proposedBuyToken(assetId, amount, pricePerToken, msg.caller);
  };

  public shared (msg) func proceedDownPayment(
    price : Nat,
    buyProposalId : Text,
  ) : async Result.Result<Text, Text> {
    await proposalservice.proceedDownPayment(price, buyProposalId, msg.caller);
  };

  public shared (msg) func finishedPayment(
    proposalId : Text,
    price : Int,
  ) : async Result.Result<Text, Text> {
    await proposalservice.finishedPayment(proposalId, price, msg.caller);
  };

  public shared (msg) func approveBuyProposal(
    buyProposalId : Text
  ) : async Result.Result<Text, Text> {
    await proposalservice.approveBuyProposal(buyProposalId, msg.caller);
  };

  public shared (msg) func createIvestorProposal(
    assetId : Text,
    incomingInvestor : Principal,
    amount : Nat,
    pricePerToken : Nat,
  ) : async Result.Result<Text, Text> {
    await proposalservice.createIvestorProposal(assetId, incomingInvestor, amount, pricePerToken, msg.caller);
  };

  public shared (msg) func approveInvestorProposal(
    investorProposalId : Text
  ) : async Result.Result<Text, Text> {
    await proposalservice.approveInvestorProposal(investorProposalId, msg.caller);
  };

  public shared (msg) func finishTheInvitation(
    investorProposalId : Text,
    price : Nat,
  ) : async Result.Result<Text, Text> {
    await proposalservice.finishTheInvitation(investorProposalId, price, msg.caller);
  };

  // report api
  public func getAssetSignature(assetId : Text) : async ?[DataType.DocumentHash] {
    switch (assetStorage.get(assetId)) {
      case (null) return null;
      case (?asset) { return ?asset.documentHash };
    };
  };

  public shared (msg) func getMyAssetReport() : async [DataType.Report] {
    await reportservice.getMyAssetReport(msg.caller);
  };

  public shared (msg) func createReportAsset(
    content : Text,
    description : Text,
    targetid : Text,
    evidence : ?DataType.TypeReportEvidence,
    reporttype : DataType.ReportType,
  ) : async Result.Result<Text, Text> {
    await reportservice.createReport(msg.caller, content, description, targetid, evidence, reporttype);
  };
};
