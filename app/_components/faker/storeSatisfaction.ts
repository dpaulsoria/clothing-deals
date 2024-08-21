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
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // Generar datos de los últimos 10 años

  return Array.from({ length: count }).map(() => {
    const year = faker.date
      .between(`${startYear}-01-01`, `${currentYear}-12-31`)
      .getFullYear();
    const createdAt = faker.date.between(`${year}-01-01`, `${year}-12-31`);

    return {
      id: uuidv4(),
      storeId: faker.helpers.arrayElement(stores).id,
      aspect: faker.helpers.arrayElement([
        'visibilidad',
        'facilidad de uso',
        'soporte',
        'rendimiento de ventas',
      ]),
      score: faker.datatype.number({ min: 1, max: 5 }),
      createdAt,
    };
  });
};
