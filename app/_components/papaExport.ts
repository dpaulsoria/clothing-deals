import * as Papa from 'papaparse';

export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);

  // Crear un Blob a partir de los datos CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Crear un enlace para descargar el archivo
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
