import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ShowDataInPastelProps<V extends string> = {
  dataIguana: [V, number][];
  name: string;
};

export default function SimpleDateComponent({
  capturasPorDia,
}): React.JSX.Element {
  const fechas = Object.keys(capturasPorDia).sort();
  const cantidades = fechas.map((fecha) => capturasPorDia[fecha]);

  const data = {
    labels: fechas,
    datasets: [
      {
        label: 'Número de Capturas',
        data: cantidades,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
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
        text: 'Capturas de Iguanas por Día',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Número de Capturas',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}
