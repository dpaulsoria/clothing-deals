'use client';
import Papa from 'papaparse';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIguanaToChartjs } from '../hooks/chartHook';
import { useEffect, useState, useCallback } from 'react';
import StackedBarChart from '../reactChart/stackedBarChart';
import SynchonizedLineChart from '../reactChart/synchonizedLineChart';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  FaArrowLeft,
  FaChartBar,
  FaDownload,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import NameModal from '@/app/(dashboard)/chart/[chartId]/nameModal';
import { MapService } from '@/app/services/map.service';
import { Statistics } from '@db/models/statistic.model';
import { EDAD_IGUANA, ESTADOS_IGUANA, SEXO } from '@lib/interfaces';
interface ChartProps extends Statistics {
  shapefile_ids: string[];
}
export default function Chart() {
  const routerSearch = useSearchParams();
  const progressDate = routerSearch.get('progressDate');
  const endDate = routerSearch.get('endDate');
  const layersid = routerSearch.get('layersid');
  const WorkespaceId = routerSearch.get('workespaceid');
  const user_id = routerSearch.get('user_id');
  const statName = routerSearch.get('stats_name');
  const router = useRouter();
  console.log(
    'progressDate',
    progressDate,
    'endDate',
    endDate,
    'layersid',
    layersid
  );
  console.log('progresDate', new Date(progressDate));
  const [isModalNameActive, setIsModalNameActive] = useState(false);
  const [processedData, setProcessedData] = useState({});
  const layersId = layersid ? layersid.split(',') : [];

  const { iguanasFetch, shapefilesFetch } = useIguanaToChartjs({
    progressDate: progressDate || '',
    endDate: endDate || '',
    layersid: layersId,
  });

  const pullingData = useCallback(() => {
    if (!iguanasFetch || iguanasFetch.length === 0) return;

    const newProcessedData = {};

    iguanasFetch.forEach((grupo, index) => {
      const grupoKey = `G${index + 1} ${shapefilesFetch[index].name}`;
      newProcessedData[grupoKey] = {
        estado: {},
        edad: {},
        sexo: {},
      };

      grupo.forEach((iguana) => {
        const { estado, edad, sexo } = iguana;

        ['estado', 'edad', 'sexo'].forEach((prop) => {
          newProcessedData[grupoKey][prop][iguana[prop]] =
            (newProcessedData[grupoKey][prop][iguana[prop]] || 0) + 1;
        });
      });
    });

    setProcessedData(newProcessedData);
  }, [iguanasFetch, shapefilesFetch]);

  useEffect(() => {
    pullingData();
  }, [pullingData]);

  if (!iguanasFetch || iguanasFetch.length === 0) return null;

  const prepareStackedBarChartData = (processedData) => {
    const chartData = [];

    Object.keys(processedData).forEach((grupoKey) => {
      const groupData = { name: grupoKey };

      Object.keys(processedData[grupoKey].estado).forEach((estadoKey) => {
        groupData[estadoKey] = processedData[grupoKey].estado[estadoKey];
      });

      chartData.push(groupData);
    });

    return chartData;
  };

  const prepareAgeBarChartData = (processedData) => {
    const chartData = [];

    Object.keys(processedData).forEach((grupoKey) => {
      const groupData = { name: grupoKey };

      Object.keys(processedData[grupoKey].edad).forEach((edadKey) => {
        groupData[edadKey] = processedData[grupoKey].edad[edadKey];
      });

      chartData.push(groupData);
    });

    return chartData;
  };

  const prepareSexoBarChartData = (processedData) => {
    const chartData = [];

    Object.keys(processedData).forEach((grupoKey) => {
      const groupData = { name: grupoKey };

      Object.keys(processedData[grupoKey].sexo).forEach((sexoKey) => {
        groupData[sexoKey] = processedData[grupoKey].sexo[sexoKey];
      });

      chartData.push(groupData);
    });

    return chartData;
  };

  const stackedBarChartData = prepareStackedBarChartData(processedData);
  const ageBarChartData = prepareAgeBarChartData(processedData);
  const sexoBarChartData = prepareSexoBarChartData(processedData);

  const renameKeysInObject = (obj) => {
    const renamedObj = {};
    Object.keys(obj).forEach((key) => {
      if (key === '0') {
        renamedObj['Macho'] = obj[key];
      } else if (key === '1') {
        renamedObj['Hembra'] = obj[key];
      } else {
        renamedObj[key] = obj[key];
      }
    });
    return renamedObj;
  };

  const handleBack = () => {
    router.push(`/maps/map?id=${WorkespaceId}&user_id=${user_id}`);
  };

  const handleSave = () => {
    // Implement save logic here
    setIsModalNameActive(true);
  };

  const stackedBarChartDataDate = sexoBarChartData.map(renameKeysInObject);

  const downloadCSVsAsZip = async (data, baseFilename = 'data') => {
    const zip = new JSZip();

    data.forEach((group, index) => {
      const csv = Papa.unparse(group);
      const filename = `${baseFilename}_grupo_${index + 1}.csv`;
      zip.file(filename, csv);
    });

    const mergedData = data.flat();
    const mergedCSV = Papa.unparse(mergedData);
    const mergedFilename = `${baseFilename}_merged.csv`;
    zip.file(mergedFilename, mergedCSV);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${baseFilename}.zip`);
  };

  const handleDownloadSVGs = () => {
    downloadCSVsAsZip(iguanasFetch);
  };

  const handleModalNameClose = () => {
    setIsModalNameActive(false);
  };

  const handleModalNameSave = async (newName) => {
    const newStatistics: ChartProps = {
      name: newName,
      timeline_init: new Date(progressDate),
      timeline_finish: new Date(endDate),
      user_id: user_id,
      shapefile_ids: layersId,
    };
    await MapService.createStatistics(newStatistics);
    setIsModalNameActive(false);
  };

  return (
    <>
      {isModalNameActive && (
        <NameModal
          handleModalNameClose={handleModalNameClose}
          handleModalNameSave={handleModalNameSave}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg"
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          {statName}
        </motion.h2>
        <div className="relative flex items-center justify-between p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
            onClick={handleBack}
            aria-label="Volver"
          >
            <FaArrowLeft />
          </motion.button>

          <motion.h2
            className="text-3xl font-bold text-gray-800"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            Estado de las Iguanas
          </motion.h2>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
              onClick={handleDownloadSVGs}
              aria-label="Descargar"
            >
              <FaDownload />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200"
              onClick={handleSave}
              aria-label="Guardar"
            >
              <FaSave />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              data: stackedBarChartData,
              icon: FaChartBar,
              title: 'Distribución',
              content: ESTADOS_IGUANA,
            },
            {
              data: ageBarChartData,
              icon: FaChartBar,
              title: 'Edades',
              content: EDAD_IGUANA,
            },
            {
              data: stackedBarChartDataDate,
              icon: FaChartBar,
              title: 'Fechas',
              content: SEXO,
            },
          ].map((chart, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <chart.icon className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">
                  {chart.title}
                </h3>
              </div>
              <div className="h-48">
                <StackedBarChart data={chart.data} content={chart.content} />
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className={`grid gap-6 ${
            iguanasFetch.length === 1
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {iguanasFetch.map((grupo, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Análisis estadístico del grupo:{' '}
                  {`G${index + 1} ${shapefilesFetch[index].name}`}
                </h3>
                <FaInfoCircle
                  className="text-blue-500 cursor-pointer"
                  title={`G${index + 1} ${shapefilesFetch[index].name}`}
                />
              </div>
              <div className="h-fit">
                <SynchonizedLineChart data={grupo} syncId={index} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
