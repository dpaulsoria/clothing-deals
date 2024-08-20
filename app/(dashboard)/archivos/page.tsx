'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaTree, FaDragon } from 'react-icons/fa';

export default function ArchivoPage() {
  const sections = [
    {
      title: 'Subir Rasters',
      description:
        'Sube tus datos geográficos continuos para su análisis y visualización.',
      color: 'from-teal-500 to-teal-700',
      href: 'archivos/rasters',
      icon: FaLayerGroup,
    },
    {
      title: 'Subir Layers',
      description: 'Carga tus capas vectoriales para enriquecer tu mapa.',
      color: 'from-orange-500 to-orange-700',
      href: 'archivos/layers',
      icon: FaTree,
    },
    {
      title: 'Subir Especie',
      description:
        'Añade datos sobre iguanas para comprender su comportamiento y distribución geográfica.',
      color: 'from-indigo-500 to-indigo-700',
      href: 'archivos/especies',
      icon: FaDragon,
    },
  ];

  return (
    <div className="h-screen bg-gray-100 flex justify-center">
      <div className="w-4/5 flex flex-col gap-7">
        <h1 className="text-3xl font-bold text-start text-gray-900  mt-4">
          Carga de Archivos
        </h1>
        <div className="flex flex-col justify-evenly h-7/10-screen">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-fit"
            >
              <Link href={section.href} className="block h-full">
                <motion.div
                  className={`bg-gradient-to-br ${section.color} rounded-lg shadow-lg overflow-hidden cursor-pointer h-full flex flex-col justify-between p-4`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {section.title}
                    </h2>
                    <p className="text-sm text-white opacity-80">
                      {section.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <motion.span
                      className="inline-flex items-center text-white text-sm"
                      whileHover={{ x: 5 }}
                    >
                      Explorar más
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.span>
                    <section.icon className="text-white opacity-30 text-4xl" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
