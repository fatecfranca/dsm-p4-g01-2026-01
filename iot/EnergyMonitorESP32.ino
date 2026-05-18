#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <EmonLib.h>

// =========================================================
// EcoSense - Medidor de Energia IoT
// Projeto DSM - ESP32 + SCT-013 + ZMPT101B
// =========================================================

// ---------------------------------------------------------
// 1. CONFIGURAÇÕES DE REDE
// ---------------------------------------------------------

// Nome da rede Wi-Fi
const char* ssid = "SEU_WIFI";

// Senha da rede Wi-Fi
const char* password = "SUA_SENHA";

// URL da API
const char* api_url =
"https://dsm-p4-g01-2026-01.onrender.com/api/telemetria/ingestao";


// ---------------------------------------------------------
// 2. CONFIGURAÇÕES DOS SENSORES
// ---------------------------------------------------------

EnergyMonitor emon1;

// Pino do sensor de tensão ZMPT101B
const int PINO_TENSAO = 34;

// Pino do sensor de corrente SCT-013
const int PINO_CORRENTE = 32;


// ---------------------------------------------------------
// 3. CALIBRAÇÕES
// ---------------------------------------------------------

// Calibração da corrente
float calibracaoCorrente = 1.55;

// Calibração da tensão
float calibracaoTensao = 234.26;

// Divisor para ajuste da tensão RMS
float divisorTensao = 1.4142;


// ---------------------------------------------------------
// 4. FUNÇÃO DE CONEXÃO WIFI
// ---------------------------------------------------------

void conectarWiFi() {

  // Verifica se já está conectado
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  Serial.print("Conectando ao Wi-Fi");

  WiFi.begin(ssid, password);

  int tentativas = 0;

  // Tenta conectar por até 20 tentativas
  while (WiFi.status() != WL_CONNECTED && tentativas < 20) {

    delay(500);
    Serial.print(".");
    tentativas++;
  }

  // Se conectou
  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("\nWi-Fi conectado!");
    Serial.print("IP do ESP32: ");
    Serial.println(WiFi.localIP());

  } else {

    Serial.println("\nFalha ao conectar no Wi-Fi.");
  }
}


// ---------------------------------------------------------
// 5. SETUP
// ---------------------------------------------------------

void setup() {

  Serial.begin(115200);

  delay(1000);

  Serial.println("====================================");
  Serial.println(" EcoSense - Medidor de Energia ");
  Serial.println("====================================");

  // Conecta no Wi-Fi
  conectarWiFi();

  // Configuração do sensor de tensão
  emon1.voltage(PINO_TENSAO, calibracaoTensao, 1.7);

  // Configuração do sensor de corrente
  emon1.current(PINO_CORRENTE, calibracaoCorrente);

  Serial.println("Sensores configurados!");
}


// ---------------------------------------------------------
// 6. LOOP PRINCIPAL
// ---------------------------------------------------------

void loop() {

  // Mantém conexão Wi-Fi
  conectarWiFi();

  // Faz leitura elétrica
  emon1.calcVI(20, 2000);

  // Tensão RMS
  float voltagem = emon1.Vrms / divisorTensao;

  // Corrente RMS
  float corrente = emon1.Irms;

  // Potência ativa
  float potenciaAtiva = emon1.realPower;

  // Potência aparente
  float potenciaAparente = voltagem * corrente;

  // Fator de potência
  float fatorPotencia = 0;

  // Evita divisão por zero
  if (potenciaAparente > 0) {

    fatorPotencia = potenciaAtiva / potenciaAparente;
  }

  // Validação de erro matemático
  if (isnan(fatorPotencia) || isinf(fatorPotencia)) {

    fatorPotencia = 0;
  }


  // ---------------------------------------------------------
  // SERIAL MONITOR
  // ---------------------------------------------------------

  Serial.println("\n========== LEITURA ==========");

  Serial.print("Voltagem: ");
  Serial.print(voltagem, 2);
  Serial.println(" V");

  Serial.print("Corrente: ");
  Serial.print(corrente, 4);
  Serial.println(" A");

  Serial.print("Potência Ativa: ");
  Serial.print(potenciaAtiva, 2);
  Serial.println(" W");

  Serial.print("Potência Aparente: ");
  Serial.print(potenciaAparente, 2);
  Serial.println(" VA");

  Serial.print("Fator de Potência: ");
  Serial.println(fatorPotencia, 2);


  // ---------------------------------------------------------
  // ENVIO PARA API
  // ---------------------------------------------------------

  if (WiFi.status() == WL_CONNECTED) {

    WiFiClientSecure client;

    // Ignora certificado HTTPS
    client.setInsecure();

    HTTPClient http;

    // Inicia conexão HTTP
    http.begin(client, api_url);

    // Header JSON
    http.addHeader("Content-Type", "application/json");

    // Criação do JSON
    StaticJsonDocument<256> doc;

    doc["dispositivoId"] = "ESP32_SALA_01";
    doc["voltagem"] = voltagem;
    doc["corrente"] = corrente;
    doc["potenciaAtiva"] = potenciaAtiva;
    doc["potenciaAparente"] = potenciaAparente;
    doc["fatorPotencia"] = fatorPotencia;

    // Conversão JSON para String
    String jsonString;

    serializeJson(doc, jsonString);

    Serial.println("\nJSON enviado:");
    Serial.println(jsonString);

    // Envia POST
    int codigoResposta = http.POST(jsonString);

    // Verifica resposta
    if (codigoResposta > 0) {

      Serial.print("Código HTTP: ");
      Serial.println(codigoResposta);

      String resposta = http.getString();

      Serial.println("Resposta API:");
      Serial.println(resposta);

    } else {

      Serial.print("Erro HTTP: ");

      Serial.println(http.errorToString(codigoResposta));
    }

    // Finaliza conexão
    http.end();

  } else {

    Serial.println("Wi-Fi desconectado.");
  }

  // Delay entre leituras
  delay(5000);
}