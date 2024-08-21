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
import html2canvas from 'html2canvas';
import ExportPDFModal from './ExportPDFModal';

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
  period: string;
  averageScore: number;
}

const SatisfactionChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SatisfactionData[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                ? `Q${Math.ceil((date.getMonth() + 1) / 3)}`
                : date.toLocaleString('default', { month: 'short' });

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
              return { period: groupKey, averageScore };
            });

            setAvailableYears(Array.from(years).sort());
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

  const satisfactionColumns = [
    { header: 'Period', key: 'period' },
    { header: 'Average Score', key: 'averageScore' },
  ];

  const omittedColumns = []; // No omitir columnas en este caso

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

  const labels = data.map((d) => d.period);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Promedio de Satisfacción',
        data: data.map((d) => d.averageScore),
        backgroundColor: data.map((d) =>
          d.averageScore >= 4.2
            ? 'rgba(75, 192, 192, 0.7)'
            : d.averageScore >= 3
              ? 'rgba(255, 205, 86, 0.7)'
              : 'rgba(255, 99, 132, 0.7)'
        ),
        borderColor: data.map((d) =>
          d.averageScore >= 4.2
            ? 'rgba(75, 192, 192, 1)'
            : d.averageScore >= 3
              ? 'rgba(255, 205, 86, 1)'
              : 'rgba(255, 99, 132, 1)'
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
        text: `Promedio de Satisfacción del Usuario en ${selectedYear}`,
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
        id="user-satisfaction-chart"
        className="top-0 z-10 pb-4 flex items-center justify-center"
      >
        <Bar data={chartData} options={options} />
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <select
          className="bg-gray-200 text-gray-700 p-2 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
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
        {/*<button*/}
        {/*  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"*/}
        {/*  onClick={() => setIsModalOpen(true)}*/}
        {/*>*/}
        {/*  Exportar PDF*/}
        {/*</button>*/}
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
          onClick={handleExportImage}
        >
          Exportar como Imagen
        </button>
      </div>
      <ExportPDFModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        columns={satisfactionColumns}
        title="User Satisfaction Report"
        companyName="CLOTHING DEALS"
        omittedColumns={omittedColumns}
      />
    </div>
  );
};

export default SatisfactionChart;
