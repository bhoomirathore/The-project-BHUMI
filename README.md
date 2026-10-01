 # 🏗️ Project B.H.U.M.I. 
**Blockchain Hosted Unified Mutation Infrastructure**

> *A government-oriented, hybrid Web3 digital land transaction platform designed to introduce an immutable trust layer and automated mutation (Namankan) workflow into existing property registration systems.*

![Status](https://img.shields.io/badge/Status-MVP_Development-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Architecture](https://img.shields.io/badge/Architecture-Hybrid_Web3-success)

---

## 📖 1. Context & Vision
Property real estate and land registry businesses face a massive administrative bottleneck globally, and specifically in India. While the initial property registry process has seen digitization, the downstream process of **Namankan (Mutation)**—updating the revenue and land ownership records—remains heavily manual, time-consuming, and prone to bureaucratic friction.

Project B.H.U.M.I. was conceptualized from ground realities to solve the structural loopholes of existing land administration models by removing single-point-of-failure vulnerabilities and automating post-registry workflows.

---

## 🚨 2. The Problem Statement
India has made massive strides in digital land modernization through initiatives like NGDRS and state portals (e.g., Madhya Pradesh’s Sampada 2.0). However, these systems fundamentally operate on **centralized databases**.

### The Core Vulnerabilities in Current Systems:
1. **Centralized Data Alteration:** Administrative databases can technically be modified with high-level admin access or insider manipulation. 
2. **Fragmented Workflows:** Registration (Registrar Office) and Mutation (Revenue Office/Patwari) remain disconnected.
3. **Lack of Permanent Audit Trails:** Historical changes lack cryptographic linkage. If a record is overwritten, the previous state is lost or hard to verify immutably.
4. **Document Forgery:** Fake physical registries and duplicate sales continue to plague the system.

---

## 💡 3. The Solution: What is B.H.U.M.I.?
**Project B.H.U.M.I. does not aim to replace highly functional existing systems like Sampada 2.0.** 
Instead, it introduces a next-generation **permissioned blockchain trust and audit layer** combined with smart contract automation. It acts as an underlying security infrastructure that connects the Registrar's approval directly to the land record mutation.

### Core Objectives:
- **Tamper-Evident Records:** Ensure ownership history cannot be silently erased.
- **Workflow Automation:** Trigger mutation instantly upon legal registration.
- **Data Integrity:** Store cryptographic proofs of physical documents.

---

## ⚙️ 4. System Architecture & Design
To ensure scalability, low transaction costs, and high speed, B.H.U.M.I. relies on a **Hybrid Architecture** rather than putting all data on-chain.

### 4.1. The Hybrid Web3 Approach
We divide our data persistence into two distinct layers:

#### A. Off-Chain Layer (Application Database)
*Powered by PostgreSQL*
- High-speed relational data management.
- Stores User Profiles (Citizens, Registrars, Revenue Officers).
- Stores standard UI data, Property Metadata (GIS location, Area, Boundaries).
- Stores highly encrypted files of Sale Deeds and Identity Proofs.

#### B. On-Chain Layer (Blockchain Ledger)
*Powered by Ethereum Virtual Machine (EVM) / Solidity*
- Acts strictly as the ultimate truth layer.
- Stores the finalized **Ownership State Transitions**.
- Stores the **SHA-256 Cryptographic Hashes** of the property documents. 
- Executes Smart Contracts for automated verification.

##### *Why Hybrid?*
> *Storing raw PDFs or massive JSON objects on a blockchain is an anti-pattern. By storing only the SHA-256 hash on the ledger, we ensure that if a single byte of the off-chain document is altered, its new hash will mismatch the blockchain hash, instantly flagging it as forged.*

---

## 🛠️ 5. Technology Stack (MVP)

### Frontend
- **React.js:** Component-based UI rendering.
- **Tailwind CSS:** Utility-first styling for dashboards.

### Backend & API
- **Node.js & Express.js:** REST API development and off-chain business logic.
- **Ethers.js / Web3.js:** To bridge the Node.js backend with the Solidity Smart Contracts.

### Database & Storage
- **PostgreSQL:** Relational database for property and user hierarchies.
- **Crypto API:** For generating SHA-256 hashes of uploaded documents.

### Blockchain Layer
- **Solidity:** For writing the `LandRegistry.sol` smart contract.
- **Hardhat / Ganache:** For local testnet deployment and EVM simulation.

---

## 🔄 6. Core Operational Workflow
The lifecycle of a property transfer in B.H.U.M.I. follows a strict 5-step process:

1. **Initiation (Web2):** Seller logs into the portal, selects their verified property, and initiates a transfer to a Buyer's ID.
2. **Document Hashing (Crypto):** Seller uploads the Sale Deed. The backend encrypts it and generates a `SHA-256` hash.
3. **Contract Request (Web3):** The Node API sends a transaction payload `[PropertyID, SellerRef, BuyerRef, DocHash]` to the Smart Contract. The status becomes `PENDING_APPROVAL`.
4. **Government Authorization (RBAC):** An authorized government official (Role: Registrar) reviews the documents off-chain. If valid, they digitally sign and approve the transaction on-chain.
5. **Automated Mutation (Event Listener):** The Smart Contract finalizes the ledger. The backend listens for the `TransactionFinalized` event and automatically updates the current owner in the PostgreSQL database, completing the mutation without manual Patwari intervention.

---

## 🚀 7. Hackathon & MVP Scope
Currently, the repository is focused on delivering the **Core Transaction Pipeline**. 
- **In Scope:** Hybrid DB setup, Document Hashing, Smart Contract RBAC, Automated State Transition.
- **Out of Scope (Future Roadmap):** AI-based OCR verification, Drone-based GIS mapping, Bank Mortgage integration, actual Aadhaar e-KYC integration.

---

## 👥 8. The Core Team
This project is being architected and developed by:
- **Dev** - Team Lead, System Architecture &  Frontend UI/UX,
- **Ashutosh** - Backend APIs & System Integration
- **Ayush** - Web3 Integration & Smart Contract Engineering
- **Bhoomi** - Documentation & Database Design

---
*Developed with 💻 & ☕ by Team B.H.U.M.I.*