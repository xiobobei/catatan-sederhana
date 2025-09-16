// index.js
const express = require("express");
const path = require("path");
const db = require("./db");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
  const rows = db.prepare("SELECT id, text, created_at FROM notes ORDER BY id DESC").all();
  res.json(rows);
});

app.post("/api/notes", (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: "text kosong" });
  const info = db.prepare("INSERT INTO notes (text) VALUES (?)").run(text.trim());
  const row = db.prepare("SELECT id, text, created_at FROM notes WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(row);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
