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
	const { studyData, labels } = req.body;

	if (!studyData || !labels || studyData.length !== labels.length) {
		return res.status(400).json({ error: 'Os dados e rótulos devem ser fornecidos corretamente e ter o mesmo tamanho.' });
	}

	const width = 680;
	const height = 480;

	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

	const configuration = {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Horas Estudadas',
					data: studyData,
					backgroundColor: 'rgba(14, 128, 216, 0.8)',
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 2,
				},
			],
		},
		options: {
			scales: {
				x: {
					title: {
						display: true,
						text: 'Dias',
						font: {
							size: 14,
						},
					},
					ticks: {
						font: {
							size: 14,
						},
						color: 'rgba(0, 0, 0, 0.8)',
						autoSkip: true,
						maxRotation: 45,
						minRotation: 45,
					},
				},
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Horas',
						font: {
							size: 14,
						},
					},
				},
			},
			plugins: {
				datalabels: {
					anchor: 'end',
					align: 'top',
					font: {
						size: 12,
						weight: 'bold',
					},
					color: 'black',
					formatter: (value) => (value > 0 ? value : ''),
				},
			},
		},
		plugins: [
			ChartDataLabels,
			{
				id: 'background_color',
				beforeDraw: (chart) => {
					const ctx = chart.canvas.getContext('2d');
					ctx.save();
					ctx.fillStyle = 'white';
					ctx.fillRect(0, 0, chart.width, chart.height);
					ctx.restore();
				},
			},
		],
	};

	try {
		const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

		// Configurar o cabeçalho da resposta para retornar a imagem
		res.setHeader('Content-Type', 'image/png');
		res.send(imageBuffer);
	} catch (error) {
		console.error('Erro ao gerar o gráfico:', error);
		res.status(500).json({ error: 'Erro ao gerar o gráfico.' });
	}
});

// Inicializa o servidor
app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
