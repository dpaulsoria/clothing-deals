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

interface UserSatisfactionData {
  createdAt: string;
  score: string;
}

interface SatisfactionData {
  quarter: string;
  averageScore: number;
}

const SatisfactionChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SatisfactionData[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>('2024');
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/fakerData/user_satisfaction.csv');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de satisfacción.');
        }

        const csvData = await response.text();

        Papa.parse<UserSatisfactionData>(csvData, {
          header: true,
          complete: (result) => {
            const satisfactionData = result.data;

            const groupedData: { [key: string]: number[] } = {};
            const years: Set<string> = new Set();

            satisfactionData.forEach((item) => {
              const date = new Date(item.createdAt);
              const year = date.getFullYear().toString();
              years.add(year);

              if (year !== selectedYear) return;

              const groupKey = showQuarters
                ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${year}`
                : `${date.toLocaleString('default', { month: 'short' })} ${year}`;

              if (!groupedData[groupKey]) groupedData[groupKey] = [];
              groupedData[groupKey].push(Number(item.score));
            });

            const averagedData: SatisfactionData[] = Object.keys(
              groupedData
            ).map((groupKey) => {
              const scores = groupedData[groupKey];
              const totalScores = scores.length;
              const averageScore =
                totalScores > 0
                  ? scores.reduce((sum, score) => sum + score, 0) / totalScores
                  : 0;
              return { quarter: groupKey, averageScore };
            });

            setAvailableYears(Array.from(years));
            setData(averagedData);
            setLoading(false);
          },
          error: () => {
            setError('No se pudo leer el archivo CSV.');
            setLoading(false);
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
        setError('No se pudo cargar el archivo de satisfacción.');
        setLoading(false);
      }
    };

    fetchData();
  }, [showQuarters, selectedYear]);

  const handleExportPDF = () => {
    const input = document.getElementById('user-satisfaction-chart');
    if (input) {
      html2canvas(input).then((canvas) => {
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

        pdf.save('user_satisfaction_chart.pdf');
      });
    }
  };

  const handleExportImage = () => {
    const input = document.getElementById('user-satisfaction-chart');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'user_satisfaction_chart.png';
        link.click();
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 bg-gray-100">
        Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 bg-gray-100">
        Error: {error}
      </div>
    );
  }

  const year = data.length > 0 ? data[0].quarter.split(' ')[1] : '2024';
  const labels = data.map((d) => d.quarter.split(' ')[0]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Promedio de Satisfacción',
        data: data.map((d) => d.averageScore),
        backgroundColor: data.map(
          (d) =>
            d.averageScore >= 4.2
              ? 'rgba(75, 192, 192, 0.7)' // Verde
              : d.averageScore >= 3
                ? 'rgba(255, 205, 86, 0.7)' // Amarillo
                : 'rgba(255, 99, 132, 0.7)' // Rojo
        ),
        borderColor: data.map(
          (d) =>
            d.averageScore >= 4.2
              ? 'rgba(75, 192, 192, 1)' // Verde
              : d.averageScore >= 3
                ? 'rgba(255, 205, 86, 1)' // Amarillo
                : 'rgba(255, 99, 132, 1)' // Rojo
        ),
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
        text: `Promedio de Satisfacción del Usuario en ${year}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <div
        className="top-0 z-10 pb-4 flex items-center justify-center"
        id="user-satisfaction-chart"
      >
        <Bar data={chartData} options={options} />
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
      <div className="flex justify-center mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2"
          onClick={handleExportPDF}
        >
          Exportar como PDF
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

export default SatisfactionChart;
