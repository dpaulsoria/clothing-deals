import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitMarginData {
  quarter: string;
  realMargin: number;
  targetMargin: number;
  deviation: number; // Positivo o negativo
}

interface ProfitMarginChartProps {
  data: ProfitMarginData[];
}

const ProfitMarginChart: React.FC<ProfitMarginChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.quarter),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Margen Real (%)',
        data: data.map((d) => d.realMargin),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Margen Objetivo (%)',
        data: data.map((d) => d.targetMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'Desviación (%)',
        data: data.map((d) => d.deviation),
        borderColor: data.map((d) =>
          d.deviation >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
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

  return <Bar data={chartData} options={options} />;
};

export default ProfitMarginChart;
