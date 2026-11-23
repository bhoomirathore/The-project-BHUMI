require("dotenv/config");
const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 B.H.U.M.I. backend running at http://localhost:${PORT}`);
  await connectDB();
});

