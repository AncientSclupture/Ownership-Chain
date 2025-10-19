# Ancient Sclupture Project's: OwnershipChain

## OwnershipChain

### Problem 

High-value assets like land, buildings, businesses, and art often face issues such as theft through document fraud, unclear ownership records, and the absence of transparent systems for shared ownership leading to legal disputes and limiting fair, inclusive access to investment and co-ownership.

See This Page For Further Devined Problem: https://ancientsclupture.github.io/Ownership-Chain/

See The Pritch Deck Presentation Here : https://youtu.be/C7PQ_rVZyAo

### Target Solution
The problem is addressed through tokenization of real-world assets using Internet Computer Protocol (ICP) technology. This solution aims to:

- **Secure ownership data** by recording it on an immutable blockchain, protecting it from manipulation or forgery by tokenize that asset into stackable token.

- **Increase transparency and accountability** in every transaction or change in ownership status.

- **Enable fractional ownership** in a digital and legally compliant way, allowing individuals to own portions of high-value assets.

- **Bridge the physical and digital worlds efficiently**, enabling digital interactions such as selling, leasing, revenue sharing, or real-time asset status reporting.

With this approach, assets like properties, businesses, or artworks can be managed in a modern, secure, and inclusive way, both locally and globally.

## Features

This Web3 application is designed to tokenize and manage real-world assets using the Internet Computer Protocol (ICP). It provides an end-to-end decentralized system for asset registration, fractional ownership, marketplace trading, and transparent ownership history.

### 1. Asset Tokenization
Create and mint digital representations of physical and digital assets with fractional ownership through token distribution. The system supports multiple asset types including Physical, Digital, and Hybrid assets with immutable ownership records stored on the blockchain.

### 2. Marketplace Trading
A decentralized marketplace where users can buy and sell asset tokens with real-time price discovery. The platform enables secure peer-to-peer transactions with advanced filtering and browsing capabilities for discovering investment opportunities.

### 3. Asset Management Dashboard
Comprehensive dashboard for tracking owned assets, monitoring token holdings and their performance, and managing overall portfolio value. Users can view detailed analytics and access quick actions for asset management operations.

### 4. Governance & Voting
Token-based governance system allowing asset owners to create proposals and participate in democratic decision-making. All voting records are transparent and immutably stored on the blockchain, ensuring fair and verifiable governance processes.

### 5. Asset Liquidation
Community-driven liquidation process where asset owners can request liquidation with transparent approval workflows. The system ensures fair distribution of liquidation proceeds based on token ownership percentages.

### 6. Transaction Management
Complete transaction history tracking for all buy, sell, and transfer operations. Users can monitor transaction status, review past activities, and manage active orders through an intuitive interface.

### 7. Complaint System
Decentralized dispute resolution mechanism where users can report issues with assets or transactions. The community-driven review process ensures transparent handling of complaints with immutable records of resolutions.

### 8. Profile & Portfolio
User identity management via Internet Identity with comprehensive portfolio analytics and ownership history. The system provides reputation tracking and personalized transaction records for each user.

---

## Public Screen

### 1. Home Screen (/)
The landing page showcases the platform's features, benefits, and statistics to introduce new users to the decentralized asset marketplace. Visitors can explore featured assets, understand the tokenization process, and access the marketplace without authentication. This screen serves as the primary entry point with clear call-to-action buttons for getting started and connecting wallets.

### 2. Asset Marketplace Screen (/market-place)
A public browsing interface displaying all available assets with search, filter, and sorting capabilities. Users can explore assets by type, price range, and other criteria without needing authentication. Clicking on an asset redirects to the detail page, which requires login for purchasing or trading actions.

#### 3. Asset Detail Screen (/protected-asset/:id)
Comprehensive information page displaying detailed asset data including token availability, pricing, documents, and ownership history. Users can review location information, asset rules, and view the complete ownership chain visualization. This screen requires authentication and provides purchase/trade functionality for token acquisition.

---

## Authentication Screen

Internet Identity Login
Secure wallet connection using Internet Computer's Internet Identity protocol for decentralized authentication. Users can create new accounts or authenticate existing ones with cryptographic security. The system maintains secure session management without storing passwords or sensitive data.

---

## Private/Protected Screens

### 1. Dashboard Screen (/protected-dashboard)
Central hub displaying portfolio overview, owned assets summary, and recent activities in one comprehensive view. Users can quickly access performance metrics, monitor token holdings, and navigate to key actions. The dashboard provides real-time updates on asset values and portfolio performance with interactive charts and quick action buttons.

### 2. Create Asset Screen (/action-create)
Multi-step wizard for registering and tokenizing new assets with six progressive batches covering all required information. Users input basic details, token economics, location data, upload documents, set asset type/status, and define ownership rules. The form includes validation, dynamic document/rule management, and preview functionality before blockchain submission.

### 3. Transaction Screen (/action-transaction)
Interface for initiating buy or sell transactions with asset selection, token amount specification, and price calculation. Users can review transaction details, see estimated costs, and confirm trades before execution. The screen provides real-time feedback and transaction status updates throughout the process.

### 4. Voting Screen (/action-voting)
Governance interface displaying active proposals with detailed information and voting options for token holders. Users can cast votes (Yes/No/Abstain), view real-time voting results, and track proposal status. The screen shows voting power based on token holdings and maintains a complete voting history for transparency.

### 5. Liquidation Screen (/action-luquidation)
Request interface for asset liquidation with detailed forms for specifying terms and justification. Users select assets they own, provide reasons for liquidation, and submit requests for community approval. The screen tracks liquidation status through the entire approval workflow with transparent progress indicators.

### 6. Complaint Asset Screen (/protected-complaint)
Filing system for reporting issues with assets or transactions, including evidence upload and detailed issue description. Users reference specific assets, provide documentation, and track complaint status through resolution. The interface maintains transparent communication between complainants and resolution teams.

### 7. Dashboard Transaction Screen (/protected-transaction)
Comprehensive transaction history viewer with filtering, searching, and sorting capabilities for all user activities. Users can view detailed information for each transaction, export records, and analyze trading patterns. The screen provides pagination and advanced filtering by type, date, status, and amount.

### 8. Dashboard Proposal Screen (/protected-proposal)
Management interface for viewing, creating, and participating in proposals related to owned assets. Users can draft new proposals, edit pending ones, vote on active proposals, and track outcomes. The screen displays proposal timelines, voting distributions, and historical records for complete governance transparency.

### 9. Dashboard Buy and Sell Screen (/protected-transferandsell)
Unified interface for managing token transfers, creating sell orders, and browsing buy opportunities. Users can initiate transfers to other users, list tokens for sale, manage active orders, and cancel pending transactions. The screen includes price calculators and transaction preview functionality for informed decision-making.

### 10. Dashboard Liquidation Screen (/protected-liquidation)
Monitoring dashboard for tracking all liquidation requests, voting on liquidation proposals, and viewing distribution of proceeds. Users can see liquidation progress, participate in approval voting, and download detailed reports. The screen maintains complete liquidation history with transparent records of all liquidation events.

### 11. Profile Screen (/protected-profile)
Personal account management page displaying user information, portfolio statistics, and complete ownership history. Users can view connected wallet status, manage notification preferences, and check reputation scores. The interface provides comprehensive activity feeds and analytics for tracking user engagement and asset performance.

---

## FLOW
```
[dApps]
├── Home Page  
|
├── [Browse] Marketplace
│   ├── Assets
│   └── [actionable] => take look button [to /protected-asset:id]
|
├── [Browse] Asset Details
│   ├── Overview
│   ├── Ownership
│   ├── Devidend History
│   ├── Support / Treasury
│   └── [actionable] => propose buy asset
│   └── [actionable] => support asset
|
├── Dashboard
|
├── [Action] Create Asset
│   ├── Create Asset Form
│   └── [actionable] => create button
|
├── [Action] Liquidation Resolve
│   ├── Find And Check Asset That Inative to processing the liquidation
│   └── [actionable] =>  button liquidation
|
├── [Action] Transaction
│   ├── Buy
│   ├── Transfer
│   ├── Done Payment Cashback
│   └── Finsihed Proposal Payments
|
├── [Action] Voting
│   ├── Table user ownership
│   └── [actionable] => click ownership id [if porposal founded then proposal card will be showed up correspond to ownership]
│   └── [actionable] => approve [if porposal founded you can approve or just ignore it]
|
└── [Action] Complaint
    ├── Complain Step Form
    └── [actionable] => send complain [if the evidence is legit then you can complaint the asset as a fraud or plagiarism]
```

## 📜 Table of Contents

- [🎥 Recording](#-recording)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [✅ Testing Results](#-testing-patterns)
- [🔄 CI/CD and Testing](#-cicd-workflow-and-testing)
- [🔗 Resources & Documentation](#-learning-resources)
- [🤝 Contributor](#-teams)

---

## 🎥 Recording

You can see here the full recording: https://youtu.be/C7PQ_rVZyAo

---

## 🚀 Getting Started

### 1. Pre Requirements
1. Download and install motoko locally:
**`Installing the motoko`**
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Verification
```bash
dfx --version
```

**`Installing the node js`**
1. Download and install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
2. in lieu of restarting the shell
```bash
\. "$HOME/.nvm/nvm.sh"
```

3. Download and install Node.js:
```bash
nvm install 22
```

4. Verivication
```bash
node -v # Should print your node version
nvm current # Should print "v22.17.1".
npm -v # Should print your npm version.
```

### 2. Install Dependencies and Agent AI

**`Installing the npm for react frontend`**
```bash
npm install
```
**`Installing the mops dependencies for backend motoko`**
```bash
mops install
```

**`Installing / get the llm model`**

```bash
ollama run llama3.1:8b
```
Once the command executes and the model is loaded, you can terminate because the model will automatically run using the model `[in-case the onlu model you have installed is llama3.1:8b]`

The ollama is ussualy run and listening on port 11434

### 4. Deployment Mode

Keep the terminal on and run:

```bash
dfx start --clean
```

Keep this tab open for reading logs.

Then pull the dependency and deploy the canisters frontend and backend do:

```bash
dfx deploy
```
Then to pull and deploy llm canister:

```bash
dfx deps pull
dfx deps deploy
```

### 5. Start the Developing Process

You can start the frontend development server with:

```bash
npm start
```

after that go and view the frontend in port 5173 **(vite port)**

**For Simplification Just Run (this file run all that process)**:
```bash
# grant permission for bash file
chmod +x ./scripts/dev-container-setup.sh 

# run the scripts
./scripts/dev-container-setup.sh 
```

### 6. Granted setup Helper and simulation helper
```bash
chmod +x ./scripts/dev-container-setup.sh 
```

---

## 📁 Project Structure

```
Ownership-Chain/
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
├── .github/workflows/                    # GitHub CI/CD pipelines
├── src/
│   ├── backend/                          # Motoko backend canister
│   │   └── data/                         # Data Typpe for data storage and input type
│   │   └── storage/                      # Storage and service to manage RWA data
│   │   └── main.mo                       # Main Motoko file
│   ├── frontend/                         # React + Tailwind + TypeScript frontend
│   │   ├── src/
│   │   │   ├── App.tsx                   # Main App component
│   │   │   ├── index.css                 # Global styles with Tailwind
│   │   │   ├── components/               # Reusable UI components (modal, notification, screen component)
│   │   │   ├── context/                  # Data Context And Provider
│   │   │   ├── hook/                     # Reuseable custom hook
│   │   │   ├── helper/                   # Helper to parsing data, convert data type, and validate hash
│   │   │   ├── services/                 # Canister service layers
│   │   │   ├── screens/                  # UI for screens
│   │   │   └── types/                    # RWA Data types
│   │   ├── assets/                       # Static assets (images, icons)
│   │   ├── tests/                        # Frontend unit tests
│   │   ├── index.html                    # Frontend entry point
│   │   ├── main.tsx                      # React main file
│   │   ├── package.json                  # Frontend dependencies
│   │   ├── tsconfig.json                 # TypeScript configuration
│   │   ├── vite.config.ts                # Vite build configuration
│   │   └── vite-env.d.ts                 # Vite type definitions
│   └── declarations/                     # Auto-generated canister interfaces
├── tests/
│   ├── src/                              # Backend test files
│   ├── backend-test-setup.ts             # PocketIC instance
│   └── vitest.config.ts                  # Vitest configuration
├── scripts/
│   ├── dev-container-setup.sh            # Extra set up steps for codespace
├── dfx.json                              # ICP config
└── mops.toml                             # Root Motoko package config
```

---

## 🔄 CI/CD Workflow And Testing

### Run Tests

```bash
npm test
```

---


## 📚 Learning Resources

- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Motoko Docs](https://internetcomputer.org/docs/motoko/home)
- [PicJS Doc](https://dfinity.github.io/pic-js/)
- [Vitest Testing Framework](https://vitest.dev/)

---

## 🤝 **Teams**

- Alex Cinatra
- Muhammad Daffa Azfa Rabani
- Arkananta Fihratullah

---

