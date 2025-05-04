const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simuler les routes du serveur
app.get("/", (req, res) => res.send("Backend opérationnel ✅"));
app.post("/messages", (req, res) => {
  const newMessage = { id: "1", message: req.body.message };
  res.status(201).json(newMessage);
});
app.get("/messages", (req, res) => res.json([{ id: "1", message: "Test" }]));

describe("Tests des routes backend", () => {
  it("GET / doit retourner un message de succès", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend opérationnel ✅");
  });

  it("POST /messages doit créer un nouveau message", async () => {
    const response = await request(app)
      .post("/messages")
      .send({ message: "Hello World" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "1", message: "Hello World" });
  });

  it("GET /messages doit retourner une liste de messages", async () => {
    const response = await request(app).get("/messages");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "1", message: "Test" }]);
  });
});
