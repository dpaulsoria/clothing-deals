'use client';

import React, { useEffect, useState } from 'react';

import { MapService } from '@/app/services/map.service';
import { LayersModal } from './layerModal';
import { FaTrashAlt, FaUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CanvasMap from './canvasMap';
import SubirShapefile from '@/app/(dashboard)/archivos/layers/subirShapefileComponent';
import { Workspace } from '@db/models/workspace.model';

export default function Layers() {
  const [shapefiles, setShapefiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShapefileIndex, setSelectedShapefileIndex] = useState(null);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem('user') || '{}')
  );

  useEffect(() => {
    if (user && user.id) {
      fetchLayers(user.id);
      fetchWorkspaces(user.id);
    }
  }, [user]);

  const fetchLayers = async (userId) => {
    const layers = await MapService.getShapefileByUserId(userId);
    setShapefiles(layers);
  };

  const fetchWorkspaces = async (userId) => {
    const workspaces = await MapService.getAllWorkspacesByUserId(userId);
    setWorkspaces(workspaces);
    console.log('Workspaces:', workspaces);
  };

  const handleUpload = () => {
    setIsModalUploadOpen(true);
  };
  const handleDeleteShapefile = (id) => {
    MapService.deleteShapefile(id);
    setShapefiles(shapefiles.filter((shapefile) => shapefile.id !== id));
  };

  const openModal = (index) => {
    setSelectedShapefileIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShapefileIndex(null);
  };
  return (
    <>
      {isModalUploadOpen && (
        <SubirShapefile
          onClose={() => setIsModalUploadOpen(false)}
          workspace={workspaces}
        />
      )}
      <div className="container mx-auto p-6">
        <div className="sticky top-0  z-10 pb-4 flex items-center justify-between">
          <div className="flex-grow flex justify-center">
            <motion.h1
              className="text-3xl font-bold text-indigo-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Visualización de Shapefiles
            </motion.h1>
          </div>
          <div className="flex items-center">
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center"
              onClick={handleUpload}
            >
              <FaUpload className="mr-2" /> Subir Nuevo Shapefile
            </button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {shapefiles.map((shapefile, index) => (
            <motion.div
              key={shapefile.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                  {shapefile.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Creado: {shapefile.created_at?.split('T')[0]}
                </p>
                <p className="text-gray-500 text-sm">
                  Actualizado: {shapefile.updated_at?.split('T')[0]}
                </p>
              </div>
              <div className="mb-4">
                <CanvasMap data={shapefile} />
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <button
                  className="text-red-500 hover:text-red-700 transition"
                  onClick={() => handleDeleteShapefile(shapefile.id)}
                >
                  <FaTrashAlt size={20} />
                </button>
                <button
                  className="text-indigo-600 hover:text-indigo-800 transition"
                  onClick={() => openModal(index)}
                >
                  Detalles
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {isModalOpen && selectedShapefileIndex !== null && (
          <LayersModal
            isOpen={isModalOpen}
            // Se cambio onClose por closeModal
            closeModal={closeModal}
            shapefile={shapefiles[selectedShapefileIndex]}
          />
        )}
      </div>
    </>
  );
}
