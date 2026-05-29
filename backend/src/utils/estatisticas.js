export const calcularMedia = (dados) => {
  if (dados.length === 0) return 0;
  return dados.reduce((acc, val) => acc + val, 0) / dados.length;
};

export const calcularQuartis = (dados) => {
  if (dados.length === 0) return { q1: 0, mediana: 0, q3: 0 };
  const ordenados = [...dados].sort((a, b) => a - b);
  return {
    q1: ordenados[Math.floor(ordenados.length * 0.25)],
    mediana: ordenados[Math.floor(ordenados.length * 0.5)],
    q3: ordenados[Math.floor(ordenados.length * 0.75)],
  };
};

export const calcularModa = (dados) => {
  if (dados.length === 0) return 0;
  const frequencias = {};
  let maxFreq = 0;
  let moda = dados[0];

  dados.forEach((val) => {
    // Arredondamos para agrupar valores contínuos (ex: 60.1 e 60.4 viram 60)
    const valorArredondado = Math.round(val);
    frequencias[valorArredondado] = (frequencias[valorArredondado] || 0) + 1;
    if (frequencias[valorArredondado] > maxFreq) {
      maxFreq = frequencias[valorArredondado];
      moda = valorArredondado;
    }
  });
  return moda;
};

export const calcularDesvioPadrao = (dados, media) => {
  if (dados.length === 0) return 0;
  const variancia =
    dados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) /
    dados.length;
  return Math.sqrt(variancia);
};

export const regressaoLinearCusto = (leituras) => {
  // Vamos cruzar os dias (X) com o custo acumulado (Y)
  let somaX = 0,
    somaY = 0,
    somaXY = 0,
    somaX2 = 0;
  const n = leituras.length;
  if (n === 0) return { tendencia: 0, intercepto: 0 };

  leituras.forEach((leitura, index) => {
    const x = index; // Representa a linha do tempo
    const y = leitura.custoReais || 0;
    somaX += x;
    somaY += y;
    somaXY += x * y;
    somaX2 += x * x;
  });

  const tendencia = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);
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

  leituras.forEach((leitura) => {
    const hora = new Date(leitura.timestamp).getUTCHours();
    const consumo = leitura.consumokWh || 0;

    if (hora >= 0 && hora < 6) estratos.madrugada += consumo;
    else if (hora >= 6 && hora < 12) estratos.manha += consumo;
    else if (hora >= 12 && hora < 18) estratos.tarde += consumo;
    else estratos.noite += consumo;
  });

  return estratos;
};
