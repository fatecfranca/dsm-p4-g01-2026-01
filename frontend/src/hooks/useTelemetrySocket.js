import { useEffect, useRef, useState } from "react";

function getWsUrl() {
  const apiBase = import.meta.env.VITE_API_URL || "/api";
  let origin;
  if (apiBase.startsWith("http")) {
    origin = apiBase.replace(/\/api\/?$/, "");
  } else {
    origin = window.location.origin;
  }
  return origin.replace(/^http/, "ws");
}

export function useTelemetrySocket({ onLeitura, enabled = true } = {}) {
  const [connected, setConnected] = useState(false);
  const onLeituraRef = useRef(onLeitura);
  const wsRef = useRef(null);
  const stoppedFlagRef = useRef(null);
  const connectRef = useRef(null);

  useEffect(() => {
    onLeituraRef.current = onLeitura;
  }, [onLeitura]);

  useEffect(() => {
    if (!enabled) return undefined;

    stoppedFlagRef.current = { stopped: false };
    connectRef.current?.(stoppedFlagRef.current);

    return () => {
      if (stoppedFlagRef.current) stoppedFlagRef.current.stopped = true;
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnected(false);
    };
  }, [enabled]);

  useEffect(() => {
    connectRef.current = (stoppedFlag) => {
      if (stoppedFlag.stopped) return;

      let ws;
      try {
        ws = new WebSocket(getWsUrl());
      } catch {
        setTimeout(() => connectRef.current?.(stoppedFlag), 3000);
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg?.tipo === "novaLeitura" && msg.dados) {
            onLeituraRef.current?.(msg.dados);
          }
        } catch {
          // payload inválido
        }
      };
      ws.onerror = () => setConnected(false);
      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (!stoppedFlag.stopped) {
          setTimeout(() => connectRef.current?.(stoppedFlag), 3000);
        }
      };
    };
  }, []);

  return { connected };
}
