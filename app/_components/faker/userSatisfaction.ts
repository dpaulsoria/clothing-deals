import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

interface UserSatisfaction {
  id: string;
  userId: string;
  score: number;
  createdAt: Date;
}

const generateUserSatisfaction = (
  users: User[],
  count: number
): UserSatisfaction[] => {
  return Array.from({ length: count }).map(() => ({
    id: uuidv4(),
    userId: faker.helpers.arrayElement(users).id,
    score: faker.datatype.number({ min: 1, max: 5 }),
    createdAt: faker.date.recent(),
  }));
};
