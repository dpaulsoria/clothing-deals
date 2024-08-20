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

  // Distribución trimestral: menos datos en Q1 y más en Q4
  const quarterWeights = [0.15, 0.25, 0.3, 0.3];

  // Calculamos cuántos registros deben ir en cada trimestre
  const totalWeights = quarterWeights.reduce((a, b) => a + b, 0);
  const recordsPerQuarter = quarterWeights.map((weight) =>
    Math.round((weight / totalWeights) * count)
  );

  // Generar los datos distribuidos por trimestre
  for (let i = 0; i < 4; i++) {
    const startMonth = i * 3; // Mes de inicio de cada trimestre
    for (let j = 0; j < recordsPerQuarter[i]; j++) {
      data.push({
        id: uuidv4(),
        userId: faker.helpers.arrayElement(users).id,
        score: faker.datatype.number({ min: 1, max: 5 }),
        createdAt: faker.date.between(
          new Date(2024, startMonth, 1),
          new Date(2024, startMonth + 2, 28)
        ),
      });
    }
  }

  return data;
};
