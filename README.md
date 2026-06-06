# Grupo 01 - P.I 4° Semestre DSM

# ⚡ EcoSense - Sistema de Monitoramento de Energia IoT

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![React Native](https://img.shields.io/badge/Mobile-React_Native-61DAFB?logo=react)
![ESP32](https://img.shields.io/badge/IoT-ESP32-E7352C?logo=espressif)

## 📖 Sobre o Projeto

O **EcoSense** é um sistema ponta a ponta (IoT, Backend, Frontend e Mobile) desenvolvido como **Projeto Interdiciplinar(PI)**. O objetivo é monitorar, em tempo real, o consumo de energia elétrica de equipamentos, fornecer análises estatísticas de qualidade de energia e realizar previsões de custos.

O hardware coleta os dados elétricos e os envia para uma API em nuvem, que processa e armazena as informações, disponibilizando-as em dashboards interativos para o usuário final.

---

## 🏗️ Arquitetura do Sistema

O projeto foi dividido em 4 camadas principais:

1. **Camada IoT (Edge):** Microcontrolador ESP32 equipado com sensores de Tensão (ZMPT101B) e Corrente (ACS712).
2. **Camada de Backend (API):** Servidor Node.js construído com Express e Prisma ORM, responsável pela ingestão, limpeza de dados (outliers) e processamento matemático.
3. **Camada de Persistência:** Banco de Dados NoSQL (MongoDB) otimizado para séries temporais e alto volume de dados (Telemetria).
4. **Camada de Apresentação:**
   - **Frontend Web:** Dashboard gerencial em React.js.
   - **App Mobile:** Aplicativo construído com React Native (Expo) para monitoramento na palma da mão.

---

## ✨ Principais Funcionalidades

- **Monitoramento em Tempo Real:** Visualização de Tensão (V), Corrente (A) e Potência Ativa (W).
- **Cálculo Financeiro:** Custo por hora atual e consumo total (kWh).
- **Estatística Preditiva:** Projeção da fatura mensal com base no comportamento de uso da máquina.
- **Qualidade de Energia:** Alertas automáticos para Fator de Potência baixo (< 0.92) e oscilações fora do padrão (Boxplot de Corrente).
- **Análise Comportamental:** Gráficos de consumo estratificados por turnos (Manhã, Tarde, Noite, Madrugada).
- **Filtros Temporais:** Histórico filtrável por períodos (7 dias, 30 dias, etc).

---

## 🛠️ Tecnologias Utilizadas

**Internet das Coisas (IoT)**

- Placa ESP32
- Linguagem C/C++ (Arduino IDE)
- Bibliotecas: `EmonLib`, `WiFiClientSecure`, `ArduinoJson`

**Backend & Banco de Dados**

- Node.js & Express.js
- Prisma ORM
- MongoDB Atlas
- Estatísticas matemáticas nativas (Média, Moda, Mediana, Desvio Padrão)

**Frontend & Mobile**

- React.js (Web)
- React Native & Expo (Mobile)
- Axios (Integração HTTP)
- Recharts / Chart.js (Visualização de Dados)

👥 Equipe de Desenvolvimento
[Pedro Henrique Xavier Constancio] - Backend & Banco de Dados, IoT - Ph-Xavier

[Iago Rodrigues Pinheiro] - Frontend & Mobile - iago-pinheiro

[Kaio Leandro Rissato] - Mobile & IoT - kaiorss
