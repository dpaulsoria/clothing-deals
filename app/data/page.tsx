'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';

export default function GraficosPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="top-0 z-10 pb-4 flex items-center justify-center">
        <motion.h1
          className="text-3xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gráficos Estadísticos
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100">
        {/* Componente SatisfactionChart */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between mb-6 max-w-full">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mt-6">
            Satisfacción de Usuarios
          </h2>
          <SatisfactionChart />
        </div>
      </div>
    </div>
  );
}
