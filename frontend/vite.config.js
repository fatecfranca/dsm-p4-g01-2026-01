import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const TARGETS = [
  { url: "https://ecosense.chilecentral.cloudapp.azure.com", name: "Azure" },
  { url: "https://dsm-p4-g01-2026-01.onrender.com", name: "Render" },
  { url: "http://localhost:3000", name: "Local" },
];

async function resolveTarget() {
  console.warn("🔍 Resolvendo servidor de API...");
  for (const t of TARGETS) {
    try {
      const res = await fetch(`${t.url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "probe@ecosense.dev", password: "probe" }),
        signal: AbortSignal.timeout(3000),
      });
      console.warn(`  ✅ ${t.name} — online (${res.status})`);
      return t.url;
    } catch {
      console.warn(`  ❌ ${t.name} — offline`);
    }
  }
  console.warn("  ⚠️ Nenhum servidor online, usando Local");
  return "http://localhost:3000";
}

export default defineConfig(async ({ mode }) => {
  // Se rodar como `vite --mode local`, usa a porta local diretamente.
  // Caso contrário, tenta resolver dinamicamente ou usa VITE_PROXY_TARGET se fornecido.
  const target = mode === 'local'
    ? 'http://localhost:3000'
    : (process.env.VITE_PROXY_TARGET || await resolveTarget());

  console.warn(`🚀 API Proxy configurado para: ${target}`);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
})
