'use client';
import { MapService } from '@/app/services/map.service';
import { AgeClassification } from '@/db/models/age.classification.model';
import { State } from '@/db/models/state.model';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaList, FaCalendarAlt } from 'react-icons/fa';
import SkeletonIguanas from '../../archivos/especies/skeleton';

export default function IguanasAtributosPage() {
  const [loading, setLoading] = useState(true);
  const [iguanaStates, setIguanaStates] = useState<State[] | null>(null);
  const [iguanaAges, setIguanaAges] = useState<AgeClassification[] | null>(
    null
  );
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const states = await MapService.getAllStateIguana();
    const ages = await MapService.getAllAgeIguana();
    setIguanaStates(states);
    setIguanaAges(ages);
    setLoading(false);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {loading ? (
          <>
            <SkeletonIguanas /> <SkeletonIguanas />
          </>
        ) : (
          <>
            {iguanaStates && (
              <DataSection
                loading={loading}
                title="Estados de Iguana"
                icon={FaList}
                items={iguanaStates}
                showTrash={showTrash}
              />
            )}
            {iguanaAges && (
              <DataSection
                loading={loading}
                title="Clasificación por Edad"
                icon={FaCalendarAlt}
                items={iguanaAges}
                showTrash={showTrash}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

function DataSection({ title, icon: Icon, items, showTrash, loading }) {
  return (
    <>
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Icon className="mr-2 text-purple-500" />
          {title}
        </h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <motion.li
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg text-purple-600">
                  {item.name}
                </h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                {/*<button className="text-blue-500 hover:text-blue-700">*/}
                {/*  <FaEdit />*/}
                {/*</button>*/}
                {showTrash && (
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
        {/*<button className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300">*/}
        {/*  Agregar Nuevo*/}
        {/*</button>*/}
      </div>
    </>
  );
}
