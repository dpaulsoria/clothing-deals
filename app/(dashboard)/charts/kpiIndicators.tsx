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

const KPIIndicators: React.FC = () => {
  const [profitData, setProfitData] = useState<any[]>([]);
  const [storeSatisfactionData, setStoreSatisfactionData] = useState<any[]>([]);
  const [userSatisfactionData, setUserSatisfactionData] = useState<any[]>([]);
  const [totalStores, setTotalStores] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async (
      filePath: string,
      setData: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          complete: (result) => setData(result.data),
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData('/fakerData/profit_margin.csv', setProfitData);
    fetchData('/fakerData/store_satisfaction.csv', setStoreSatisfactionData);
    fetchData('/fakerData/use_satisfaction.csv', setUserSatisfactionData);
    fetchData('/fakerData/stores.csv', (data) => setTotalStores(data.length));
    fetchData('/fakerData/users.csv', (data) => setTotalUsers(data.length));
  }, []);

  const parseNumber = (value: any) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalProfitMarginDeviation = profitData.reduce(
    (sum, item) => sum + parseNumber(item.deviation),
    0
  );
  const avgStoreSatisfaction =
    storeSatisfactionData.reduce(
      (sum, item) => sum + parseNumber(item.score),
      0
    ) / (storeSatisfactionData.length || 1);
  const avgUserSatisfaction =
    userSatisfactionData.reduce(
      (sum, item) => sum + parseNumber(item.score),
      0
    ) / (userSatisfactionData.length || 1);

  const barData = {
    labels: [
      'Profit Margin Deviation',
      'Store Satisfaction',
      'User Satisfaction',
    ],
    datasets: [
      {
        label: 'KPI Metrics',
        data: [
          totalProfitMarginDeviation,
          avgStoreSatisfaction,
          avgUserSatisfaction,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Indicadores Clave de Rendimiento (KPIs)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 border-l-4 border-green-500 shadow-md">
          <h3 className="text-lg font-semibold">Total Stores</h3>
          <p className="text-2xl">{totalStores}</p>
        </div>
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl">{totalUsers}</p>
        </div>
        <div className="p-4 bg-red-100 border-l-4 border-red-500 shadow-md">
          <h3 className="text-lg font-semibold">Profit Margin Deviation</h3>
          <p className="text-2xl">{totalProfitMarginDeviation.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-6">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 shadow-md">
          <h3 className="text-lg font-semibold">Average Store Satisfaction</h3>
          <p className="text-2xl">{avgStoreSatisfaction.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-100 border-l-4 border-purple-500 shadow-md">
          <h3 className="text-lg font-semibold">Average User Satisfaction</h3>
          <p className="text-2xl">{avgUserSatisfaction.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default KPIIndicators;
