// Backend/src/services/pinata.service.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Load env vars – make sure `dotenv` is configured early in the app (e.g. in app.js)
const {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
  PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud',
} = process.env;

/**
 * Upload a Buffer (or ReadStream) to Pinata.
 * @param {Buffer|fs.ReadStream} fileBuffer – file data
 * @param {string} fileName – original file name (used for Pinata metadata)
 * @returns {{cid: string, gatewayUrl: string}} – CID and a public gateway URL
 */
async function uploadFile(fileBuffer, fileName) {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Pinata credentials are not set in environment');
  }

  const data = new FormData();
  // Pinata expects the field name "file"
  data.append('file', fileBuffer, {
    filename: fileName,
    contentType: 'application/octet-stream',
  });

  // Optional: add metadata (helps later when browsing Pinata UI)
  data.append(
    'pinataMetadata',
    JSON.stringify({ name: fileName })
  );

  // Optional: pinning options (e.g., CID version 1)
  data.append(
    'pinataOptions',
    JSON.stringify({ cidVersion: 1 })
  );

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data,
    {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...data.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    }
  );

  const { IpfsHash: cid } = response.data;
  const gatewayUrl = `${PINATA_GATEWAY_URL}/ipfs/${cid}`;

  return { cid, gatewayUrl };
}

module.exports = {
  uploadFile,
};