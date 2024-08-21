import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

export interface UserSatisfaction {
  id: string;
  userId: string;
  score: number;
  createdAt: Date;
}

export const generateUserSatisfaction = (
  users: User[],
  count: number
): UserSatisfaction[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    userId: faker.helpers.arrayElement(users).id,
    score: faker.datatype.number({ min: 1, max: 5, precision: 0.1 }),
    createdAt: faker.date.between('2020-01-01', '2024-12-31'),
  }));
};
