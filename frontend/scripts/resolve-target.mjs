const TARGETS = [
  { url: "https://ecosense.chilecentral.cloudapp.azure.com", name: "Azure" },
  { url: "https://dsm-p4-g01-2026-01.onrender.com", name: "Render" },
  { url: "http://localhost:3000", name: "Local" },
];

async function main() {
  console.error("🔍 Resolvendo servidor de API...");
  for (const t of TARGETS) {
    try {
      const res = await fetch(`${t.url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "probe@ecosense.dev", password: "probe" }),
        signal: AbortSignal.timeout(3000),
      });
      console.error(`  ✅ ${t.name} — online (${res.status})`);
      console.log(t.url);
      return;
    } catch {
      console.error(`  ❌ ${t.name} — offline`);
    }
  }
  console.error("  ⚠️ Nenhum servidor online, usando Local");
  console.log("http://localhost:3000");
}

main();
