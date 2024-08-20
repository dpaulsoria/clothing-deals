import { query } from '@db/db';
import { Identifier } from '@db/models/indetifier.interface';

export async function updateHandler<T extends Identifier>(
  tableName: string,
  validFields: string[],
  updateFields: Partial<T>
) {
  const setClause: string[] = [];
  const values = [];
  let paramCount = 1;

  Object.entries(updateFields).forEach(([key, value]) => {
    if (validFields.includes(key) && value !== undefined) {
      setClause.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });
  values.push(updateFields.id);

  if (setClause.length === 0) throw new Error('No valid fields to update');

  const sql = `
    UPDATE ${tableName}
    SET ${setClause.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  try {
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateHandler:', error);
    throw error;
  }
}
