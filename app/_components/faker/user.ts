import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'user']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};
