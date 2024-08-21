'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import dynamic from 'next/dynamic';

const KPIIndicators = dynamic(
  () => import('../(dashboard)/charts/kpiIndicators'),
  {
    ssr: false,
  }
);

const SatisfactionChart = dynamic(
  () => import('../(dashboard)/charts/SatisfactionChart'),
  {
    ssr: false,
  }
);
const ProfitMarginChart = dynamic(
  () => import('../(dashboard)/charts/ProfitMarginChart'),
  {
    ssr: false,
  }
);

const StoreChart = dynamic(() => import('../(dashboard)/charts/StoreChart'), {
  ssr: false,
});

const StoreSatisfactionChart = dynamic(
  () => import('../(dashboard)/charts/StoreSatisfactionChart'),
  {
    ssr: false,
  }
);

export default function GraficosPage() {
  const [activeTab, setActiveTab] = useState<'charts' | 'kpis'>('charts');

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex justify-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'charts'
            ? 'Gráficos Estadísticos'
            : 'Indicadores Clave de Rendimiento (KPIs)'}
        </motion.h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'charts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('charts')}
        >
          Gráficos Estadísticos
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'kpis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('kpis')}
        >
          Indicadores KPIs
        </button>
      </div>

      {/* Content */}
      {activeTab === 'charts' && (
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
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
              Store Chart
            </h2>
            <StoreChart />
          </div>

          {/* Store Satisfaction Chart */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
              Store Satisfaction Chart
            </h2>
            <StoreSatisfactionChart />
          </div>
        </div>
      )}

      {activeTab === 'kpis' && (
        <div>
          <KPIIndicators />
        </div>
      )}
    </div>
  );
}
