import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@components/faker/store';

export interface StoreSatisfaction {
  id: string;
  storeId: string;
  aspect: string;
  score: number;
  createdAt: Date;
}

export const generateStoreSatisfaction = (
  stores: Store[],
  count: number
): StoreSatisfaction[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    storeId: faker.helpers.arrayElement(stores).id,
    aspect: faker.helpers.arrayElement([
      'visibilidad',
      'facilidad de uso',
      'soporte',
      'rendimiento de ventas',
    ]),
    score: faker.datatype.number({ min: 1, max: 5 }),
    createdAt: faker.date.between('2020-01-01', '2024-12-31'),
  }));
};
