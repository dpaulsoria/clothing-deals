import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';
import { MapService } from '@/app/services/map.service';
interface LayersModalProps {
    isOpen: boolean;
    closeModal: () => void;
    shapefile: any;
}

export const LayersModal = ({
    isOpen,
    closeModal,
    shapefile,
}: LayersModalProps) => {
    const [editedshapefile, setEditedshapefile] = useState(shapefile);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'description') {
            setEditedshapefile((prev) => ({ ...prev, properties: { description: value } }));
            return;
        }
        setEditedshapefile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // onSave(editedshapefile);
        MapService.updateShapefile({
            id: editedshapefile.id,
            name: editedshapefile.name,
            user_id: editedshapefile.user_id,
            properties: {
                description: editedshapefile.description,
            },
            is_global: editedshapefile.is_global,
            geometry: editedshapefile.geometry,
        })
        closeModal();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-medium mb-4">Editar Shapefile</h3>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                        >
                            <FaTimes className="h-6 w-6" />
                        </button>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={editedshapefile.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={3}
                                    value={editedshapefile.properties.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="is_global" className="block text-sm font-medium text-gray-700">
                                    Is Global
                                </label>
                                <input
                                    type="checkbox"
                                    name="is_global"
                                    id="is_global"
                                    checked={editedshapefile.is_global}
                                    onChange={(e) => setEditedshapefile((prev) => ({ ...prev, is_global: e.target.checked }))}
                                    className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={handleSave}
                            >
                                <FaSave className="mr-2" />
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};