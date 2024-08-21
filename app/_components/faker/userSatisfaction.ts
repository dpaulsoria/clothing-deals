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
  const data: UserSatisfaction[] = [];

  // Generar datos distribuidos a lo largo del año con mayor variabilidad
  for (let i = 0; i < count; i++) {
    const randomMonth = faker.datatype.number({ min: 0, max: 11 });
    const randomScore = faker.datatype.number({
      min: 1,
      max: 5,
      precision: 0.05, // Mayor variabilidad en los puntajes
    });

    data.push({
      id: uuidv4(),
      userId: faker.helpers.arrayElement(users).id,
      score: randomScore,
      createdAt: faker.date.between(
        new Date(2024, randomMonth, 1),
        new Date(2024, randomMonth, 28)
      ),
    });
  }

  return data;
};
