const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ pakai PORT dari env
const DB_PATH = path.join(__dirname, "user.json");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Pastikan user.json ada
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, "{}");
}

// 🔸 Simpan foto ke user tertentu
app.post("/api/save", (req, res) => {
  const { code, photo } = req.body;

  if (!code || !photo || !photo.url) {
    return res.status(400).send("Data tidak lengkap");
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH));
  if (!db[code]) db[code] = [];
  db[code].push(photo);

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  res.send("✅ Foto disimpan!");
});

// 🔸 Ambil gallery berdasarkan kode user
app.get("/api/gallery/:code", (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  const code = req.params.code;

  if (!db[code]) return res.json([]);
  res.json(db[code]);
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
