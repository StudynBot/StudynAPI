const express = require('express');
const bodyParser = require('body-parser');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ChartDataLabels = require('chartjs-plugin-datalabels');

// Configuração básica do servidor
const app = express();
const port = 3000;

// Middleware para lidar com JSON no body das requisições
app.use(bodyParser.json());

// Endpoint para gerar gráficos
app.post('/generate-chart', async (req, res) => {
	console.log('oi');
});

// Inicializa o servidor
app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
