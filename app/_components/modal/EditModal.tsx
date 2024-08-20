// app/_components/RasterModal.ts
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ImageService } from '@/app/services/image.service';

interface EditModalProps {
  show: boolean;
  onClose: () => void;
  item: Editable;
  title: string;
  onSave: (name: string, description: string) => void;
}

export interface Editable {
  file_name: string;
  description?: string;
  file_path: string;
}

const EditModal = ({ show, onClose, item, title, onSave }: EditModalProps) => {
  const [name, setName] = useState(item.file_name || '');
  const [description, setDescription] = useState(item.description || '');

  const handleCloseModal = () => {
    onClose();
  };
  const handleSave = () => {
    onSave(name, description);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-3xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-4">
            <Image
              src={ImageService.getThumbnail(item.file_path)}
              alt={item.file_name}
              width={500}
              height={300}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <label
              htmlFor={'name'}
              className="block text-gray-700 font-medium mb-2"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor={'description'}
              className="block text-gray-700 font-medium mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-36 overflow-y-auto"
            ></textarea>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleCloseModal}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Guardar Edición
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
