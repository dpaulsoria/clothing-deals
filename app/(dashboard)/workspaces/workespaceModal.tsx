import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';
import { Workspace } from '@db/models/workspace.model';
import { MapService } from '@/app/services/map.service';

interface WorkspaceModalProps {
  closeModal: () => void;
  onSubmit: (workspace: Workspace) => void;
  workspace: Workspace;
}

export const WorkspaceModal = ({
  closeModal,
  workspace, onSubmit
}: WorkspaceModalProps) => {
  const [editedWorkspace, setEditedWorkspace] = useState(workspace);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedWorkspace((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSubmit(editedWorkspace);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg p-8 w-full max-w-xl relative shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Workspace</h3>
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
          <div className="space-y-8">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedWorkspace.name}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition"
                placeholder="Enter workspace name"
              />
            </div>
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={editedWorkspace.description}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition"
                placeholder="Enter a description for the workspace"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_global"
                id="is_global"
                checked={editedWorkspace.is_global}
                onChange={(e) =>
                  setEditedWorkspace((prev) => ({
                    ...prev,
                    is_global: e.target.checked,
                  }))
                }
                className="h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_global" className="text-sm font-medium text-gray-700">
                Is Global
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-base font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-150"
              onClick={handleSave}
            >
              <FaSave className="mr-2" />
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
