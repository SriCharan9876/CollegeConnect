import express from "express";
import cors from "cors";
import collegeRoutes from "./routes/collegeRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/colleges", collegeRoutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});