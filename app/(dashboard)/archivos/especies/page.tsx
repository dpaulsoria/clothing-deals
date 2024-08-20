'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parse } from 'papaparse';
import { faker } from '@faker-js/faker';
import { createIguanabyCsv } from '@/app/_lib/api/markers';
import { MapService } from '@/app/services/map.service';
import SkeletonIguanas from '@/app/(dashboard)/archivos/especies/skeleton';
import UpFileIcon from '@/app/_components/icons/UpFileIcon';
import { Iguana } from '@db/models/iguana.model';
import { ApiResponse } from '@/app/services/api.service';
import { Point } from 'geojson';
import { useModal } from '@components/modal/LighModal';

export default function Especies() {
  const [markersIguanas, setMarkersIguanas] = useState<Iguana[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const { addModal } = useModal();
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      parse(file, {
        complete: async (results) => {
          const rawData = results.data;

          if (rawData && rawData.length > 0) {
            const formattedData = rawData.map((iguana: any) => {
              const [latitude, longitude] = iguana.coordinates.split(',');
              return {
                estado: iguana.estado,
                edad: iguana.edad,
                sexo: iguana.sexo,
                par_coordenado: `${longitude.trim()},${latitude.trim()}`, // Convertir y reorganizar las coordenadas
                fechaCaptura: iguana.fechaCaptura,
              };
            });

            try {
              const userId = 1; // Reemplazar con el user_id que corresponda
              addModal('Guardando Iguanas...');

              const response = await createIguanabyCsv(userId, formattedData);
              console.log('Marcadores creados con éxito:', response);
              addModal('Iguanas cargadas con éxito');
              handleFetchMarkers();
            } catch (error) {
              console.error('Error al enviar los datos al backend:', error);
            }
          } else {
            console.error('Error parsing CSV: Data is empty or malformed');
          }
        },
        header: true,
        skipEmptyLines: true,
      });
      console.log('file', file);
    }
  };

  function generateNameDictionary() {
    const nameDictionary: { [key: number]: string } = {};
    for (let i = 0; i <= 5; i++) {
      nameDictionary[i] = faker.person.firstName();
    }
    return nameDictionary;
  }

  const getNameByNumber = (number: number): string => {
    const nameDictionary = generateNameDictionary();
    if (number >= 0 && number <= 5) {
      return nameDictionary[number];
    } else {
      return 'Número fuera de rango';
    }
  };

  const handleFetchMarkers = useCallback(async () => {
    setLoading(true);
    try {
      // Iguana from model
      const response: ApiResponse<{ result: Iguana[]; extra: string }> =
        await MapService.getAllMarkersPagination(
          page.toString(),
          limit.toString()
        );
      const totalItems = parseInt(response.extra, 10);
      console.log('response', response);
      console.log('totalItems', totalItems);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error1
      setMarkersIguanas(response.result);
      setTotalItems(totalItems);
    } catch (error) {
      console.error('Error fetching markers:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    handleFetchMarkers();
  }, [handleFetchMarkers]);

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

  const parsingSexo = (sexo: number) => {
    if (sexo === 0) {
      return 'Macho';
    } else if (sexo === 1) {
      return 'Hembra';
    } else {
      return 'Indefinido';
    }
  };
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleCSVUpload}
        accept=".csv"
      />

      <div className="bg-gray-100 p-4 flex flex-col text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Iguana de las Islas Galápagos
        </h1>
        <button
          onClick={triggerFileInput}
          className="fixed top-20 z-10 right-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <UpFileIcon className="mr-2 fill-white w-5" />
          Subir archivo csv
        </button>
        <div className="w-full overflow-x-auto shadow-md sm:rounded-lg mt-4">
          {loading ? (
            <SkeletonIguanas />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Capturado por
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Edad
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sexo
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Coordenadas
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha de Captura
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {markersIguanas.map((iguana, index) => (
                    <tr
                      key={iguana.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {index + 1 + (page - 1) * limit}
                      </td>
                      <td className="px-6 py-4">
                        {getNameByNumber(Number(iguana.user_id)) || 'N/A'}
                      </td>
                      <td className="px-6 py-4">{iguana.estado}</td>
                      <td className="px-6 py-4">{iguana.edad}</td>
                      <td className="px-6 py-4">{parsingSexo(iguana.sexo)}</td>
                      <td className="px-6 py-4">
                        {iguana.point
                          ? (
                              JSON.parse(String(iguana.point)) as Point
                            ).coordinates.join(', ')
                          : 'Sin coordenadas'}
                      </td>
                      <td className="px-6 py-4">
                        {iguana.register_date
                          ? format(
                              new Date(iguana.register_date),
                              'dd/MM/yyyy',
                              {
                                locale: es,
                              }
                            )
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
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
    </>
  );
}
