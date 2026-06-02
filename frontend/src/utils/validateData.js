const BOLD = "font-weight:700";
const GREEN = "color:#22C55E;font-weight:700";
const RED = "color:#EF4444;font-weight:700";
const YELLOW = "color:#F59E0B;font-weight:700";
const DIM = "color:#94A3B8";
const RESET = "color:#E2E8F0";

const FIELDS = ["voltagem", "corrente", "potenciaAtiva", "potenciaAparente", "potenciaReativa", "fatorPotencia", "frequencia", "potenciaKw", "custoHora", "consumokWh", "custoReais"];

function pct(a, b) {
  if (!b) return "0.0";
  return ((a / b) * 100).toFixed(1);
}

function fmt(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return v.toFixed(4);
  return String(v);
}

function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const p25 = sorted[Math.floor(n * 0.25)];
  const p75 = sorted[Math.ceil(n * 0.75)];
  const std = Math.sqrt(sorted.reduce((s, v) => s + (v - avg) ** 2, 0) / n);

  let anomalous = 0;
  const outliers = sorted.filter(v => Math.abs(v - avg) > 3 * std);
  anomalous = outliers.length;

  return { n, avg, min, max, median, p25, p75, std, anomalous };
}

function logSection(title) {
  console.log(`%c━━━ ${title} ━━━`, BOLD);
}

function log(label, value, status = RESET) {
  console.log(`%c• ${label}:%c ${value}`, DIM, status);
}

function logPass(label) {
  console.log(`%c  ✅ ${label}`, GREEN);
}

function logFail(label, detail = "") {
  console.log(`%c  ❌ ${label}${detail ? ` — ${detail}` : ""}`, RED);
}

function logWarn(label, detail = "") {
  console.log(`%c  ⚠️ ${label}${detail ? ` — ${detail}` : ""}`, YELLOW);
}

export function validateData(readings) {
  if (!readings || readings.length === 0) {
    console.log(`%c📊 EcoSense — Data Validation`, BOLD);
    console.log(`%c❌ Nenhuma leitura recebida`, RED);
    return;
  }

  console.log(`%c📊 EcoSense — Data Validation %c(${readings.length} leituras)`, BOLD, DIM);
  console.log("");

  // ── 1. INTEGRIDADE ──
  logSection("1. INTEGRIDADE");

  // Timestamps
  const timestamps = readings.map(r => r.timestamp).filter(Boolean);
  const sorted = [...timestamps].sort();
  const isOrdered = timestamps.every((t, i) => i === 0 || t >= timestamps[i - 1]);

  log("Período", `${sorted[0]?.slice(0, 10)} → ${sorted[sorted.length - 1]?.slice(0, 10)}`);
  log("Ordem cronológica", isOrdered ? "✅ OK (ASC)" : "⚠️ Fora de ordem");

  if (!isOrdered) logFail("readings não estão em ordem cronológica");

  // Dispositivos
  const devices = [...new Set(readings.map(r => r.dispositivoId))];
  log("Dispositivos", devices.join(", "));

  // Campos obrigatórios
  let allOk = true;
  FIELDS.forEach(field => {
    const nulls = readings.filter(r => r[field] === null || r[field] === undefined).length;
    const nullPct = pct(nulls, readings.length);
    if (nulls === readings.length) {
      logWarn(`${field}: 100% null (${nulls}/${readings.length})`);
    } else if (nulls > 0) {
      logWarn(`${field}: ${nullPct}% null (${nulls}/${readings.length})`);
    }
  });

  if (allOk) logPass("Todos os campos obrigatórios presentes");

  // ── 2. ESTATÍSTICAS ──
  logSection("2. ESTATÍSTICAS POR CAMPO");

  const report = {};
  FIELDS.forEach(field => {
    const vals = readings.map(r => r[field]).filter(v => v != null && isFinite(v));
    if (vals.length === 0) {
      report[field] = { n: 0 };
      log(field, "100% null — sem dados");
      return;
    }
    const s = stats(vals);
    report[field] = s;
    log(field, `${s.avg.toFixed(2)} (min: ${s.min.toFixed(2)}, máx: ${s.max.toFixed(2)}, mediana: ${s.median.toFixed(2)}, P25: ${s.p25.toFixed(2)}, P75: ${s.p75.toFixed(2)}, σ: ${s.std.toFixed(2)})`);

    if (s.anomalous > 0) {
      logWarn(`${field}: ${s.anomalous} outliers (>3σ)`);
    }
  });

  // ── 3. SESSÕES ──
  logSection("3. SESSÕES DE LEITURA");

  const byDate = {};
  readings.forEach(r => {
    const d = r.timestamp?.slice(0, 10) || "unknown";
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(r.timestamp);
  });

  Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, ts]) => {
      const first = ts[0].slice(11, 19);
      const last = ts[ts.length - 1].slice(11, 19);
      const duration = ((new Date(ts[ts.length - 1]) - new Date(ts[0])) / 60000).toFixed(1);
      log(date, `${ts.length} leituras, ${first} → ${last} (${duration} min)`);
    });

  // ── 4. CONSISTÊNCIA DAS MÉTRICAS ──
  logSection("4. CONSISTÊNCIA DOS GRÁFICOS");

  // Voltagem vs Corrente: verificar V/A ≈ Potência
  let vaConsistent = 0;
  let vaInconsistent = 0;
  readings.forEach(r => {
    if (r.voltagem && r.corrente && r.potenciaAparente && r.voltagem > 0) {
      const va = r.voltagem * r.corrente;
      const ratio = Math.abs(va - Math.abs(r.potenciaAparente)) / va;
      if (ratio < 0.1) vaConsistent++;
      else vaInconsistent++;
    }
  });
  const vaPct = pct(vaConsistent, vaConsistent + vaInconsistent);
  log("V × A ≈ Pot. Aparente", `${vaPct}% consistente (${vaConsistent} de ${vaConsistent + vaInconsistent} amostras)`);
  if (vaPct < 80) logFail("V×A não bate com potência aparente na maioria dos casos");
  else if (vaPct < 95) logWarn("V×A tem divergências com potência aparente");
  else logPass("V×A consistente com potência aparente");

  // Última leitura
  const lastReading = readings.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b);
  log("Última leitura (bruta)", `${lastReading.timestamp} — V:${fmt(lastReading.voltagem)} A:${fmt(lastReading.corrente)} W:${fmt(lastReading.potenciaAtiva)}`);

  // Latest (o que KPICards mostra)
  const sortedReadings = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const latest = sortedReadings[sortedReadings.length - 1];
  log("Última leitura (sorted, pro dash)", `${latest.timestamp} — V:${fmt(latest.voltagem)} A:${fmt(latest.corrente)} W:${fmt(latest.potenciaAtiva)}`);

  if (latest.timestamp !== lastReading.timestamp) {
    logWarn("Latest difere da última leitura bruta — verificar sort");
  }

  // ── 5. OUTLIERS ──
  logSection("5. OUTLIERS (thresholds do MetricChart)");

  const THRESHOLDS = { voltagem: { max: 300 }, corrente: { max: 10 }, potenciaAtiva: { min: -100, max: 500 } };

  const removed = { voltagem: 0, corrente: 0, potenciaAtiva: 0 };
  readings.forEach(r => {
    if (r.voltagem > THRESHOLDS.voltagem.max) removed.voltagem++;
    if (r.corrente > THRESHOLDS.corrente.max) removed.corrente++;
    if (r.potenciaAtiva < THRESHOLDS.potenciaAtiva.min || r.potenciaAtiva > THRESHOLDS.potenciaAtiva.max) removed.potenciaAtiva++;
  });

  Object.entries(removed).forEach(([field, count]) => {
    if (count === 0) logPass(`${field}: 0 outliers`);
    else logWarn(`${field}: ${count} outliers removidos (${pct(count, readings.length)}%)`);
  });

  // ── 6. RESUMO ──
  logSection("6. RESUMO");

  const totalIssues = Object.values(removed).reduce((a, b) => a + b, 0) + (vaInconsistent > readings.length * 0.2 ? 1 : 0);
  if (totalIssues === 0) {
    console.log(`%c✅ Todos os dados consistentes — nenhum problema encontrado`, GREEN);
  } else {
    console.log(`%c⚠️  ${totalIssues} anomalia(s) detectada(s) — detalhes acima`, YELLOW);
  }

  console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━`, RESET);

  return report;
}
