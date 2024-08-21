'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';
import ProfitMarginChart from '../(dashboard)/charts/ProfitMarginChart';
import StoreChart from '../(dashboard)/charts/StoreChart';
import StoreSatisfactionChart from '@/app/(dashboard)/charts/StoreSatisfactionChart';

export default function GraficosPage() {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex justify-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Gráficos Estadísticos
        </motion.h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Satisfaction Chart */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            User Satisfaction Chart
          </h2>
          <SatisfactionChart />
        </div>

        {/* Profit Margin Chart */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            Margin Profit Chart
          </h2>
          <ProfitMarginChart />
        </div>

        {/* Store Chart */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            Store Chart
          </h2>
          <StoreChart />
        </div>

        {/* Store Satisfaction Chart */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
            Store Satisfaction Chart
          </h2>
          <StoreSatisfactionChart />
        </div>
      </div>
    </div>
  );
}
