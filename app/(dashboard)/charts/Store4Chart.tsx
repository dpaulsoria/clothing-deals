'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StoreData {
  period: string;
  marketingTechnique: string;
  newStores: number;
}

const Store4Chart: React.FC = () => {
  const [data, setData] = useState<StoreData[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/fakerData/stores.csv');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de datos.');
        }

        const csvData = await response.text();

        Papa.parse<StoreData>(csvData, {
          header: true,
          complete: (result) => {
            setData(result.data);
          },
          error: (error) => {
            console.error('Error al parsear CSV:', error);
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchData();
  }, []);

  const groupedData = data.reduce<{ [key: string]: number }>((acc, item) => {
    const date = new Date(item.period);
    const groupKey = showQuarters
      ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
      : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    if (!acc[groupKey]) {
      acc[groupKey] = 0;
    }
    acc[groupKey] += item.newStores;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Nuevas Tiendas Asociadas',
        data: Object.values(groupedData),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
        text: 'Nuevas Tiendas Asociadas por Técnica de Marketing',
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowQuarters(!showQuarters)}
        >
          {showQuarters ? 'Mostrar por Meses' : 'Mostrar por Trimestres'}
        </button>
      </div>
    </div>
  );
};

export default Store4Chart;
