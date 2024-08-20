'use client'
import { MapService } from '@/app/services/map.service';
import { useState, useEffect } from 'react';
import { User } from '@/db/models/user.model';
import { FaSort, FaSortUp, FaSortDown, FaUserPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import SkeletonIguanas from '@/app/(dashboard)/archivos/especies/skeleton';

export default function UsuariosPage() {
    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [worker, setWorker] = useState({
        name: '',
        email: ''
    });
    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        setLoading(true);
        const userData = await MapService.getAllUsers()
        setUsers(userData);
        setLoading(false);
    }

    const deleteuser = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            await MapService.deleteUser(id)
            obtenerUsuarios()
        }
    }

    const updateuser = async (updatedData) => {
        await MapService.updateUser(updatedData)
        setEditingId(null);
        obtenerUsuarios()
    }
    const createAnInviteByEmail = async (credentials) => {
        await MapService.createUserbyEmail(credentials)
        obtenerUsuarios()
    }
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const getSortIcon = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorker(prevWorker => ({
            ...prevWorker,
            [name]: value
        }));
    };
    const submitNewWorker = (e) => {
        e.preventDefault();
        console.log("worker", worker);
        createAnInviteByEmail(worker);
        // Limpiar el formulario después de enviar
        setWorker({ name: '', email: '' });
    };
    return (
        <>
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FaUserPlus className="mr-2 text-purple-500" />
                    Agregar Nuevo Trabajador
                </h2>
                <form onSubmit={submitNewWorker} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={worker.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={worker.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300">
                        Agregar Trabajador
                    </button>
                </form>
            </div>
            <div className="w-full overflow-x-auto shadow-md sm:rounded-lg mt-4">

                {loading ? (SkeletonIguanas()) :
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('id')}>
                                    ID {getSortIcon('id')}
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('name')}>
                                    Nombre {getSortIcon('name')}
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('email')}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('isadmin')}>
                                    Admin {getSortIcon('isadmin')}
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('isactive')}>
                                    Activo {getSortIcon('isactive')}
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('created_at')}>
                                    Fecha de Creación {getSortIcon('created_at')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <input
                                                type="text"
                                                defaultValue={user.name}
                                                className="w-full p-1 border rounded"
                                                onChange={(e) => user.name = e.target.value}
                                            />
                                        ) : user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full p-1 border rounded"
                                                onChange={(e) => user.email = e.target.value}
                                            />
                                        ) : user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                defaultValue={user.isadmin ? 'Sí' : 'No'}
                                                className="w-full p-1 border rounded"
                                                onChange={(e) => user.isadmin = e.target.value === 'Sí'}
                                            >
                                                <option>Sí</option>
                                                <option>No</option>
                                            </select>
                                        ) : user.isadmin ? 'Sí' : 'No'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                defaultValue={user.isactive ? 'Sí' : 'No'}
                                                className="w-full p-1 border rounded"
                                                onChange={(e) => user.isactive = e.target.value === 'Sí'}
                                            >
                                                <option>Sí</option>
                                                <option>No</option>
                                            </select>
                                        ) : user.isactive ? 'Sí' : 'No'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <>
                                                <button onClick={() => updateuser(user)} className="text-green-600 hover:text-green-900 mr-2">
                                                    <FaSave />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-900">
                                                    <FaTimes />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setEditingId(user.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteuser(user.id)} className="text-red-600 hover:text-red-900">
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </>
    );
}