'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';

interface UserSatisfactionData {
  id: string;
  userId: string;
  score: number;
  createdAt: string;
}

interface UserSatisfactionGrouped {
  score: number;
  count: number;
}

export default function GraficosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserSatisfactionGrouped[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

            // Agrupar los datos por `score` y contar las ocurrencias
            const groupedData: { [key: number]: number } = {};
            satisfactionData.forEach((item) => {
              const score = item.score;
              if (!groupedData[score]) {
                groupedData[score] = 0;
              }
              groupedData[score] += 1;
            });

            const chartData = Object.keys(groupedData).map((score) => ({
              score: parseInt(score),
              count: groupedData[score],
            }));

            setData(chartData);
            setLoading(false);
          },
          error: () => {
            setError('No se pudo leer el archivo CSV.');
            setLoading(false);
          },
        });
      } catch (error) {
        setError('No se pudo cargar el archivo de satisfacción.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          Gráfico de Satisfacción de Usuarios
        </motion.h1>
      </div>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="bg-white rounded-l shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between">
          <SatisfactionChart data={data} />
        </div>
      </div>
    </div>
  );
}
