/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import React, { ReactNode, useState, useCallback } from 'react';
import DeleteIcon from '@/app/_components/icons/DeleteIcon';
import InfoModal from '@/app/_components/modal/InfoModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Analysis {
  Icono: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  fecha: string;
  is_global?: boolean;
  deleteText: string;
  usuario?: string;
  isNew?: boolean;
  onDelete: () => void;
  onEnter: () => void;
  doModalOpen: () => void;
  children?: ReactNode;
}

const AnalysisComponent: React.FC<Analysis> = ({
  Icono,
  fecha,
  deleteText,
  usuario,
  onEnter,
  onDelete,
  children,
  doModalOpen,
  isNew = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAction = useCallback(() => {
    console.log('Clicked!');
    setIsModalOpen(false);
    onDelete();
  }, [onDelete]);

  return (
    <div className="w-full flex flex-row justify-between rounded-xl pl-2">
      <InfoModal
        isModalOpen={isModalOpen}
        onAction={handleAction}
        onClose={handleCloseModal}
      >
        {deleteText}
      </InfoModal>
      <button
        onClick={doModalOpen}
        className="bg-gray-200 w-20 rounded-l-xl flex justify-center items-center cursor-pointer hover:bg-gray-200 group"
      >
        <div className="w-fit flex pl-2 py-3 items-center">
          <Icono className="fill-gray-700 group-hover:fill-indigo-400" />
        </div>
      </button>
      <div
        className="w-full flex flex-row cursor-pointer  bg-gray-200 group hover:bg-indigo-400"
        onClick={onEnter}
      >
        <div className="w-full flex flex-col justify-center pl-3">
          <div className="flex flex-row gap-5 items-center group-hover:text-white">
            <small>{usuario}</small>
            <small>{format(fecha, 'dd MMMM yyyy', { locale: es })}</small>
          </div>
          <div className=" group-hover:text-white">{children}</div>
        </div>
        {isNew && (
          <div className=" top-2 right-2 bg-green-500 text-white text-xs font-bold p-1 px-3 rounded-2xl my-1 mr-4 w-fit h-fit">
            Nuevo
          </div>
        )}
      </div>
      <button
        onClick={handleOpenModal}
        className="bg-gray-300 w-20 rounded-e-xl flex justify-center items-center cursor-pointer hover:bg-gray-200 group"
      >
        <DeleteIcon
          className="fill-gray-700 group-hover:fill-red-600"
          width={26}
          height={26}
        />
      </button>
    </div>
  );
};

export default AnalysisComponent;
