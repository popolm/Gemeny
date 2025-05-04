const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// ➡️ Stockage temporaire des messages
const messages = [];

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

// ➡️ Pour lire du JSON dans les requêtes POST
app.use(bodyParser.json());

// Route GET pour vérifier que le backend est opérationnel
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

// ➡️ Route pour recevoir les messages (POST)
app.post("/messages", (req, res) => {
  const newMessage = {
    id: Date.now().toString(),
    message: req.body.message,
  };

  messages.push(newMessage);

  console.log(
    `📨 Nouveau POST reçu - ID: ${newMessage.id}, Message: ${newMessage.message}`
  );

  // Diffuser le message à tous les clients WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newMessage));
    }
  });

  res.status(201).json(newMessage);
});

// ➡️ Route GET pour voir tous les messages enregistrés (optionnel)
app.get("/messages", (req, res) => {
  res.json(messages);
});

// ➡️ Lancer le serveur
server.listen(PORT, () => {
  console.log(`✅ Backend en ligne sur http://localhost:${PORT}`);
});
