# Ancient Sclupture Project's: OwnershipChain

## OwnershipChain

### Problem 

### Target Solution
The problem is addressed through tokenization of real-world assets using Internet Computer Protocol (ICP) technology. This solution aims to:

- **Secure ownership data** by recording it on an immutable blockchain, protecting it from manipulation or forgery.

- **Increase transparency and accountability** in every transaction or change in ownership status.

- **Enable fractional ownership** in a digital and legally compliant way, allowing individuals to own portions of high-value assets.

- **Bridge the physical and digital worlds efficiently**, enabling digital interactions such as selling, leasing, revenue sharing, or real-time asset status reporting.

With this approach, assets like properties, businesses, or artworks can be managed in a modern, secure, and inclusive way, both locally and globally.

## Feature

This repository offers a high-quality, production-ready template to jumpstart your Internet Computer (ICP) development.

We Use:

- 💻 **Motoko-based Canister** backend
- 🔥 **React + Tailwind + Typescript** frontend
- 🤖  **IC LLM Canister** integration of Agentic AI as a helpfull agent ai.

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

### 6. Run Tests

```bash
npm test
```

---

## 📁 Project Structure

```
Ownership-Chain/
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
├── .github/workflows/                    # GitHub CI/CD pipelines
├── src/
│   ├── backend/                          # Motoko backend canister
│   │   └── main.mo                       # Main Motoko file
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

## 🔄 CI/CD Workflow And Testing

---


## 📚 Learning Resources

- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Motoko Docs](https://internetcomputer.org/docs/motoko/home)
- [PicJS Doc](https://dfinity.github.io/pic-js/)
- [Vitest Testing Framework](https://vitest.dev/)

---

## 🤝 **Teams**

---

