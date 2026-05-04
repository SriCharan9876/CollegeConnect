import "dotenv/config";
import express from "express";
import cors from "cors";
import collegeRoutes from "./routes/collegeRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import discussionRoutes from "./routes/discussionRoutes";

const app = express();

app.use(
  cors({
    origin: [
      "https://collegeconnect-5hefgip7o-sri-charans-projects-cc97bb75.vercel.app",
      "https://collegeconnect-git-main-sri-charans-projects-cc97bb75.vercel.app",
      "https://collegeconnect-nu.vercel.app",
      "https://collegeconnect-sri-charans-projects-cc97bb75.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/colleges", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/discussion", discussionRoutes);

app.get("/", (req, res) => {
  res.send("API is online.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});