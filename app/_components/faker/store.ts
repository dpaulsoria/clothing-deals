import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface Store {
  id: string;
  name: string;
  joinedDate: Date;
  marketingTechnique: string;
}

export const generateStores = (count: number): Store[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    name: faker.company.name(),
    joinedDate: faker.date.past(),
    marketingTechnique: faker.helpers.arrayElement([
      'SEO',
      'Social Media',
      'Email Marketing',
    ]),
  }));
};
