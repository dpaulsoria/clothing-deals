'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapService } from '@/app/services/map.service';
import { motion } from 'framer-motion';
import { FaChartBar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function GraficosPage() {
  // const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedStatistic, setSelectedStatistic] = useState<Statistics | null>(
  //   null
  // );
  const [newName, setNewName] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Número de elementos por página

  const user_id = JSON.parse(sessionStorage.getItem('user') || '{}').id;

  // const fetchStatistics = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = (await MapService.getAllStatisticsByUserId(
  //       user_id,
  //       page,
  //       limit
  //     )) as unknown as { result: Statistics[]; extra: number };
  //     if (response) {
  //       setStatistics(response.result);
  //       setTotalItems(response.extra);
  //     } else {
  //       setError('Error al obtener las estadísticas');
  //     }
  //   } catch (err) {
  //     console.error('Error al obtener las estadísticas:', err);
  //     setError(err instanceof Error ? err.message : 'Error desconocido');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [user_id, page, limit]);

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

      {/*<motion.div*/}
      {/*  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"*/}
      {/*  initial={{ opacity: 0, y: 10 }}*/}
      {/*  animate={{ opacity: 1, y: 0 }}*/}
      {/*  transition={{ duration: 0.5, delay: 0.1 }}*/}
      {/*>*/}
      {/*  {statistics?.map((statistic: Statistics) => (*/}
      {/*    <motion.div*/}
      {/*      key={statistic.id}*/}
      {/*      className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 cursor-pointer"*/}
      {/*      whileHover={{ scale: 1.02 }}*/}
      {/*      transition={{ duration: 0.3 }}*/}
      {/*      onClick={() => handleStatisticClick(statistic)}*/}
      {/*    >*/}
      {/*      <div className="mb-4">*/}
      {/*        <h2 className="text-xl font-semibold mb-2 text-indigo-600 flex items-center">*/}
      {/*          <FaChartBar className="mr-2" />*/}
      {/*          {statistic.name}*/}
      {/*        </h2>*/}
      {/*        <p className="text-gray-500 text-sm">*/}
      {/*          Usuario ID: {statistic.user_id}*/}
      {/*        </p>*/}
      {/*        <p className="text-gray-500 text-sm">*/}
      {/*          Inicio: {new Date(statistic.timeline_init).toLocaleDateString()}*/}
      {/*        </p>*/}
      {/*        <p className="text-gray-500 text-sm">*/}
      {/*          Fin: {new Date(statistic.timeline_finish).toLocaleDateString()}*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </motion.div>*/}
      {/*  ))}*/}
      {/*</motion.div>*/}

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

      {/*{isModalOpen && selectedStatistic && (*/}
      {/*  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">*/}
      {/*    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">*/}
      {/*      <h3 className="text-2xl font-semibold text-gray-800 mb-4">*/}
      {/*        Editar Nombre de la Estadística*/}
      {/*      </h3>*/}
      {/*      <input*/}
      {/*        type="text"*/}
      {/*        value={newName}*/}
      {/*        onChange={(e) => setNewName(e.target.value)}*/}
      {/*        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"*/}
      {/*      />*/}
      {/*      <div className="flex justify-end space-x-4">*/}
      {/*        <button*/}
      {/*          onClick={handleModalClose}*/}
      {/*          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"*/}
      {/*        >*/}
      {/*          Cancelar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          onClick={handleUpdateStatistic}*/}
      {/*          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"*/}
      {/*        >*/}
      {/*          Guardar*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
