# B.H.U.M.I API Reference

## 1. Land Verification API
`GET /api/v1/land/verify?ulpin={ULPIN_ID}`

**Response:**
```json
{
  "ulpin": "B.H.U.M.I-2026-MH-984210",
  "owner": "Rajesh Kumar Sharma",
  "status": "Verified",
  "hash": "0x8f3c71a9e42b10d5c829e1f407b3a98c761d2b8e90a1f2c3d4e5f6a7b8c9d0e1",
  "encumbrance": "Clear"
}
```

## 2. Mutation Smart Contract API
`POST /api/v1/mutation/execute`

**Request Payload:**
```json
{
  "mutationId": "MUT-2026-8812",
  "seller": "Rajesh Kumar Sharma",
  "buyer": "Ananya Verma",
  "officerSign": "0x4a...9b"
}
```
