import { EDAD_IGUANA, ESTADOS_IGUANA } from '@lib/interfaces';

/**
 * Valida si un correo electrónico es válido utilizando una expresión regular.
 * @param email - El correo electrónico a validar.
 * @returns `true` si el correo electrónico es válido, `false` en caso contrario.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export function parseEstadoIguana(estado: string): string | null {
  const index: number = ESTADOS_IGUANA.indexOf(estado);
  return index !== -1 ? (index + 1).toString() : null;
}

export function parseEdadIguana(edad: string): string | null {
  const index: number = EDAD_IGUANA.indexOf(edad);
  return index !== -1 ? (index + 1).toString() : null;
}
