'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportPDFModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: { header: string; key: string }[];
  title: string;
  companyName?: string;
  omittedColumns?: string[]; // Prop para definir columnas a omitir
}

const ExportPDFModal = <T,>({
  isOpen,
  onClose,
  data,
  columns,
  title,
  companyName = 'CLOTHING DEALS',
  omittedColumns = [],
}: ExportPDFModalProps<T>) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const availableMonths = Array.from(
    new Set(data.map((d) => d['month' as keyof T] as string))
  );
  const availableYears = Array.from(
    new Set(data.map((d) => d['year' as keyof T] as string))
  );

  const handleExportPDF = () => {
    const filteredData = data.filter(
      (item) =>
        (item['month' as keyof T] as string) === selectedMonth &&
        (item['year' as keyof T] as string) === selectedYear
    );

    // Filtrar las columnas que no están en omittedColumns
    const filteredColumns = columns.filter(
      (col) => !omittedColumns.includes(col.key as string)
    );

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(companyName, 14, 22);
    doc.setFontSize(12);
    doc.text(`${title} (${selectedMonth} ${selectedYear})`, 14, 32);

    const tableRows: string[][] = filteredData.map((item) =>
      filteredColumns.map((col) => String(item[col.key]))
    );

    (doc as any).autoTable({
      head: [filteredColumns.map((col) => col.header)],
      body: tableRows,
      startY: 40,
    });

    doc.save(
      `${companyName.replace(/\s+/g, '_')}_${title.replace(/\s+/g, '_')}_${selectedMonth}_${selectedYear}.pdf`
    );
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">{`Exportar ${title}`}</h2>
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
