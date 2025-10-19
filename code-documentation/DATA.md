# Asset Tokenization Smart Contract

Complete documentation for Motoko-based asset tokenization smart contract on the Internet Computer.

## 📋 Table of Contents

- [Overview](#overview)
- [Data Structure](#data-structure)
- [Core Data Types](#core-data-types)
- [Input Types](#input-types)
- [Key Features](#key-features)
- [Usage Examples](#usage-examples)
- [Security Considerations](#security-considerations)

## 🎯 Overview

This smart contract enables tokenization of physical, digital, or hybrid assets on the Internet Computer blockchain. The system supports:

- Creation and management of tokenized assets
- Fractional ownership through tokens
- Peer-to-peer trading between users
- Proposal and voting system
- Treasury management
- Complaint system for fraud and plagiarism detection

## 📊 Data Structure

### dataType.mo

This file contains all data type definitions used throughout the system.

## 🔑 Core Data Types

### Asset

Represents an asset to be tokenized.

```motoko
public type Asset = {
  id : Text;
  creator : Principal;
  name: Text;
  description : Text;
  
  totalToken : Nat;
  tokenLeft : Nat;
  pendingToken : Nat;
  minTokenPurchased : Nat;
  maxTokenPurchased : Nat;
  pricePerToken : Float;
  
  locationInfo : ?LocationType;
  documentHash : [AssetDocument];
  
  assetType : AssetType;
  assetStatus : AssetStatus;
  rule : [AssetRule];
  
  ownershipMaturityTime : Int;
  
  createdAt : Int;
  updatedAt : Int;
};
```

**Field Descriptions:**
- `id`: Unique identifier for the asset
- `creator`: Principal address of the asset creator
- `name`: Asset name
- `description`: Detailed asset description
- `totalToken`: Total tokens available
- `tokenLeft`: Remaining available tokens
- `pendingToken`: Tokens currently in transaction
- `minTokenPurchased`: Minimum tokens per purchase
- `maxTokenPurchased`: Maximum tokens per purchase
- `pricePerToken`: Price per token in float
- `locationInfo`: Optional location information
- `documentHash`: Array of related documents
- `assetType`: Type of asset (Physical/Digital/Hybrid)
- `assetStatus`: Asset status (Active/Pending/Inactive)
- `rule`: Array of rules applicable to the asset
- `ownershipMaturityTime`: Ownership maturity timestamp
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### AssetType

Asset category types:

```motoko
public type AssetType = {
  #Physical;  // Physical assets (property, vehicles, etc.)
  #Digital;   // Digital assets (NFTs, IP, etc.)
  #Hybrid;    // Combination of physical and digital
};
```

### AssetStatus

Asset condition status:

```motoko
public type AssetStatus = {
  #Active;    // Active and tradeable
  #Pending;   // Under verification
  #Inactive;  // Not active
};
```

### AssetDocument

Document structure for asset verification:

```motoko
public type AssetDocument = {
  name : Text;
  hash : Text;
  signature : Text;
};
```

### AssetRule

Rules applicable to an asset:

```motoko
public type AssetRule = {
  name : Text;
  content : Text;
};
```

### LocationType

Geographical location data:

```motoko
public type LocationType = {
  lat : Float;
  long : Float;
  details : [Text];
};
```

### AssetOwnership

Represents user's token ownership:

```motoko
public type AssetOwnership = {
  id : Text;
  assetid : Text;
  owner : Principal;
  tokenhold : Nat;
  openForSale : Bool;
  buyingprice : Float;
  upuntil : Int;
  holdat : Int;
};
```

**Field Descriptions:**
- `id`: Ownership identifier
- `assetid`: ID of the owned asset
- `owner`: Principal of token holder
- `tokenhold`: Number of tokens held
- `openForSale`: Whether tokens are available for sale
- `buyingprice`: Buying price per token
- `upuntil`: Offer expiration timestamp
- `holdat`: Timestamp when tokens were acquired

### Transaction

Transaction record in the system:

```motoko
public type Transaction = {
  id : Text;
  assetid : Text;
  to : Principal;
  from : Principal;
  totalprice : Float;
  transactionType : TransactionType;
  status : TransactionStatus;
  createdAt : Int;
};
```

### TransactionType

Types of transactions:

```motoko
public type TransactionType = {
  #Buy;                    // Token purchase
  #Transfer;               // Token transfer
  #Donepayment;           // Payment completed
  #DonepaymentCashback;   // Payment cashback
  #Supportasset;          // Asset support
  #Liquidation;           // Asset liquidation
  #Dividend;              // Dividend distribution
};
```

### TransactionStatus

Transaction status:

```motoko
public type TransactionStatus = {
  #Done;      // Transaction completed
  #Progress;  // In progress
  #Cancled;   // Cancelled (typo preserved from original)
};
```

### AssetProposal

Proposal system for asset changes:

```motoko
public type AssetProposal = {
  id : Text;
  from : Principal;
  assetid : Text;
  token : Nat;
  pricePerToken : Float;
  votes: [(Principal, Float)];
  createdAt : Int;
};
```

**Voting System:**
- Each token holder can vote
- Voting weight based on token holdings
- Default period: 1 week

### TreasuryLedger

Treasury records for assets:

```motoko
public type TreasuryLedger = {
  assetid : Text;
  tsid: Text;
  description : Text;
  treasuryledgerType: TresuryType;
  priceamount : Float;
  from: Principal;
  createdAt : Int;
};
```

### TresuryType

Types of treasury entries:

```motoko
public type TresuryType = {
  #Donepayment;    // Completed payment
  #AssetSupport;   // Asset support contribution
};
```

### Complaint

Complaint system for fraud and plagiarism:

```motoko
public type Complaint = {
  id : Text;
  reporter : Principal;
  reason : Text;
  complaintType: ComplaintType;
  assetid : Text;
  resolved : Bool;
  createdAt : Int;
};
```

### ComplaintType

Types of complaints:

```motoko
public type ComplaintType = {
  #Fraud;       // Fraudulent activity
  #Plagiarism;  // Plagiarism/forgery
};
```

### User

User data in the system:

```motoko
public type User = {
  principalAddress: Principal;
  surname: Text;
  mockBalance: Float;
  publickey: ?Text;
  userStatus: UserStatus;
};
```

### UserStatus

User account status:

```motoko
public type UserStatus = {
  #Approve;    // User approved
  #Suspended;  // User suspended
};
```

## 📝 Input Types

### inputType.mo

This file contains data types for API inputs.

### CreateAssetInputApi

Input for creating a new asset (from API):

```motoko
public type CreateAssetInputApi = {
  name : Text;
  description : Text;
  totalToken : Nat;
  tokenLeft : Nat;
  minTokenPurchased : Nat;
  maxTokenPurchased : Nat;
  pricePerToken : Float;
  locationInfo : ?DataType.LocationType;
  documentHash : [DataType.AssetDocument];
  assetType : DataType.AssetType;
  assetStatus : DataType.AssetStatus;
  rule : [DataType.AssetRule];
  ownershipMaturityTime : Int;
};
```

### CreateOwnershipInput

Input for creating new ownership:

```motoko
public type CreateOwnershipInput = {
  assetid : Text;
  owner : Principal;
  tokenhold : Nat;
  openForSale : Bool;
  buyingprice : Float;
  upuntil : Int;
  holdat : Int;
};
```

### TransactionInput

Input for creating transactions:

```motoko
public type TransactionInput = {
  assetid : Text;
  to : Principal;
  from : Principal;
  totalprice : Float;
  transactionType : DataType.TransactionType;
  status : DataType.TransactionStatus;
};
```

### AssetProposalInput

Input for creating proposals:

```motoko
public type AssetProposalInput = {
  from : Principal;
  assetid : Text;
  token : Nat;
  pricePerToken : Float;
};
```

### ComplaintInput

Input for filing complaints:

```motoko
public type ComplaintInput = {
  reporter : Principal;
  reason : Text;
  complaintType : DataType.ComplaintType;
  assetid : Text;
  resolved : Bool;
};
```

### CreateTreasuryLedgerInput

Input for recording treasury entries:

```motoko
public type CreateTreasuryLedgerInput = {
  assetid : Text;
  description : Text;
  treasuryledgerType : DataType.TresuryType;
  priceamount : Float;
  from : Principal;
};
```

## 🚀 Key Features

### 1. Asset Tokenization
- Convert physical/digital assets into tokens
- Fractional ownership capabilities
- Token supply management
- Multi-asset type support

### 2. Trading System
- Token purchase functionality
- Peer-to-peer transfers
- Open/close sale status
- Dynamic price management
- Transaction history tracking

### 3. Governance
- Proposal creation system
- Token-weighted voting
- Democratic decision making
- One week default voting period

### 4. Treasury Management
- Payment tracking
- Asset support contributions
- Comprehensive transaction ledger
- Multi-type treasury entries

### 5. Compliance & Safety
- Complaint filing system
- User suspension capabilities
- Asset verification process
- Document hashing for integrity validation
- Fraud and plagiarism detection

## 💡 Usage Examples

### Creating an Asset

```motoko
let assetInput : CreateAssetInputApi = {
  name = "Premium Real Estate Token";
  description = "Tokenized luxury apartment in downtown";
  totalToken = 1000;
  tokenLeft = 1000;
  minTokenPurchased = 1;
  maxTokenPurchased = 100;
  pricePerToken = 1000.0;
  locationInfo = ?{
    lat = 40.7128;
    long = -74.0060;
    details = ["New York", "Manhattan", "Downtown"]
  };
  documentHash = [{
    name = "Property Deed";
    hash = "abc123...";
    signature = "sig456..."
  }];
  assetType = #Physical;
  assetStatus = #Pending;
  rule = [{
    name = "Minimum Hold Period";
    content = "Tokens must be held for minimum 30 days"
  }];
  ownershipMaturityTime = 2592000; // 30 days in seconds
};
```

### Creating a Transaction

```motoko
let txInput : TransactionInput = {
  assetid = "asset-123";
  to = principalBuyer;
  from = principalSeller;
  totalprice = 5000.0;
  transactionType = #Buy;
  status = #Progress;
};
```

### Filing a Complaint

```motoko
let complaintInput : ComplaintInput = {
  reporter = principalReporter;
  reason = "Asset documents appear to be forged";
  complaintType = #Fraud;
  assetid = "asset-456";
  resolved = false;
};
```

## 📦 Dependencies

```motoko
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
```

## 🔐 Security Considerations

1. **Document Verification**: All documents use cryptographic hashing for integrity verification
2. **Principal-based Authentication**: Uses Internet Computer Principal for secure authentication
3. **Status Management**: Multiple status levels for workflow control
4. **Complaint System**: Built-in mechanism for reporting fraud and plagiarism
5. **User Suspension**: Ability to suspend users who violate terms
6. **Token Limits**: Min/max purchase limits to prevent manipulation
7. **Maturity Time**: Ownership maturity period to prevent immediate flipping
8. **Pending Tokens**: Separate tracking of tokens in active transactions

## 🏗️ Architecture

The system follows a modular architecture:

- **dataType.mo**: Core data type definitions
- **inputType.mo**: API input type definitions
- **Separation of Concerns**: Clear distinction between internal and API-facing types

## 🔄 Transaction Flow

1. **Asset Creation** → Pending status → Verification → Active
2. **Purchase** → Payment → Token allocation → Ownership record
3. **Transfer** → Verification → Update ownership → Transaction record
4. **Proposal** → Voting period → Execution/Rejection

## 📊 Token Economics

- Fractional ownership through tokenization
- Dynamic pricing per token
- Supply management (total, left, pending)
- Min/max purchase constraints
- Maturity period enforcement

## 🛠️ Development

### Prerequisites
- dfx (Internet Computer SDK)
- Motoko compiler
- Node.js (for testing)

### Setup
```bash
dfx start --background
dfx deploy
```

## 📄 License

[Add your license here]

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📧 Contact

[Add your contact information here]

## 🗺️ Roadmap

- [ ] Implement main contract logic
- [ ] Add unit tests
- [ ] Integrate with frontend
- [ ] Deploy to mainnet
- [ ] Add dividend distribution mechanism
- [ ] Implement governance voting logic
- [ ] Add secondary market features

---

**Note**: This is a documentation for the data types module. Actual contract implementation should be added separately.