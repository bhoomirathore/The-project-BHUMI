/*
  Warnings:

  - The values [HQ] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chainAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('TRANSFER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'RESUBMISSION', 'FAILED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'SUCCESSFUL', 'FAILED');

-- CreateEnum
CREATE TYPE "LandType" AS ENUM ('AGRICULTURAL', 'RESIDENTIAL', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('ACTIVE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('SALE_DEED', 'IDENTITY_PROOF', 'LAND_MAP', 'ENCUMBRANCE_CERT', 'TAX_RECEIPT', 'AADHAAR', 'PAN_CARD', 'KHASRA_DOC', 'PROPERTY_IMAGE', 'BUYER_IMAGE_PROOF', 'CHATUR_SEEMA', 'WITNESS_DOCS');

-- CreateEnum
CREATE TYPE "DocumentState" AS ENUM ('STAGED', 'ATTACHED');

-- CreateEnum
CREATE TYPE "AppointmentPurpose" AS ENUM ('TRANSFER', 'APPLICATION_VISIT', 'RECORD_QUERY', 'CERTIFICATE_HELP', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendeeType" AS ENUM ('SELF', 'REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('DOCUMENT', 'PROPERTY', 'CONFLICT');

-- CreateEnum
CREATE TYPE "VerificationResult" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "BlockchainStatus" AS ENUM ('SUBMITTED', 'PENDING', 'CONFIRMED', 'SYNCED', 'SYNC_FAILED', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CITIZEN', 'REGISTRAR', 'GOVERNMENT_HQ');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CITIZEN';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "chainAddress" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Property" (
    "propertyId" TEXT NOT NULL,
    "khasraNumber" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    "district" TEXT NOT NULL,
    "tehsil" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "areaSqFt" DECIMAL(12,2) NOT NULL,
    "landType" "LandType" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentOwnerId" TEXT NOT NULL,
    "chainPropertyId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("propertyId")
);

-- CreateTable
CREATE TABLE "PropertyOwner" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownershipStart" TIMESTAMP(3) NOT NULL,
    "ownershipEnd" TIMESTAMP(3),
    "applicationId" TEXT,
    "blockchainTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicationNo" SERIAL NOT NULL,
    "type" "ApplicationType" NOT NULL DEFAULT 'TRANSFER',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "propertyId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kycCheckedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "rejectionComments" TEXT,
    "resubmissionRemarks" TEXT,
    "registryNumber" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedById" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amountPaise" INTEGER,
    "failureReason" TEXT,
    "mockReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRecord" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "result" "VerificationResult" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "appointmentId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "state" "DocumentState" NOT NULL DEFAULT 'STAGED',
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageReference" TEXT NOT NULL,
    "fileHash" VARCHAR(66) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "referenceNo" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "propertyId" TEXT,
    "purpose" "AppointmentPurpose" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "office" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "slot" TEXT NOT NULL,
    "attendeeType" "AttendeeType" NOT NULL DEFAULT 'SELF',
    "attendeeName" TEXT,
    "attendeeMobile" TEXT,
    "contactMobile" TEXT,
    "assistanceNeeded" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainTransaction" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "txHash" TEXT,
    "status" "BlockchainStatus" NOT NULL DEFAULT 'SUBMITTED',
    "error" TEXT,
    "blockNumber" INTEGER,
    "chainId" INTEGER,
    "contractAddress" TEXT,
    "submittedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockchainTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "eventData" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockchainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_chainPropertyId_key" ON "Property"("chainPropertyId");

-- CreateIndex
CREATE INDEX "Property_currentOwnerId_idx" ON "Property"("currentOwnerId");

-- CreateIndex
CREATE INDEX "Property_district_idx" ON "Property"("district");

-- CreateIndex
CREATE UNIQUE INDEX "Property_district_tehsil_village_khasraNumber_key" ON "Property"("district", "tehsil", "village", "khasraNumber");

-- CreateIndex
CREATE INDEX "PropertyOwner_propertyId_idx" ON "PropertyOwner"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyOwner_userId_idx" ON "PropertyOwner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationNo_key" ON "Application"("applicationNo");

-- CreateIndex
CREATE UNIQUE INDEX "Application_registryNumber_key" ON "Application"("registryNumber");

-- CreateIndex
CREATE INDEX "Application_propertyId_idx" ON "Application"("propertyId");

-- CreateIndex
CREATE INDEX "Application_sellerId_idx" ON "Application"("sellerId");

-- CreateIndex
CREATE INDEX "Application_buyerId_idx" ON "Application"("buyerId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_applicationId_createdAt_idx" ON "ApplicationStatusHistory"("applicationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mockReference_key" ON "Payment"("mockReference");

-- CreateIndex
CREATE INDEX "Payment_applicationId_idx" ON "Payment"("applicationId");

-- CreateIndex
CREATE INDEX "VerificationRecord_applicationId_type_createdAt_idx" ON "VerificationRecord"("applicationId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "Document_applicationId_idx" ON "Document"("applicationId");

-- CreateIndex
CREATE INDEX "Document_appointmentId_idx" ON "Document"("appointmentId");

-- CreateIndex
CREATE INDEX "Document_uploadedById_state_idx" ON "Document"("uploadedById", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_referenceNo_key" ON "Appointment"("referenceNo");

-- CreateIndex
CREATE INDEX "Appointment_office_date_slot_idx" ON "Appointment"("office", "date", "slot");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_applicationId_idx" ON "Appointment"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainTransaction_txHash_key" ON "BlockchainTransaction"("txHash");

-- CreateIndex
CREATE INDEX "BlockchainTransaction_applicationId_idx" ON "BlockchainTransaction"("applicationId");

-- CreateIndex
CREATE INDEX "BlockchainTransaction_status_idx" ON "BlockchainTransaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainEvent_transactionId_logIndex_key" ON "BlockchainEvent"("transactionId", "logIndex");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_chainAddress_key" ON "User"("chainAddress");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_currentOwnerId_fkey" FOREIGN KEY ("currentOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwner" ADD CONSTRAINT "PropertyOwner_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwner" ADD CONSTRAINT "PropertyOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwner" ADD CONSTRAINT "PropertyOwner_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwner" ADD CONSTRAINT "PropertyOwner_blockchainTransactionId_fkey" FOREIGN KEY ("blockchainTransactionId") REFERENCES "BlockchainTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainTransaction" ADD CONSTRAINT "BlockchainTransaction_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainEvent" ADD CONSTRAINT "BlockchainEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "BlockchainTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
