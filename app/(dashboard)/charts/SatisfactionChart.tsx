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

interface UserSatisfactionData {
  score: number;
  count: number;
}

interface SatisfactionChartProps {
  data: UserSatisfactionData[];
}

const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => `Score ${d.score}`),
    datasets: [
      {
        label: 'Número de Usuarios',
        data: data.map((d) => d.count),
        backgroundColor: data.map(
          (d) =>
            d.score >= 4
              ? 'rgba(75, 192, 192, 0.7)' // Verde para puntajes altos
              : d.score === 3
                ? 'rgba(255, 205, 86, 0.7)' // Amarillo para puntajes medios
                : 'rgba(255, 99, 132, 0.7)' // Rojo para puntajes bajos
        ),
        borderColor: data.map(
          (d) =>
            d.score >= 4
              ? 'rgba(75, 192, 192, 1)' // Verde para puntajes altos
              : d.score === 3
                ? 'rgba(255, 205, 86, 1)' // Amarillo para puntajes medios
                : 'rgba(255, 99, 132, 1)' // Rojo para puntajes bajos
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
        text: 'Distribución de Calificaciones de Satisfacción de Usuarios',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SatisfactionChart;
