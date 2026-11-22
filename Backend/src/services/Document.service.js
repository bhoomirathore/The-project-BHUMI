// Backend/src/services/document.service.js (new version or extension)
const { uploadFile } = require('./pinata.service');
const prisma = require('../prisma/client'); // existing Prisma client

/**
 * Upload a citizen‑submitted document to Pinata and persist metadata.
 * @param {Buffer} fileBuffer – raw file bytes received from multipart request
 * @param {string} originalName – the original filename (e.g. "title.pdf")
 */
async function storeDocument(fileBuffer, originalName) {
  // 1️⃣ Pin to IPFS via Pinata
  const { cid, gatewayUrl } = await uploadFile(fileBuffer, originalName);

  // 2️⃣ Persist a reference in the DB (the schema already has a `storageReference` field)
  const doc = await prisma.document.create({
    data: {
      name: originalName,
      storageReference: cid, // on‑chain we will store this CID
      storageUrl: gatewayUrl,
      // other required fields such as citizenId, type, etc. can be added here
    },
  });

  return doc;
}

module.exports = { storeDocument };