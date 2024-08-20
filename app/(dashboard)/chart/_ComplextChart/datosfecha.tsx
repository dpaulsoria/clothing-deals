import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataPoint {
  fecha: string;
  valor: number;
}

interface DatosToBar {
  datasets: {
    label: string;
    data: DataPoint[];
    backgroundColor: string;
  }[];
}

const initialOptions = {
  scales: {
    x: {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        displayFormats: {
          hour: 'HH:mm' as const,
          day: 'dd/MM/yyyy' as const,
          month: 'MM/yyyy' as const,
        },
      },
      adapters: {
        date: {
          locale: es,
        },
      },
    },
    y: {
      beginAtZero: true,
    },
  },
} as const;

export default function GraficoFechas({
  datosFechas,
}: {
  datosFechas: DatosToBar | null;
}) {
  const [options, setOptions] = useState(initialOptions);

  if (!datosFechas) {
    return <div>Loading...</div>;
  }

  const handleViewChange = (unit: 'day' | 'hour' | 'month') => {
    const newOptions = JSON.parse(JSON.stringify(options));
    newOptions.scales.x.time.unit = unit;

    setOptions(newOptions);
  };

  return (
    <div>
      <h2>Iguanas Capturadas por Fecha</h2>
      <div>
        <button onClick={() => handleViewChange('hour')}>Hora</button>
        <button onClick={() => handleViewChange('day')}>Día</button>
        <button onClick={() => handleViewChange('month')}>Mes</button>
      </div>
      <Bar data={datosFechas} options={options} />
    </div>
  );
}
