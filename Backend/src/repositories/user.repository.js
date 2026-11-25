const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../config/db");

const DATA_DIR = path.join(__dirname, "../../data");
const STORE_FILE = path.join(DATA_DIR, "auth_store.json");

let isPrismaAvailable = false;

// Check if Prisma connection is working
async function checkPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isPrismaAvailable = true;
    return true;
  } catch (err) {
    isPrismaAvailable = false;
    return false;
  }
}

// Ensure data directory and local store exist for fallback
function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    // Seed initial users with bcrypt hashed passwords
    const salt = bcrypt.genSaltSync(12);
    const demoHashedPassword = bcrypt.hashSync("Demo1234!", salt);

    const initialData = {
      users: [
        {
          id: "citizen-demo-id-1",
          name: "Rajesh Singh",
          email: "rajesh.singh@example.com",
          phone: "9876543210",
          password: demoHashedPassword,
          role: "CITIZEN",
          googleId: null,
          avatar: null,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "registrar-demo-id-2",
          name: "Ramesh Sharma",
          email: "ramesh.sharma@example.com",
          phone: "9876543211",
          password: demoHashedPassword,
          role: "REGISTRAR",
          googleId: null,
          avatar: null,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "hq-demo-id-3",
          name: "Mukesh Kumar",
          email: "mukesh.kumar@example.com",
          phone: "9876543212",
          password: demoHashedPassword,
          role: "HQ",
          googleId: null,
          avatar: null,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      refreshTokens: [],
      passwordResetTokens: [],
    };

    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local auth store:", err);
    return { users: [], refreshTokens: [], passwordResetTokens: [] };
  }
}

function writeLocalStore(data) {
  ensureLocalStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

class UserRepository {
  constructor() {
    checkPrisma();
  }

  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (isPrismaAvailable) {
      try {
        return await prisma.user.findFirst({
          where: { email: { equals: normalizedEmail, mode: "insensitive" } },
        });
      } catch (err) {
        // Fall back to local store if DB error occurs
      }
    }

    const store = readLocalStore();
    return (
      store.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      ) || null
    );
  }

  async findById(id) {
    if (isPrismaAvailable) {
      try {
        return await prisma.user.findUnique({ where: { id } });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    return store.users.find((u) => u.id === id) || null;
  }

  async findByGoogleId(googleId) {
    if (!googleId) return null;
    if (isPrismaAvailable) {
      try {
        return await prisma.user.findUnique({ where: { googleId } });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    return store.users.find((u) => u.googleId === googleId) || null;
  }

  async createUser({ name, email, phone, password, role = "CITIZEN", googleId = null, avatar = null }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Map HQ role if incoming is GOVERNMENT_HQ
    const mappedRole = role === "GOVERNMENT_HQ" ? "HQ" : role;

    if (isPrismaAvailable) {
      try {
        return await prisma.user.create({
          data: {
            name,
            email: normalizedEmail,
            phone: phone || null,
            password: password || null,
            role: mappedRole,
            googleId: googleId || null,
            avatar: avatar || null,
          },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      phone: phone || null,
      password: password || null,
      role: mappedRole,
      googleId: googleId || null,
      avatar: avatar || null,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    writeLocalStore(store);
    return newUser;
  }

  async updateUser(id, updateData) {
    if (isPrismaAvailable) {
      try {
        return await prisma.user.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const index = store.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    writeLocalStore(store);
    return store.users[index];
  }

  // ── Refresh Token Management ────────────────────────────────────────────────
  async createRefreshToken({ tokenHash, userId, expiresAt }) {
    if (isPrismaAvailable) {
      try {
        return await prisma.refreshToken.create({
          data: {
            token: tokenHash,
            userId,
            expiresAt,
            revoked: false,
          },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const newRecord = {
      id: crypto.randomUUID(),
      token: tokenHash,
      userId,
      revoked: false,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };
    store.refreshTokens.push(newRecord);
    writeLocalStore(store);
    return newRecord;
  }

  async findRefreshToken(tokenHash) {
    if (isPrismaAvailable) {
      try {
        return await prisma.refreshToken.findUnique({
          where: { token: tokenHash },
          include: { user: true },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const record = store.refreshTokens.find((r) => r.token === tokenHash);
    if (!record) return null;

    const user = store.users.find((u) => u.id === record.userId);
    return { ...record, expiresAt: new Date(record.expiresAt), user };
  }

  async revokeRefreshToken(tokenHash) {
    if (isPrismaAvailable) {
      try {
        return await prisma.refreshToken.update({
          where: { token: tokenHash },
          data: { revoked: true },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const index = store.refreshTokens.findIndex((r) => r.token === tokenHash);
    if (index !== -1) {
      store.refreshTokens[index].revoked = true;
      writeLocalStore(store);
    }
  }

  async revokeAllUserRefreshTokens(userId) {
    if (isPrismaAvailable) {
      try {
        return await prisma.refreshToken.updateMany({
          where: { userId },
          data: { revoked: true },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    store.refreshTokens.forEach((r) => {
      if (r.userId === userId) {
        r.revoked = true;
      }
    });
    writeLocalStore(store);
  }

  // ── Password Reset Token Management ─────────────────────────────────────────
  async createPasswordResetToken({ tokenHash, userId, expiresAt }) {
    if (isPrismaAvailable) {
      try {
        // Invalidate prior reset tokens
        await prisma.passwordResetToken.updateMany({
          where: { userId },
          data: { used: true },
        });
        return await prisma.passwordResetToken.create({
          data: {
            token: tokenHash,
            userId,
            expiresAt,
            used: false,
          },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    // Mark prior tokens as used
    store.passwordResetTokens.forEach((t) => {
      if (t.userId === userId) t.used = true;
    });

    const newRecord = {
      id: crypto.randomUUID(),
      token: tokenHash,
      userId,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: new Date().toISOString(),
    };
    store.passwordResetTokens.push(newRecord);
    writeLocalStore(store);
    return newRecord;
  }

  async findValidPasswordResetToken(tokenHash) {
    if (isPrismaAvailable) {
      try {
        const record = await prisma.passwordResetToken.findUnique({
          where: { token: tokenHash },
          include: { user: true },
        });
        if (!record || record.used || new Date(record.expiresAt) < new Date()) {
          return null;
        }
        return record;
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const record = store.passwordResetTokens.find(
      (t) =>
        t.token === tokenHash &&
        !t.used &&
        new Date(t.expiresAt) > new Date()
    );
    if (!record) return null;

    const user = store.users.find((u) => u.id === record.userId);
    return { ...record, expiresAt: new Date(record.expiresAt), user };
  }

  async markPasswordResetTokenUsed(tokenHash) {
    if (isPrismaAvailable) {
      try {
        return await prisma.passwordResetToken.update({
          where: { token: tokenHash },
          data: { used: true },
        });
      } catch (err) {
        // Fall back
      }
    }

    const store = readLocalStore();
    const index = store.passwordResetTokens.findIndex(
      (t) => t.token === tokenHash
    );
    if (index !== -1) {
      store.passwordResetTokens[index].used = true;
      writeLocalStore(store);
    }
  }
}

module.exports = new UserRepository();
module.exports.checkPrisma = checkPrisma;
