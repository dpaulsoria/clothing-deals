import React, { useState, useEffect } from 'react';
import { EDAD_IGUANA, ESTADOS_IGUANA } from '@lib/interfaces';
import { formatDate } from 'date-fns';
import { CloseIcon } from '@/app/_components/icons';
import { Marker } from 'leaflet';

interface MarkerFormProps {
    isOpen: boolean;
    onClose: () => void;
    marker?: L.Marker;
    onSubmit: (data: L.Marker) => void;
}

export default function MarkerForm({ isOpen, onClose, marker, onSubmit }: MarkerFormProps) {
    const [localMarker, setLocalMarker] = useState<L.Marker | null>(null);

    useEffect(() => {
        if (marker && marker.feature && marker.feature.properties) {
            const updatedMarker = { ...marker };
            const properties = updatedMarker.feature.properties;
            properties.user_id = properties.user_id || "1";
            properties.sexo = properties.sexo || 0;
            properties.estado = properties.estado || ESTADOS_IGUANA[0];
            properties.edad = properties.edad || EDAD_IGUANA[0];
            properties.fechaCaptura = properties.fechaCaptura
                ? formatDate(properties.fechaCaptura, 'yyyy-MM-dd')
                : formatDate(new Date(), 'yyyy-MM-dd');

            setLocalMarker(updatedMarker as Marker);
        }
    }, [marker]);

    if (!isOpen || !localMarker) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedMarker = { ...localMarker };
        updatedMarker.feature.properties[name] = value;
        setLocalMarker(updatedMarker as Marker);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localMarker) {
            onSubmit(localMarker);
        }
        
    };

    return (
        <div className="absolute text-gray-800 top-4 left-4 w-80 bg-white p-4 rounded shadow-lg z-[9999]">
            <button onClick={onClose} className="absolute top-2 right-2">
                <CloseIcon className="fill-gray-600 w-5" />
            </button>
            <form onSubmit={handleSubmit} className="p-1 bg-white rounded">
                <div className="mb-4">
                    <h3 className="font-bold mb-2">Estado de la iguana</h3>
                    {ESTADOS_IGUANA.map((option) => (
                        <label key={option} className="block mb-1">
                            <input
                                type="radio"
                                name="estado"
                                value={option}
                                checked={localMarker.feature.properties.estado === option}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <h3 className="font-bold mb-2">Edad de la iguana</h3>
                    {EDAD_IGUANA.map((option) => (
                        <label key={option} className="block mb-1">
                            <input
                                type="radio"
                                name="edad"
                                value={option}
                                checked={localMarker.feature.properties.edad === option}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <h3 className="font-bold mb-2">Fecha de captura</h3>
                    <input
                        type="date"
                        name="fechaCaptura"
                        value={formatDate(localMarker.feature.properties.fechaCaptura, 'yyyy-MM-dd')}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Guardar
                </button>
            </form>
        </div>
    );
}
