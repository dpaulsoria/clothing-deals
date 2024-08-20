import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { colorMapping } from '@lib/utils';

export default function StackedBarChart({ data, content }) {
  if (!data || data.length === 0) return;
  console.log('data', data);
  const atributesElement = content;
  console.log('atributesElement', atributesElement);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <YAxis />
        <XAxis dataKey="name" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {atributesElement.map((atribute, index) => (
          <Bar
            key={`${atribute}-${index}`}
            dataKey={atribute}
            fill={colorMapping[atribute]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
