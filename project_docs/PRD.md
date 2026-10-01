# B.H.U.M.I. — Product Requirements Document

## Blockchain Hosted Unified Mutation Infrastructure

**Project:** B.H.U.M.I.
**Document:** Product Requirements Document
**Version:** 1.1
**Status:** Locked for MVP — Phase 1
**Target:** Smart India Hackathon / Capstone Project

---

# 1. Document Purpose

This document defines the **product requirements** for B.H.U.M.I.

It specifies:

* the problem being addressed,
* the intended users,
* the product objective,
* functional requirements,
* user-facing workflows,
* MVP scope,
* product constraints,
* non-functional requirements,
* acceptance criteria,
* out-of-scope functionality,
* MVP success criteria.

Technical implementation details are defined separately in the **B.H.U.M.I. Technical Architecture Document**.

---

# 2. Product Overview

B.H.U.M.I. is a digital land transaction platform intended to connect property registration/transfer with the subsequent ownership mutation process.

The platform provides a digital workflow in which:

1. A citizen initiates a property transaction.
2. Required information and documents are submitted.
3. The transaction is verified by an authorized government official.
4. The authorized transaction is finalized.
5. The resulting ownership change is recorded in a tamper-evident history.
6. The ownership state becomes available through the system without requiring a separate manual mutation submission.

B.H.U.M.I. is intended as an enhancement/trust layer around existing digital land-record processes, not as a replacement for the legal or governmental land-record system.

---

# 3. Problem Statement

The project addresses two primary problems.

## 3.1 Record Integrity

Conventional centralized land-record systems depend heavily on controlled database access.

Unauthorized or incorrect modification of an operational record can create uncertainty regarding the integrity of historical ownership information.

B.H.U.M.I. aims to provide a tamper-evident history of finalized ownership transactions.

---

## 3.2 Registration–Mutation Disconnection

Property registration and subsequent mutation may involve separate administrative processes.

This can result in:

* duplicate data entry,
* manual follow-up,
* delays,
* fragmented records,
* unnecessary administrative effort.

B.H.U.M.I. aims to connect the finalized property transaction with the ownership mutation process.

---

# 4. Product Objective

The primary objective of the MVP is:

> **To demonstrate a complete digital property-transfer workflow in which an authorized government approval results in a finalized ownership transaction and automatic completion of the corresponding mutation process.**

The MVP must demonstrate the complete path from citizen request to finalized ownership update.

---

# 5. Product Vision

B.H.U.M.I. aims to provide a transparent and traceable digital property transaction experience where ownership changes can be verified through a persistent transaction history.

The product should reduce unnecessary manual steps while preserving government authorization over property transactions.

---

# 6. Core Product Concept

## 1-Step Registry + Mutation

For the purposes of the MVP, **1-Step Registry + Mutation** means:

> Once an authorized government official approves a valid property transaction, the system completes the corresponding ownership transaction and automatically reflects the resulting mutation without requiring a separate manual mutation-entry process.

This is a **product behavior**, not a statement about the underlying technical transaction mechanism.

The technical implementation is defined in the Architecture Document.

---

# 7. Product Users

## 7.1 Citizen

The citizen uses B.H.U.M.I. to:

* access the platform,
* identify a property,
* initiate a transaction,
* submit required information,
* upload required documents,
* complete the applicable payment step,
* track the application,
* view the resulting ownership status.

---

## 7.2 Government Official / Registrar

The authorized government official uses B.H.U.M.I. to:

* access pending applications,
* review submitted information,
* verify supporting documents,
* verify transaction eligibility,
* approve or reject transactions,
* finalize authorized property transactions,
* monitor transaction status.

---

## 7.3 Public / Auditor

The public/auditor interface provides read-only property verification.

A user should be able to provide an appropriate property identifier and view permitted information regarding:

* property registration status,
* transaction status,
* ownership-history information,
* transaction verification status.

Sensitive personal information must not be publicly exposed.

---

# 8. MVP Functional Requirements

## FR-01 — User Authentication

The system shall provide authentication appropriate to the user's role.

The system shall distinguish between:

* citizens,
* authorized government users,
* administrative users where required.

---

## FR-02 — Role-Based Access

The system shall restrict functionality according to the authenticated user's role.

A citizen shall not be able to perform government approval operations.

A public user shall have read-only access to permitted verification information.

---

## FR-03 — Property Identification

The system shall allow a citizen to identify the relevant property before initiating a transaction.

The system should support the project's applicable property identifier, such as Property ID or Khasra number.

---

## FR-04 — Property Transaction Request

The citizen shall be able to initiate a property transaction request.

The request shall contain the information required to identify:

* the property,
* the current ownership,
* the proposed transaction,
* the receiving/new owner where applicable.

---

## FR-05 — Document Submission

The system shall allow the citizen to submit required supporting documents.

The system shall provide appropriate validation and shall associate submitted documents with the relevant transaction/application.

---

## FR-06 — KYC Verification

The MVP shall include a simulated/mock KYC verification process.

The system shall be able to represent at least:

```text
Pending
Verified
Failed
```

Real government identity/KYC APIs are outside the MVP.

---

## FR-07 — Payment

The MVP shall include a simulated INR payment process.

The payment process shall support at least:

```text
Initiated
Successful
Failed
```

A successful payment shall allow the application to proceed according to the defined workflow.

Real banking/payment-provider integration is outside the MVP.

---

# 9. Government Verification Requirements

## FR-08 — Application Review

The authorized government user shall be able to view pending applications.

The application shall display the information required to make the verification decision.

---

## FR-09 — Document Verification

The government user shall be able to review submitted supporting documents.

The official shall be able to determine whether the submitted documentation satisfies the application's requirements.

---

## FR-10 — Property Verification

The government user shall be able to verify the relevant property information before approving the transaction.

---

## FR-11 — Application Decision

The government user shall be able to:

* approve an application,
* reject an application,
* request correction/resubmission where supported.

A rejected application shall not be treated as a finalized ownership transaction.

---

# 10. Ownership Transaction Requirements

## FR-12 — Ownership Transfer

The system shall support the transfer of ownership for an eligible property.

The transfer shall identify:

* the property,
* previous owner,
* new owner,
* transaction,
* approval status.

---

## FR-13 — Ownership History

The system shall maintain a persistent history of finalized ownership transactions.

A completed ownership transfer shall not silently erase the previous ownership history.

---

## FR-14 — Mutation Completion

Following successful finalization of an approved ownership transaction, the resulting ownership state shall automatically be reflected in the application's property records.

The citizen shall not be required to submit a separate manual mutation request for the same finalized transaction.

---

# 11. Transaction Status Requirements

The system shall provide meaningful status information throughout the transaction lifecycle.

At minimum, the system should distinguish between:

```text
Draft
Submitted
Under Verification
Approved
Processing
Completed
Rejected
Failed
```

Where blockchain processing is involved, the application shall not display a transaction as completed before the required finalization has occurred.

---

# 12. Document Integrity Requirements

The system shall provide a mechanism for detecting whether an approved document/record has been altered after its integrity fingerprint was created.

The integrity mechanism shall:

* produce a cryptographic fingerprint,
* associate the fingerprint with the relevant transaction,
* allow subsequent verification,
* detect mismatches.

The exact hashing implementation is defined in the Architecture Document.

---

# 13. Public Verification Requirements

The system shall provide a public/read-only verification facility.

A user shall be able to enter a supported property identifier and obtain permitted information regarding the property's transaction history.

The verification interface may provide:

* property identifier,
* registration status,
* ownership-history reference,
* transaction reference,
* verification status.

The interface shall not expose sensitive personal information or private documents.

---

# 14. Transaction Transparency

For a finalized transaction, the system shall provide sufficient information for an authorized user to determine:

* whether the transaction was approved,
* whether it was finalized,
* whether the ownership state was updated,
* whether the transaction has an associated verification record.

---

# 15. Auditability Requirements

The system shall maintain an auditable record of significant actions.

The audit trail shall support tracing important stages such as:

* application submission,
* document submission,
* verification,
* approval/rejection,
* transaction finalization,
* ownership update,
* transaction failure.

The exact audit implementation is defined in the Architecture Document.

---

# 16. Privacy Requirements

The product shall follow a minimum-data-exposure principle.

Sensitive information shall not be publicly exposed.

The system shall protect information such as:

* identity information,
* KYC information,
* personal contact details,
* private documents,
* payment-related information.

The public verification interface shall expose only information required for property verification.

---

# 17. Security Requirements

The system shall:

* authenticate users,
* enforce role-based authorization,
* prevent unauthorized transaction approval,
* prevent unauthorized ownership changes,
* protect sensitive documents,
* prevent unauthorized access to private user information,
* maintain an audit trail of important operations.

Technical security controls are defined in the Architecture Document.

---

# 18. Error Handling Requirements

The product shall provide appropriate status handling when a transaction cannot be completed.

The system shall handle at least:

### Payment failure

The transaction shall not proceed as successfully paid.

### Document/KYC verification failure

The application shall not proceed as successfully verified.

### Government rejection

The property transaction shall not be finalized.

### Transaction processing failure

The application shall display an appropriate failure/processing state rather than falsely reporting completion.

### Synchronization failure

If the final ownership transaction has been successfully finalized but the application has not yet reflected the result, the system shall represent this as an incomplete synchronization state and support recovery.

---

# 19. Non-Functional Requirements

## NFR-01 — Integrity

Finalized ownership transactions must have a tamper-evident history.

## NFR-02 — Privacy

Sensitive citizen information must not be exposed through public verification.

## NFR-03 — Security

Only authorized users may perform restricted operations.

## NFR-04 — Traceability

Important transaction actions must be auditable.

## NFR-05 — Reliability

A failure in one stage of the transaction must not cause the system to falsely report successful completion.

## NFR-06 — Usability

Users must be able to understand the current state of their transaction without requiring knowledge of blockchain technology.

## NFR-07 — Maintainability

The MVP should be structured so that future integrations and additional government services can be added without changing the core product workflow.

---

# 20. MVP Scope

The following functionality is included in Phase 1:

| Requirement                     | MVP |
| ------------------------------- | --: |
| Citizen authentication          |   ✓ |
| Government authentication       |   ✓ |
| Role-based access               |   ✓ |
| Property identification         |   ✓ |
| Property transaction request    |   ✓ |
| Document submission             |   ✓ |
| Mock KYC                        |   ✓ |
| Mock INR payment                |   ✓ |
| Government verification         |   ✓ |
| Government approval/rejection   |   ✓ |
| Ownership transfer              |   ✓ |
| Ownership history               |   ✓ |
| Automatic mutation completion   |   ✓ |
| Document integrity verification |   ✓ |
| Public property verification    |   ✓ |
| Transaction status tracking     |   ✓ |
| Audit trail                     |   ✓ |

---

# 21. Explicitly Out of Scope — MVP

The following are not required for Phase 1.

## Government Integrations

* Real Aadhaar/e-KYC APIs
* Live government land-record APIs
* Live e-stamping integration
* Production government authentication systems

## Payment

* Live banking APIs
* Production payment settlement
* Real government fee collection

## Artificial Intelligence

* OCR
* AI document classification
* AI fraud detection
* AI-based property matching

## Advanced Blockchain Features

* Complex dispute-resolution contracts
* Advanced freeze/unfreeze mechanisms
* Cross-chain interoperability
* Complex governance mechanisms
* User-managed blockchain wallets

## Additional Product Features

* Advanced GIS
* Mobile application
* Large-scale analytics
* Multi-state production deployment

These features may be considered in future phases but are not required for MVP completion.

---

# 22. MVP Acceptance Criteria

The MVP shall be considered functionally complete when the following end-to-end scenario succeeds.

### Scenario: Property Transfer

1. A citizen authenticates.
2. The citizen identifies a property.
3. The citizen initiates a transfer request.
4. Required documents are submitted.
5. Mock KYC succeeds.
6. Mock INR payment succeeds.
7. The application reaches government verification.
8. An authorized government official reviews the application.
9. The official approves the transaction.
10. The transaction is successfully finalized.
11. The ownership history reflects the new transaction.
12. The property's current ownership is updated.
13. The citizen can view the resulting status.
14. The public verification interface can verify the finalized property transaction.
15. No separate manual mutation request is required for the finalized transfer.

---

# 23. MVP Success Criteria

The MVP should demonstrate the following measurable outcome:

> **A property can be successfully registered/transferred through the digital workflow, approved by an authorized government user, finalized as a tamper-evident transaction, and reflected in the resulting ownership record without a separate manual mutation operation.**

The demonstration should also show that:

* unauthorized users cannot approve the transaction,
* document integrity can be verified,
* previous ownership history remains traceable,
* transaction failures are not incorrectly reported as successful,
* sensitive information is not exposed through public verification.

---

# 24. Product Constraints

The following are product-level constraints:

1. Citizens must not be required to understand blockchain technology to use the platform.
2. Citizens must not be required to manage cryptocurrency to complete a transaction.
3. Government authorization remains required before a property transaction is finalized.
4. Sensitive personal information must not be publicly exposed.
5. Existing legal/government land-record authority is not replaced by the MVP.
6. The MVP must prioritize the complete registration/transfer-to-mutation workflow over additional features.
7. Real government and financial integrations are not required for Phase 1.
8. Advanced features must not delay completion of the core MVP workflow.

---

# 25. Product Boundaries

The PRD defines **what the product must accomplish**.

It intentionally does not prescribe:

* database technology,
* programming language,
* blockchain network implementation,
* smart-contract code structure,
* wallet implementation,
* API folder structure,
* event-listener implementation,
* database schema,
* deployment infrastructure,
* specific cryptographic implementation details.

Those decisions belong to the Technical Architecture Document.

---

# 26. Related Project Documents

The project documentation is separated by responsibility:

| Document                  | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| **PRD.md**                | Product requirements and expected behavior          |
| **ARCHITECTURE.md**       | Technical architecture and implementation structure |
| **WORKFLOWS.md**          | Detailed business/process workflows                 |
| **DATABASE_DESIGN.md**    | Database schema and relationships                   |
| **SMART_CONTRACT.md**     | Smart-contract design                               |
| **API_DOCUMENTATION.md**  | API contracts                                       |
| **CODING_AGENT_RULES.md** | Implementation rules for developers/coding agents   |

The PRD is the source for **product scope and requirements**. The Architecture document is the source for **technical implementation decisions**.

---

# 27. Final Product Definition

B.H.U.M.I. is a digital property transaction platform that connects property transfer approval with ownership mutation while providing a tamper-evident history of finalized transactions.

The MVP focuses on one complete, demonstrable workflow:

> **Citizen transaction request → document/KYC/payment submission → government verification → authorized approval → finalized ownership transaction → automatic mutation completion → verifiable ownership history.**

Technical decisions required to implement this workflow are defined separately in the Architecture Document.

