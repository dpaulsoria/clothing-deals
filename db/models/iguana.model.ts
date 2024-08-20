// db/models/iguana.model.ts
import { query } from '@db/db';
import { Geometry, Point } from 'geojson';
import { QueryResult } from 'pg';
import { updateHandler } from '@utils/update.handler';
import { Statistics } from '@db/models/statistic.model';
import { getGeoJSONById } from '@db/models/shapefile.model';

const TABLE: string = '"GPG_IGUANA"';
const TABLE_STATE: string = '"GPG_STATE"';
const TABLE_AGE_CLASS: string = '"GPG_AGE_CLASSIFICATION"';
const TABLE_ASSOCIATE_STATE: string = '"GPG_STATE_IGUANA"';
const TABLE_ASSOCIATE_AGE_CLASS: string = '"GPG_AGE_CLASS_IGUANA"';

export interface Iguana {
  id?: string;
  user_id: string;
  point?: Point;
  sexo: number;
  register_date?: Date;
  estado?: string;
  edad?: string;
  created_at?: Date;
  updated_at?: Date;
}

export function generateRandomPointAndDateInGalapagos(): {
  point: Point;
  register_date: Date;
} {
  // Coordenadas para la zona de las Islas Galápagos
  const latMin = -1.45;
  const latMax = -0.6;
  const lonMin = -91.7;
  const lonMax = -90.3;

  // Generar un punto aleatorio dentro de las coordenadas
  const latitude = Math.random() * (latMax - latMin) + latMin;
  const longitude = Math.random() * (lonMax - lonMin) + lonMin;

  const point: Point = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  // Generar una fecha aleatoria dentro de los últimos 2 meses
  const now = new Date();
  const pastTwoMonths = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    now.getDate()
  );
  const register_date = new Date(
    pastTwoMonths.getTime() +
      Math.random() * (now.getTime() - pastTwoMonths.getTime())
  );

  return {
    point,
    register_date,
  };
}

// Crear un nuevo marcador de iguana
export async function createIguanaMarker(
  iguanaMarker: Iguana
): Promise<Iguana> {
  let registerDateValue: string = '$4';
  if (!iguanaMarker.register_date) registerDateValue = 'NOW()';
  const result: QueryResult<Iguana> = await query(
    `INSERT INTO ${TABLE} (user_id, sexo, point, register_date, created_at, updated_at) 
     VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326), ${registerDateValue}, NOW(), NOW()) RETURNING *`,
    [
      iguanaMarker.user_id,
      iguanaMarker.sexo,
      JSON.stringify(iguanaMarker.point),
      iguanaMarker.register_date,
    ]
  );
  return result.rows[0];
}

export async function getIguanaMarkerById(id: string): Promise<Iguana> {
  const result: QueryResult<Iguana> = await query(
    `SELECT 
        iguana.id, 
        iguana.user_id, 
        ST_AsGeoJSON(iguana.point) as point, 
        iguana.register_date, 
        iguana.created_at, 
        iguana.updated_at,
        state.name as estado,
        age_class.name as edad,
        iguana.sexo as sexo
     FROM ${TABLE} iguana
     LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
     LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
     LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
     LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
     WHERE iguana.id = $1`,
    [id]
  );
  return result.rows[0];
}

// Obtener un marcador de iguana por su User ID
export async function getIguanaMarkerByUserId(
  user_id: string
): Promise<Iguana[]> {
  const result: QueryResult<Iguana> = await query(
    `SELECT 
        iguana.id, 
        iguana.user_id, 
        ST_AsGeoJSON(iguana.point) as point, 
        iguana.register_date, 
        iguana.created_at, 
        iguana.updated_at,
        state.name as estado,
        age_class.name as edad,
        iguana.sexo as sexo
     FROM ${TABLE} iguana
     LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
     LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
     LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
     LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
     WHERE iguana.user_id = $1`,
    [user_id]
  );
  return result.rows;
}

function convertEcuadorDateToUTCStartAndEnd(dateString, isStartOfDay) {
  const localDate = new Date(dateString);
  localDate.setHours(localDate.getHours() - 5);
  if (isStartOfDay)
    localDate.setUTCHours(0, 0, 0, 0); // 00:00:00.000 UTC
  else localDate.setUTCHours(23, 59, 59, 999);
  return localDate.toISOString();
}

export async function getAllIguanaMarkers(): Promise<Iguana[]> {
  const result: QueryResult<Iguana> = await query(
    `SELECT 
        iguana.id, 
        iguana.user_id, 
        ST_AsGeoJSON(iguana.point) as point, 
        iguana.register_date, 
        iguana.created_at, 
        iguana.updated_at,
        state.name as estado,
        age_class.name as edad,
        iguana.sexo as sexo
     FROM ${TABLE} iguana
     LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
     LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
     LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
     LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id`
  );
  return result.rows;
}

export async function getIguanaMarkerFilterById(
  shapefileId: string,
  init: string,
  finish: string
): Promise<Iguana[]> {
  const shapefileResult: Geometry = await getGeoJSONById(shapefileId);
  console.log(
    `getIguanaMarkerFilterById`,
    init,
    convertEcuadorDateToUTCStartAndEnd(init, true),
    finish,
    convertEcuadorDateToUTCStartAndEnd(finish, false)
  );
  if (!shapefileResult)
    throw new Error(`Shapefile with ID ${shapefileId} not found`);
  return await getIguanaMarkerFilterByGeometry(
    shapefileResult,
    convertEcuadorDateToUTCStartAndEnd(init, true),
    convertEcuadorDateToUTCStartAndEnd(finish, false)
  );
}

export async function getIguanaMarkerByDate(
  init: string,
  finish: string
): Promise<Iguana[]> {
  console.log(
    `getIguanaMarkerByDate`,
    convertEcuadorDateToUTCStartAndEnd(init, true),
    convertEcuadorDateToUTCStartAndEnd(finish, false)
  );
  const queryText: string = `
    SELECT 
        iguana.id, 
        iguana.user_id, 
        ST_AsGeoJSON(iguana.point) as point, 
        iguana.register_date, 
        iguana.created_at, 
        iguana.updated_at,
        state.name as estado,
        age_class.name as edad,
        iguana.sexo as sexo
    FROM ${TABLE} iguana
    LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
    LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
    LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
    LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
    WHERE 
        iguana.register_date BETWEEN $1 AND $2;
  `;
  const result: QueryResult<Iguana> = await query(queryText, [
    convertEcuadorDateToUTCStartAndEnd(init, true),
    convertEcuadorDateToUTCStartAndEnd(finish, false),
  ]);
  return result.rows;
}

export async function getIguanaMarkerFilterByGeometry(
  geometry: Geometry,
  init: string,
  finish: string,
  properties?: { radius: number } // Aceptar properties solo si es Point
): Promise<Iguana[]> {
  let queryText: string;
  let parameters: any[];

  if (geometry.type === 'Point' && properties?.radius) {
    const radiusInMeters = properties.radius;

    queryText = `
      SELECT 
          iguana.id, 
          iguana.user_id, 
          ST_AsGeoJSON(iguana.point) as point, 
          iguana.register_date, 
          iguana.created_at, 
          iguana.updated_at,
          state.name as estado,
          age_class.name as edad,
          iguana.sexo as sexo
      FROM ${TABLE} iguana
      LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
      LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
      LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
      LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
      WHERE 
          ST_DWithin(
            iguana.point::geography, 
            ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)::geography, 
            $2
          ) AND
          iguana.register_date BETWEEN $3 AND $4;
    `;
    parameters = [
      JSON.stringify(geometry),
      radiusInMeters,
      convertEcuadorDateToUTCStartAndEnd(init, true),
      convertEcuadorDateToUTCStartAndEnd(finish, false),
    ];
  } else {
    queryText = `
      SELECT 
          iguana.id, 
          iguana.user_id, 
          ST_AsGeoJSON(iguana.point) as point, 
          iguana.register_date, 
          iguana.created_at, 
          iguana.updated_at,
          state.name as estado,
          age_class.name as edad,
          iguana.sexo as sexo
      FROM ${TABLE} iguana
      LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
      LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
      LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
      LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
      WHERE 
          ST_Intersects(iguana.point, ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)) AND
          iguana.register_date BETWEEN $2 AND $3;
    `;

    parameters = [
      JSON.stringify(geometry),
      convertEcuadorDateToUTCStartAndEnd(init, true),
      convertEcuadorDateToUTCStartAndEnd(finish, false),
    ];
  }

  console.log(`Query Text`, queryText);
  const result: QueryResult<Iguana> = await query(queryText, parameters);
  return result.rows;
}

export async function getIguanaMarkerFilterById_NoDate(
  shapefileId: string
): Promise<Iguana[]> {
  console.log(`Get Iguana Marker Filter By Id`, shapefileId);
  const shapefileResult: Geometry = await getGeoJSONById(shapefileId);
  console.log(`Resu`, shapefileResult);
  if (!shapefileResult)
    throw new Error(`Shapefile with ID ${shapefileId} not found`);
  console.log(`ShapeRes`);
  return await getIguanaMarkerFilterByGeometry_NoDate(shapefileResult);
}

export async function getIguanaMarkerFilterByGeometry_NoDate(
  geometry: Geometry
): Promise<Iguana[]> {
  console.log(`Get Iguana Marker Filter By Geometry`, geometry);

  const geoJSON: string = JSON.stringify(geometry);
  console.log(`geoJson`, geoJSON);

  const queryText: string = `
    SELECT 
        iguana.id, 
        iguana.user_id, 
        ST_AsGeoJSON(iguana.point) as point, 
        iguana.register_date, 
        iguana.created_at, 
        iguana.updated_at,
        state.name as estado,
        age_class.name as edad,
        iguana.sexo as sexo
    FROM ${TABLE} iguana
    LEFT JOIN ${TABLE_ASSOCIATE_STATE} si ON iguana.id = si.iguana_id
    LEFT JOIN ${TABLE_STATE} state ON si.state_id = state.id
    LEFT JOIN ${TABLE_ASSOCIATE_AGE_CLASS} aci ON iguana.id = aci.iguana_id
    LEFT JOIN ${TABLE_AGE_CLASS} age_class ON aci.age_class_id = age_class.id
    WHERE 
        ST_Intersects(iguana.point, ST_SetSRID(ST_GeomFromGeoJSON($1), 4326))
  `;

  const result: QueryResult<Iguana> = await query(queryText, [geoJSON]);
  return result.rows;
}

// Actualizar un marcador de iguana por su ID
export async function updateIguanaMarker(
  iguanaMarker: Partial<Iguana>
): Promise<Iguana> {
  const validIguanaMarkerFiels = ['point', 'register_date', 'sexo'];
  return await updateHandler<Iguana>(
    TABLE,
    validIguanaMarkerFiels,
    iguanaMarker
  );
}

// Eliminar un marcador de iguana por su ID
export async function deleteIguanaMarker(id: string): Promise<Iguana> {
  const result: QueryResult<Iguana> = await query(
    `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
