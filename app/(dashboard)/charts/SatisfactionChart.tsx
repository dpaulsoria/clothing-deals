import React from 'react';
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

interface SatisfactionData {
  quarter: string;
  averageScore: number;
}

interface SatisfactionChartProps {
  data: SatisfactionData[];
}

const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ data }) => {
  // Asumimos que todas las etiquetas están en el formato "Qx YYYY" o "MMM YYYY"
  const year = data.length > 0 ? data[0].quarter.split(' ')[1] : '2024';

  // Eliminar el año de las etiquetas para evitar repeticiones
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

  return <Bar data={chartData} options={options} />;
};

export default SatisfactionChart;
