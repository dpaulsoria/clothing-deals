import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

interface ProfitMargin {
  id: string;
  actualMargin: number;
  targetMargin: number;
  quarter: string;
  deviation: number;
  createdAt: Date;
}

const generateProfitMargins = (count: number): ProfitMargin[] => {
  return Array.from({ length: count }).map(() => {
    const targetMargin = faker.datatype.number({ min: 10, max: 30 });
    const actualMargin = faker.datatype.number({ min: 5, max: 35 });
    return {
      id: uuidv4(),
      actualMargin,
      targetMargin,
      quarter: faker.helpers.arrayElement([
        'Q1 2024',
        'Q2 2024',
        'Q3 2024',
        'Q4 2024',
      ]),
      deviation: ((actualMargin - targetMargin) / targetMargin) * 100,
      createdAt: faker.date.recent(),
    };
  });
};
