# Storage Modules Documentation

Complete documentation for all storage modules in the Asset Tokenization Smart Contract system.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Storage Modules](#storage-modules)
  - [AssetStorage](#assetstorage)
  - [OwnershipStorage](#ownershipstorage)
  - [TransactionStorage](#transactionstorage)
  - [AssetProposalStorage](#assetproposalstorage)
  - [TreasuryStorage](#treasurystorage)
  - [ComplaintStorage](#complaintstorage)
  - [UserKYC](#userkyc)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## 🎯 Overview

The storage layer provides persistent data management using HashMaps for efficient key-value storage. Each module handles a specific domain of the asset tokenization system.

### Key Features
- **Nested HashMap Structure**: Primary key (assetId) with secondary HashMap for related records
- **Auto-incrementing IDs**: Each storage maintains its own counter
- **Immutable Records**: Uses record reconstruction for updates
- **Type Safety**: Strong typing from DataType module

## 🏗️ Architecture

```
storage/
├── AssetStorage.mo           # Asset management
├── OwnershipStorage.mo       # Token ownership tracking
├── TransactionStorage.mo     # Transaction history
├── AssetProposalStorage.mo   # Governance proposals
├── TreasuryStorage.mo        # Financial management
├── ComplaintStorage.mo       # Complaint system
└── UserKYC.mo               # User management
```

## 📦 Storage Modules

---

## AssetStorage

Manages the core asset data including creation, retrieval, and updates.

### Class: `AssetStorageClass`

#### Private State
```motoko
private var assetStorage: HashMap<Text, DataType.Asset>
private var assetCounter: Nat
private var assetIds: Buffer<Text>
private var assetName: Buffer<Text>
```

### Methods

#### `create(insertedasset: InputType.CreateAssetInput): Text`
Creates a new asset and returns its ID.

**Parameters:**
- `insertedasset`: Asset creation input

**Returns:** Asset ID (format: `asset-{counter}`)

**Example:**
```motoko
let assetId = assetStorage.create(assetInput);
// Returns: "asset-0"
```

#### `get(id: Text): ?DataType.Asset`
Retrieves a single asset by ID.

**Parameters:**
- `id`: Asset identifier

**Returns:** Optional Asset record

#### `getAll(): [DataType.Asset]`
Returns all assets in the system.

**Returns:** Array of all assets

#### `getRange(startIndex: Nat, endIndex: Nat): [DataType.Asset]`
Retrieves assets within a specific range for pagination.

**Parameters:**
- `startIndex`: Starting index (inclusive)
- `endIndex`: Ending index (exclusive)

**Returns:** Array of assets in range

**Example:**
```motoko
let assets = assetStorage.getRange(0, 10); // First 10 assets
```

#### `getTotalCount(): Nat`
Returns the total number of assets.

#### `findAssetIdByName(querydata: Text): ?Text`
Searches for an asset ID by name (case-insensitive).

**Parameters:**
- `querydata`: Asset name to search

**Returns:** Optional asset ID

#### `editAssetStatus(assetId: Text, newStatus: DataType.AssetStatus): (Bool, Text)`
Updates the status of an asset.

**Parameters:**
- `assetId`: Target asset ID
- `newStatus`: New status value

**Returns:** Tuple of (success, message)

#### `reduceAssetToken(assetid: Text, amount: Nat): (Bool, Text)`
Reduces available tokens after purchase.

**Parameters:**
- `assetid`: Asset identifier
- `amount`: Number of tokens to reduce

**Returns:** Tuple of (success, message)

**Validation:**
- Checks sufficient token availability
- Updates `tokenLeft` field

---

## OwnershipStorage

Manages token ownership records and transfers between users.

### Class: `OwnershipStorageClass`

#### Private State
```motoko
private var ownershipStorage: HashMap<Text, HashMap<Text, DataType.AssetOwnership>>
private var ownershipCounter: Nat
```

**Structure:** `assetId → ownershipId → AssetOwnership`

### Methods

#### `addNewHolder(assetId: Text, insertedinput: InputType.CreateOwnershipInput): Text`
Creates a new ownership record.

**Parameters:**
- `assetId`: Asset identifier
- `insertedinput`: Ownership creation data

**Returns:** Success message with ownership ID

**ID Format:** `own-{counter}`

#### `changeOwnershipHolder(from: Principal, to: Principal, assetid: Text, ownershipid: Text, amount: Float, allowZeroAmount: Bool): (Bool, Text)`
Transfers ownership between users.

**Parameters:**
- `from`: Current owner
- `to`: New owner
- `assetid`: Asset identifier
- `ownershipid`: Ownership record ID
- `amount`: Payment amount
- `allowZeroAmount`: Allow zero-price transfers (for gifts/airdrops)

**Returns:** Tuple of (success, message)

**Validations:**
- Prevents self-transfer
- Verifies ownership
- Checks sale status (unless `allowZeroAmount`)
- Validates expiration time
- Confirms sufficient payment

**Special Behavior:**
- If recipient already owns tokens, merges ownership records
- Updates `holdat` timestamp

#### `checkPartOfHolder(assetid: Text, user: Principal): ?DataType.AssetOwnership`
Checks if a user owns tokens of a specific asset.

**Returns:** Optional ownership record

#### `getMyOwnership(user: Principal): [DataType.AssetOwnership]`
Retrieves all ownerships for a user across all assets.

**Parameters:**
- `user`: User's principal

**Returns:** Array of ownership records

#### `getAllOwnershipByAssetId(assetid: Text): [DataType.AssetOwnership]`
Gets all ownership records for a specific asset.

#### `getOwnershipById(assetid: Text, ownershipid: Text): ?DataType.AssetOwnership`
Retrieves a specific ownership record.

#### `isOwnershipForSale(assetid: Text, ownershipid: Text): Bool`
Checks if an ownership is available for sale.

#### `getTokenHolder(assetid: Text, user: Principal): (Bool, Nat)`
Returns the number of tokens a user holds for an asset.

**Returns:** Tuple of (found, tokenCount)

#### `openMyOwnership(assetid: Text, ownershipid: Text, user: Principal): (Bool, Text)`
Sets ownership status to open for sale.

**Validations:**
- Verifies user is the owner
- Updates `openForSale` to true

---

## TransactionStorage

Records all transactions in the system for audit and history tracking.

### Class: `TransactionStorageClass`

#### Private State
```motoko
private var transactionStorage: HashMap<Text, HashMap<Text, DataType.Transaction>>
private var transactionCounter: Nat
```

**Structure:** `assetId → transactionId → Transaction`

### Methods

#### `createTransaction(insertedinput: InputType.TransactionInput): Text`
Creates a new transaction record.

**Parameters:**
- `insertedinput`: Transaction data

**Returns:** Success message with transaction ID

**ID Format:** `tnx-{counter}`

**Timestamp:** Automatically set to `Time.now()`

#### `getAllTransactionByAssetId(assetid: Text): [DataType.Transaction]`
Retrieves all transactions for a specific asset.

#### `getTransactionByTransactionId(assetid: Text, transactionid: Text): ?DataType.Transaction`
Gets a specific transaction by ID.

#### `getTransactionByType(assetid: Text, txnType: DataType.TransactionType): [DataType.Transaction]`
Filters transactions by type.

**Parameters:**
- `assetid`: Asset identifier
- `txnType`: Transaction type filter

**Returns:** Array of matching transactions

**Supported Types:**
- `#Buy`
- `#Transfer`
- `#Donepayment`
- `#DonepaymentCashback`
- `#Supportasset`
- `#Liquidation`
- `#Dividend`

---

## AssetProposalStorage

Manages governance proposals and voting for asset-related decisions.

### Class: `AssetProposalClass`

#### Private State
```motoko
private var assetproposalStorage: HashMap<Text, HashMap<Text, DataType.AssetProposal>>
private var assetproposalCounter: Nat
```

**Structure:** `assetId → proposalId → AssetProposal`

### Methods

#### `initiateProposal(input: InputType.AssetProposalInput): (Text, Bool)`
Creates a new proposal.

**Parameters:**
- `input`: Proposal data

**Returns:** Tuple of (message, success)

**ID Format:** `prs-{counter}`

**Initial State:** Empty votes array

#### `getProposal(assetid: Text, proposalid: Text): ?DataType.AssetProposal`
Retrieves a specific proposal.

#### `getAllProposalAsset(assetid: Text): [DataType.AssetProposal]`
Gets all proposals for an asset.

#### `voteProposal(assetid: Text, proposalid: Text, voter: Principal, votevalue: Float): (Text, Bool)`
Adds a vote to a proposal.

**Parameters:**
- `assetid`: Asset identifier
- `proposalid`: Proposal identifier
- `voter`: Voter's principal
- `votevalue`: Vote weight (based on token holdings)

**Returns:** Tuple of (message, success)

**Validations:**
- Prevents double voting
- Records vote with weight

**Vote Format:** `[(Principal, Float)]` - Array of (voter, weight) tuples

#### `getMyProposal(user: Principal): [DataType.AssetProposal]`
Retrieves all proposals created by a user.

#### `validateExpired(assetid: Text, proposalid: Text, maturitytime: Int): (Bool, Bool)`
Checks if a proposal has expired.

**Parameters:**
- `assetid`: Asset identifier
- `proposalid`: Proposal identifier
- `maturitytime`: Duration in days

**Returns:** Tuple of (found, expired)

**Calculation:** `currentTime > (createdAt + maturitytime * 24 * 60 * 60 * 1_000_000_000)`

---

## TreasuryStorage

Manages financial ledgers for assets including payments and support funds.

### Class: `TreasuryStorageClass`

#### Private State
```motoko
private var treasuryStorage: HashMap<Text, HashMap<Text, DataType.TreasuryLedger>>
private var treasuryCounter: Nat
```

**Structure:** `assetId → treasuryId → TreasuryLedger`

### Methods

#### `addNewTreasury(insertedinput: InputType.CreateTreasuryLedgerInput): Text`
Creates a new treasury ledger entry.

**ID Format:** `tsr-{counter}`

#### `takeTreasury(assetid: Text, tsid: Text, amount: Float): (Text, Bool)`
Withdraws funds from a specific treasury entry.

**Validations:**
- Checks sufficient balance
- Updates remaining amount

#### `getAllTreasuryByAssetId(assetid: Text): [DataType.TreasuryLedger]`
Gets all treasury entries for an asset.

#### `getAllTreasury(): [DataType.TreasuryLedger]`
Returns all treasury entries across all assets.

#### `getTreasurybyId(assetid: Text, treasuryid: Text): ?DataType.TreasuryLedger`
Retrieves a specific treasury entry.

#### `getTotalAssetFunding(assetid: Text): Float`
Calculates total funding for an asset.

**Returns:** Sum of all treasury amounts for the asset

#### `getFundingFromAssetTreasuryTotal(assetid: Text, amountToTake: Float): (Bool, Float)`
Withdraws funds from asset support treasuries.

**Parameters:**
- `assetid`: Asset identifier
- `amountToTake`: Amount to withdraw

**Returns:** Tuple of (success, amountTaken)

**Behavior:**
- Only withdraws from `#AssetSupport` type treasuries
- Prioritizes oldest entries first
- Continues until amount is fulfilled or treasuries exhausted
- Returns actual amount withdrawn

**Example:**
```motoko
let (success, amount) = treasury.getFundingFromAssetTreasuryTotal("asset-1", 1000.0);
// If only 800 available: (true, 800.0)
// If sufficient funds: (true, 1000.0)
```

#### `getTreasuryForDonePayment(assetid: Text, sender: Principal): (Bool, Text)`
Finds treasury entry for completed payment by user.

**Returns:** Tuple of (found, treasuryId)

---

## ComplaintStorage

Manages fraud and plagiarism complaints against assets.

### Class: `ComplaintStorageClass`

#### Private State
```motoko
private var complaintStorage: HashMap<Text, HashMap<Text, DataType.Complaint>>
private var complaintCounter: Nat
```

**Structure:** `assetId → complaintId → Complaint`

### Methods

#### `createComplaint(insertedinput: InputType.ComplaintInput): Text`
Files a new complaint.

**ID Format:** `cmp-{counter}`

**Initial State:** `resolved = false`

#### `solveComplain(assetid: Text, complaintid: Text): (Text, Bool)`
Marks a complaint as resolved.

**Returns:** Tuple of (message, success)

**Updates:** Sets `resolved = true`

#### `getComplaintByAssetid(assetid: Text): [DataType.Complaint]`
Gets all complaints for an asset.

#### `getComplaint(assetid: Text, complaintid: Text): ?DataType.Complaint`
Retrieves a specific complaint.

---

## UserKYC

Manages user accounts, balances, and KYC information.

### Class: `UserKycStorageClass`

#### Private State
```motoko
private var userKycStorage: HashMap<Principal, DataType.User>
private var userKycCounter: Nat
private var devMockBalance: Float
```

**Structure:** `Principal → User`

### Methods

#### `createUser(principal: Principal, surname: Text, publickey: ?Text): (Bool, Text)`
Registers a new user.

**Parameters:**
- `principal`: User's principal address
- `surname`: User's name
- `publickey`: Optional public key

**Returns:** Tuple of (success, message)

**Initial State:**
- `mockBalance = 0`
- `userStatus = #Approve`

**Validation:** Prevents duplicate registration

#### `addPublicKey(principal: Principal, publickey: Text): (Bool, Text)`
Adds public key to existing user.

**Validations:**
- User must exist
- Public key not already set

#### `suspendUser(principal: Principal): (Bool, Text)`
Suspends a user account.

**Effect:** Sets `userStatus = #Suspended`

#### `mockTransferBalance(from: Principal, to: Principal, amount: Float): (Bool, Text)`
Transfers balance between users.

**Parameters:**
- `from`: Sender principal
- `to`: Receiver principal
- `amount`: Transfer amount

**Returns:** Tuple of (success, message)

**Validations:**
- Both users must exist
- Neither account suspended
- Sufficient sender balance
- Amount > 0

#### `mockTransferTo(to: Principal, amount: Float): (Bool, Text)`
Adds balance to a user (for testing/airdrops).

**Validations:**
- Recipient must exist
- Amount > 0

#### `chargeTo(to: Principal, amount: Float): (Bool, Text)`
Deducts balance from user and adds to dev account.

**Validations:**
- User must exist
- Sufficient balance

**Side Effect:** Increases `devMockBalance`

#### `getRegisteredUser(user: Principal): ?DataType.User`
Retrieves user data.

#### `getUserCount(): Nat`
Returns total number of registered users.

#### `getUserBalance(user: Principal): Float`
Gets user's current balance.

#### `getDevBalance(): Float`
Returns developer account balance.

#### `addDevBalance(amount: Float): Float`
Sets developer balance directly.

#### `calcPercentage(amount: Float, prc: Float): Float`
Utility function to calculate percentage.

**Formula:** `amount * prc`

**Example:**
```motoko
let fee = userKyc.calcPercentage(1000.0, 0.05); // Returns: 50.0
```

---

## 💡 Usage Examples

### Creating and Purchasing an Asset

```motoko
// 1. Create asset
let assetInput: InputType.CreateAssetInput = { /* ... */ };
let assetId = assetStorage.create(assetInput);

// 2. User purchases tokens
let ownershipInput: InputType.CreateOwnershipInput = {
  assetid = assetId;
  owner = buyerPrincipal;
  tokenhold = 10;
  openForSale = false;
  buyingprice = 100.0;
  upuntil = 0;
  holdat = Time.now();
};
let ownMsg = ownershipStorage.addNewHolder(assetId, ownershipInput);

// 3. Record transaction
let txInput: InputType.TransactionInput = {
  assetid = assetId;
  to = buyerPrincipal;
  from = sellerPrincipal;
  totalprice = 1000.0;
  transactionType = #Buy;
  status = #Done;
};
let txMsg = transactionStorage.createTransaction(txInput);

// 4. Reduce available tokens
let (success, msg) = assetStorage.reduceAssetToken(assetId, 10);
```

### Creating and Voting on Proposal

```motoko
// 1. Create proposal
let proposalInput: InputType.AssetProposalInput = {
  from = proposerPrincipal;
  assetid = "asset-0";
  token = 100;
  pricePerToken = 50.0;
};
let (msg, success) = proposalStorage.initiateProposal(proposalInput);

// 2. Vote on proposal
let (voteMsg, voteSuccess) = proposalStorage.voteProposal(
  "asset-0",
  "prs-0",
  voterPrincipal,
  25.0 // Vote weight based on tokens held
);

// 3. Check if expired
let (found, expired) = proposalStorage.validateExpired(
  "asset-0",
  "prs-0",
  7 // 7 days
);
```

### Managing Treasury

```motoko
// 1. Add treasury entry
let treasuryInput: InputType.CreateTreasuryLedgerInput = {
  assetid = "asset-0";
  description = "Asset support contribution";
  treasuryledgerType = #AssetSupport;
  priceamount = 5000.0;
  from = supporterPrincipal;
};
let tsMsg = treasuryStorage.addNewTreasury(treasuryInput);

// 2. Get total funding
let total = treasuryStorage.getTotalAssetFunding("asset-0");

// 3. Withdraw funds
let (success, amount) = treasuryStorage.getFundingFromAssetTreasuryTotal(
  "asset-0",
  1000.0
);
```

### User Transfer Flow

```motoko
// 1. Register users
let (success1, msg1) = userKyc.createUser(user1, "Alice", null);
let (success2, msg2) = userKyc.createUser(user2, "Bob", null);

// 2. Add balance to user1
let (success3, msg3) = userKyc.mockTransferTo(user1, 10000.0);

// 3. Transfer ownership
let (success4, msg4) = ownershipStorage.changeOwnershipHolder(
  user1,
  user2,
  "asset-0",
  "own-0",
  1000.0,
  false
);

// 4. Transfer payment
let (success5, msg5) = userKyc.mockTransferBalance(user2, user1, 1000.0);
```

---

## 🎯 Best Practices

### 1. Error Handling
Always check return tuples for success status:
```motoko
let (success, message) = assetStorage.reduceAssetToken(id, amount);
if (not success) {
  // Handle error
  return #err(message);
};
```

### 2. Validation Before Storage
Validate input before creating records:
```motoko
// Check asset exists
switch (assetStorage.get(assetId)) {
  case (null) { return #err("Asset not found") };
  case (?asset) {
    // Proceed with operation
  };
};
```

### 3. Atomic Operations
Group related storage operations to maintain consistency:
```motoko
// When transferring ownership:
// 1. Update ownership record
// 2. Create transaction record
// 3. Update user balances
// All should succeed or all should fail
```

### 4. Pagination for Large Datasets
Use range queries for better performance:
```motoko
let pageSize = 20;
let page = 1;
let startIndex = page * pageSize;
let endIndex = startIndex + pageSize;
let assets = assetStorage.getRange(startIndex, endIndex);
```

### 5. Index Management
Maintain separate indices for common queries:
```motoko
// AssetStorage maintains both:
// - assetIds (for range queries)
// - assetName (for name searches)
```

### 6. Immutability Pattern
Always reconstruct entire records for updates:
```motoko
let updated: DataType.Asset = {
  id = existing.id;
  // ... copy all fields
  tokenLeft = existing.tokenLeft - amount; // Only change needed field
  updatedAt = Time.now();
};
```

### 7. Nested HashMap Access
Always handle null cases in nested structures:
```motoko
switch (outerMap.get(assetId)) {
  case (null) { /* Handle missing asset */ };
  case (?innerMap) {
    switch (innerMap.get(recordId)) {
      case (null) { /* Handle missing record */ };
      case (?record) { /* Process record */ };
    };
  };
};
```

---

## 🔒 Security Considerations

1. **Principal Verification**: Always verify caller's principal before sensitive operations
2. **Balance Checks**: Validate sufficient funds before transfers
3. **Status Checks**: Verify user/asset status before operations
4. **Double-Spend Prevention**: Check ownership before transfers
5. **Expiration Validation**: Check time limits on offers and proposals
6. **Amount Validation**: Ensure amounts are greater than zero

---

## 📊 Performance Characteristics

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| get() | O(1) | HashMap lookup |
| create() | O(1) | HashMap insert |
| getAll() | O(n) | Full iteration |
| getRange() | O(m) | Where m = range size |
| findByName() | O(n) | Linear search |
| Nested lookups | O(1) | Two HashMap lookups |

---

## 🔄 Data Flow Patterns

### Purchase Flow
```
User → createTransaction() → changeOwnershipHolder() → reduceAssetToken() → mockTransferBalance()
```

### Proposal Flow
```
User → initiateProposal() → voteProposal() → validateExpired() → [Execute/Reject]
```

### Complaint Flow
```
User → createComplaint() → [Investigation] → solveComplain()
```

---

## 📝 Notes

- All IDs use prefix + counter pattern for easy identification
- Timestamps use Internet Computer's `Time.now()` (nanoseconds)
- HashMaps initialized with capacity 10 (auto-grows as needed)
- Nested structures enable efficient asset-based queries
- Mock balance system for testing without real tokens

---

## 🚀 Future Enhancements

- [ ] Add batch operations for efficiency
- [ ] Implement event logging
- [ ] Add data migration utilities
- [ ] Optimize search with secondary indices
- [ ] Add data export functionality
- [ ] Implement archive mechanism for old records