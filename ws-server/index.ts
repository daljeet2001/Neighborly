import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 4001 });

// Store connected users
const clients = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      console.log("Received:", msg);

      if (msg.type === "register") {
        // Save user connection
        clients.set(msg.userId, ws);
        ws.send(JSON.stringify({ type: "system", message: "Registered" }));
        return;
      }

      if (msg.type === "message") {
        const { senderId, receiverId, content } = msg;

        // Send to receiver if online
        const receiver = clients.get(receiverId);
        if (receiver && receiver.readyState === WebSocket.OPEN) {
          receiver.send(JSON.stringify(msg));
        }

        // Also echo back to sender (so they see their message in real time)
        // const sender = clients.get(senderId);
        // if (sender && sender.readyState === WebSocket.OPEN) {
        //   sender.send(JSON.stringify(msg));
        // }
      }

      if (msg.type === "new_post") {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

      if (msg.type === "new_service") {
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
    // Remove disconnected user from registry
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        break;
      }
    }
  });
});

console.log("WS server running on ws://localhost:4001");
