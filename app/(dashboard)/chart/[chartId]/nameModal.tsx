'use client';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
type NameModalProps = {
  handleModalNameClose: () => void;
  handleModalNameSave: (name: string) => void;
};
export default function NameModal({
  handleModalNameSave,
  handleModalNameClose,
}: NameModalProps) {
  const [name, setName] = useState('');
  const handleChangeName = (value: string) => {
    setName(value);
  };
  return (
    <motion.div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ingresa el Nombre
          </h2>
          <FaTimes
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={handleModalNameClose}
          />
        </div>
        <input
          type="text"
          onChange={(e) => handleChangeName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Ingresa el nombre"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleModalNameClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleModalNameSave(name)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
