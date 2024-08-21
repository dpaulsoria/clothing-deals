'use client';

import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  ProfitMargin,
  Store,
  StoreSatisfaction,
  User,
  UserSatisfaction,
} from './models';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface KPIIndicatorsProps {
  profitMargins: ProfitMargin[];
  storeSatisfactions: StoreSatisfaction[];
  userSatisfactions: UserSatisfaction[];
  stores: Store[];
  users: User[];
}

const KPIIndicators: React.FC<KPIIndicatorsProps> = ({
  profitMargins,
  storeSatisfactions,
  userSatisfactions,
  stores,
  users,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const availableYears = Array.from(
    new Set(profitMargins.map((item) => item.year))
  );

  const filterByYear = (items, year: string) =>
    items.filter(
      (item) =>
        item.year === year ||
        new Date(item.createdAt).getFullYear().toString() === year
    );

  // Filtrar datos por el año seleccionado
  const filteredProfitMargins = filterByYear(profitMargins, selectedYear);
  const filteredStoreSatisfactions = filterByYear(
    storeSatisfactions,
    selectedYear
  );
  const filteredUserSatisfactions = filterByYear(
    userSatisfactions,
    selectedYear
  );

  // Agrupación de datos por mes y año para profit margins
  const groupedProfitData: ProfitMargin[] = filteredProfitMargins.reduce(
    (acc, item) => {
      const monthYear = `${item.month} ${item.year}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item.deviation);
      return acc;
    },
    {} as { [key: string]: number[] }
  );

  const lineLabels: string[] = Object.keys(groupedProfitData);
  const lineDataValues: number[] = Object.values(groupedProfitData).map(
    (values) =>
      values.reduce((sum, val) => parseFloat(sum) + parseFloat(val), 0) /
      parseFloat(values.length)
  );

  // Datos para el gráfico de línea (Profit Margin Deviation a lo largo del tiempo)
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Profit Margin Deviation (%)',
        data: lineDataValues,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Desviación del Margen de Beneficio - ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calcular los promedios de satisfacción
  const avgStoreSatisfaction =
    filteredStoreSatisfactions.reduce((sum, item) => sum + item.score, 0) /
    (filteredStoreSatisfactions.length || 1);
  const avgUserSatisfaction =
    filteredUserSatisfactions.reduce((sum, item) => sum + item.score, 0) /
    (filteredUserSatisfactions.length || 1);

  // Datos para el gráfico de barras (Satisfacción de Tiendas y Usuarios)
  const barData = {
    labels: ['Store Satisfaction', 'User Satisfaction'],
    datasets: [
      {
        label: 'Average Satisfaction',
        data: [avgStoreSatisfaction, avgUserSatisfaction],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
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
        text: `Satisfacción Promedio - ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Escala Likert de 1 a 5
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2">
          Filtrar por Año:
        </label>
        <select
          id="year-select"
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 border-l-4 border-green-500 shadow-md">
          <h3 className="text-lg font-semibold">Total Stores</h3>
          <p className="text-2xl">{stores.length}</p>
        </div>
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 shadow-md">
          <h3 className="text-lg font-semibold">Average Store Satisfaction</h3>
          <p className="text-2xl">{avgStoreSatisfaction.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-100 border-l-4 border-purple-500 shadow-md">
          <h3 className="text-lg font-semibold">Average User Satisfaction</h3>
          <p className="text-2xl">{avgUserSatisfaction.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-6">
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="mb-6">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default KPIIndicators;
