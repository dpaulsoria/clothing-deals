'use client';

import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StoreSatisfactionData {
  aspect: string;
  score: number;
  createdAt: string;
}

interface RadarChartData {
  aspect: string;
  averageScore: number;
}

const StoreSatisfactionChart: React.FC = () => {
  const [data, setData] = useState<RadarChartData[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  useEffect(() => {
    const fetchStoreSatisfactionData = async () => {
      try {
        const response = await fetch('/fakerData/store_satisfaction.csv');
        if (!response.ok) {
          throw new Error(
            'No se pudo cargar el archivo de satisfacción de tiendas.'
          );
        }

        const csvData = await response.text();

        Papa.parse<StoreSatisfactionData>(csvData, {
          header: true,
          complete: (result) => {
            const satisfactionData = result.data;

            const groupedData: { [key: string]: number[] } = {};
            satisfactionData.forEach((item) => {
              if (!groupedData[item.aspect]) {
                groupedData[item.aspect] = [];
              }
              groupedData[item.aspect].push(item.score);
            });

            const averagedData: RadarChartData[] = Object.keys(groupedData).map(
              (aspect) => {
                const scores = groupedData[aspect];
                const totalScores = scores.length;
                const averageScore =
                  totalScores > 0
                    ? scores.reduce((sum, score) => sum + score, 0) /
                      totalScores
                    : 0;

                return { aspect, averageScore };
              }
            );

            const trend = averagedData.map((data) => data.averageScore);
            setTrendData(trend);

            setData(averagedData);
          },
          error: () => {
            console.error('No se pudo leer el archivo CSV.');
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    fetchStoreSatisfactionData();
  }, []);

  const chartData = {
    labels: data.map((d) => d.aspect),
    datasets: [
      {
        label: 'Satisfacción Promedio por Aspecto',
        data: data.map((d) => d.averageScore),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: data.map(
          (d) =>
            d.averageScore >= 4
              ? 'rgba(75, 192, 192, 1)' // Verde
              : d.averageScore >= 3
                ? 'rgba(255, 205, 86, 1)' // Amarillo
                : 'rgba(255, 99, 132, 1)' // Rojo
        ),
      },
      {
        label: 'Tendencia General',
        data: trendData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
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
        text: 'Satisfacción de Tiendas de Ropa con el Servicio',
      },
    },
    scales: {
      r: {
        ticks: {
          beginAtZero: true,
          max: 5,
        },
      },
    },
  };

  return <Radar data={chartData} options={options as any} />;
};

export default StoreSatisfactionChart;
