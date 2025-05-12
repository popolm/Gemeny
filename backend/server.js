const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DB_FILE = "/app/data/db.json";

function obfuscateMessage(message) {
  return message
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
    .join("");
}

let messages = [];
if (fs.existsSync(DB_FILE)) {
  try {
    messages = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    console.log(`📁 ${messages.length} messages chargés depuis db.json`);
  } catch (err) {
    console.error("❌ Erreur lors du chargement de db.json :", err);
  }
}

function saveMessages() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(messages, null, 2));
    console.log("💾 Messages sauvegardés dans db.json");
  } catch (err) {
    console.error("❌ Erreur lors de l'écriture de db.json :", err);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.startsWith("http://127.0.0.1") ||
        origin.startsWith("http://localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("❌ CORS bloqué pour cette origine: " + origin));
      }
    },
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type",
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend opérationnel ✅");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🔗 Client WebSocket connecté");
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello world" });
});

app.post("/messages", (req, res) => {
  const rawMessage = req.body.message;

  if (!rawMessage || rawMessage.trim() === "") {
    console.warn("⚠️ Message vide reçu");
    return res.status(400).json({ error: "Le message ne peut pas être vide" });
  }

  const obfuscated = obfuscateMessage(rawMessage);

  const newMessage = {
    id: Date.now().toString(),
    message: obfuscated,
  };

  messages.push(newMessage);
  saveMessages();

  console.log(
    `📨 Nouveau POST reçu - ID: ${newMessage.id}, Message: ${rawMessage} → ${obfuscated}`
  );

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newMessage));
    }
  });

  res.status(201).json(newMessage);
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

server.listen(PORT, () => {
  console.log(`✅ Backend en ligne sur http://localhost:${PORT}`);
});
