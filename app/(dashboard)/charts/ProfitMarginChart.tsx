'use client';

import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
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
import { ProfitMargin } from '@components/faker/profitMargin';

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

interface ProfitMarginChartProps {
  data: ProfitMargin[];
  showQuarters: boolean; // Propiedad para controlar la visualización por trimestre o mes
}

const ProfitMarginChart: React.FC<ProfitMarginChartProps> = ({
  data,
  showQuarters,
}) => {
  const groupedData = data.reduce<{ [key: string]: ProfitMargin[] }>(
    (acc, item) => {
      const groupKey = showQuarters
        ? item.quarter
        : new Date(item.createdAt).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          });

      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);

      return acc;
    },
    {}
  );

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Margen Real (%)',
        data: Object.keys(groupedData).map(
          (key) =>
            groupedData[key].reduce((sum, item) => sum + item.actualMargin, 0) /
            groupedData[key].length
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Margen Objetivo (%)',
        data: Object.keys(groupedData).map(
          (key) =>
            groupedData[key].reduce((sum, item) => sum + item.targetMargin, 0) /
            groupedData[key].length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'Desviación (%)',
        data: Object.keys(groupedData).map(
          (key) =>
            groupedData[key].reduce((sum, item) => sum + item.deviation, 0) /
            groupedData[key].length
        ),
        borderColor: Object.keys(groupedData).map((key) =>
          groupedData[key].reduce((sum, item) => sum + item.deviation, 0) /
            groupedData[key].length >=
          0
            ? 'rgba(75, 192, 192, 1)'
            : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 2,
        fill: false,
        yAxisID: 'y2',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparación de Margen de Beneficio y Desviación',
      },
    },
    scales: {
      y1: {
        beginAtZero: true,
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Margen de Beneficio (%)',
        },
      },
      y2: {
        beginAtZero: true,
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false, // Solo dibuja la cuadrícula en y1
        },
        title: {
          display: true,
          text: 'Desviación (%)',
        },
      },
    },
  };

  return <Chart type="bar" data={chartData} options={options} />;
};

export default ProfitMarginChart;
