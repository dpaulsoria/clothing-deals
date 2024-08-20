'use client';
import React, { useState } from 'react';

import { AllFeatures } from '@interface/feature';
import {
  emptyFeatures,
  isValidShapefile,
  processFiles,
} from '@repository/features.util';

export default function Pagcopy() {
  const [shapefiles, setShapefiles] = useState<FileList | null>(null);
  const [features, setFeatures] = useState<AllFeatures>(emptyFeatures);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string>('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    setFeatures(emptyFeatures); // Limpiar las características anteriores

    if (selectedFiles) {
      if (!isValidShapefile(selectedFiles)) {
        setUploadStatus(
          'Solo se permiten archivos con extensiones .shp, .shx o .tif'
        );
        setShapefiles(null);
      } else {
        setShapefiles(selectedFiles);
        const allFeatures = await processFiles(
          selectedFiles,
          Number(workspaceId)
        );
        setFeatures(allFeatures);
      }
    } else {
      setShapefiles(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!shapefiles || !workspaceId) {
      setUploadStatus(
        'No se han seleccionado archivos o falta el Workspace ID'
      );
      return;
    }

    try {
      features.workspaceId = workspaceId;
      const requestBody = {
        features,
        user_id: 1,
      };

      console.log('Request Body', requestBody);

      setUploadStatus('Subiendo archivos...');
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setUploadStatus('Archivos subidos exitosamente');
        // Lógica adicional si se necesita, por ejemplo, actualizar el estado global o contexto
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error al subir archivos: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setUploadStatus('Error al subir archivos');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subir Archivos Shapefile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="shapefiles"
            className="block text-sm font-medium text-gray-700"
          >
            Shape files
          </label>
          <input
            type="file"
            name="shapefiles"
            id="shapefiles"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="workspaceId"
            className="block text-sm font-medium text-gray-700"
          >
            Workspace ID
          </label>
          <input
            type="text"
            name="workspaceId"
            id="workspaceId"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            placeholder="Workspace ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Subir
          </button>
        </div>
      </form>
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Características del Shapefile</h2>
        <pre className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          {JSON.stringify(features, null, 2)}
        </pre>
      </div>
    </div>
  );
}
