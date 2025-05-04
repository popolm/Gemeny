document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("postButton");
  const inputField = document.getElementById("inputField");
  const messagesContainer = document.createElement("div");
  document.body.appendChild(messagesContainer);

  // Initialiser WebSocket
  const ws = new WebSocket("ws://127.0.0.1:3000");

  ws.onopen = () => {
    console.log("✅ WebSocket connecté");
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const messageElement = document.createElement("p");
    messageElement.textContent = `📩 ${message.message}`;
    messagesContainer.appendChild(messageElement);
  };

  ws.onerror = (error) => {
    console.error("❌ Erreur WebSocket:", error);
  };

  button.addEventListener("click", function () {
    fetch("http://127.0.0.1:81/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputField.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        inputField.value = ""; // Réinitialiser le champ
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

function sendMessage() {
  const backendUrl = window.BACKEND_URL || "http://localhost:81";

  fetch(`${backendUrl}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello from frontend!" }),
  })
    .then((res) => res.text())
    .then((msg) => alert("✅ Réponse du backend: " + msg))
    .catch((err) => alert("❌ Erreur: " + err));
}
