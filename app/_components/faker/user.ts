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
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

// Funciones Faker para exportar los datos a CSV
export const fakerUsers = () => {
  const users = generateUsers(10);
  exportToCSV(users, 'fakerData/users.csv');

  // Generar User Satisfaction basada en los usuarios generados
  const userSatisfaction = generateUserSatisfaction(users, 50);
  exportToCSV(userSatisfaction, 'fakerData/user_satisfaction.csv');
};
