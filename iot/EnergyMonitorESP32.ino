#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <EmonLib.h>


// =====================================
// CONFIGURAÇÃO WIFI
// =====================================
const char* ssid = "Rissato";
const char* password = "253537jf";


// =====================================
// CONFIGURAÇÃO API
// =====================================
const char* api_url = "https://dsm-p4-g01-2026-01.onrender.com/api/telemetria/ingestao";
const char* dispositivoId = "ESP32_VENTILADOR";


// =====================================
// PINOS ESP32
// =====================================
const int PINO_TENSAO = 34;     
const int PINO_CORRENTE = 32;   


// =====================================
// SENSOR ZMPT101B
// =====================================
EnergyMonitor emon1;


// AJUSTADO PARA REDE 127V
float calibracaoTensao = 154.00;


// =====================================
// SENSOR ACS712 20A
// =====================================

// ACS712 20A sem divisor
float sensibilidadeACS = 0.100;


// calculado automaticamente
float offsetACS = 2.50;



// =====================================
// FILTROS
// =====================================

// evita tensão fantasma
float tensaoMinima = 10.0;


// corta ruído do ACS712 parado
float correnteMinima = 0.050;




void setup() {


  Serial.begin(115200);
  delay(1000);


  Serial.println("Iniciando ESP32...");


  analogReadResolution(12);



  WiFi.begin(ssid, password);


  Serial.print("Conectando WiFi");


  while(WiFi.status() != WL_CONNECTED){

    delay(500);
    Serial.print(".");
  }



  Serial.println();
  Serial.println("WiFi conectado!");

  Serial.print("IP: ");
  Serial.println(WiFi.localIP());




  // inicia sensor tensão
  emon1.voltage(
    PINO_TENSAO,
    calibracaoTensao,
    1.7
  );



  delay(2000);



  // calibrar ACS sem carga ligada
  calibrarOffsetACS();


  delay(1000);
}






void loop(){



  // =============================
  // TENSÃO
  // =============================
  emon1.calcVI(20,2000);


  float tensao = emon1.Vrms;



  // =============================
  // CORRENTE
  // =============================
  float corrente = lerCorrenteACS();




  if(tensao < tensaoMinima){

    tensao = 0.0;
  }



  if(corrente < correnteMinima){

    corrente = 0.0;
  }



  float potenciaAtiva = tensao * corrente;



  Serial.println("===================================");



  Serial.print("Tensão: ");
  Serial.print(tensao,2);
  Serial.println(" V");



  Serial.print("Corrente: ");
  Serial.print(corrente,4);
  Serial.println(" A");



  Serial.print("Potência: ");
  Serial.print(potenciaAtiva,2);
  Serial.println(" W");



  enviarParaAPI(
    tensao,
    corrente,
    potenciaAtiva
  );



  delay(1000);
}









// =====================================
// CALIBRAR ZERO ACS712
// =====================================
void calibrarOffsetACS(){



  long soma = 0;


  int amostras = 1000;



  Serial.println("Calibrando ACS712...");
  Serial.println("Não deixe aparelho ligado");



  for(int i=0;i<amostras;i++){


    soma += analogRead(PINO_CORRENTE);


    delay(2);
  }




  float mediaADC = soma / (float)amostras;



  offsetACS = mediaADC * (3.3 / 4095.0);




  Serial.print("Offset ACS712: ");
  Serial.print(offsetACS,4);
  Serial.println(" V");

}









// =====================================
// LER ACS712 RMS
// =====================================
float lerCorrenteACS(){



  int amostras = 1000;



  float somaQuadrados = 0;



  for(int i=0;i<amostras;i++){



    int adc = analogRead(PINO_CORRENTE);



    float tensaoSensor = adc * (3.3 / 4095.0);



    float diferenca = tensaoSensor - offsetACS;



    somaQuadrados += diferenca * diferenca;




    delayMicroseconds(500);

  }




  float tensaoRMS = sqrt(
    somaQuadrados / amostras
  );



  float correnteRMS = tensaoRMS / sensibilidadeACS;




  return correnteRMS;

}









// =====================================
// ENVIAR PARA API
// =====================================
void enviarParaAPI(
  float tensao,
  float corrente,
  float potenciaAtiva
){



  if(WiFi.status() == WL_CONNECTED){



    WiFiClientSecure client;


    client.setInsecure();




    HTTPClient http;



    http.begin(
      client,
      api_url
    );



    http.addHeader(
      "Content-Type",
      "application/json"
    );




    StaticJsonDocument<256> doc;




    doc["dispositivoId"] = dispositivoId;

    doc["voltagem"] = tensao;

    doc["corrente"] = corrente;

    doc["potenciaAtiva"] = potenciaAtiva;





    String json;



    serializeJson(
      doc,
      json
    );




    Serial.println("Enviando JSON:");
    Serial.println(json);




    int httpCode = http.POST(json);




    Serial.print("Código HTTP: ");
    Serial.println(httpCode);




    Serial.println("Resposta API:");
    Serial.println(http.getString());



    http.end();

  }

}