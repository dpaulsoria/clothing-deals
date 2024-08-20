import { generateUsers } from '@components/faker/user';
import { exportToCSV } from '@components/papaExport';
import { generateUserSatisfaction } from '@components/faker/userSatisfaction';
import { generateProfitMargins } from '@components/faker/profitMargin';
import { generateStores } from '@components/faker/store';
import { generateStoreSatisfaction } from '@components/faker/storeSatisfaction';

export const fakerUsers = () => {
  const users = generateUsers(10);
  exportToCSV(users, 'users.csv');

  // Generar User Satisfaction basada en los usuarios generados
  const userSatisfaction = generateUserSatisfaction(users, 50);
  exportToCSV(userSatisfaction, 'user_satisfaction.csv');
};

export const fakerProfitMargins = () => {
  const profitMargins = generateProfitMargins(4);
  exportToCSV(profitMargins, 'profit_margins.csv');
};

export const fakerStores = () => {
  const stores = generateStores(5);
  exportToCSV(stores, 'stores.csv');

  // Generar Store Satisfaction basada en las tiendas generadas
  const storeSatisfaction = generateStoreSatisfaction(stores, 20);
  exportToCSV(storeSatisfaction, 'store_satisfaction.csv');
};
