import { WebSocketServer } from "ws";

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Cliente WebSocket conectado");
    ws.on("close", () => console.log("Cliente WebSocket desconectado"));
  });

  console.log("WebSocket server inicializado");
  return wss;
}

export function broadcastLeitura(leitura) {
  if (!wss) return;
  const msg = JSON.stringify({ tipo: "novaLeitura", dados: leitura });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}
