'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UpFileIcon from '@components/icons/UpFileIcon';
import RasterIcon from '@/app/_components/icons/RasterIcon';
import Image from 'next/image';
import { RasterFile } from '@db/models/raster.model';
import { MapService } from '@/app/services/map.service';
import { ImageService } from '@/app/services/image.service';
import EditModal from '@components/modal/EditModal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface RasterFileWithNew extends RasterFile {
  isNew?: boolean;
}

export default function SubirRasters() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRaster, setSelectedRaster] = useState<RasterFile | null>(null);
  const [rasters, setRasters] = useState<RasterFileWithNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [thumbnailSrcs, setThumbnailSrcs] = useState<{ [key: string]: string }>(
    {}
  );
  const limit = 10; // Número de elementos por página

  const user_id = JSON.parse(sessionStorage.getItem('user') || '{}').id;

  useEffect(() => {
    fetchRasters();
  }, [page]);

  useEffect(() => {
    rasters.forEach((raster) => {
      const thumbnailSrc = ImageService.getThumbnail(raster.file_path);
      setThumbnailSrcs((prevSrcs) => ({
        ...prevSrcs,
        [raster.file_path]: thumbnailSrc,
      }));
    });
  }, [rasters]);

  const handleCardClick = (raster: React.SetStateAction<RasterFile>) => {
    setSelectedRaster(raster);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRaster(null);
  };

  const handleEditRaster = async (name: string, description: string) => {
    selectedRaster.file_name = name;
    selectedRaster.description = description;
    const response: Partial<RasterFile> =
      await MapService.updateRaster(selectedRaster);
    if (response) {
      console.log(`Update successfully`, response);
      handleCloseModal();
      await fetchRasters();
    } else {
      // Poner Toasty de Fail
    }
  };

  const fetchRasters = async () => {
    try {
      setLoading(true);
      const response = (await MapService.getRastersWithPagination(
        page,
        limit
      )) as unknown as { result: RasterFile[]; extra: string };
      if (response) {
        setRasters(response.result);
        setTotalItems(
          parseInt(JSON.parse(response.extra).totalItems || '10', 10)
        );
      } else {
        setError('Error al obtener los rasters');
      }
    } catch (error) {
      console.error('Error al obtener los rasters:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user_id); // Obtiene el ID de usuario desde sessionStorage

    try {
      const response = await MapService.saveRaster(formData);
      if (response) {
        const newRaster: RasterFileWithNew = {
          ...response,
          isNew: true,
        };
        setRasters((prevRasters) => [newRaster, ...prevRasters]);
      } else {
        setError('Error al subir el raster');
      }
    } catch (error) {
      console.error('Error al subir el raster:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleNextPage = () => {
    if (page * limit < totalItems) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleImageError = (filePath: string) => {
    setThumbnailSrcs((prevSrcs) => ({
      ...prevSrcs,
      [filePath]: '/loading.png', // Reemplaza con la ruta de tu imagen por defecto
    }));
  };

  const totalPages = Math.ceil(totalItems / limit);

  if (loading) return <div>Cargando rasters...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 p-4 flex flex-col">
      <div className="sticky top-0  z-10 pb-4 flex items-center justify-between">
        <motion.h1
          className="text-3xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Visualización de Rasters
        </motion.h1>
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center"
        >
          <UpFileIcon className="mr-2 fill-white w-5" />
          Subir Nuevo Raster
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      {rasters.length === 0 ? (
        <div className="text-center text-gray-600">
          No hay rasters disponibles.
        </div>
      ) : (
        <div className="grid auto-rows-max grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
          {rasters.map((raster) => (
            <motion.div
              key={raster.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-full bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={() => handleCardClick(raster)}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={thumbnailSrcs[raster.file_path] || '/loading.png'}
                  alt={raster.file_name}
                  quality={75}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority
                  onError={() => handleImageError(raster.file_path)}
                />
                {raster.is_global && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Global
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                  {raster.file_name}
                </h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <RasterIcon className="mr-2 fill-gray-700 w-5" />
                  <span>{raster.description}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft className="mr-2" /> Anterior
        </button>
        <span className="text-gray-600">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente <FaArrowRight className="ml-2" />
        </button>
      </div>

      {selectedRaster && (
        <EditModal
          title={'Editar Raster'}
          item={selectedRaster}
          onSave={handleEditRaster}
          show={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
