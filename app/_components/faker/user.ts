import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { exportToCSV } from '@components/papaExport';
import { generateUserSatisfaction } from '@components/faker/userSatisfaction';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'user']),
    createdAt: faker.date.between('2020-01-01', '2024-12-31'),
    updatedAt: faker.date.recent(),
  }));
};
