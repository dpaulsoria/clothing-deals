'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';
import ProfitMarginChart from '../(dashboard)/charts/ProfitMarginChart';
import StoreChart from '../(dashboard)/charts/StoreChart';
import StoreSatisfactionChart from '@/app/(dashboard)/charts/StoreSatisfactionChart';

const chartClassName =
  'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between mb-6 max-w-full';
const h2ClassName = 'text-2xl font-semibold text-center text-indigo-600 mt-6';

export default function GraficosPage() {
  return (
    <div className="container mx-auto p-6 min-h-screen">
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
        <div className={chartClassName}>
          <h2 className={h2ClassName}>User Satisfaction Chart</h2>
          <SatisfactionChart />
        </div>

        {/* Componente de Margin Profit Chart*/}
        <div className={chartClassName}>
          <h2 className={h2ClassName}>Margin Profit Chart</h2>
          <ProfitMarginChart />
        </div>

        {/* Componente de Store Chart */}
        <div className={chartClassName}>
          <h2 className={h2ClassName}>Store Chart</h2>
          <StoreChart />
        </div>

        {/* Componente de Store Satisfaction Chart */}
        <div className={chartClassName}>
          <h2 className={h2ClassName}>Store Satisfaction Chart</h2>
          <StoreSatisfactionChart />
        </div>
      </div>
    </div>
  );
}
