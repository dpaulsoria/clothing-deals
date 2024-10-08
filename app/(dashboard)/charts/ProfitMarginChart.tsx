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
import html2canvas from 'html2canvas';
import ExportPDFModal from '@/app/(dashboard)/charts/ExportPDFModal';
import { ProfitMargin } from '@components/faker/profitMargin';

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

const profitMarginColumns = [
  { header: 'ID', key: 'id' },
  { header: 'Actual Margin (%)', key: 'actualMargin' },
  { header: 'Target Margin (%)', key: 'targetMargin' },
  { header: 'Deviation (%)', key: 'deviation' },
  { header: 'Month', key: 'month' },
  { header: 'Year', key: 'year' },
  { header: 'Created At', key: 'createdAt' },
];

const ProfitMarginChart: React.FC = () => {
  const [data, setData] = useState<ProfitMargin[]>([]);
  const [filteredData, setFilteredData] = useState<ProfitMargin[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            const parsedData = result.data.map((d) => ({
              ...d,
              actualMargin: parseFloat(d.actualMargin),
              targetMargin: parseFloat(d.targetMargin),
              deviation: parseFloat(d.deviation),
            })) as ProfitMargin[];
            setData(parsedData);
            const years = Array.from(
              new Set(parsedData.map((d) => d.year))
            ).sort();
            setAvailableYears(years);
            setFilteredData(parsedData.filter((d) => d.year === '2024'));
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

  const groupDataByMonth = (data: ProfitMargin[]): ProfitMargin[] => {
    const grouped = data.reduce(
      (acc, item) => {
        const key = `${item.month} ${item.year}`;
        if (!acc[key]) {
          acc[key] = {
            ...item,
            actualMargin: 0,
            targetMargin: 0,
            deviation: 0,
          };
        }
        acc[key].actualMargin += item.actualMargin;
        acc[key].targetMargin += item.targetMargin;
        acc[key].deviation += item.deviation;
        return acc;
      },
      {} as { [key: string]: ProfitMargin }
    );

    return Object.values(grouped);
  };

  const groupDataByQuarter = (data: ProfitMargin[]): ProfitMargin[] => {
    const grouped = data.reduce(
      (acc, item) => {
        const quarter = `Q${Math.ceil((new Date(item.createdAt).getMonth() + 1) / 3)} ${item.year}`;
        if (!acc[quarter]) {
          acc[quarter] = {
            ...item,
            month: quarter,
            actualMargin: 0,
            targetMargin: 0,
            deviation: 0,
          };
        }
        acc[quarter].actualMargin += item.actualMargin;
        acc[quarter].targetMargin += item.targetMargin;
        acc[quarter].deviation += item.deviation;
        return acc;
      },
      {} as { [key: string]: ProfitMargin }
    );

    return Object.values(grouped);
  };

  useEffect(() => {
    const filtered = data.filter((d) => d.year === selectedYear);
    const groupedData = showQuarters
      ? groupDataByQuarter(filtered)
      : groupDataByMonth(filtered);
    setFilteredData(groupedData);
  }, [selectedYear, data, showQuarters]);
  function abbreviateMonth(month: string): string {
    const monthAbbreviations: { [key: string]: string } = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };

    return monthAbbreviations[month] || month;
  }

  const chartData = {
    labels: filteredData.map((d) => abbreviateMonth(d.month)),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Margen Real (%)',
        data: filteredData.map((d) => d.actualMargin),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Margen Objetivo (%)',
        data: filteredData.map((d) => d.targetMargin),
        backgroundColor: 'rgba(255, 205, 86, 0.7)',
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Desviación (%)',
        data: filteredData.map((d) => d.deviation),
        borderColor: filteredData.map((d) =>
          d.deviation >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
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
        text: `Comparación del Margen de Beneficio y Desviación (${selectedYear})`,
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

  const handleExportImage = () => {
    const chartElement = document.getElementById('profit-margin-chart');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'profit_margin_chart.png';
        link.click();
      });
    }
  };
  // Definir las columnas a omitir
  const omittedColumns = ['id', 'createdAt'];

  return (
    <div className="container mx-auto p-6" id="profit-margin-chart">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <Chart type="bar" data={chartData} options={options} />
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <select
          className="bg-gray-200 text-gray-700 p-2 rounded"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value || null)}
        >
          <option value="">Seleccionar Año</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowQuarters(!showQuarters)}
        >
          {showQuarters ? 'Mostrar por Meses' : 'Mostrar por Trimestres'}
        </button>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Exportar a PDF
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
          onClick={handleExportImage}
        >
          Exportar como Imagen
        </button>
      </div>
      <ExportPDFModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        columns={profitMarginColumns}
        title="Profit Margin Report"
        companyName="CLOTHING DEALS"
        omittedColumns={omittedColumns} // Pasamos las columnas a omitir al modal
      />
    </div>
  );
};

export default ProfitMarginChart;
