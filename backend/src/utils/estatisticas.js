export const calcularMedia = (dados) => {
  if (dados.length === 0) return 0;
  return dados.reduce((acc, val) => acc + val, 0) / dados.length;
};

export const calcularQuartis = (dados) => {
  if (dados.length === 0) return { min: 0, q1: 0, mediana: 0, q3: 0, max: 0 };
  const ordenados = [...dados].sort((a, b) => a - b);

  const mid = Math.floor(ordenados.length / 2);
  const mediana =
    ordenados.length % 2 === 0
      ? (ordenados[mid - 1] + ordenados[mid]) / 2
      : ordenados[mid];

  return {
    min: Number(ordenados[0].toFixed(2)),
    q1: Number(ordenados[Math.floor(ordenados.length * 0.25)].toFixed(2)),
    mediana: Number(mediana.toFixed(2)),
    q3: Number(ordenados[Math.floor(ordenados.length * 0.75)].toFixed(2)),
    max: Number(ordenados[ordenados.length - 1].toFixed(2)),
  };
};

export const calcularModa = (dados, casasDecimais = 1, ignorarZeros = true) => {
  // Filtra os zeros se ignorarZeros for true
  const dadosValidos = ignorarZeros ? dados.filter((v) => v > 0) : dados;

  if (dadosValidos.length === 0) return 0;

  const frequencias = {};
  let maxFreq = 0;
  let moda = dadosValidos[0];

  dadosValidos.forEach((val) => {
    // Preserva casas decimais para não quebrar corrente e fator de potência
    const fator = Math.pow(10, casasDecimais);
    const valorArredondado = Math.round(val * fator) / fator;

    frequencias[valorArredondado] = (frequencias[valorArredondado] || 0) + 1;
    if (frequencias[valorArredondado] > maxFreq) {
      maxFreq = frequencias[valorArredondado];
      moda = valorArredondado;
    }
  });

  return moda;
};

export const calcularDesvioPadrao = (dados, media) => {
  if (dados.length <= 1) return 0;
  const variancia =
    dados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) /
    (dados.length - 1);
  return Math.sqrt(variancia);
};

export const regressaoLinearCusto = (leituras) => {
  let somaX = 0,
    somaY = 0,
    somaXY = 0,
    somaX2 = 0;
  const n = leituras.length;
  if (n === 0) return { tendencia: 0, intercepto: 0 };

  const tempoInicial = new Date(leituras[0].timestamp).getTime();

  leituras.forEach((leitura) => {
    // Eixo X: Quantas horas se passaram desde a primeira leitura da amostra
    const x = (new Date(leitura.timestamp).getTime() - tempoInicial) / 3600000;

    // Eixo Y: O valor do custo
    const y = leitura.custoHora || 0;

    somaX += x;
    somaY += y;
    somaXY += x * y;
    somaX2 += x * x;
  });

  // Se todos os dados tiverem o mesmo tempo (evita divisão por zero)
  const denominador = n * somaX2 - Math.pow(somaX, 2);
  if (denominador === 0) return { tendencia: 0, intercepto: somaY / n };

  const tendencia = (n * somaXY - somaX * somaY) / denominador;
  const intercepto = (somaY - tendencia * somaX) / n;

  return { tendencia, intercepto };
};

export const calcularIntervaloConfianca = (media, desvioPadrao, n) => {
  if (n === 0) return { min: 0, max: 0 };
  const Z = 1.96; // Valor Z para 95% de confiança
  const margemErro = Z * (desvioPadrao / Math.sqrt(n));
  return {
    min: media - margemErro,
    max: media + margemErro,
  };
};

export const calcularEstratosPorTurno = (leituras) => {
  const estratos = { madrugada: 0, manha: 0, tarde: 0, noite: 0 };

  // Começamos do índice 1 para poder comparar com a leitura anterior [i-1]
  for (let i = 1; i < leituras.length; i++) {
    const leitura = leituras[i];
    const prevLeitura = leituras[i - 1];

    // Calcula quantas horas se passaram entre uma leitura e outra (Delta Time)
    const dt =
      (new Date(leitura.timestamp) - new Date(prevLeitura.timestamp)) / 3600000;

    // Energia Real Consumida (kWh) = Potência (kW) * Tempo (h)
    const consumoKwh = (leitura.potenciaKw || 0) * dt;

    const d = new Date(leitura.timestamp);
    const hora = (d.getUTCHours() - 3 + 24) % 24; // Fuso horário

    if (hora >= 0 && hora < 6) estratos.madrugada += consumoKwh;
    else if (hora >= 6 && hora < 12) estratos.manha += consumoKwh;
    else if (hora >= 12 && hora < 18) estratos.tarde += consumoKwh;
    else estratos.noite += consumoKwh;
  }

  return estratos;
};

export const obterAmostraAleatoria = (dados, tamanhoAmostra) => {
  if (dados.length <= tamanhoAmostra) return dados;

  const embaralhado = [...dados];
  for (let i = embaralhado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
  }

  // Pegamos a amostra e RE-ORDENAMOS cronologicamente
  const amostra = embaralhado.slice(0, tamanhoAmostra);
  return amostra.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};
