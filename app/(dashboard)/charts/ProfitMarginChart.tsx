'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface ProfitMargin {
  quarter: string;
  actualMargin: number;
  targetMargin: number;
  deviation: number;
}

const ProfitMarginChart: React.FC = () => {
  const [data, setData] = useState<ProfitMargin[]>([]);
  const [filteredData, setFilteredData] = useState<ProfitMargin[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/fakerData/profit_margins.csv');
        if (!response.ok) {
          throw new Error(
            'No se pudo cargar el archivo de márgenes de beneficio.'
          );
        }

        const csvData = await response.text();

        Papa.parse<ProfitMargin>(csvData, {
          header: true,
          complete: (result) => {
            setData(result.data);
            setFilteredData(result.data);
          },
          error: (error) => {
            console.error('Error al leer el archivo CSV:', error.message);
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const filtered = data.filter((d) => d.quarter.includes(selectedYear));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [selectedYear, data]);

  const chartData = {
    labels: filteredData.map((d) => d.quarter),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Margen Real (%)',
        data: filteredData.map((d) => d.actualMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Verde claro para las barras del margen real
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Margen Objetivo (%)',
        data: filteredData.map((d) => d.targetMargin),
        backgroundColor: 'rgba(255, 205, 86, 0.7)', // Amarillo para las barras del margen objetivo
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Desviación (%)',
        data: filteredData.map((d) => d.deviation),
        borderColor: filteredData.map((d) =>
          d.deviation >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ), // Verde para desviación positiva, rojo para negativa
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparación del Margen de Beneficio y Desviación',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Margen (%)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Desviación (%)',
        },
      },
    },
  };

  const handleExportPDF = () => {
    const chartElement = document.getElementById('profit-margin-chart');
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

        pdf.save('profit_margin_chart.pdf');
      });
    }
  };

  const handleExportImage = () => {
    const chartElement = document.getElementById('profit-margin-chart');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'profit_margin_chart.png';
        link.click();
      });
    }
  };

  const years = Array.from(
    new Set(data.map((d) => d.quarter.split(' ')[1]))
  ).sort();

  return (
    <div className="container mx-auto p-6" id="profit-margin-chart">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <Chart type="bar" data={chartData} options={options} />
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <select
          className="bg-gray-200 text-gray-700 p-2 rounded"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value || null)}
        >
          <option value="">Seleccionar Año</option>
          {years.map((year) => (
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

export default ProfitMarginChart;
