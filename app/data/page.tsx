'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';
import ProfitMarginChart from '../(dashboard)/charts/ProfitMarginChart';
import { ProfitMargin } from '@components/faker/profitMargin';

interface UserSatisfactionData {
  id: string;
  userId: string;
  score: number;
  createdAt: string;
}

export interface SatisfactionData {
  quarter: string;
  averageScore: number;
}

export default function GraficosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [satisfactionData, setSatisfactionData] = useState<SatisfactionData[]>(
    []
  );
  const [profitMarginData, setProfitMarginData] = useState<ProfitMargin[]>([]);
  const [showQuarters, setShowQuarters] = useState(false);

  useEffect(() => {
    const fetchSatisfactionData = async () => {
      try {
        const response = await fetch('/fakerData/user_satisfaction.csv');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de satisfacción.');
        }

        const csvData = await response.text();

        Papa.parse<UserSatisfactionData>(csvData, {
          header: true,
          complete: (result) => {
            const satisfactionData = result.data;

            const groupedData: { [key: string]: number[] } = {};

            satisfactionData.forEach((item) => {
              const date = new Date(item.createdAt);
              const groupKey = showQuarters
                ? `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
                : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

              if (!groupedData[groupKey]) groupedData[groupKey] = [];
              groupedData[groupKey].push(Number(item.score));
            });

            const averagedData: SatisfactionData[] = Object.keys(
              groupedData
            ).map((groupKey) => {
              const scores = groupedData[groupKey];
              const totalScores = scores.length;
              const averageScore =
                totalScores > 0
                  ? scores.reduce((sum, score) => sum + score, 0) / totalScores
                  : 0;
              return { quarter: groupKey, averageScore };
            });

            setSatisfactionData(averagedData);
            setLoading(false);
          },
          error: () => {
            setError('No se pudo leer el archivo CSV.');
            setLoading(false);
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
        setError('No se pudo cargar el archivo de satisfacción.');
        setLoading(false);
      }
    };

    const fetchProfitMarginData = async () => {
      try {
        const response = await fetch('/fakerData/profit_margins.csv');
        if (!response.ok) {
          throw new Error(
            'No se pudo cargar el archivo de márgenes de beneficio.'
          );
        }

        const csvData = await response.text();

        Papa.parse<ProfitMargin>(csvData, {
          header: true,
          complete: (result) => {
            setProfitMarginData(result.data);
            setLoading(false);
          },
          error: () => {
            setError('No se pudo leer el archivo CSV.');
            setLoading(false);
          },
        });
      } catch (error) {
        console.error('Fetch Error:', error);
        setError('No se pudo cargar el archivo de márgenes de beneficio.');
        setLoading(false);
      }
    };

    fetchSatisfactionData();
    fetchProfitMarginData();
  }, [showQuarters]);

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
          Gráficos Estadísticos
        </motion.h1>
      </div>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between mb-6">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mt-6">
            Satisfacción de Usuarios
          </h2>
          <SatisfactionChart data={satisfactionData} />
          <div className="flex justify-center mt-4 mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => setShowQuarters(!showQuarters)}
            >
              {showQuarters ? 'Mostrar por Meses' : 'Mostrar por Trimestres'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mt-6">
            Margen de Beneficio y Desviación
          </h2>
          <ProfitMarginChart
            data={profitMarginData}
            showQuarters={showQuarters}
          />
          <div className="flex justify-center mt-4 mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => setShowQuarters(!showQuarters)}
            >
              {showQuarters ? 'Mostrar por Meses' : 'Mostrar por Trimestres'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
