/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

describe("Frontend Tests", () => {
  let appHtml;
  let mockWebSocket;

  beforeAll(() => {
    const htmlPath = path.resolve(__dirname, "index.html");
    appHtml = fs.readFileSync(htmlPath, "utf8");
    document.body.innerHTML = appHtml;

    // Simuler WebSocket
    mockWebSocket = {
      send: jest.fn(),
      addEventListener: jest.fn(),
    };
    global.WebSocket = jest.fn(() => mockWebSocket);

    require("./app.js"); // Charger le script frontend
  });

  it("doit afficher un titre", () => {
    const title = document.querySelector("h1");
    expect(title.textContent).toBe("Gemeny");
  });
  it("doit afficher un bouton", () => {
    const button = document.getElementById("postButton");
    expect(button).not.toBeNull();
  });
  it("doit ajouter un message au conteneur", () => {
    const messagesContainer = document.querySelector("div");
    const messageElement = document.createElement("p");
    messageElement.textContent = "📩 Test Message";
    messagesContainer.appendChild(messageElement);

    expect(messagesContainer.textContent).toContain("📩 Test Message");
  });
});
