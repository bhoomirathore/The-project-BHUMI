# B.H.U.M.I. — Coding Agent Rules

**Project:** Blockchain Hosted Unified Mutation Infrastructure  
**Document:** Coding & Implementation Rules  
**Version:** 1.1  
**Status:** Locked for MVP / Phase 1

---

# 1. Purpose

This document defines the rules that coding agents and developers must follow when modifying the B.H.U.M.I. repository.

These rules govern:

- implementation scope,
- use of project documentation,
- technology choices,
- architecture boundaries,
- security,
- data handling,
- blockchain interaction,
- coding discipline,
- testing,
- Git usage,
- documentation consistency.

The **PRD defines what the product must do**.

The **Architecture document defines how the system is technically implemented**.

This document defines **how implementation work must be carried out without violating those decisions**.

---

# 2. Foundation Documents

Before making a code, configuration, database, smart-contract, API, UI, or documentation change, read the current foundation documents:

```text
PRD.md
ARCHITECTURE.md
RULES.md
WORKFLOWS.md
DATABASE_DESIGN.md
SMART_CONTRACT.md
```

If any of these files do not yet exist, do not invent their contents. Use the documents that are actually present in the repository and ask for clarification when the missing document is required to make a decision.

## Rules

1. Treat the foundation documents as authoritative.
2. Do not silently contradict them.
3. Do not introduce a feature outside the PRD scope.
4. Do not introduce a technical pattern that conflicts with the Architecture document.
5. Do not change database or smart-contract structure without an approved requirement.
6. If two authoritative documents conflict, stop and request clarification.
7. Do not silently resolve an architectural or product conflict.

---

# 3. Document Responsibility Boundary

Avoid duplicating information across project documents.

## PRD

Defines:

```text
What the product must do
Why it exists
Who uses it
MVP requirements
Product constraints
Acceptance criteria
Out-of-scope functionality
```

## ARCHITECTURE.md

Defines:

```text
How the system is technically implemented
System components
Technology choices
Data/storage architecture
Blockchain architecture
Service boundaries
Synchronization
Security architecture
Deployment
Infrastructure
```

## WORKFLOWS.md

Defines:

```text
Detailed business/process workflows
Actor actions
Process states
Process transitions
```

## DATABASE_DESIGN.md

Defines:

```text
Tables
Columns
Relationships
Indexes
Constraints
Migrations
```

## SMART_CONTRACT.md

Defines:

```text
Contract state
Functions
Events
Roles
Modifiers
Contract validation
Contract tests
```

Do not copy entire sections from one document into another merely for convenience.

---

# 4. MVP Scope Rule

Implement only functionality required by the current MVP.

The MVP focuses on the complete property transaction flow:

```text
Citizen Request
    ↓
Document / KYC / Payment
    ↓
Government Verification
    ↓
Authorized Approval
    ↓
Finalized Ownership Transaction
    ↓
Automatic Mutation Completion
    ↓
Ownership History / Verification
```

Do not implement future functionality simply because the architecture can support it.

Examples of features outside the locked MVP include:

```text
Real Aadhaar/e-KYC APIs
Live banking integrations
AI/OCR
Advanced dispute contracts
Advanced freeze/unfreeze mechanisms
Cross-chain interoperability
Citizen-managed blockchain wallets
Large-scale GIS
Production multi-state infrastructure
```

If the PRD is changed later, update the implementation scope accordingly.

---

# 5. Scope Discipline

For every requested change, determine:

```text
1. What requirement is being implemented?
2. Which existing component owns that responsibility?
3. Which files actually need to change?
4. What existing behavior must remain unchanged?
5. Does the change cross an architecture or security boundary?
```

Only modify what is necessary.

Do not:

- add unsolicited features,
- refactor unrelated modules,
- rename established concepts without approval,
- replace working architecture with a preferred architecture,
- create duplicate services,
- create duplicate APIs,
- modify unrelated documentation,
- introduce speculative abstractions.

Prefer the smallest complete implementation.

---

# 6. Technology Boundary

Use the technology stack defined in `ARCHITECTURE.md`.

The current MVP stack includes:

```text
Frontend:
React
Vite
Tailwind CSS
Framer Motion where already used

Backend:
Node.js
Express.js

Database:
PostgreSQL
Prisma

Blockchain:
Solidity
EVM-compatible network
ethers.js
Hardhat-compatible development tooling

Hashing:
SHA-256

Storage:
Approved secure off-chain document storage

Infrastructure:
Docker where defined by the architecture
```

Do not introduce alternative technologies merely because they are familiar or convenient.

Examples of technologies that must not be introduced without approval:

```text
MongoDB
Firebase
Supabase as a replacement database
MUI
Chakra UI
Unapproved blockchain frameworks
Unapproved ORM/database layers
Unapproved authentication providers
```

An explicit architecture change is required before replacing an approved technology.

---

# 7. Frontend Rules

Use the existing frontend architecture.

## Requirements

- Reuse existing components.
- Reuse existing hooks and services.
- Follow established routing.
- Follow Tailwind conventions.
- Follow existing design tokens and patterns.
- Keep API calls inside the approved API/service layer.
- Do not place privileged business logic in the browser.

Do not:

- add another UI framework,
- create duplicate components,
- expose backend secrets,
- put blockchain private keys in frontend code,
- bypass backend authorization.

The frontend is a presentation/client layer, not the authority for government operations.

---

# 8. Backend Rules

The backend is the controlled application layer.

Business logic should remain on the server where it affects:

- authorization,
- government verification,
- transaction approval,
- document access,
- payment state,
- ownership changes,
- blockchain writes,
- audit records.

Use the established flow:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository / Data Access
  ↓
Database or External Service
```

Controllers should remain thin.

Do not move security-sensitive business logic into frontend code merely to simplify implementation.

---

# 9. Authentication and Authorization

All protected operations must be authorized server-side.

Required principles:

```text
Authentication
    ↓
Role Resolution
    ↓
Authorization
    ↓
Operation
```

Application roles are defined by the current product/architecture documentation.

At minimum, the implementation must distinguish between:

```text
Citizen
Government / Registrar
Admin
Public / Read-only verification
```

Where the detailed government role model exists in the approved workflow documentation, preserve those distinctions.

Never trust a role supplied only by the frontend.

Never bypass authorization for testing convenience.

---

# 10. Blockchain Boundary

The blockchain is a trust/integrity layer.

The implementation must preserve the separation:

```text
Frontend
    ↓
Backend
    ↓
Authorization / Verification
    ↓
Authorized Blockchain Identity
    ↓
Smart Contract
    ↓
Blockchain
```

Citizens must not directly execute privileged registry or ownership-transfer transactions.

Citizens do not require:

```text
MetaMask
Private blockchain keys
Cryptocurrency
Direct blockchain gas payment
```

unless the approved architecture is explicitly changed.

---

# 11. Blockchain Write Authorization

Only authorized backend/Registrar identities may execute privileged smart-contract operations.

Never:

- expose a Registrar private key to the frontend,
- store a private key in browser storage,
- place a private key in `VITE_*`,
- hardcode a private key in source code,
- commit private keys to Git,
- allow arbitrary users to call privileged contract functions.

Private keys must be supplied through secure backend configuration/secrets management.

---

# 12. Smart Contract Boundary

Do not change the smart-contract interface without an approved requirement.

For the MVP, the contract is intentionally limited to the functionality required by the approved product scope.

Before changing:

```text
Functions
Events
State variables
Roles
Modifiers
Access control
```

check:

```text
PRD.md
ARCHITECTURE.md
SMART_CONTRACT.md
```

If the change affects the contract interface, stop for approval when it is not already defined by those documents.

---

# 13. Blockchain Transaction Rule

Do not treat transaction submission as transaction completion.

The technical lifecycle is:

```text
Approval
    ↓
Transaction Submitted
    ↓
Blockchain Pending
    ↓
Blockchain Confirmed
    ↓
Contract Event Received
    ↓
Application State Synchronized
    ↓
Completed
```

The UI and backend must distinguish pending, confirmed, and synchronized states where required.

Do not mark a property as finalized merely because a transaction hash was created.

---

# 14. Blockchain / PostgreSQL Synchronization

For blockchain-backed ownership:

```text
Blockchain
    ↓
Confirmed Event
    ↓
Event Listener
    ↓
Validation
    ↓
PostgreSQL Ownership Projection
```

Do not independently overwrite finalized blockchain-backed ownership information in PostgreSQL.

PostgreSQL is the operational application projection.

The blockchain contains the finalized ownership-event history.

If synchronization fails:

```text
BLOCKCHAIN_SYNC_FAILED
```

must be represented according to the architecture and the system must support the approved recovery/reconciliation path.

---

# 15. Event Processing Must Be Idempotent

Blockchain events may be received more than once.

Event handlers must not create duplicate ownership-history records or repeat irreversible operations.

Use an appropriate unique event identifier, such as:

```text
transaction hash + event/log index
```

or the identifier defined by `SMART_CONTRACT.md`.

Processing pattern:

```text
Receive Event
    ↓
Check Whether Already Processed
    ↓
Already Processed?
   /          \
 YES           NO
  ↓             ↓
Ignore        Process
```

---

# 16. Data Storage Boundary

Sensitive and operational data remains off-chain.

Examples include:

```text
User information
KYC information
Identity documents
Property documents
Personal contact information
Payment information
Application records
Audit records
Operational land data
```

Do not move sensitive information on-chain without an explicit approved architecture change.

The blockchain should contain only the data required by the approved smart-contract design.

---

# 17. Document Handling

Documents must be processed server-side.

Expected flow:

```text
Upload
  ↓
Authentication
  ↓
Authorization
  ↓
File Validation
  ↓
Secure Storage
  ↓
Metadata Record
```

At minimum validate:

- file type,
- file size,
- user/application authorization,
- storage destination.

Do not expose private documents through unrestricted public URLs.

Do not store full documents directly on-chain.

---

# 18. Hashing Rules

The MVP uses SHA-256 for cryptographic integrity fingerprints.

For document hashing:

```text
Original Uploaded File
    ↓
Exact File Bytes
    ↓
SHA-256
    ↓
Cryptographic Fingerprint
```

Do not silently transform, regenerate, or modify the source file before hashing unless the approved architecture defines a canonicalization step.

Do not call a hash mathematically "unique."

A hash is an integrity fingerprint; it is not encryption and does not itself establish legal ownership.

---

# 19. Privacy Rules

Use minimum necessary data exposure.

Never expose through public verification:

```text
Aadhaar numbers
Private KYC documents
Private contact information
Payment credentials
Private keys
Unnecessary personal addresses
```

Public verification should return only the information permitted by the product and architecture.

Do not add personally identifying blockchain data merely because it is technically possible.

---

# 20. Database Rules

Use PostgreSQL and the approved ORM/data-access architecture.

Before changing schema:

1. Check `PRD.md`.
2. Check `ARCHITECTURE.md`.
3. Check `DATABASE_DESIGN.md`.
4. Determine whether the change is required.
5. Preserve existing relationships and constraints.

Do not:

- create duplicate tables for the same concept,
- bypass migrations,
- manually edit production schema,
- remove existing data relationships without approval,
- introduce another database.

Database changes must be represented through the project's migration mechanism.

---

# 21. API Rules

Follow the approved API/domain structure.

Before adding an endpoint:

1. Search for an existing endpoint that already performs the operation.
2. Follow the existing route/controller/service pattern.
3. Apply authentication and RBAC.
4. Validate input server-side.
5. Return consistent response/error structures.

Do not create duplicate endpoints for the same operation merely with different names.

Do not change an established API contract without approval.

---

# 22. Payment Rules

The MVP uses the approved payment implementation defined by the architecture.

Payment processing must remain separate from blockchain gas handling.

Conceptually:

```text
Citizen Payment
    ↓
Application Payment State
    ↓
Government Processing
    ↓
Authorized Blockchain Transaction
```

Never:

- store payment credentials on-chain,
- treat application payment as blockchain gas,
- allow payment success alone to finalize ownership.

---

# 23. Business Workflow Preservation

Do not bypass required business stages.

The core transaction must preserve the approved sequence:

```text
Citizen Request
    ↓
Required Information / Documents
    ↓
KYC / Payment
    ↓
Government Verification
    ↓
Authorized Approval
    ↓
Finalized Ownership Transaction
    ↓
Mutation Completion
    ↓
Ownership History / Verification
```

The exact workflow belongs to `WORKFLOWS.md`.

If a requested implementation skips a required approval or verification stage, stop and request clarification.

---

# 24. Audit Rules

Important state-changing actions must be auditable according to the architecture.

Examples:

```text
Application Submitted
Document Uploaded
KYC Verified
Payment Completed
Application Approved
Application Rejected
Blockchain Transaction Submitted
Blockchain Transaction Confirmed
Ownership Synchronized
Synchronization Failed
```

Do not remove audit events merely to simplify implementation.

Do not use audit logs as a replacement for authorization.

---

# 25. Error Handling

Handle failures explicitly.

Required failure categories include:

```text
Authentication failure
Authorization failure
Validation failure
Document failure
KYC failure
Payment failure
Government rejection
Blockchain transaction failure
Blockchain confirmation delay
Hash mismatch
Blockchain/database synchronization failure
Duplicate blockchain event
```

Never convert an error into a false success state.

Error handling should preserve the transaction's actual state.

---

# 26. No Silent Data Mutation

Do not silently modify ownership, property, application, or transaction state to make a workflow pass.

Any state-changing operation must:

1. be authorized,
2. validate its inputs,
3. preserve required history,
4. generate the appropriate audit information,
5. follow the approved workflow.

---

# 27. Existing Code Preservation

Before modifying existing code:

1. Read the relevant implementation.
2. Understand its current inputs and outputs.
3. Identify dependencies.
4. Make the smallest required change.
5. Preserve unrelated behavior.

Do not rewrite working modules merely to match personal coding preferences.

Do not perform broad refactors during feature work unless explicitly requested.

---

# 28. Dependency Discipline

Before installing a dependency:

1. Check whether the project already has the capability.
2. Check existing dependencies.
3. Check the Architecture document.
4. Confirm the dependency is necessary for the requested task.

Do not install libraries for convenience.

Do not introduce competing libraries for the same responsibility without approval.

---

# 29. Testing Rules

Test the behavior directly affected by the requested change.

Relevant test categories include:

```text
Unit tests
API tests
Integration tests
Smart-contract tests
Workflow tests
Failure-path tests
```

For blockchain-related changes, test at minimum where applicable:

```text
Authorized operation
Unauthorized operation
Correct state change
Correct event
Event processing
Duplicate event handling
Synchronization
Failure handling
```

For document changes:

```text
Valid document
Invalid document
Hash generation
Hash mismatch
Unauthorized access
```

---

# 30. No Autonomous Debugging Loop

Do not enter an uncontrolled cycle of:

```text
Run everything
    ↓
Find unrelated failure
    ↓
Modify unrelated code
    ↓
Run everything again
    ↓
Repeat
```

If a requested change causes a direct error:

1. Identify the exact error.
2. Make the smallest relevant correction.
3. Re-check the affected behavior.
4. Stop when the requested task is complete.

Do not expand scope to fix unrelated pre-existing failures unless explicitly requested.

---

# 31. Git Rules

Keep changes scoped to the requested task.

Before committing:

```text
Inspect changed files
Review the diff
Check for secrets
Check for generated artifacts
Check that unrelated files were not modified
```

Do not:

- force-push shared branches,
- rewrite shared history,
- commit secrets,
- commit unnecessary generated files,
- mix unrelated features into one change.

Use the project's existing branch/commit conventions.

---

# 32. Environment and Secrets

Never commit real:

```text
Passwords
JWT secrets
Database credentials
Private keys
Payment secrets
Encryption keys
API keys
Production credentials
```

Example environment files must contain placeholders only.

Frontend environment variables must never contain backend-only secrets.

Anything required to sign blockchain transactions is backend-only.

---

# 33. Documentation Rules

Documentation must remain consistent with implementation.

When an approved technical decision changes:

1. Update the relevant architecture/design document.
2. Update affected implementation documentation.
3. Do not silently allow documentation to become incorrect.

Do not duplicate technical architecture inside the PRD.

Do not duplicate the full PRD inside the Architecture document.

Each document should remain responsible for its defined scope.

---

# 34. UI and Design Rules

Follow the project's approved design system and existing UI conventions.

Before creating a new UI pattern:

1. Search existing components.
2. Reuse existing patterns where possible.
3. Check `Design.md` if present.
4. Avoid introducing another design system.

Do not add a new component library without approval.

Accessibility and responsive behavior must follow the project's established standards.

---

# 35. File and Repository Structure

Respect the existing repository structure.

Expected high-level structure:

```text
BHUMI/
├── frontend/
├── backend/
├── contracts/
├── docs/
├── storage/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

Place new files inside the module responsible for that concern.

Do not reorganize the repository for personal preference.

---

# 36. Stop Conditions

Stop and request human clarification when:

- foundation documents conflict,
- the requested feature exceeds MVP scope,
- a new technology is required,
- a database structure must change without an approved requirement,
- a smart-contract interface must change without approval,
- sensitive information would need to move on-chain,
- authorization would need to be bypassed,
- a private key or secret would need to be exposed,
- the required behavior is not defined,
- the implementation would contradict the Architecture document,
- a legal/product decision is required rather than a coding decision.

Do not invent a project decision to avoid stopping.

---

# 37. Implementation Discipline

Every implementation should satisfy:

```text
Requirement identified
        ↓
Correct module identified
        ↓
Existing implementation reviewed
        ↓
Architecture checked
        ↓
Smallest complete change
        ↓
Affected behavior tested
        ↓
Unrelated behavior preserved
```

---

# 38. Final Agent Contract

Before implementation:

```text
READ
  ↓
PRD.md
ARCHITECTURE.md
RULES.md
WORKFLOWS.md
DATABASE_DESIGN.md
SMART_CONTRACT.md
  ↓
IDENTIFY REQUIREMENT
  ↓
IDENTIFY ACTIVE SCOPE
  ↓
CHECK ARCHITECTURE
  ↓
IMPLEMENT ONLY REQUIRED CHANGE
  ↓
PRESERVE SECURITY + AUTHORIZATION
  ↓
PRESERVE DATA BOUNDARIES
  ↓
TEST AFFECTED BEHAVIOR
  ↓
STOP
```

## Non-Negotiable Rules

```text
1. Do not exceed the approved product scope.

2. Do not contradict the Architecture document.

3. Do not introduce unapproved technologies.

4. Do not move sensitive data on-chain.

5. Do not expose private keys or secrets.

6. Do not bypass backend authorization.

7. Do not allow citizens to perform privileged blockchain writes.

8. Do not treat blockchain submission as blockchain confirmation.

9. Do not update blockchain-backed ownership independently of the approved synchronization flow.

10. Do not process blockchain events non-idempotently.

11. Do not rewrite working business logic without instruction.

12. Do not modify unrelated files.

13. Do not add unsolicited features.

14. Do not silently resolve conflicting project decisions.

15. Do not use autonomous debugging loops.

16. Stop when a human/product/architecture decision is required.
```
