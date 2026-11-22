const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("neon Database connected successfully");
  } catch (error) {
    console.error(" neon Database connection failed:", error.message);
  }
};

module.exports = prisma;
module.exports.connectDB = connectDB;

