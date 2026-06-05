import { useEffect, useRef } from "react";

const WS_URL =
  process.env.EXPO_PUBLIC_WS_URL ||
  "wss://dsm-p4-g01-2026-01.onrender.com";

export default function useWebSocket(onMessage, enabled = true) {
  const wsRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    function connect() {
      if (cancelled) return;
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => console.log("WebSocket conectado");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current(data);
        } catch (e) {
          console.error("Erro ao processar mensagem WS:", e);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!cancelled) setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [enabled]);
}
