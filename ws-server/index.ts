import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected users
const clients = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      console.log("Received:", msg);

      if (msg.type === "register") {
        clients.set(msg.userId, ws);
        ws.send(JSON.stringify({ type: "system", message: "Registered" }));
        return;
      }

      if (msg.type === "message") {
        const { senderId, receiverId, content } = msg;
        const receiver = clients.get(receiverId);

        if (receiver && receiver.readyState === WebSocket.OPEN) {
          receiver.send(JSON.stringify(msg));
        }
      }

      if (msg.type === "new_post" || msg.type === "new_service") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
          }
        });
      }
    } catch (err) {
      console.error("Failed to process WS message", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        break;
      }
    }
  });
});

// Regular HTTP route
app.get("/", (req, res) => {
  res.send("WebSocket service is running 🚀");
});

// Start HTTP + WS server
const PORT = 4001;
server.listen(PORT, () => {
  console.log(`HTTP + WS server running on http://localhost:${PORT}`);
});
