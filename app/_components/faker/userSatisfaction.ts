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
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9; // Generar datos de los últimos 10 años

  return Array.from({ length: count }).map(() => {
    const year = faker.date
      .between(`${startYear}-01-01`, `${currentYear}-12-31`)
      .getFullYear();
    const createdAt = faker.date.between(`${year}-01-01`, `${year}-12-31`);

    return {
      id: uuidv4(),
      userId: faker.helpers.arrayElement(users).id,
      score: faker.datatype.number({ min: 1, max: 5, precision: 0.1 }),
      createdAt,
    };
  });
};
