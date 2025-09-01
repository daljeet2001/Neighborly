import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4001 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // Broadcast to all
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WS server running on ws://localhost:4001");

