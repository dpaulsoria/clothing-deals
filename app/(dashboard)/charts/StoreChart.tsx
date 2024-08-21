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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface StoreData {
  storeId: string;
  marketingTechnique: string;
  createdAt: string;
}

const StoreChart: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: number }>({});
  const [showQuarters, setShowQuarters] = useState(false);

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
            const storeData = result.data;

            // Agrupación de datos por marketingTechnique y trimestre/mes
            const groupedData: { [key: string]: number } = {};

            storeData.forEach((item) => {
              const date = new Date(item.createdAt);
              const groupKey = showQuarters
                ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
                : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

              const key = `${item.marketingTechnique} (${groupKey})`;

              if (!groupedData[key]) groupedData[key] = 0;
              groupedData[key]++;
            });

            setData(groupedData);
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
  }, [showQuarters]);

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
    <div>
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

export default StoreChart;
