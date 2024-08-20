'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaClock, FaPlusCircle, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapService } from '@/app/services/map.service';
import { Workspace } from '@db/models/workspace.model';
export default function Maps() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const id_user = JSON.parse(sessionStorage.getItem('user'))?.id || '';
  const [newWorkspace, setNewWorkspace] = useState<Workspace>({
    name: '',
    user_id: parseInt(id_user),
    description: '',
    state: 1,
    is_global: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewWorkspace((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await MapService.createWorkspace(newWorkspace);
      if (result) {
        console.log('Workspace created:', result);
        setIsModalOpen(false);
        router.push(
          `maps/map?id=${result.id}&name=${result.name}&description=${result.description}&user_id=${result.user_id}`
        );
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
      // Aquí puedes manejar el error, como mostrar un mensaje al usuario
    }
  };

  return (
    <div className="flex pt-20 justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-4xl px-8">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">
          Elige tu espacio de trabajo
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tarjeta para Nuevo Workspace */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <FaPlusCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Crear Nuevo Workspace
              </h2>
              <p className="text-gray-600 mb-6">
                Inicia un nuevo proyecto desde cero. Define tus propios
                parámetros y comienza a interactuar con Galápagos
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Comenzar Nuevo Proyecto
              </button>
            </div>
          </div>

          {/* Tarjeta para Workspace Anterior */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FaClock className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Usar Workspace Anterior
              </h2>
              <p className="text-gray-600 mb-6">
                Continúa trabajando en tus proyectos anteriores. Retoma tu
                trabajo justo donde lo dejaste.
              </p>
              <Link
                href="/workspaces"
                className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Cargar Proyecto Existente
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Crear Nuevo Workspace
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newWorkspace.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newWorkspace.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Crear Workspace
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
