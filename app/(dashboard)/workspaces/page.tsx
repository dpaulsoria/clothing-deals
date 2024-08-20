'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaEye, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { WorkspaceModal } from './workespaceModal';
import { MapService } from '@/app/services/map.service';
import { Workspace } from '@db/models/workspace.model';
import SkeletonWS from './SkeletonWS';
import InfoModal from '@/app/_components/modal/InfoModal';

export default function CapasPage() {
  const [workspaceData, setWorkspaceData] = useState<Workspace[] | null>(null);
  const [workspaceIndex, setWorkspaceIndex] = useState<number | null>(null);
  const [isModalWorkspaceOpen, setIsModalWorkspaceOpen] = useState(false);
  // const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<number | null>(
    null
  );
  const id_user = JSON.parse(sessionStorage.getItem('user'))?.id || '1';

  const handleClick = (id: string, user_id: number) => {
    router.push(`maps/map?id=${id}&user_id=${user_id}`);
  };

  const handleCloseModal = () => {
    setIsModalWorkspaceOpen(false);
  };

  const getWorkspaceData = useCallback(async () => {
    setLoading(true);
    const workspace = await MapService.getAllWorkspacesByUserId(
      parseInt(id_user)
    );
    setWorkspaceData(workspace);
    setLoading(false);
  }, [id_user]);

  useEffect(() => {
    getWorkspaceData();
  }, [getWorkspaceData]);

  const openModal = (index: number) => {
    setWorkspaceIndex(index);
    setIsModalWorkspaceOpen(true);
  };
  const handleSave = (workespace: Workspace) => {
    MapService.updateWorkspace(workespace);
    setIsModalWorkspaceOpen(false);
    getWorkspaceData();
  };

  const handleDeleteWorkspace = (id: number) => {
    setWorkspaceToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log(workspaceToDelete);

    if (workspaceToDelete) {
      await MapService.deleteWorkspace(workspaceToDelete);
      await getWorkspaceData();
      setIsConfirmModalOpen(false);
      setWorkspaceToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setWorkspaceToDelete(null);
  };
  return (
    <>
      <InfoModal
        isModalOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onAction={handleConfirmDelete}
      >
        ¿Está seguro que desea eliminar este espacio de trabajo?
      </InfoModal>
      <div className="flex-grow flex flex-col p-6 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 min-h-screen">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10">
          Espacios de trabajo guardados
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonWS key={index} />
            ))}
          </div>
        ) : (
          <>
            {workspaceData.length === 0 && (
              <div className="flex flex-col  items-center justify-center h-full space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center">
                  No hay espacios de trabajo disponibles
                </h2>
                <p className="text-lg text-gray-500 max-w-md text-center">
                  Parece que aún no has creado ningún espacio de trabajo.
                  Comienza creando un nuevo espacio para gestionar tus proyectos
                  de manera eficiente.
                </p>
                <button
                  onClick={() => router.push('/maps')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlusCircle size={24} className="mr-3" />
                  Crear un nuevo espacio de trabajo
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workspaceData.length > 0 &&
                workspaceData
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((workspace, index) => (
                    <motion.div
                      key={workspace.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
                    >
                      <div className="p-6 flex-grow">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                          {workspace.name}
                        </h2>
                        <p className="text-gray-600 mb-6">
                          {workspace.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm p-6 text-gray-500">
                        <span>
                          {new Date(workspace.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-medium text-gray-700">
                          {workspace.user_name}
                        </span>
                      </div>
                      <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                        <button
                          onClick={() =>
                            handleClick(workspace.id, workspace.user_id)
                          }
                          className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <FaEye size={20} className="mr-2" />
                          <span>Ir</span>
                        </button>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openModal(index)}
                            className="flex items-center text-green-600 hover:text-green-800 focus:outline-none"
                          >
                            <FaEdit size={20} className="mr-2" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteWorkspace(parseInt(workspace.id))
                            }
                            className="flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            <FaTrash size={20} className="mr-2" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </>
        )}
        {isModalWorkspaceOpen && workspaceIndex !== null && (
          <WorkspaceModal
            closeModal={handleCloseModal}
            onSubmit={handleSave}
            workspace={workspaceData[workspaceIndex]}
          />
        )}
      </div>
    </>
  );
}
