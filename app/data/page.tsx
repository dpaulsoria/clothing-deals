'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function GraficosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Número de elementos por página

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNextPage = () => {
    if (page * limit < totalItems) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 bg-gray-100">
        Cargando estadísticas...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 bg-gray-100">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <motion.h1
          className="text-3xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gráficos Estadísticos Guardados
        </motion.h1>
      </div>
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
    </div>
  );
}
