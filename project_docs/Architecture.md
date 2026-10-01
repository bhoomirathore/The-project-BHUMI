# B.H.U.M.I. — Technical Architecture

**Project:** Blockchain Hosted Unified Mutation Infrastructure  
**Document:** Technical Architecture  
**Version:** 1.0  
**Status:** Locked for MVP / Phase 1

---

## 1. Document Purpose

This document defines the technical architecture of B.H.U.M.I.

It describes:

- system components and their responsibilities,
- application and service boundaries,
- database and storage architecture,
- blockchain and smart-contract architecture,
- hashing and document integrity,
- blockchain transaction processing,
- event-driven synchronization,
- authentication and authorization,
- APIs,
- security,
- failure handling,
- deployment,
- environment configuration,
- project structure.

Product requirements, personas, product goals, acceptance criteria, and feature prioritization are defined in the B.H.U.M.I. PRD and are not duplicated here.

---

# 2. Architecture Principles

B.H.U.M.I. follows these technical principles:

1. **Hybrid architecture** — operational and sensitive data remain off-chain; blockchain stores finalized ownership events and selected cryptographic proofs.
2. **Backend-controlled blockchain writes** — citizens do not directly submit smart-contract transactions.
3. **Event-driven synchronization** — PostgreSQL ownership projections are updated from confirmed blockchain events.
4. **Least-privilege access** — application roles and blockchain roles are separately controlled.
5. **Privacy by design** — personal documents and sensitive identity data remain off-chain.
6. **Immutable event history** — finalized blockchain events are not edited through the application.
7. **Asynchronous transaction processing** — blockchain submission and database synchronization are separate operations.
8. **MVP simplicity** — the smart contract contains only the functionality required for the Phase 1 implementation.

---

# 3. System Context

B.H.U.M.I. consists of five primary technical domains:

```text
┌──────────────────────────────────────────────────────────────┐
│                         B.H.U.M.I.                           │
│                                                              │
│  ┌──────────────┐     ┌──────────────────┐                  │
│  │   Frontend   │────▶│      Backend     │                  │
│  │ React + Vite │     │ Node + Express   │                  │
│  └──────────────┘     └───────┬──────────┘                  │
│                               │                              │
│              ┌────────────────┼────────────────┐             │
│              ▼                ▼                ▼             │
│       ┌────────────┐   ┌──────────────┐  ┌──────────────┐   │
│       │ PostgreSQL │   │   Document   │  │  Blockchain  │   │
│       │ + Prisma   │   │   Storage    │  │ Smart        │   │
│       └────────────┘   └──────────────┘  │ Contract     │   │
│                                          └──────┬───────┘   │
│                                                 │           │
│                                                 ▼           │
│                                         Event Listener       │
│                                                 │           │
│                                                 ▼           │
│                                           PostgreSQL         │
│                                           Projection         │
└──────────────────────────────────────────────────────────────┘
```

---

# 4. High-Level Architecture

The application is divided into the following layers:

```text
Presentation Layer
        │
        ▼
API Layer
        │
        ▼
Application / Service Layer
        │
        ├───────────────┐
        ▼               ▼
Data Layer       Blockchain Layer
        │               │
        ▼               ▼
PostgreSQL       Smart Contract
        │               │
        │               ▼
        │          EVM Blockchain
        │               │
        │            Events
        │               │
        └───────◀───────┘
```

The frontend never directly writes application data to PostgreSQL or directly performs privileged blockchain operations.

---

# 5. Component Architecture

## 5.1 Frontend

Technology:

- React
- Vite
- Tailwind CSS
- Framer Motion

Responsibilities:

- authentication UI,
- citizen dashboard,
- government dashboard,
- application forms,
- document upload,
- payment UI,
- verification status,
- blockchain transaction status,
- public property verification,
- API communication.

The frontend treats blockchain processing as an asynchronous operation and displays appropriate states such as:

```text
SUBMITTED
BLOCKCHAIN_PENDING
BLOCKCHAIN_CONFIRMED
SYNCED
FAILED
```

The frontend does not contain blockchain private keys.

---

## 5.2 Backend

Technology:

- Node.js
- Express.js

Responsibilities:

- authentication,
- authorization,
- application processing,
- property operations,
- document handling,
- KYC simulation,
- payment simulation,
- hashing,
- government verification,
- blockchain transaction orchestration,
- event listening,
- PostgreSQL projection synchronization,
- audit logging.

The backend is the orchestration layer between the Web2 application and blockchain.

---

## 5.3 Database

Technology:

- PostgreSQL
- Prisma ORM

Responsibilities:

- application state,
- user data,
- property metadata,
- land records,
- document metadata,
- payment state,
- KYC state,
- blockchain transaction state,
- operational ownership projection,
- audit logs.

---

## 5.4 Document Storage

Documents are stored off-chain in secure document storage.

The MVP may use local/object storage.

A production deployment may use an S3-compatible storage system or another approved object-storage layer.

The database stores document metadata and references rather than embedding large files directly in relational records.

---

## 5.5 Blockchain Layer

Technology:

- Solidity
- EVM-compatible network
- ethers.js
- Hardhat-compatible local development network

Responsibilities:

- finalized ownership events,
- property identifiers,
- selected cryptographic proofs,
- transaction history,
- blockchain-level access control.

---

# 6. Off-Chain / On-Chain Data Architecture

## 6.1 Off-Chain

The following remain off-chain:

- user profiles,
- authentication information,
- KYC information,
- KYC documents,
- property operational metadata,
- land-record details,
- uploaded documents,
- payment information,
- application records,
- audit logs,
- blockchain processing state,
- synchronization state.

Sensitive personal information is not stored directly on-chain.

---

## 6.2 On-Chain

The MVP blockchain record contains only the minimum required data for the blockchain trust layer.

Representative property structure:

```solidity
struct Property {
    bytes32 propertyId;
    address currentOwner;
    bytes32 documentHash;
    bytes32 metadataHash;
    uint256 registeredAt;
    uint256 lastTransferAt;
    bool exists;
}
```

The exact Solidity representation may be refined during implementation without changing the storage boundary.

---

# 7. Data Authority Model

For blockchain-backed ownership records:

- the blockchain contains the authoritative finalized event history;
- PostgreSQL contains the operational projection used by the application.

Architecture:

```text
                 ┌─────────────────────────┐
                 │       Blockchain        │
                 │                         │
                 │ Finalized Ownership     │
                 │ Events + Proofs         │
                 └────────────┬────────────┘
                              │
                              │ Contract Events
                              ▼
                 ┌─────────────────────────┐
                 │ Blockchain Event        │
                 │ Listener                │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ PostgreSQL              │
                 │ Operational Projection  │
                 └─────────────────────────┘
```

PostgreSQL must not independently overwrite a blockchain-backed finalized ownership event.

---

# 8. Database Architecture

The database is relational because property, owner, application, transaction, document, and audit relationships are highly structured.

Core entities:

```text
User
GovernmentUser
Property
LandRecord
Application
Document
KYCVerification
Payment
BlockchainTransaction
OwnershipHistory
AuditLog
```

A conceptual relationship is:

```text
User
 │
 ├── Application
 │       │
 │       ├── Documents
 │       ├── Payment
 │       ├── KYCVerification
 │       └── BlockchainTransaction
 │
 └── Property
         │
         └── OwnershipHistory
```

---

## 8.1 Important Database Constraints

The implementation should enforce appropriate uniqueness constraints, including where applicable:

```text
property_id UNIQUE
application_id UNIQUE
blockchain_transaction_hash UNIQUE
(blockchain_transaction_hash, event_log_index) UNIQUE
```

Foreign keys should enforce relationships between applications, properties, users, documents, transactions, and ownership records.

---

# 9. Ownership Projection

The `Property` ownership information in PostgreSQL is treated as an operational projection for blockchain-backed records.

Example:

```text
Blockchain:
Owner = Address B

        │
        ▼

Event Listener

        │
        ▼

PostgreSQL:
currentOwner = B
```

The application reads PostgreSQL for normal dashboard/search operations rather than querying the blockchain for every page load.

---

# 10. Blockchain Architecture

## 10.1 Network Model

The MVP uses an EVM-compatible local development/test network.

The architecture must distinguish:

```text
Blockchain network
        ≠
Smart-contract access control
```

The MVP may simulate a permissioned environment through strict smart-contract RBAC on a local EVM-compatible network.

A future production deployment may use a permissioned EVM-compatible network.

---

# 11. Smart Contract Architecture

The MVP contract is intentionally small.

Required operations:

```solidity
registerProperty(...)
transferOwnership(...)
getProperty(...)
getCurrentOwner(...)
```

Required events:

```solidity
PropertyRegistered(...)
OwnershipTransferred(...)
```

State-changing operations must be restricted to authorized roles.

Advanced dispute/freeze functionality is not part of the MVP contract.

---

# 12. Smart Contract Access Control

The contract must implement role-based access control.

Conceptually:

```text
Citizen
   │
   │ No direct write access
   ▼
Backend
   │
   ▼
Authorized Registrar Identity
   │
   ▼
Smart Contract
```

Only authorized blockchain identities can execute state-changing functions.

The citizen cannot directly call privileged contract functions through the public frontend.

---

# 13. Blockchain Identity Architecture

The application uses two distinct identity domains.

## 13.1 Application Identity

Citizens and officials have application identities stored in PostgreSQL.

Example:

```text
User ID
Role
Application permissions
```

## 13.2 Blockchain Identity

Blockchain transactions use EVM addresses.

The backend maintains the required mapping between application records and blockchain identities.

For the currentOwner field, the blockchain address represents the system's blockchain ownership identity for that property.

The relationship between a blockchain identity and personally identifiable information remains off-chain.

---

# 14. Registrar Wallet Architecture

The authorized Registrar/backend wallet is responsible for signing privileged blockchain transactions.

```text
Registrar Authentication
          │
          ▼
Backend Authorization
          │
          ▼
Transaction Service
          │
          ▼
Authorized Wallet
          │
          ▼
Smart Contract
```

Private keys must never be exposed through:

- frontend code,
- browser storage,
- `VITE_*` variables,
- Git repositories,
- client-side JavaScript.

Private keys must be supplied only to trusted backend infrastructure through secure secret management.

---

# 15. Blockchain Transaction Architecture

The technical transaction sequence is:

```text
1. Application reaches approval state
2. Backend validates authorization
3. Required hashes are calculated
4. Transaction payload is created
5. Authorized wallet signs transaction
6. Transaction is submitted
7. Transaction hash is persisted
8. Confirmation is monitored
9. Contract event is detected
10. Event is validated
11. PostgreSQL projection is updated
12. Audit event is recorded
```

Blockchain confirmation and PostgreSQL synchronization are separate operations.

They must not be implemented as one atomic transaction.

---

# 16. Transaction State Machine

The backend tracks blockchain processing explicitly.

```text
PENDING
   │
   ▼
BLOCKCHAIN_PENDING
   │
   ├───────────────▶ BLOCKCHAIN_FAILED
   │
   ▼
BLOCKCHAIN_CONFIRMED
   │
   ├───────────────▶ BLOCKCHAIN_SYNC_FAILED
   │
   ▼
BLOCKCHAIN_SYNCED
```

A transaction must not be represented as fully completed merely because it has been submitted to the blockchain.

---

# 17. Event Synchronization Architecture

The backend must listen for contract events.

```text
Registrar Approval
        │
        ▼
Blockchain Transaction
        │
        ▼
Blockchain Confirmation
        │
        ▼
Smart Contract Event
        │
        ▼
Event Listener
        │
        ▼
Event Validation
        │
        ▼
Projection Update
        │
        ▼
Audit Log
```

For example:

```text
OwnershipTransferred
        │
        ▼
Validate propertyId
Validate transaction
Validate event
        │
        ▼
Update Property.currentOwner
        │
        ▼
Create OwnershipHistory record
        │
        ▼
Mark synchronization successful
```

---

# 18. Event Processing Idempotency

Blockchain event processing must be idempotent.

The same event may be received more than once due to retries, listener restarts, or recovery processing.

The system should identify processed events using a unique event reference such as:

```text
transactionHash + event/log index
```

Conceptually:

```text
Blockchain Event
       │
       ▼
Already Processed?
    /       \
  YES        NO
   │          │
 Ignore      Process
              │
              ▼
        Update Projection
```

This prevents duplicate ownership-history entries.

---

# 19. Reconciliation Architecture

A blockchain transaction may be confirmed even if the PostgreSQL update fails.

Example:

```text
Blockchain
Owner = B
     │
     ▼
Event Confirmed
     │
     X
PostgreSQL Update Failed
```

The application records:

```text
BLOCKCHAIN_SYNC_FAILED
```

The system must support retry/reconciliation.

The blockchain event remains the source for reconstructing the intended ownership state.

---

# 20. Hashing Architecture

SHA-256 is used to create cryptographic fingerprints.

```text
Original File
      │
      ▼
File Validation
      │
      ▼
Original File Bytes
      │
      ▼
SHA-256
      │
      ▼
Document Hash
```

The MVP hashes the exact original uploaded file bytes.

The file must not be regenerated or modified before hashing.

---

# 21. Hash Storage

The document itself remains off-chain.

Conceptually:

```text
                ┌────────────────────┐
                │ Original Document  │
                └─────────┬──────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
        Secure Off-Chain       SHA-256
           Storage               Hash
                                  │
                                  ▼
                           Blockchain Proof
```

The blockchain stores the cryptographic proof, not the actual document.

KYC and other sensitive documents remain off-chain.

---

# 22. Metadata Hashing

Where the blockchain stores a metadata hash, the backend must define a deterministic representation of the metadata before hashing.

The canonicalization format should be fixed during implementation so that the same logical metadata always produces the same hash.

Example conceptual flow:

```text
Property Metadata
       │
       ▼
Canonical Representation
       │
       ▼
SHA-256
       │
       ▼
metadataHash
```

---

# 23. Authentication Architecture

The backend is responsible for authentication.

Conceptual flow:

```text
Frontend
   │
   ▼
Login / OTP / Credentials
   │
   ▼
Auth API
   │
   ▼
Credential Verification
   │
   ▼
Session / JWT
   │
   ▼
Protected API
```

The exact authentication mechanism may be implemented according to the project environment, but authentication must remain server-side and role-aware.

---

# 24. Authorization Architecture

Application-level roles are enforced through backend middleware.

Example:

```text
Citizen
  ├── Citizen APIs
  └── Own applications

Registrar
  ├── Verification APIs
  ├── Approval APIs
  └── Blockchain transaction APIs

Admin
  └── Administrative APIs

Public
  └── Read-only verification
```

Authorization must be checked server-side even when the frontend hides unauthorized controls.

---

# 25. Document Architecture

Document processing:

```text
Upload
  │
  ▼
Authentication Check
  │
  ▼
File Validation
  │
  ├── Type validation
  ├── Size validation
  └── Access validation
  │
  ▼
Secure Storage
  │
  ▼
Document Metadata in PostgreSQL
  │
  ▼
SHA-256
```

Documents should be referenced using IDs rather than exposing unrestricted filesystem paths.

---

# 26. Payment Architecture

The MVP uses a replaceable payment-service abstraction.

```text
Frontend
   │
   ▼
Payment API
   │
   ▼
Payment Service
   │
   ▼
Mock Payment Provider
   │
   ├── SUCCESS
   └── FAILED
```

Payment records are stored in PostgreSQL.

The payment layer is intentionally abstracted so that a real INR payment provider can be integrated later without redesigning the application layer.

---

# 27. Public Verification Architecture

Public verification is implemented as an application service rather than direct unrestricted blockchain access.

```text
Public User
    │
    ▼
Property ID
    │
    ▼
Verification API
    │
    ├── PostgreSQL data
    │
    └── Blockchain verification
            │
            ▼
      Verification Result
```

The response should expose only permitted verification information.

Sensitive personal information and private documents must not be returned.

---

# 28. API Architecture

The backend API is organized by domain.

```text
/api/auth
/api/users
/api/land
/api/properties
/api/applications
/api/documents
/api/kyc
/api/payments
/api/verification
/api/registry
/api/mutations
/api/ownership
/api/blockchain
/api/audit
```

## Responsibilities

| Module | Responsibility |
|---|---|
| `/auth` | Authentication and sessions |
| `/users` | User/application identity |
| `/land` | Land-record lookup |
| `/properties` | Property operations |
| `/applications` | Application lifecycle |
| `/documents` | Document upload and metadata |
| `/kyc` | KYC verification state |
| `/payments` | Mock payment processing |
| `/verification` | Government verification |
| `/registry` | Registration services |
| `/mutations` | Ownership transfer services |
| `/ownership` | Ownership projection/history |
| `/blockchain` | Blockchain transaction lifecycle |
| `/audit` | Audit records |

Controllers should remain thin and delegate business logic to services.

---

# 29. Backend Service Architecture

Recommended service structure:

```text
services/
├── auth/
├── properties/
├── applications/
├── documents/
├── kyc/
├── verification/
├── payments/
├── registry/
├── mutation/
├── hashing/
├── blockchain/
│   ├── blockchain.service.ts
│   ├── contract.service.ts
│   ├── transaction.service.ts
│   ├── event.listener.ts
│   └── wallet.service.ts
├── ownership/
└── audit/
```

Database access should be isolated through repositories where appropriate.

---

# 30. Repository Layer

The repository layer isolates Prisma/database operations from business logic.

Example:

```text
ApplicationService
        │
        ▼
ApplicationRepository
        │
        ▼
Prisma
        │
        ▼
PostgreSQL
```

This allows database implementation details to remain separate from application services.

---

# 31. Core Technical Data Flow

## Registration

```text
React
  ↓
Application API
  ↓
Application Service
  ↓
PostgreSQL
  ↓
Government Verification
  ↓
Blockchain Transaction Service
  ↓
Hashing Service
  ↓
Authorized Wallet
  ↓
Smart Contract
  ↓
Blockchain
  ↓
Event Listener
  ↓
Ownership Projection
  ↓
PostgreSQL
```

## Ownership Transfer

```text
Transfer Request
      ↓
Verification
      ↓
Approval
      ↓
Hash Generation
      ↓
transferOwnership()
      ↓
Blockchain Confirmation
      ↓
OwnershipTransferred Event
      ↓
Event Listener
      ↓
PostgreSQL Ownership Projection
```

---

# 32. Security Architecture

Security controls are implemented at multiple layers.

```text
User Authentication
        ↓
Role Authorization
        ↓
API Authorization
        ↓
Input Validation
        ↓
Database Access Control
        ↓
Blockchain Authorization
        ↓
Smart Contract RBAC
```

---

## 32.1 Secrets

Secrets must not be committed to Git.

Sensitive configuration includes:

- JWT secrets,
- encryption keys,
- database credentials,
- blockchain private keys,
- payment secrets.

Development values belong in local environment configuration.

Production values should use a secure secret-management mechanism.

---

# 33. Blockchain Security Requirements

The smart-contract implementation must include:

- role-based write restrictions,
- authorization checks,
- validation of property existence,
- validation of ownership-transfer conditions,
- event emission,
- tests for unauthorized calls.

The contract should remain intentionally small to reduce attack surface and implementation complexity.

---

# 34. Audit Architecture

Important system actions must generate audit records.

Examples:

```text
USER_CREATED
DOCUMENT_UPLOADED
KYC_VERIFIED
PAYMENT_SUCCESS
APPLICATION_APPROVED
APPLICATION_REJECTED
BLOCKCHAIN_TX_SUBMITTED
BLOCKCHAIN_TX_CONFIRMED
OWNERSHIP_SYNCED
OWNERSHIP_SYNC_FAILED
```

Audit records should include:

```text
event type
timestamp
actor/system identity
application ID
property ID
transaction reference where applicable
```

---

# 35. Failure Handling

## 35.1 Payment Failure

```text
Payment
   ↓
FAILED
   ↓
Application remains incomplete
```

## 35.2 Verification Failure

```text
Verification
   ↓
FAILED
   ↓
Application rejected/correction required
```

## 35.3 Blockchain Submission Failure

```text
Transaction Submission
   ↓
FAILED
   ↓
BLOCKCHAIN_FAILED
```

The application must not mark the property as blockchain-finalized.

## 35.4 Confirmation Delay

```text
BLOCKCHAIN_PENDING
```

The UI must continue to show a processing state rather than falsely reporting completion.

## 35.5 Synchronization Failure

```text
Blockchain Confirmed
        ↓
PostgreSQL Update Failed
        ↓
BLOCKCHAIN_SYNC_FAILED
        ↓
Retry / Reconciliation
```

---

# 36. Asynchronous UX Architecture

Blockchain confirmation is asynchronous.

The frontend must not assume:

```text
Approve clicked = Completed
```

Instead:

```text
Approve
  ↓
Submitting
  ↓
Transaction Submitted
  ↓
Waiting for Confirmation
  ↓
Confirmed
  ↓
Synchronizing
  ↓
Completed
```

The UI should expose the transaction reference where appropriate.

---

# 37. Environment Configuration

## Backend

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/bhumi

JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:5173

STORAGE_PATH=./storage/documents
DOCUMENT_MAX_SIZE_MB=10

ENCRYPTION_KEY=CHANGE_THIS_TO_A_SECURE_KEY

BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_CHAIN_ID=31337
LAND_REGISTRY_CONTRACT_ADDRESS=0x...
REGISTRAR_WALLET_ADDRESS=0x...
REGISTRAR_PRIVATE_KEY=DO_NOT_COMMIT_THIS

PAYMENT_GATEWAY_KEY=CHANGE_THIS
PAYMENT_GATEWAY_SECRET=CHANGE_THIS

LOG_LEVEL=info
```

The payment variables represent the payment-service abstraction and may be replaced by mock-service configuration for the MVP.

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api

VITE_BLOCKCHAIN_CHAIN_ID=31337
VITE_LAND_REGISTRY_CONTRACT_ADDRESS=0x...
```

No private key or backend secret may be placed in `VITE_*` variables.

---

# 38. Deployment Architecture

## MVP Development

```text
Developer Machine
       │
       ├── React/Vite
       ├── Node/Express
       ├── PostgreSQL
       └── Local EVM Network
```

Docker may be used to standardize PostgreSQL and supporting services.

## Prototype Deployment

A prototype may deploy:

```text
Frontend
   ↓
Backend
   ├── PostgreSQL
   ├── Document Storage
   └── EVM Blockchain/RPC
```

Production deployment requires stronger infrastructure, secret management, backup, monitoring, and an appropriate permissioned blockchain network.

---

# 39. Docker Architecture

The project may use:

```text
docker-compose.yml
```

for local infrastructure such as PostgreSQL and supporting services.

The local EVM network may run through the selected development framework.

Docker should simplify environment setup but should not hide the logical service boundaries.

---

# 40. Testing Architecture

Testing must cover the boundaries between components.

## Unit Tests

- hashing service,
- validation,
- application services,
- payment service,
- authorization.

## Smart Contract Tests

- registration,
- ownership transfer,
- unauthorized access,
- invalid property,
- event emission,
- state updates.

## Integration Tests

- API → PostgreSQL,
- API → hashing,
- backend → smart contract,
- blockchain event → PostgreSQL.

## Failure Tests

- payment failure,
- invalid document,
- blockchain transaction failure,
- confirmation delay,
- duplicate event,
- synchronization failure,
- hash mismatch.

---

# 41. Smart Contract Testing Strategy

Because smart-contract state is persistent after deployment, contract tests must be completed before using the deployed contract for the integrated MVP.

Minimum tests:

```text
✓ Authorized registration
✓ Unauthorized registration rejected
✓ Authorized ownership transfer
✓ Unauthorized transfer rejected
✓ Invalid property rejected
✓ Correct event emitted
✓ Current owner updated
✓ Document hash stored
✓ Metadata hash stored
```

---

# 42. Project Directory Structure

Recommended repository structure:

```text
BHUMI/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── auth/
│       │   ├── citizen/
│       │   └── government/
│       │       ├── registrar/
│       │       └── admin/
│       ├── hooks/
│       ├── services/
│       ├── api/
│       ├── routes/
│       ├── types/
│       ├── utils/
│       └── App.tsx
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── models/
│       ├── repositories/
│       ├── services/
│       │   ├── auth/
│       │   ├── properties/
│       │   ├── applications/
│       │   ├── documents/
│       │   ├── kyc/
│       │   ├── verification/
│       │   ├── payments/
│       │   ├── registry/
│       │   ├── mutation/
│       │   ├── hashing/
│       │   ├── blockchain/
│       │   │   ├── blockchain.service.ts
│       │   │   ├── contract.service.ts
│       │   │   ├── transaction.service.ts
│       │   │   ├── event.listener.ts
│       │   │   └── wallet.service.ts
│       │   ├── ownership/
│       │   └── audit/
│       └── utils/
│
├── contracts/
│   ├── src/
│   │   └── LandRegistry.sol
│   ├── script/
│   └── test/
│
├── docs/
│
├── storage/
│
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 43. Technology Decisions

| Layer | Technology | Architectural Role |
|---|---|---|
| Frontend | React + Vite | Presentation |
| Styling | Tailwind CSS | UI |
| Animation | Framer Motion | UI interaction |
| Backend | Node.js + Express | API/orchestration |
| Database | PostgreSQL | Operational data |
| ORM | Prisma | Database access |
| Blockchain | Solidity | Smart contract |
| Blockchain Runtime | EVM-compatible network | Ledger |
| Web3 Library | ethers.js | Blockchain integration |
| Hashing | SHA-256 | Document/metadata integrity |
| Document Storage | Local/object storage | Off-chain files |
| Containers | Docker | Local infrastructure |
| Testing | Contract + API + integration tests | Reliability |

---

# 44. Architecture Constraints

The following constraints apply to the MVP implementation:

1. Citizens do not directly write to the smart contract.
2. Citizens do not require MetaMask.
3. Citizen-side blockchain gas payment is not required.
4. Sensitive personal data remains off-chain.
5. Actual documents are never stored directly on-chain.
6. PostgreSQL and blockchain are not one atomic transaction.
7. PostgreSQL ownership projection is synchronized from confirmed blockchain events.
8. Blockchain event processing must be idempotent.
9. Smart-contract write operations require authorization.
10. Private blockchain keys remain backend-only.
11. The MVP blockchain is an EVM-compatible local/test environment.
12. Production permissioned blockchain deployment is a future infrastructure decision.
13. Advanced dispute/freeze contract functionality is outside the MVP contract.
14. Mock payment infrastructure is replaceable with a future real provider.

---

# 45. Implementation Sequence

The implementation should proceed in dependency order.

## Layer 1 — Database

```text
PostgreSQL
    ↓
Prisma Schema
    ↓
Migrations
    ↓
Repositories
```

## Layer 2 — Backend Foundation

```text
Express
    ↓
Authentication
    ↓
RBAC
    ↓
Basic APIs
```

## Layer 3 — Document and Hashing

```text
Upload
    ↓
Secure Storage
    ↓
SHA-256
```

## Layer 4 — Smart Contract

```text
LandRegistry.sol
    ↓
RBAC
    ↓
Registration
    ↓
Transfer
    ↓
Events
    ↓
Tests
```

## Layer 5 — Blockchain Integration

```text
ethers.js
    ↓
Wallet
    ↓
Contract Service
    ↓
Transaction Service
    ↓
Event Listener
```

## Layer 6 — Frontend

```text
Citizen Dashboard
    ↓
Application Flow
    ↓
Registrar Dashboard
    ↓
Transaction Status
```

## Layer 7 — End-to-End Integration

```text
React
  ↓
Backend
  ↓
PostgreSQL
  ↓
Hashing
  ↓
Blockchain
  ↓
Event Listener
  ↓
PostgreSQL Projection
```

---

# 46. Architecture Verification Checklist

Before considering the technical MVP implementation complete, verify:

### Application

- [ ] Authentication works
- [ ] RBAC works
- [ ] Property lookup works
- [ ] Application creation works
- [ ] Document upload works
- [ ] Mock KYC works
- [ ] Mock payment works

### Database

- [ ] Prisma schema is migrated
- [ ] Relationships are enforced
- [ ] Transaction identifiers are unique
- [ ] Ownership projection is queryable
- [ ] Audit records are created

### Hashing

- [ ] Original file bytes are hashed
- [ ] SHA-256 output is stored correctly
- [ ] Hash mismatch is detected

### Smart Contract

- [ ] Contract deploys locally
- [ ] Registrar authorization works
- [ ] Unauthorized writes fail
- [ ] Property registration works
- [ ] Ownership transfer works
- [ ] Events are emitted

### Synchronization

- [ ] Event listener receives events
- [ ] Events are validated
- [ ] Duplicate events are idempotent
- [ ] PostgreSQL projection updates
- [ ] Sync failure is recorded
- [ ] Reconciliation can be performed

### Security

- [ ] No private keys in frontend
- [ ] No secrets committed to Git
- [ ] API authorization is enforced
- [ ] Documents require authorization
- [ ] Sensitive information is not exposed publicly

---

# 47. Architecture Boundary

This document defines **how B.H.U.M.I. is technically implemented**.

The following documents should provide more specialized detail without duplicating this document:

```text
PRD.md
    → Product requirements

WORKFLOWS.md
    → Business workflows

DATABASE_DESIGN.md
    → Detailed tables, columns, relationships, indexes

SMART_CONTRACT.md
    → Contract interface, state, events, modifiers and tests

API_DOCUMENTATION.md
    → Endpoint contracts and request/response schemas

CODING_AGENT_RULES.md
    → Repository and implementation rules
```

The architecture document acts as the technical bridge between the PRD and these implementation-level documents.
