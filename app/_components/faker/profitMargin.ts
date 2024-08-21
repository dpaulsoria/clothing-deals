import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface ProfitMargin {
  id: string;
  actualMargin: number;
  targetMargin: number;
  month: string;
  year: string;
  deviation: number;
  createdAt: Date;
}

export const generateProfitMargins = (count: number): ProfitMargin[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // Generar datos de los últimos 10 años

  return Array.from({ length: count }).map(() => {
    const targetMargin = faker.datatype.number({ min: 10, max: 30 });
    const actualMargin = faker.datatype.number({ min: 5, max: 35 });
    const year = faker.date
      .between(`${startYear}-01-01`, `${currentYear}-12-31`)
      .getFullYear();
    const month = faker.date
      .between(`${year}-01-01`, `${year}-12-31`)
      .toLocaleString('default', { month: 'long' });

    return {
      id: uuidv4(),
      actualMargin,
      targetMargin,
      month: month,
      year: String(year),
      deviation: ((actualMargin - targetMargin) / targetMargin) * 100,
      createdAt: faker.date.between(`${year}-01-01`, `${year}-12-31`),
    };
  });
};
