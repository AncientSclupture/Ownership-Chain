# 🛠️ Backend Documentation – OwnershipChain

## 🚀 Executive Summary
The **OwnershipChain backend** is the trusted foundation for tokenized asset ownership, built on the **Internet Computer (ICP)** using **Motoko**.  
It provides the rails for **asset registration, tokenized ownership, shareholder governance, and dividend distribution** — all fully on-chain.  

Every component is designed with modular precision, divided into two core layers:  
- **Storage Layer** → Immutable, efficient ledgers for users, assets, transactions, and ownership records.  
- **Service Layer** → Smart business logic that governs proposals, asset management, and transparent reporting.  

At the center lies the **Main Actor (`main.mo`)**, acting as the canister API gateway. It connects services to storage and safely exposes public endpoints for developers, governments, and investors.  

---

## 📦 Storage Layer

The storage layer is the **ledger of truth**. Immutable, auditable, and designed for efficiency with `HashMap` and `TrieMap` structures (O(1) lookup).  

### 🔐 UserStorage
- Stores user profiles bound to **Principal IDs**.  
- Attributes: `fullName`, `phone`, `publicKey`, `kyc_level`, etc.  
- Functions: `create`, `get`, `getAll`, `update`.  
*Meaning*: Users are not just identities — they are the **root of trust** for every transaction.  

### 🏛️ AssetStorage
- Stores **tokenized assets** (land, property, digital assets).  
- Each asset has a unique `asset_n` ID.  
- Attributes: `name`, `description`, `totalToken`, `pricePerToken`, `documentHash`, `assetType`.  
- Functions: `create`, `get`, `getAll`, `getRange`, `findAssetByName`, `update`.  
*Meaning*: Assets are the **core entities** that will be fractionalized into tokens.  

### 📊 OwnershipStorage
- Maintains distribution of ownership in `TrieMap<Principal, Ownership>`.  
- Supports:  
  - `transferOwnership` → partial transfer  
  - `changeOwnership` → total transfer  
  - `addNewOwnershipHolder` → onboard new investors  
- Validates percentages to ensure ownership never exceeds 100%.  
*Meaning*: This is the **ownership ledger** — the backbone of trust and governance.  

### 🤝 ProposalStorage
Two proposal types enable democratic decision-making:  
- **BuyProposalStorage** → for token purchase requests.  
- **InvestorProposalStorage** → for onboarding new investors.  

Each records:  
- Buyer/Investor  
- Token amount & pricing  
- Approval voting (≥50%)  

*Meaning*: Proposals = **decentralized governance**, not unilateral deals.  

### 💸 TransactionStorage
- Immutable records of all transactions: purchases, payments, dividend distributions.  
- Each transaction is timestamped.  
*Meaning*: The **internal financial ledger**, auditable by the public.  

### 🛡️ Reports & ReportActions
- **ReportsStorage** → holds asset-related reports (condition, legal status, etc.).  
- **ReportActionStorage** → logs actions such as validation, approvals, or amendments.  
*Meaning*: Transparency goes beyond ownership — it extends to **asset health and compliance**.  

---

## ⚙️ Service Layer

If the storage is the database, the **Service Layer is the brain** — executing rules and governance.  

- **UserService** → Register users, query personal ownership.  
- **AssetService** → Search, create, and manage assets.  
- **ProposalService** → Handle voting, approvals, payments.  
- **ReportService** → File and manage asset reports.  
- **LLMService** → AI-powered transparency & historical asset analysis.  

*Meaning*: Services are the **contracts of fairness** that ensure no single party can cheat the system.  

---

## 🎯 Main Actor (`main.mo`)

The **API Gateway** that bridges storage and services, exposing safe endpoints to the outside world.  

Example APIs:  
```motoko
public shared (msg) func registUser(...) : async Result.Result<Text, Text>;
public shared (msg) func createAsset(...) : async Result.Result<Text, Text>;
public shared (msg) func proposedBuyToken(...) : async Result.Result<Text, Text>;
public shared (msg) func getMyAssets() : async [DataType.Asset];
