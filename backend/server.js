import express from "express";
import { configDotenv } from "dotenv";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import notesRoutes from "./routes/Notes.js";
import path from "path";

configDotenv();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

connectDb();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
