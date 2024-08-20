import { LayerWithCustomProperties } from '@lib/interfaces';
import { useCallback, useEffect, useState } from 'react';
import { generateAndDownloadIguanaData } from '@lib/actions';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaVectorSquare,
  FaFileAlt,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';

type LayerBarComponentProps = {
  layersGroup: LayerWithCustomProperties[];
  toggleLayerSelection: (layer: LayerWithCustomProperties) => void;
  focusLayer: (layer: LayerWithCustomProperties) => void;
  toggleLayerVisibility: (layer: LayerWithCustomProperties) => void;
  setIsModalOpen: (value: boolean) => void;
};
export default function LayerBarComponent({
  layersGroup,
  toggleLayerSelection,
  focusLayer,
  toggleLayerVisibility,
  setIsModalOpen,
}: LayerBarComponentProps) {
  const [vectorExpanded, setVectorExpanded] = useState(true);
  const [filteredLayers, setFilteredLayers] = useState([]);

  const downloadLayerAsGeoJSON = useCallback(
    (layer: LayerWithCustomProperties) => {
      if (!layer.toGeoJSON) {
        return;
      }
      const geoJSON = layer.toGeoJSON();
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(geoJSON));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `${layer.feature.properties.name || 'layer'}.geojson`
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    []
  );
  const handleGenerateIguanaData = useCallback(
    (layer: LayerWithCustomProperties) => {
      if (layer && layer.toGeoJSON) {
        const numIguanas = 2000; // Puedes hacer esto configurable si lo deseas
        const captureDate = new Date(); // Puedes hacer esto configurable si lo deseas
        generateAndDownloadIguanaData(numIguanas, layer, captureDate, true);
      }
    },
    []
  );
  useEffect(() => {
    const filtrado = layersGroup.filter((layer) => {
      const geoJSON = layer.toGeoJSON();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return geoJSON.geometry && geoJSON.geometry.type !== 'LineString';
    });

    // Actualizamos el estado con las capas filtradas
    setFilteredLayers(filtrado);
  }, [layersGroup]);

  const renderLayerControls = (layer) => (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={layer.feature.properties.selected}
          onChange={() => toggleLayerSelection(layer)}
          className="w-4 h-4 cursor-pointer"
        />
        <p className="font-semibold text-sm text-gray-800 capitalize">
          {layer.feature.properties.name || 'Capa sin nombre'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={!layer.feature.properties.visible}
          onClick={() => focusLayer(layer)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaVectorSquare size={18} />
        </button>
        <button
          onClick={() => toggleLayerVisibility(layer)}
          className="text-gray-500 hover:text-gray-700"
        >
          {layer.feature.properties.visible ? (
            <FaEye size={18} />
          ) : (
            <FaEyeSlash size={18} />
          )}
        </button>
        <button
          disabled={!layer.feature.properties.visible}
          onClick={() => downloadLayerAsGeoJSON(layer)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaArrowUp size={18} className="transform rotate-180" />
        </button>
        <button
          disabled={!layer.feature.properties.visible}
          onClick={() => handleGenerateIguanaData(layer)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaFileAlt size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute top-4 right-4 w-80 text-gray-800 bg-white px-4 pb-4 rounded-lg shadow-xl max-h-[calc(70vh-2rem)] overflow-y-auto z-[8888] backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sticky top-0 z-50 flex justify-between items-center mb-4 py-3 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200">
        <h2 className="text-xl font-bold">Capas</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {filteredLayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="font-semibold text-md text-center">
            No se han encontrado Layers
          </p>
          <p className="font-light text-sm text-center">
            Crea tus primeros Layers desde las herramientas que están en la
            parte inferior izquierda de la pantalla
          </p>
        </div>
      ) : (
        <>
          {filteredLayers.map((layer, index) => (
            <div
              key={`layer-${index}`}
              className="mb-2 px-3 py-2 bg-gray-50 rounded"
            >
              {renderLayerControls(layer)}
            </div>
          ))}
        </>
      )}
    </motion.div>
  );
}
