'use client';

import React, { ReactNode, useEffect, useCallback } from 'react';
import { useInteractiveElement } from '../hooks/comandEsc';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface InfoModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  children: ReactNode;
}

export default function InfoModal({
  isModalOpen,
  onClose,
  onAction,
  children,
}: InfoModalProps) {
  const { elementRef } = useInteractiveElement<HTMLDivElement>({
    closeOnEscape: true,
    closeOnClickOutside: true,
  });

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, handleClose]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-start transition-opacity duration-300 ease-in-out">
      <div
        ref={elementRef}
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mt-20 transition-transform duration-500 ease-in-out opacity-100 translate-y-0"
      >
        {/* Barra indicadora en la parte superior */}
        <div className="absolute top-0 left-0 w-3/4 h-1 bg-green-500 rounded-tr-lg rounded-tl-lg"></div>
        {/* Contenido del modal */}
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            PARQUE NACIONAL GALÁPAGOS
          </h2>
          <button
            onClick={handleClose}
            className="ml-auto text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <div className="text-gray-800">
          <p className="mb-4">{children}</p>
          <div className="w-full flex justify-end gap-4">
            <button
              onClick={() => {
                onAction();
                handleClose();
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Aceptar
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
