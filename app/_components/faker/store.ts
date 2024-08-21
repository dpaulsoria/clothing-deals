import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface Store {
  id: string;
  name: string;
  joinedDate: Date;
  marketingTechnique: string;
}

export const generateStores = (count: number): Store[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // Generar datos de los últimos 10 años

  return Array.from({ length: count }).map(() => {
    const year = faker.date
      .between(`${startYear}-01-01`, `${currentYear}-12-31`)
      .getFullYear();
    const joinedDate = faker.date.between(`${year}-01-01`, `${year}-12-31`);

    return {
      id: uuidv4(),
      name: faker.company.name(),
      joinedDate,
      marketingTechnique: faker.helpers.arrayElement([
        'SEO',
        'Social Media',
        'Email Marketing',
      ]),
    };
  });
};
