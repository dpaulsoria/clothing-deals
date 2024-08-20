import {
  DataIcon,
  EditIcon,
  LayerIcon,
  SaveIcon,
  RasterIcon, // Supongamos que existe este ícono
} from '@/app/_components/icons';
import { motion } from 'framer-motion';

type ToolBarComponentProps = {
  isModalOpen: boolean;
  isRastersDynamicActive: boolean;
  setIsModalOpen: (value: boolean) => void;
  hideAllLayers: () => void;
  triggerFileInput: () => void;
  handleClickEstadisticas: () => void;
  setIsRasterDynamicActive: (value: boolean) => void;
};

export default function ToolBarComponent({
  isModalOpen,
  setIsModalOpen,
  handleClickEstadisticas,
  hideAllLayers,
  triggerFileInput,
  setIsRasterDynamicActive,
  isRastersDynamicActive,
}: ToolBarComponentProps) {
  return (
    <>
      <div className="flex text-gray-700 bg-white rounded-xl gap-2 shadow-lg w-fit bg-white/80 backdrop-blur-sm overflow-hidden ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <div className="flex flex-col pl-4 p-2 items-center group">
            <LayerIcon
              className={
                isModalOpen
                  ? 'fill-indigo-600 w-5 h-5'
                  : 'fill-gray-700 group-hover:fill-indigo-600 w-5 h-5'
              }
            />
            <div className="text-gray-700 font-light text-xs ">Capas</div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsRasterDynamicActive(!isRastersDynamicActive)}
        >
          <div className="flex flex-col p-2 items-center group">
            <RasterIcon
              className={
                isRastersDynamicActive
                  ? 'fill-green-600 w-5 h-5'
                  : 'fill-gray-700 group-hover:fill-green-600 w-5 h-5'
              }
            />
            <div className="text-gray-700 font-light text-xs ">Rasters</div>
          </div>
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={hideAllLayers}>
          <div className="flex flex-col group p-2 items-center">
            <EditIcon className="fill-gray-700 group-hover:fill-red-600 w-5 h-5" />
            <div className="text-gray-700 font-light text-xs ">Limpiar</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={handleClickEstadisticas}
        >
          <div className="flex flex-col group p-2 items-center">
            <DataIcon className="fill-gray-700 group-hover:fill-amber-600 w-5 h-5" />
            <div className="text-gray-700 font-light text-xs ">Analizar</div>
          </div>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} onClick={triggerFileInput}>
          <div className="flex flex-col p-2 pr-4 group items-center">
            <SaveIcon className="fill-gray-700 group-hover:fill-purple-600 w-5 h-5" />
            <div className="text-gray-700 font-light text-xs ">Guardar</div>
          </div>
        </motion.button>
      </div>
    </>
  );
}
