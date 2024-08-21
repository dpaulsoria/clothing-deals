'use client';

import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StoreSatisfactionData {
  aspect: string;
  score: number;
  createdAt: string;
}

interface RadarChartData {
  aspect: string;
  averageScore: number;
}

const StoreSatisfactionChart: React.FC = () => {
  const [data, setData] = useState<RadarChartData[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>('2024');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);

  useEffect(() => {
    const fetchStoreSatisfactionData = async () => {
      try {
        const response = await fetch('/fakerData/store_satisfaction.csv');
        if (!response.ok) {
          throw new Error(
            'No se pudo cargar el archivo de satisfacción de tiendas.'
          );
        }

        const csvData = await response.text();

        Papa.parse<StoreSatisfactionData>(csvData, {
          header: true,
          complete: (result) => {
            const satisfactionData = result.data;

            const groupedData: { [key: string]: number[] } = {};
            const years: Set<string> = new Set();

            satisfactionData.forEach((item) => {
              const date = new Date(item.createdAt);
              const year = date.getFullYear().toString();
              years.add(year);

              const groupKey = showQuarters
                ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${year}`
                : `${date.toLocaleString('default', { month: 'short' })} ${year}`;

              if (!groupedData[item.aspect]) {
                groupedData[item.aspect] = [];
              }
              groupedData[item.aspect].push(Number(item.score));
            });

            const filteredData = selectedYear
              ? Object.keys(groupedData)
                  .filter((key) => key.includes(selectedYear))
                  .reduce(
                    (acc, key) => {
                      acc[key] = groupedData[key];
                      return acc;
                    },
                    {} as { [key: string]: number[] }
                  )
              : groupedData;

            const averagedData: RadarChartData[] = Object.keys(
              filteredData
            ).map((aspect) => {
              const scores = filteredData[aspect];
              const totalScores = scores.length;
              const averageScore =
                totalScores > 0
                  ? scores.reduce((sum, score) => sum + score, 0) / totalScores
                  : 0;

              return { aspect, averageScore };
            });

            const trend = averagedData.map((data) => data.averageScore);
            setTrendData(trend);
            setData(averagedData);
            setAvailableYears(Array.from(years));
          },
          error: () => {
            console.error('No se pudo leer el archivo CSV.');
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchStoreSatisfactionData();
  }, [selectedYear, showQuarters]);

  const handleExportPDF = () => {
    const chartElement = document.getElementById('store-satisfaction-chart');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('store_satisfaction_chart.pdf');
      });
    }
  };

  const handleExportImage = () => {
    const chartElement = document.getElementById('store-satisfaction-chart');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'store_satisfaction_chart.png';
        link.click();
      });
    }
  };

  const chartData = {
    labels: data.map((d) => d.aspect),
    datasets: [
      {
        label: 'Satisfacción Promedio por Aspecto',
        data: data.map((d) => d.averageScore),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: data.map(
          (d) =>
            d.averageScore >= 4
              ? 'rgba(75, 192, 192, 1)' // Verde
              : d.averageScore >= 3
                ? 'rgba(255, 205, 86, 1)' // Amarillo
                : 'rgba(255, 99, 132, 1)' // Rojo
        ),
      },
      {
        label: 'Tendencia General',
        data: trendData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Satisfacción de Tiendas de Ropa con el Servicio',
      },
    },
    scales: {
      r: {
        ticks: {
          beginAtZero: true,
          max: 5,
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };
  return (
    <div className="container mx-auto p-6" id="store-satisfaction-chart">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <Radar data={chartData} options={options} />
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <select
          className="bg-gray-200 text-gray-700 p-2 rounded"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value || null)}
        >
          <option value="">Seleccionar Año</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowQuarters(!showQuarters)}
        >
          {showQuarters ? 'Mostrar por Meses' : 'Mostrar por Trimestres'}
        </button>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={handleExportPDF}
        >
          Exportar a PDF
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
          onClick={handleExportImage}
        >
          Exportar como Imagen
        </button>
      </div>
    </div>
  );
};

export default StoreSatisfactionChart;
