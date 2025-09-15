# Ancient Sclupture Project's: OwnershipChain

## OwnershipChain

### Problem 

High-value assets like land, buildings, businesses, and art often face issues such as theft through document fraud, unclear ownership records, and the absence of transparent systems for shared ownership leading to legal disputes and limiting fair, inclusive access to investment and co-ownership.

See This Page For Further Problem Case: https://ancientsclupture.github.io/Ownership-Chain/

### Target Solution
The problem is addressed through tokenization of real-world assets using Internet Computer Protocol (ICP) technology. This solution aims to:

- **Secure ownership data** by recording it on an immutable blockchain, protecting it from manipulation or forgery.

- **Increase transparency and accountability** in every transaction or change in ownership status.

- **Enable fractional ownership** in a digital and legally compliant way, allowing individuals to own portions of high-value assets.

- **Bridge the physical and digital worlds efficiently**, enabling digital interactions such as selling, leasing, revenue sharing, or real-time asset status reporting.

With this approach, assets like properties, businesses, or artworks can be managed in a modern, secure, and inclusive way, both locally and globally.


---

## ✨ Key Features

### 🔐 Secure Asset Registration
- Assets are created via the `createAsset` function.
- Each asset is bound to a **unique principal owner**.
- Records are **immutable** and **publicly auditable**.

### 🏛️ Marketplace for Tokenized Assets
- Browse, buy, and sell **fractional ownership shares**.
- Submit or approve **buy proposals**.
- View a **transparent breakdown** of current owners and asset history.

### 📊 Shareholder Governance
- All share transfers require **≥50% approval voting** by existing owners.
- Governance rules are enforced directly by **ICP canister smart contracts**.

### 💸 Dividend Distribution
- Asset owners can **distribute dividends on-chain**.
- Shareholders securely **claim their earnings** without intermediaries.

### 🤖 AI-Powered Transparency *(Future)*
- Ownership history summaries powered by **LLM** for credibility checks.
- **Wallet-based KYC** integration to ensure secure compliance.

---

## 🛠️ Technology Stack
- 💻 **Backend**: Motoko-based ICP Canisters  
- 🎨 **Frontend**: React + Tailwind + TypeScript  
- 🤖 **Agentic AI**: LLM for ownership history & asset intelligence  
- 🚀 **Deployment**: Vite + GitHub Actions (CI/CD)  

---

## 📈 Why OwnershipChain Matters

- **For Governments** → Secure land registries, reduce fraud, build trust.  
- **For Investors** → Access to assets once locked to the elite.  
- **For Communities** → Collective ownership and fair revenue sharing.  
- **For The Future** → Towards a **global standard for asset credibility**.  

---

## 🌍 Vision

OwnershipChain is not just a dApp — it’s a **paradigm shift** in how humanity perceives **trust, ownership, and value exchange**.

---

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

You can see here the full recording: [yt link]

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
chmod +x ./scripts/simulation_agent_create_assets.sh 
chmod +x ./scripts/simulation_helper.sh 
```

---

## 📁 Project Structure

```
Ownership-Chain/
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
├── .github/workflows/                    # GitHub CI/CD pipelines
├── src/
│   ├── backend/                          # Motoko backend canister
│   │   ├── main.mo                       # Main Motoko actor (API Gateway)
│   │   │
│   │   ├── data/                         # Data models & input types
│   │   │   ├── dataType.mo
│   │   │   └── inputType.mo
│   │   │
│   │   ├── service/                      # Business logic layer
│   │   │   ├── assetService.mo
│   │   │   ├── userService.mo
│   │   │   ├── proposalService.mo
│   │   │   ├── reportService.mo
│   │   │   ├── transactionService.mo
│   │   │   └── llmService.mo
│   │   │
│   │   ├── storage/                      # Immutable on-chain ledgers
│   │   │   ├── assetStorage.mo
│   │   │   ├── userStorage.mo
│   │   │   ├── ownershipStorage.mo
│   │   │   ├── transactionStorage.mo
│   │   │   ├── buyProposalsStorage.mo
│   │   │   ├── investorProposalsStorage.mo
│   │   │   ├── reportStorage.mo
│   │   │   └── reportActionsStorage.mo
│   │   │
│   │   └── utils/                        # Helper & validation utilities
│   │       ├── helper.mo
│   │       └── validation.mo
│   │
│   ├── frontend/                         # React + Tailwind + TypeScript frontend
│   │   ├── src/
│   │   │   ├── App.tsx                   # Main App component
│   │   │   ├── index.css                 # Global styles with Tailwind
│   │   │   ├── components/               # Reusable UI components
│   │   │   ├── services/                 # Canister service layers
│   │   │   └── screens/                  # Page-level components
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

## 🛠️ Backend Overview
The backend is powered by Motoko canisters for asset storage, proposals, ownership governance, and transaction history.  

👉 For full details, see the [Backend Documentation](./documentation.md).

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


---

