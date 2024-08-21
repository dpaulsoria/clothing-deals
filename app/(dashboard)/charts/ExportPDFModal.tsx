'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProfitMargin } from '@components/faker/profitMargin';

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfitMargin[];
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const availableMonths = Array.from(new Set(data.map((d) => d.month)));
  const availableYears = Array.from(new Set(data.map((d) => d.year)));

  const handleExportPDF = () => {
    const filteredData = data.filter(
      (item) => item.month === selectedMonth && item.year === selectedYear
    );

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('CLOTHING DEALS', 14, 22);
    doc.setFontSize(12);
    doc.text(
      `Reporte de Margen de Beneficio (${selectedMonth} ${selectedYear})`,
      14,
      32
    );

    const tableColumn = [
      'Actual Margin (%)',
      'Target Margin (%)',
      'Deviation (%)',
      'Created At',
    ];
    const tableRows: string[][] = [];

    filteredData.forEach((item) => {
      const rowData = [
        item.actualMargin.toFixed(2),
        item.targetMargin.toFixed(2),
        item.deviation.toFixed(2),
        new Date(item.createdAt).toLocaleDateString(),
      ];
      tableRows.push(rowData);
    });

    // Usar autoTable para crear la tabla en el PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save(
      `CLOTHING_DEALS_Profit_Margin_${selectedMonth}_${selectedYear}.pdf`
    );
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">
            Exportar Reporte de Margen de Beneficio
          </h2>
          <div className="mb-4">
            <label htmlFor="year-select" className="block text-gray-700">
              Año:
            </label>
            <select
              id="year-select"
              className="w-full p-2 mt-2 bg-gray-100 border border-gray-300 rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Seleccionar Año</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="month-select" className="block text-gray-700">
              Mes:
            </label>
            <select
              id="month-select"
              className="w-full p-2 mt-2 bg-gray-100 border border-gray-300 rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Seleccionar Mes</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={handleExportPDF}
            >
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ExportPDFModal;
