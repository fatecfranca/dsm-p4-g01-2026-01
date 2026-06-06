import { useEffect, useRef, useState, useCallback } from "react";

function getWsUrl() {
  const apiBase = import.meta.env.VITE_API_URL || "/api";
  let origin;
  if (apiBase.startsWith("http")) {
    origin = apiBase.replace(/\/api\/?$/, "");
  } else {
    origin = window.location.origin;
  }
  return `${origin.replace(/^http/, "ws")}`;
}

export function useTelemetrySocket({ onLeitura, enabled = true } = {}) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const handlerRef = useRef(onLeitura);
  const stoppedRef = useRef(false);

  handlerRef.current = onLeitura;

  const connect = useCallback(() => {
    if (stoppedRef.current) return;
    try {
      const ws = new WebSocket(getWsUrl());
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg?.tipo === "novaLeitura" && msg.dados) {
            handlerRef.current?.(msg.dados);
          }
        } catch {
          // payload inválido, ignora
        }
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        if (!stoppedRef.current) {
          reconnectRef.current = setTimeout(connect, 3000);
        }
      };
    } catch {
      setConnected(false);
      if (!stoppedRef.current) {
        reconnectRef.current = setTimeout(connect, 3000);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    stoppedRef.current = false;
    connect();
    return () => {
      stoppedRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect, enabled]);

  return { connected };
}
