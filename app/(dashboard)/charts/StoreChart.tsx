'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface StoreData {
  id: string;
  name: string;
  joinedDate: string;
  marketingTechnique: string;
}

const StoreChart: React.FC = () => {
  const [data, setData] = useState<number[][]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [yLabels, setYLabels] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>('2024');
  const [showQuarters, setShowQuarters] = useState(false);
  const [originalData, setOriginalData] = useState<StoreData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/fakerData/stores.csv');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de tiendas.');
        }

        const csvData = await response.text();

        Papa.parse<StoreData>(csvData, {
          header: true,
          complete: (result) => {
            const parsedData = result.data as StoreData[];
            setOriginalData(parsedData);
            processChartData(parsedData);
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

  useEffect(() => {
    processChartData(originalData);
  }, [showQuarters, selectedYear]);

  const handleExportPDF = () => {
    const chartElement = document.getElementById('store-heatmap');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('store_satisfaction_chart.pdf');
      });
    }
  };

  const handleExportImage = () => {
    const chartElement = document.getElementById('store-heatmap');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'store_satisfaction_chart.png';
        link.click();
      });
    }
  };

  const processChartData = (storeData: StoreData[]) => {
    const filteredData = selectedYear
      ? storeData.filter(
          (item) =>
            new Date(item.joinedDate).getFullYear().toString() === selectedYear
        )
      : storeData;

    const techniques = Array.from(
      new Set(filteredData.map((item) => item.marketingTechnique))
    );
    const timeLabels = showQuarters
      ? ['Q1', 'Q2', 'Q3', 'Q4']
      : Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString('default', { month: 'short' })
        );

    const heatmapData: number[][] = techniques.map((technique) =>
      timeLabels.map(() => 0)
    );

    filteredData.forEach((item) => {
      const date = new Date(item.joinedDate);
      const timeIndex = showQuarters
        ? Math.ceil((date.getMonth() + 1) / 3) - 1
        : date.getMonth();
      const techniqueIndex = techniques.indexOf(item.marketingTechnique);

      heatmapData[techniqueIndex][timeIndex]++;
    });

    setLabels(timeLabels);
    setYLabels(techniques);
    setData(heatmapData);
  };

  return (
    <div className="container mx-auto p-6">
      <div
        id="store-heatmap"
        className="top-0 z-10 pb-4 flex items-center justify-center"
      >
        <Plot
          data={[
            {
              z: data,
              x: labels,
              y: yLabels,
              type: 'heatmap',
              colorscale: 'YlGnBu',
            },
          ]}
          layout={{
            title: `Distribución de Tiendas por Técnica de Marketing (${selectedYear})`,
            xaxis: { title: showQuarters ? 'Trimestres' : 'Meses' },
            yaxis: {
              title: 'Técnica de Marketing',
              tickfont: {
                size: 10, // Reducir tamaño de la fuente
              },
              automargin: true,
            },
            margin: {
              l: 140, // Aumentar margen izquierdo para los nombres largos
            },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <select
          className="bg-gray-200 text-gray-700 p-2 rounded"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value || null)}
        >
          <option value="">Seleccionar Año</option>
          {Array.from(
            new Set(
              originalData.map((d) =>
                new Date(d.joinedDate).getFullYear().toString()
              )
            )
          )
            .sort()
            .map((year) => (
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
          onClick={handleExportPDF}
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
    </div>
  );
};

export default StoreChart;
