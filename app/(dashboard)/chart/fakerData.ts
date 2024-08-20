import { faker } from '@faker-js/faker';
import {
  Iguana,
  EDAD_IGUANA,
  ESTADOS_IGUANA,
  SEXO,
} from '@/app/_lib/interfaces';

// Función para generar una iguana individual
function generarIguana(index: number): Iguana {
  const fechaCaptura = faker.date.past({ years: 2 }); // Capturada en los últimos 2 años
  const estado = faker.helpers.arrayElement(ESTADOS_IGUANA);
  const edad = faker.helpers.arrayElement(EDAD_IGUANA);
  const sexo = faker.helpers.arrayElement(SEXO);

  return {
    id: `IGU${String(index + 1).padStart(3, '0')}`,
    estado,
    edad,
    sexo,
    coordinates: `${faker.location.latitude()},${faker.location.longitude()}`,
    fechaCaptura: fechaCaptura.toISOString(),
  };
}

// Función para generar un conjunto de iguanas
export function generarConjuntoIguanas(cantidad: number): Iguana[] {
  return Array.from({ length: cantidad }, (_, index) => generarIguana(index));
}

// Ejemplo de uso:
// const iguanas = generarConjuntoIguanas(100);
