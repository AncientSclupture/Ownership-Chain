# Main Contract API Documentation

Complete API documentation for the Asset Tokenization Smart Contract main module.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Public Methods](#public-methods)
  - [Asset Management](#asset-management)
  - [Proposal & Voting](#proposal--voting)
  - [Ownership Transfer](#ownership-transfer)
  - [Treasury & Financial](#treasury--financial)
  - [Complaint System](#complaint-system)
  - [User Management](#user-management)
  - [Query Methods](#query-methods)
- [Business Flows](#business-flows)
- [Fee Structure](#fee-structure)
- [Security & Validation](#security--validation)
- [Usage Examples](#usage-examples)

## 🎯 Overview

The main contract (`main.mo`) is the entry point for all user interactions with the asset tokenization platform. It orchestrates multiple storage modules to provide a complete fractional ownership system.

### Key Features
- **Asset Tokenization**: Create and manage tokenized assets
- **Proposal System**: Democratic buying process with voting
- **Ownership Management**: Transfer and trade token ownership
- **Treasury System**: Financial management with DP and support funds
- **Complaint Handling**: Report and resolve fraud/plagiarism
- **Liquidation**: Fair distribution during asset bankruptcy
- **Dividend Distribution**: Proportional profit sharing

## 🏗️ Architecture

```motoko
persistent actor {
  // Storage Modules
  private transient let assetStorage
  private transient let assetproposalStorage
  private transient let complaintStorage
  private transient let ownershipStorage
  private transient let transactionStorage
  private transient let treasuryStorage
  private transient let userStorage
}
```

**Note**: Uses `persistent actor` with `transient` storage modules for upgrade compatibility.

---

## 📝 Public Methods

### Asset Management

#### `createAsset(input: CreateAssetInputApi): async (Bool, Text)`

Creates a new tokenized asset.

**Parameters:**
```motoko
{
  name: Text;
  description: Text;
  totalToken: Nat;
  tokenLeft: Nat;
  minTokenPurchased: Nat;
  maxTokenPurchased: Nat;
  pricePerToken: Float;
  locationInfo: ?LocationType;
  documentHash: [AssetDocument];
  assetType: AssetType;
  assetStatus: AssetStatus;
  rule: [AssetRule];
  ownershipMaturityTime: Int;
}
```

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Charges 5% fee of total asset value
2. Creates asset record
3. Creates initial ownership for creator (held tokens)
4. Returns asset ID

**Fee:** `5%` of `(pricePerToken * totalToken)`

**Example:**
```motoko
let input = {
  name = "Luxury Apartment Downtown";
  description = "Premium 2BR apartment";
  totalToken = 1000;
  tokenLeft = 800;
  minTokenPurchased = 10;
  maxTokenPurchased = 100;
  pricePerToken = 100.0;
  // ... other fields
};

let (success, msg) = await contract.createAsset(input);
// Returns: (true, "Asset created successfully with id: asset-0")
```

**Validations:**
- User must have sufficient balance for fee
- User must be registered

---

#### `inactiveAsset(assetid: Text): async (Bool, Text)`

Marks an asset as inactive (e.g., bankruptcy, fraud).

**Parameters:**
- `assetid`: Asset identifier

**Returns:** `(success: Bool, message: Text)`

**Authorization:** Only asset creator

**Fee:** `50%` of total asset value

**Validations:**
- Caller must be asset creator
- Sufficient balance for penalty fee

---

### Proposal & Voting

#### `proposeAssetPurchase(assetid: Text, token: Nat, pricePerToken: Float, amount: Float): async (Bool, Text)`

Creates a purchase proposal with down payment.

**Parameters:**
- `assetid`: Target asset ID
- `token`: Number of tokens to purchase
- `pricePerToken`: Price per token
- `amount`: Payment amount (must cover DP)

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Validates asset exists and has sufficient tokens
2. Checks min/max token constraints
3. Calculates DP (20% of total price)
4. Validates DP amount
5. Stores DP in treasury (#Donepayment)
6. Creates proposal
7. Records transaction

**DP Calculation:** `20%` of `(token * pricePerToken)`

**Example:**
```motoko
// Buy 50 tokens at 100.0 each
// Total: 5000.0, DP: 1000.0
let (success, msg) = await contract.proposeAssetPurchase(
  "asset-0",
  50,
  100.0,
  1000.0
);
```

**Validations:**
- Asset must exist and be active
- Sufficient tokens available
- Token amount within min/max bounds
- DP amount sufficient (≥ 20%)

---

#### `voteProposal(assetid: Text, proposalid: Text): async (Bool, Text)`

Votes on a purchase proposal.

**Parameters:**
- `assetid`: Asset identifier
- `proposalid`: Proposal identifier

**Returns:** `(success: Bool, message: Text)`

**Authorization:** Only token holders of the asset

**Vote Weight:** Based on tokens held by voter

**Example:**
```motoko
// User with 25 tokens votes
let (success, msg) = await contract.voteProposal("asset-0", "prs-0");
// Vote weight = 25.0
```

**Validations:**
- Caller must be a token holder
- Cannot vote twice
- Proposal must exist

---

#### `finishPayment(assetid: Text, proposalid: Text, amount: Float): async (Bool, Text)`

Completes payment after proposal approval.

**Parameters:**
- `assetid`: Asset identifier
- `proposalid`: Proposal identifier
- `amount`: Remaining payment amount

**Returns:** `(success: Bool, message: Text)`

**Authorization:** Only proposal creator

**Process:**
1. Validates voting approval based on rules:
   - If <50% sold: votes ≥ sold percentage
   - If ≥50% sold: votes > 50%
2. Validates payment amount (remaining 80%)
3. Deducts DP from treasury
4. Charges 5% transaction fee
5. Reduces asset tokens
6. Creates transaction record
7. Transfers ownership to buyer

**Fee:** `5%` of remaining payment

**Voting Rules:**
```
If soldRatio < 50%:
  Required votes = soldRatio

If soldRatio ≥ 50%:
  Required votes > 50%
```

**Example:**
```motoko
// Total: 5000, DP paid: 1000, Remaining: 4000
let (success, msg) = await contract.finishPayment(
  "asset-0",
  "prs-0",
  4000.0
);
```

**Validations:**
- Caller is proposal creator
- Sufficient voting approval
- Exact payment amount
- Sufficient tokens available

---

#### `withdrawDPCashback(assetid: Text, tsid: Text, proposalid: Text, amount: Float): async (Bool, Text)`

Withdraws down payment if proposal rejected or expired.

**Parameters:**
- `assetid`: Asset identifier
- `tsid`: Treasury ID
- `proposalid`: Proposal identifier
- `amount`: Cashback amount

**Returns:** `(success: Bool, message: Text)`

**Conditions:**
- Proposal must be expired (>20 days)
- Treasury must have sufficient funds

**Fee:** `2%` of cashback amount

**Example:**
```motoko
// After 20+ days, withdraw rejected DP
let (success, msg) = await contract.withdrawDPCashback(
  "asset-0",
  "tsr-0",
  "prs-0",
  1000.0
);
```

**Validations:**
- Proposal exists and expired
- Treasury has sufficient funds
- User has balance for fee

---

### Ownership Transfer

#### `transferOwnership(assetid: Text, ownershipid: Text, to: Principal): async (Bool, Text)`

Transfers ownership to another user (gift/airdrop).

**Parameters:**
- `assetid`: Asset identifier
- `ownershipid`: Ownership record ID
- `to`: Recipient principal

**Returns:** `(success: Bool, message: Text)`

**Fee:** `1.0` flat fee

**Example:**
```motoko
let (success, msg) = await contract.transferOwnership(
  "asset-0",
  "own-0",
  recipientPrincipal
);
```

**Validations:**
- Caller is ownership owner
- Cannot transfer to self
- Recipient is valid

**Note:** Uses `allowZeroAmount = true` for free transfers

---

#### `buyOwnership(assetid: Text, ownershipid: Text, amount: Float, from: Principal): async (Bool, Text)`

Purchases ownership from another holder.

**Parameters:**
- `assetid`: Asset identifier
- `ownershipid`: Ownership record ID
- `amount`: Purchase price
- `from`: Seller principal

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Validates ownership is for sale
2. Transfers ownership
3. Charges 20% transaction fee
4. Transfers payment to seller
5. Records transaction

**Fee:** `20%` of purchase amount + `1.0` if amount is 0

**Example:**
```motoko
let (success, msg) = await contract.buyOwnership(
  "asset-0",
  "own-0",
  5000.0,
  sellerPrincipal
);
```

**Validations:**
- Ownership must be open for sale
- Buyer has sufficient balance
- Not expired offer

---

#### `openMyOwnership(assetid: Text, ownershipid: Text): async (Bool, Text)`

Opens ownership for sale.

**Parameters:**
- `assetid`: Asset identifier
- `ownershipid`: Ownership record ID

**Returns:** `(success: Bool, message: Text)`

**Authorization:** Only ownership owner

**Example:**
```motoko
let (success, msg) = await contract.openMyOwnership("asset-0", "own-0");
```

---

### Treasury & Financial

#### `supportAsset(assetid: Text, amount: Float): async (Bool, Text)`

Contributes funds to support an asset.

**Parameters:**
- `assetid`: Asset identifier
- `amount`: Support amount

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Charges 2% fee
2. Adds to treasury (#AssetSupport)
3. Records transaction

**Fee:** `2%` of support amount

**Use Cases:**
- Community funding
- Asset improvement
- Emergency support

**Example:**
```motoko
let (success, msg) = await contract.supportAsset("asset-0", 1000.0);
```

---

#### `processLiquidation(assetid: Text): async (Bool, Text)`

Processes liquidation for inactive assets.

**Parameters:**
- `assetid`: Asset identifier

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Validates asset is inactive
2. Calculates proportional share
3. Charges 2% fee
4. Withdraws from asset support treasury
5. Distributes to token holders

**Formula:** 
```
userShare = totalTreasury * (userTokens / totalTokens)
```

**Fee:** `2%` of liquidation amount

**Example:**
```motoko
// Asset bankrupt, distribute treasury proportionally
let (success, msg) = await contract.processLiquidation("asset-0");
```

**Validations:**
- Asset must be inactive
- Caller must be token holder
- Treasury must have funds

---

#### `shareDevidend(assetid: Text, totalDevidend: Float): async (Bool, Text)`

Distributes dividends to token holders.

**Parameters:**
- `assetid`: Asset identifier
- `totalDevidend`: Total dividend amount

**Returns:** `(success: Bool, message: Text)`

**Authorization:** Only asset creator

**Process:**
1. Gets all token holders
2. Calculates proportional share for each
3. Creates dividend transactions

**Formula:**
```
holderShare = totalDevidend * (holderTokens / totalHeldTokens)
```

**Example:**
```motoko
// Distribute 10000 profit to holders
let (success, msg) = await contract.shareDevidend("asset-0", 10000.0);
```

---

#### `withdrawFromTreasury(assetid: Text, tsid: Text, amount: Float): async Text`

Withdraws funds from treasury.

**Parameters:**
- `assetid`: Asset identifier
- `tsid`: Treasury ID
- `amount`: Withdrawal amount

**Returns:** Status message

**Authorization:** Only asset creator

**Example:**
```motoko
let msg = await contract.withdrawFromTreasury("asset-0", "tsr-0", 5000.0);
```

---

### Complaint System

#### `fileComplaint(assetid: Text, reason: Text, complaintType: ComplaintType): async (Bool, Text)`

Files a complaint against an asset.

**Parameters:**
- `assetid`: Target asset
- `reason`: Complaint reason
- `complaintType`: `#Fraud` or `#Plagiarism`

**Returns:** `(success: Bool, message: Text)`

**Process:**
1. Changes asset status to #Pending
2. Creates complaint record

**Example:**
```motoko
let (success, msg) = await contract.fileComplaint(
  "asset-0",
  "Forged documents detected",
  #Fraud
);
```

---

#### `resolveComplaint(assetid: Text, complaintid: Text): async Text`

Marks complaint as resolved.

**Parameters:**
- `assetid`: Asset identifier
- `complaintid`: Complaint ID

**Returns:** Status message

**Authorization:** Admin/Moderator

**Example:**
```motoko
let msg = await contract.resolveComplaint("asset-0", "cmp-0");
```

---

### User Management

#### `registKyc(surname: Text, publickey: ?Text): async (Bool, Text)`

Registers a new user.

**Parameters:**
- `surname`: User's name
- `publickey`: Optional public key

**Returns:** `(success: Bool, message: Text)`

**Example:**
```motoko
let (success, msg) = await contract.registKyc("John Doe", null);
```

---

#### `addPublicKey(publickey: Text): async (Bool, Text)`

Adds public key to existing user.

**Parameters:**
- `publickey`: User's public key

**Returns:** `(success: Bool, message: Text)`

---

#### `getBalanceForDemo(): async (Bool, Text)`

⚠️ **DEMO ONLY** - Adds 20.0 to user balance.

**Returns:** `(success: Bool, message: Text)`

---

### Query Methods

#### Asset Queries

```motoko
// Get single asset
getAsset(assetid: Text): async ?Asset

// Get all assets
getAllAssets(): async [Asset]

// Get assets by range (pagination)
getAssetByRange(start: Nat, end: Nat): async [Asset]

// Get total asset count
getTotalAsset(): async Nat

// Get user's created assets
getPersonalAset(user: Principal): async [Asset]
```

#### Ownership Queries

```motoko
// Get user's ownerships
getMyOwnerships(user: Principal): async [AssetOwnership]

// Get all ownerships for an asset
getAssetOwnerships(assetid: Text): async [AssetOwnership]

// Get specific ownership
getOwnershipById(assetid: Text, ownershipid: Text): async ?AssetOwnership
```

#### Transaction Queries

```motoko
// Get all transactions for asset
getAllTransactionsByAssetId(assetid: Text): async [Transaction]

// Get specific transaction
getTransactionByTransactionId(assetid: Text, transactionid: Text): async ?Transaction

// Get dividend transactions
getAssetDividend(assetid: Text): async [Transaction]
```

#### Proposal Queries

```motoko
// Get user's proposals
getMyProposals(user: Principal): async [AssetProposal]

// Get all proposals for asset
getAssetProposals(assetid: Text): async [AssetProposal]

// Get specific proposal
getProposal(assetid: Text, proposalid: Text): async ?AssetProposal
```

#### Treasury Queries

```motoko
// Get all treasury entries
getAllTreasury(): async [TreasuryLedger]

// Get treasury by asset
getAllTreasuryByAssetId(assetid: Text): async [TreasuryLedger]

// Get specific treasury entry
getTreasuryByAssetId(assetid: Text, treasuryid: Text): async ?TreasuryLedger
```

#### Complaint Queries

```motoko
// Get complaints for asset
getAssetComplaints(assetid: Text): async [Complaint]
```

#### User Queries

```motoko
// Get user balance
myBalance(): async Float

// Get dev balance
getDevBalance(): async Float

// Get user data
getRegisteredUser(user: Principal): async ?User

// Get total registered users
totalRegisteredUser(): async Nat
```

---

## 🔄 Business Flows

### 1. Complete Purchase Flow

```
1. User creates proposal with DP (20%)
   └─> proposeAssetPurchase()

2. Token holders vote
   └─> voteProposal()

3. If approved, buyer finishes payment (80%)
   └─> finishPayment()
   
4. Ownership transferred automatically

Alternative: If rejected after 20 days
   └─> withdrawDPCashback()
```

### 2. Secondary Market Flow

```
1. Owner opens ownership for sale
   └─> openMyOwnership()

2. Buyer purchases ownership
   └─> buyOwnership()
   
3. Payment transferred automatically
```

### 3. Liquidation Flow

```
1. Asset marked as inactive
   └─> inactiveAsset() or fileComplaint()

2. Token holders claim proportional share
   └─> processLiquidation()
   
3. Treasury funds distributed
```

### 4. Dividend Flow

```
1. Asset creator distributes profits
   └─> shareDevidend()

2. System calculates proportional shares

3. Transactions created for each holder
```

---

## 💰 Fee Structure

| Operation | Fee | Charged To |
|-----------|-----|------------|
| Create Asset | 5% of total value | Creator |
| Finish Payment | 5% of amount | Buyer |
| DP Cashback | 2% of amount | Requester |
| Support Asset | 2% of amount | Supporter |
| Liquidation | 2% of share | Claimer |
| Transfer Ownership | 1.0 flat | Sender |
| Buy Ownership | 20% of amount | Buyer |
| Inactive Asset | 50% of total value | Creator |

**Fee Calculation Example:**
```motoko
// Asset: 1000 tokens at 100.0 each = 100,000 total
// Creation fee: 100,000 * 5% = 5,000

// Purchase: 50 tokens at 100.0 = 5,000
// DP: 1,000 (20%)
// Remaining: 4,000
// Payment fee: 4,000 * 5% = 200
```

---

## 🔐 Security & Validation

### Authentication
- All public methods use `msg.caller` for identity
- Principal-based authorization checks

### Authorization Checks
```motoko
// Asset creator only
if (asset.creator != caller) {
  return (false, "Unauthorized");
}

// Token holder only
if (ownership.owner != caller) {
  return (false, "Not owner");
}
```

### Input Validation
- Token amounts within min/max bounds
- Sufficient balance for fees
- Non-zero amounts for transfers
- Asset/proposal existence checks

### State Validation
- Asset status checks (Active/Inactive)
- Ownership sale status
- Proposal expiration
- Treasury balance

### Double-Spend Prevention
- Ownership transfer validates current owner
- Token reduction checks availability
- Treasury withdrawal validates balance

---

## 💡 Usage Examples

### Complete Asset Creation to Purchase

```motoko
// 1. Register user
let (regSuccess, regMsg) = await contract.registKyc("Alice", null);

// 2. Get demo balance
let (balSuccess, balMsg) = await contract.getBalanceForDemo();

// 3. Create asset
let assetInput = {
  name = "Apartment A1";
  description = "2BR luxury apartment";
  totalToken = 1000;
  tokenLeft = 800;
  minTokenPurchased = 10;
  maxTokenPurchased = 100;
  pricePerToken = 100.0;
  locationInfo = ?{
    lat = 40.7128;
    long = -74.0060;
    details = ["NYC", "Manhattan"]
  };
  documentHash = [{
    name = "Deed";
    hash = "abc123";
    signature = "sig456"
  }];
  assetType = #Physical;
  assetStatus = #Active;
  rule = [];
  ownershipMaturityTime = 2592000; // 30 days
};

let (createSuccess, assetId) = await contract.createAsset(assetInput);
// assetId = "asset-0"

// 4. Buyer proposes purchase (50 tokens)
let (propSuccess, propMsg) = await contract.proposeAssetPurchase(
  "asset-0",
  50,
  100.0,
  1000.0 // 20% DP
);
// proposalId = "prs-0"

// 5. Token holders vote
let (voteSuccess, voteMsg) = await contract.voteProposal(
  "asset-0",
  "prs-0"
);

// 6. After approval, finish payment
let (finishSuccess, finishMsg) = await contract.finishPayment(
  "asset-0",
  "prs-0",
  4000.0 // Remaining 80%
);

// 7. Check new ownership
let ownerships = await contract.getMyOwnerships(buyerPrincipal);
```

### Asset Support and Liquidation

```motoko
// 1. Support struggling asset
let (suppSuccess, suppMsg) = await contract.supportAsset(
  "asset-0",
  5000.0
);

// 2. If asset fails, mark inactive
let (inactiveSuccess, inactiveMsg) = await contract.inactiveAsset("asset-0");

// 3. Token holders claim liquidation
let (liqSuccess, liqMsg) = await contract.processLiquidation("asset-0");
```

### Secondary Market Trading

```motoko
// 1. Owner opens for sale
let (openSuccess, openMsg) = await contract.openMyOwnership(
  "asset-0",
  "own-0"
);

// 2. Buyer purchases
let (buySuccess, buyMsg) = await contract.buyOwnership(
  "asset-0",
  "own-0",
  6000.0,
  sellerPrincipal
);
```

### Dividend Distribution

```motoko
// Creator distributes 10,000 profit
let (divSuccess, divMsg) = await contract.shareDevidend(
  "asset-0",
  10000.0
);

// Check dividends received
let dividends = await contract.getAssetDividend("asset-0");
```

---

## 📊 Transaction Types Reference

| Type | Usage | Direction |
|------|-------|-----------|
| `#Buy` | Token purchase | Buyer → Creator |
| `#Transfer` | Ownership transfer | Sender → Receiver |
| `#Donepayment` | DP storage | Buyer → Treasury |
| `#DonepaymentCashback` | DP refund | Treasury → Buyer |
| `#Supportasset` | Community support | Supporter → Treasury |
| `#Liquidation` | Asset liquidation | Treasury → Holders |
| `#Dividend` | Profit sharing | Creator → Holders |

---

## 🎯 Best Practices

### For Asset Creators
1. Set realistic token prices and supply
2. Define clear min/max purchase limits
3. Upload verified documents
4. Regular dividend distributions
5. Communicate with token holders

### For Buyers
1. Verify asset documents before proposing
2. Ensure sufficient balance for DP + fees
3. Participate in voting
4. Consider maturity period
5. Monitor proposal expiration (20 days)

### For Token Holders
1. Vote on proposals promptly
2. Open ownership for secondary sales
3. Monitor asset status
4. Claim liquidation if asset fails
5. Track dividend distributions

### For Platform Usage
1. Always check return values
2. Handle errors gracefully
3. Use pagination for large datasets
4. Cache query results when possible
5. Validate inputs before submission

---

## ⚠️ Important Notes

### Demo Features
- `getBalanceForDemo()` - **REMOVE IN PRODUCTION**
- Mock balance system - Replace with real tokens

### Upgrade Safety
- Uses `persistent actor` with `transient` storage
- Data persistence handled by storage modules
- Plan upgrade strategy for production

### Time-Based Operations
- Proposal expiration: 20 days
- Ownership maturity: Configurable per asset
- All timestamps in nanoseconds (IC standard)

### Gas Optimization
- Use range queries for pagination
- Batch operations where possible
- Cache frequently accessed data

---

## 🔮 Future Enhancements

- [ ] Multi-signature for large transactions
- [ ] Automated market maker (AMM) for secondary market
- [ ] NFT integration for asset certificates
- [ ] Oracle integration for asset valuation
- [ ] Insurance mechanism
- [ ] Staking rewards for long-term holders
- [ ] Governance token for platform decisions
- [ ] Cross-chain bridge integration

---

## 📞 Support & Resources

- **Documentation**: [Add your docs link]
- **GitHub**: [Add your repo link]
- **Discord**: [Add your community link]
- **Email**: [Add support email]

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**License**: [Add your license]