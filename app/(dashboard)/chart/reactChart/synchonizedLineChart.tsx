import { motion } from 'framer-motion';
import { FaChartLine, FaVenusMars } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import { colorMapping } from '@lib/utils';

import { format } from 'date-fns';
import { ESTADOS_IGUANA, EDAD_IGUANA, SEXO } from '@lib/interfaces';
function ChartSection({
  title,
  icon: Icon,
  data,
  syncId,
  dataKeys,
  chartType,
}) {
  const Chart = chartType === 'line' ? LineChart : AreaChart;
  const DataComponent = chartType === 'line' ? Line : Area;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" rounded-lg shadow-sm p-4 mb-6"
    >
      <div className="flex items-center mb-4">
        <Icon className="text-blue-500 mr-2 text-xl" />
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <Chart
          data={data}
          syncId={syncId}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickFormatter={(tick) => format(new Date(tick), 'MM-dd')}
            angle={-45}
            textAnchor="end"
            height={60}
            tickMargin={10}
          />
          <YAxis />

          <Tooltip />
          {dataKeys.map((key) => {
            const Component = DataComponent as React.ComponentType<any>;
            return (
              <Component
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colorMapping[key]}
                fill={colorMapping[key]}
              />
            );
          })}
        </Chart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default function SynchonizedLineChart({ data, syncId }) {
  if (!data || data.length === 0) return;
  const pullingDataForDate = (dataIguana) => {
    const newProcessedData = {};

    dataIguana.forEach((iguana, index) => {
      const fecha = new Date(iguana.register_date).toISOString().split('T')[0];

      const grupoKey = fecha;
      if (!newProcessedData[grupoKey]) {
        newProcessedData[grupoKey] = {
          estado: {},
          edad: {},
          sexo: {},
        };
      }
      const { estado, edad, sexo } = iguana;
      ['estado', 'edad', 'sexo'].forEach((prop) => {
        newProcessedData[grupoKey][prop][iguana[prop]] =
          (newProcessedData[grupoKey][prop][iguana[prop]] || 0) + 1;
      });
    });
    const chartData = [];
    Object.keys(newProcessedData).forEach((grupo, index) => {
      const flatObject = { name: grupo };
      Object.keys(newProcessedData[grupo]).forEach((key) => {
        if (
          typeof newProcessedData[grupo][key] === 'object' &&
          !Array.isArray(newProcessedData[grupo][key])
        ) {
          Object.keys(newProcessedData[grupo][key]).forEach((subKey) => {
            flatObject[subKey] = newProcessedData[grupo][key][subKey];
          });
        } else {
          flatObject[key] = newProcessedData[grupo][key];
        }
      });
      chartData.push(flatObject);
    });

    return chartData;
  };
  const dataPulling = pullingDataForDate(data);

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
  const stackedBarChartDataDate =
    pullingDataForDate(data).map(renameKeysInObject);

  const handleBack = () => {
    // Aquí puedes agregar lógica adicional si es necesario antes de llamar a onBack
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full  rounded-lg pr-6"
    >
      <ChartSection
        title="Estado de las iguanas por tiempo"
        icon={FaChartLine}
        data={stackedBarChartDataDate}
        syncId={syncId}
        dataKeys={ESTADOS_IGUANA}
        chartType="line"
      />

      <ChartSection
        title="Edad de las iguanas por tiempo"
        icon={FaChartLine}
        data={stackedBarChartDataDate}
        syncId={syncId}
        dataKeys={EDAD_IGUANA}
        chartType="line"
      />

      <ChartSection
        title="Sexo de las iguanas por tiempo"
        icon={FaVenusMars}
        data={stackedBarChartDataDate}
        syncId={syncId}
        dataKeys={SEXO}
        chartType="area"
      />
    </motion.div>
  );
}
