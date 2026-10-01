# BHUMI - Frontend Design & Architecture Documentation

## 1. Project Overview

**BHUMI** (भूमि) is a **Blockchain-powered Digital Land Registry System**. The frontend is a modern, trustworthy, and visually sophisticated web application designed to inspire confidence in digital land ownership, transparency, and immutability.

This document serves as the comprehensive design specification for the entire frontend, covering the 3-tier portal architecture (Citizen, Authority, Government), visual language, Web3 component library, and interaction patterns.

---

## 2. Design Philosophy & Principles

### Core Values Visualized
- **Trust & Authority**
- **Transparency & Clarity**
- **Security & Immutability**

### Design Principles
1. **Light, Minimalist Aesthetic** — Cream/off-white backgrounds with high-contrast dark text for maximum readability and a formal, institutional feel.
2. **Clarity Above All** — Strong typographic hierarchy, generous whitespace, and muted container backgrounds.
3. **Role-Based Workflows** — Distinct visual cues and dashboards based on user authorization (Citizen vs. Authority vs. HQ).
4. **Blockchain Feedback** — Clear visual states for ongoing smart contract interactions (mining, confirming, success).

---

## 3. Design Tokens

### 3.1 Color Palette (Light/Minimalist Theme)

| Token                | Usage                                                                 |
|----------------------|-----------------------------------------------------------------------|
| `bg-primary`         | `#FDFBF7` or similar cream/off-white (Main background)                |
| `bg-surface`         | `#F3EFEE` (Cards, sidebars, secondary containers)                     |
| `text-primary`       | `#1F1A17` or deep charcoal/black (Headings, primary text)             |
| `text-secondary`     | `#5C5552` (Subtitles, muted text)                                     |
| `accent-dark`        | `#2D2421` (Primary buttons, active states)                            |
| `status-success`     | `#10b981` (Verification complete, validator health)                   |
| `status-warning`     | `#f59e0b` (Pending verifications, urgent tasks)                       |
| `status-error`       | `#ef4444` (Disputes, failed transactions)                             |

### 3.2 Typography & Spacing
- **Font Family**: `Plus Jakarta Sans` or similar modern sans-serif.
- **Card Styling**: Soft rounded corners (`rounded-2xl` or `rounded-3xl`) with very subtle or no drop shadows, relying on background color contrast (e.g., cream against white).
- **Buttons**: Pill-shaped or heavily rounded (`rounded-full` or `rounded-lg`), dark background with light text.

---

## 4. Page Structure & 3-Tier Architecture

### 4.1 Landing Page
- **Hero Section**: Clear value proposition ("Securing Land Rights Through Blockchain").
- **Features Grid**: Floating asymmetrical cards highlighting core benefits (Secure, Fast, Verified).
- **Service Portals Route**: Three distinct entry points for Citizens, Local Authorities, and Government HQ.

### 4.2 Citizen Portal Dashboard
- **Sidebar**: Dashboard, Verify Land, Book Appointment, Download E-Registry, Profile.
- **Header**: Welcome message with user name and role badge (e.g., "Rajesh Kumar | Citizen").
- **Metrics**: Total Properties, Verified Records, Pending Process, Upcoming Appointments.
- **Quick Actions**: Verify Land Ownership, Book Registry Appointment, Download E-Registry.

### 4.3 Local Authority Portal (Registrar/Patwari)
- **Sidebar**: Dashboard, Document Verification, eKYC Processing, Registry & Mutation.
- **Metrics**: Urgent Applications, Pending Verifications, Completed This Month, Scheduled Appointments.
- **Task Queue**: 
  - *Document Verification* (Applicant details, Registry Type).
  - *eKYC Biometric Verification* (Parties involved).
  - *Deed Execution & Mutation* (Smart Contract Final Commitment).
- **Summary Panel**: Today's Appointments, Biometrics Done, Deeds Minted.

### 4.4 Government HQ Portal (State Administrator)
- **Sidebar**: Dashboard, Registry Monitoring, Analytics, Disputes.
- **Macro Metrics**: Total Land Digitized, Blockchain Blocks Minted, Tehsils Online, Stamp Duty Revenue.
- **Regional Analytics**: Data tables showing active mutations, registered area, and validator node health across districts.

---

## 5. Domain-Specific Component Library

### 5.1 Web3 & Mutation Components

#### 1. `MutationStepper` (Namankhan Flow)
A vertical or horizontal timeline component tracking the exact stage of the property transfer:
1. *Initiated by Seller (Signed via Wallet)*
2. *Accepted by Buyer (Signed via Wallet)*
3. *Pending Patwari Verification (Off-chain KYC)*
4. *Approved by Tehsildar (Final Blockchain Mutation)*

#### 2. `SmartContractInteractionBtn`
Button variants specifically for executing state-changing blockchain transactions (e.g., "Mint Deed"). Must handle internal states:
- `Idle` -> `Awaiting Wallet Confirmation` -> `Mining (Spinner)` -> `Success/Reverted`.

#### 3. `DocumentViewerModal`
Secure overlay modal to preview IPFS-hosted encrypted legal documents (Sale deeds, IDs) directly within the Authority portal before approval.

#### 4. `RoleBadge`
Visual indicators attached to user avatars to strictly differentiate access levels (`Citizen`, `Authority`, `GOV HQ`).

#### 5. `TransactionStatusPill`
Real-time status indicators: Pending (Amber), Minted/Confirmed (Green), Failed (Red). Includes a direct link to the blockchain explorer hash.

---

## 6. Animations & Interaction States

1. **Transaction Mining State**: Blockchain transactions are not instant. UI must prevent double-clicks during ownership transfer. Utilize a card-level loading skeleton or spinner with text: *"Writing Namankhan to Blockchain... Please do not close this window."*
2. **Hover States**: Subtle opacity changes or background darkening on buttons and table rows. No excessive scaling or 3D floating required for the internal dashboards.
3. **Modal Focus**: Background blur (`backdrop-blur-sm`) when executing critical actions like eKYC approval or deed minting to keep focus on the transaction.

---

**Document Version**: 3.0 (Updated with 3-Tier Portals & Mutation UI)  
**Project**: BHUMI - Digital Land Registry System  
**Designed for**: Developers & UI Engineers