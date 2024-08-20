'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Store {
  id: string;
  name: string;
  joinedDate: string;
  marketingTechnique: string;
}

const ITEMS_PER_PAGE = 3;

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/fakerData/stores.csv')
      .then((response) => {
        if (!response.ok)
          throw new Error('No se pudo cargar el archivo de tiendas.');
        return response.text();
      })
      .then((csvData) =>
        Papa.parse<Store>(csvData, {
          header: true,
          complete: (result) => setStores(result.data),
          error: () => setError('No se pudo leer el archivo CSV.'),
        })
      )
      .catch(() => setError('No se pudo cargar el archivo de tiendas.'))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE);

  const paginate = (direction: 'prev' | 'next') => {
    setCurrentPage((prevPage) =>
      direction === 'prev'
        ? Math.max(prevPage - 1, 1)
        : Math.min(prevPage + 1, totalPages)
    );
  };

  const currentStores = stores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando tiendas...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  if (stores.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        No hay tiendas disponibles.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow p-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Tiendas Asociadas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <Image
                src="/assets/store-placeholder.png"
                alt={store.name}
                width={600}
                height={400}
                className="object-cover w-full h-36"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                <p className="text-gray-600">
                  Técnica de Marketing: {store.marketingTechnique}
                </p>
              </div>
              <div className="px-4 py-2 text-sm text-gray-500">
                Se unió el {new Date(store.joinedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-[9999] bg-gray-100 py-4">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate('prev')}
              className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => paginate('next')}
              className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
