'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaLock,
  FaEdit,
  FaSave,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { MapService } from '@/app/services/map.service';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = await MapService.getusersById('1');
    setEditedUser(user);
    setPreviewImage(
      'https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    );
    return user;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedUser((prev) => ({ ...prev, url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    // Por ejemplo: await MapService.updateUser(editedUser);
    MapService.updateUser(editedUser);
    setIsEditing(false);
  };

  if (!editedUser)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-[90vh] bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Perfil de Usuario
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            {isEditing ? <FaSave size={24} /> : <FaEdit size={24} />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={previewImage}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover"
              />
              {isEditing && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
                >
                  <FaCamera color="white" />
                  <input
                    type="file"
                    id="profilePic"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FaUser className="text-gray-400" />
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full p-2 border rounded ${isEditing ? 'border-blue-300' : 'border-gray-200'}`}
              />
            </div>

            <div className="flex items-center space-x-4">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full p-2 border rounded ${isEditing ? 'border-blue-300' : 'border-gray-200'}`}
              />
            </div>

            <div className="flex items-center space-x-4">
              {editedUser.isadmin ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span className="text-gray-700">
                {editedUser.isadmin ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>

          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar Cambios
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
