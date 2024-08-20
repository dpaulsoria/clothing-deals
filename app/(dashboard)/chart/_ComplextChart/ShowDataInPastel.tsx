import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


interface ChartProps {
  name: string;
  data: {
    labels: string[];
    datasets: [{
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    }]
  }
}
export default function ShowDataInPastel({ data, name }: ChartProps) {
  if (!data) {
    return <div>Cargando...</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const totalIguanas = data.datasets[0].data.reduce((acc, count) => acc + count, 0);

  return (
    <div className="bg-gray-200 rounded-xl p-4 text-gray-900 h-full flex items-center ">

      <div className="flex items-center justify-between w-full ">

        <div className="p-5 flex flex-col w-3/5 xl:w-3/6 ">
          <div className="text-gray-800 text-xl">
            <p>{name}</p>
          </div>
          <Pie data={data} options={options} />
        </div>
        <div className="w-2/5   p-4 ">
          <div className="text-sm opacity-70">Total de Iguanas</div>
          <div className="text-3xl font-bold mb-2">{totalIguanas}</div>
          <div className="text-sm opacity-70">desglose</div>
          {data.labels.map((label, index) => (
            <div key={label} className="mt-2">
              <div className="flex justify-between">
                <span
                  className="flex items-center"
                  style={{ color: data.datasets[0].backgroundColor[index] }}
                >
                  <span
                    className="w-3 h-3 mr-2 inline-block"
                    style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                  ></span>
                  {label}
                </span>
                <span>{data.datasets[0].data[index]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}