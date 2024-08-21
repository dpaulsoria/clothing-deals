'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

export interface StoreData {
  id: string;
  name: string;
  joinedDate: string;
  marketingTechnique: string;
}

const StoreChart: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: number }>({});
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<StoreData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/fakerData/stores.csv');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de tiendas.');
        }

        const csvData = await response.text();

        Papa.parse<StoreData>(csvData, {
          header: true,
          complete: (result) => {
            setOriginalData(result.data);
            processChartData(result.data);
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
    processChartData(originalData);
  }, [showQuarters, selectedYear]);

  const processChartData = (storeData: StoreData[]) => {
    const filteredData = selectedYear
      ? storeData.filter((item) => item.joinedDate.includes(selectedYear))
      : storeData;

    const groupedData: { [key: string]: number } = {};

    filteredData.forEach((item) => {
      const date = new Date(item.joinedDate);
      const groupKey = showQuarters
        ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
        : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      const key = `${item.marketingTechnique} (${groupKey})`;

      if (!groupedData[key]) groupedData[key] = 0;
      groupedData[key]++;
    });

    setData(groupedData);
  };

  const handleExportPDF = () => {
    const chartElement = document.getElementById('store-chart');
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

        pdf.save('store_chart.pdf');
      });
    }
  };

  const handleExportImage = () => {
    const chartElement = document.getElementById('store-chart');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'store_chart.png';
        link.click();
      });
    }
  };

  const years = Array.from(
    new Set(
      originalData.map((d) => new Date(d.joinedDate).getFullYear().toString())
    )
  ).sort();

  const labels = Object.keys(data);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Nuevas Tiendas Asociadas',
        data: Object.values(data),
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Azul para las barras
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Nuevas Tiendas Asociadas por Técnica de Marketing`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Tiendas',
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6" id="store-chart">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <Bar data={chartData} options={options} />
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

export default StoreChart;
