'use client';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Workspace } from '@db/models/workspace.model';
import { MapService } from '@/app/services/map.service';
import { Shapefile } from '@db/models/shapefile.model';

type SubirShapefileProps = {
  onClose: () => void;
  workspace: Workspace[];
};

export default function SubirShapefile({
  onClose,
  workspace,
}: SubirShapefileProps) {
  const [geojsonFile, setGeojsonFile] = useState(null);
  const [workspaceId, setWorkspaceId] = useState('');
  const [fileName, setFileName] = useState(''); // Nuevo estado para el nombre del archivo
  const id_user = JSON.parse(sessionStorage.getItem('user'))?.id || '';

  const onUpload = (
    geojsonFile: any,
    workspaceId: string,
    fileName: string
  ) => {
    const shp: Shapefile = {
      name: fileName || geojsonFile.name, // Usa el nombre proporcionado o el del archivo
      geometry: geojsonFile.geometry,
      workspace_ids: [workspaceId],
      properties: geojsonFile.properties,
      user_id: id_user,
      is_global: false,
    };
    console.log('geojsonFile', geojsonFile);
    console.log('workspaceId', workspaceId);
    console.log('fileName', fileName);
    MapService.saveShapefile(shp);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1];

      if (fileExtension === 'geojson') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const info = event.target.result.toString();
          setGeojsonFile(JSON.parse(info));
        };
        reader.readAsText(file);
      } else {
        alert('Por favor, sube un archivo .geojson válido.');
      }
    }
  };

  const handleUpload = () => {
    if (geojsonFile && workspaceId) {
      onUpload(geojsonFile, workspaceId, fileName);
      onClose(); // Cerrar el modal después de la carga
    } else {
      alert(
        'Selecciona un archivo .geojson válido, un Workspace y un nombre de archivo.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Subir Shapefile</h2>
          <FaTimes
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition"
            onClick={onClose}
          />
        </div>
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-gray-700 font-medium mb-2">
            Selecciona un archivo .geojson
          </label>
          <input
            type="file"
            accept=".geojson"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-gray-700 font-medium mb-2">
            Nombre del archivo
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Introduce un nombre para el archivo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="block text-gray-700 font-medium mb-2">
            Selecciona un Workspace
          </label>
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="" disabled>
              Selecciona un Workspace
            </option>
            {workspace.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );
}
