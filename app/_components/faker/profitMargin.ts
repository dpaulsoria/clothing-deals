import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface ProfitMargin {
  id: string;
  actualMargin: number;
  targetMargin: number;
  quarter: string;
  deviation: number;
  createdAt: Date;
}

export const generateProfitMargins = (count: number): ProfitMargin[] => {
  return Array.from({ length: count }).map(() => {
    const targetMargin = faker.datatype.number({ min: 10, max: 30 });
    const actualMargin = faker.datatype.number({ min: 5, max: 35 });
    const year = faker.date.between('2020-01-01', '2024-12-31').getFullYear();
    const quarter = faker.helpers.arrayElement([
      `Q1 ${year}`,
      `Q2 ${year}`,
      `Q3 ${year}`,
      `Q4 ${year}`,
    ]);
    return {
      id: uuidv4(),
      actualMargin,
      targetMargin,
      quarter,
      deviation: ((actualMargin - targetMargin) / targetMargin) * 100,
      createdAt: faker.date.between('2020-01-01', '2024-12-31'),
    };
  });
};
