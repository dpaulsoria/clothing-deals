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
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // Generar datos de los últimos 10 años

  return Array.from({ length: count }).map(() => {
    const year = faker.date
      .between(`${startYear}-01-01`, `${currentYear}-12-31`)
      .getFullYear();
    const createdAt = faker.date.between(`${year}-01-01`, `${year}-12-31`);

    return {
      id: uuidv4(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'user']),
      createdAt,
      updatedAt: faker.date.recent(),
    };
  });
};
