'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import SatisfactionChart from '../(dashboard)/charts/SatisfactionChart';
import { SatisfactionByQuarter } from '@components/faker/userSatisfaction';

interface UserSatisfactionData {
  id: string;
  userId: string;
  score: number;
  createdAt: string;
}

export default function GraficosPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SatisfactionByQuarter[]>([]);

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

            // Paso 2: Agrupar los datos por trimestre
            const groupedData: { [key: string]: number[] } = {};
            satisfactionData.forEach((item) => {
              const date = new Date(item.createdAt);
              console.log(`Date`, date);
              const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
              console.log(quarter);
              // Si el trimestre no existe en el grupo, lo creamos
              if (!groupedData[quarter]) groupedData[quarter] = [];

              console.log(groupedData);
              // Almacenar el puntaje en el trimestre correspondiente
              groupedData[quarter].push(Number(item.score));
            });

            // Paso 4: Calcular el promedio por trimestre
            const averagedData: SatisfactionByQuarter[] = Object.keys(
              groupedData
            ).map((quarter) => {
              const scores = groupedData[quarter];

              // Verificar el contenido del array de puntajes
              console.log(`Quarter: ${quarter}, Scores Array: `, scores);

              const totalScores = scores.length;
              const averageScore =
                totalScores > 0
                  ? scores.reduce((sum, score) => sum + score, 0) / totalScores
                  : 0;

              console.log(
                `Quarter: ${quarter}, Total Scores: ${totalScores}, Average: ${averageScore}`
              );

              return { quarter, averageScore };
            });

            console.log('Final Averaged Data:', averagedData);
            setData(averagedData);
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300 flex flex-col justify-between">
          <SatisfactionChart data={data} />
        </div>
      </div>
    </div>
  );
}
