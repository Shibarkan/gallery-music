const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const DB_PATH = path.join(__dirname, "..", "user.json"); // relatif dari root project

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔸 Hanya GET (karena POST akan gagal tulis file)
app.get("/api/gallery/:code", (req, res) => {
  if (!fs.existsSync(DB_PATH)) return res.json([]);
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const code = req.params.code;
  res.json(db[code] || []);
});

module.exports = app;
