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

  const chartData = {
    labels: data.map((d) => d.quarter),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Margen Real (%)',
        data: data.map((d) => d.actualMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Verde claro para las barras del margen real
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Margen Objetivo (%)',
        data: data.map((d) => d.targetMargin),
        backgroundColor: 'rgba(255, 205, 86, 0.7)', // Amarillo para las barras del margen objetivo
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Desviación (%)',
        data: data.map((d) => d.deviation),
        borderColor: data.map((d) =>
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

  return <Chart type="bar" data={chartData} options={options} />;
};

export default ProfitMarginChart;
