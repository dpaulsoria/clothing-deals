// app/api/marker/route.ts
/** @swagger
 * tags:
 *   name: Marker
 *   description: API for managing markers
 */

import { NextRequest } from 'next/server';
import {
  createIguanaMarker,
  getIguanaMarkerById,
  getAllIguanaMarkers,
  updateIguanaMarker,
  deleteIguanaMarker,
  Iguana,
  // generateRandomPointAndDateInGalapagos,
  getIguanaMarkerByUserId,
} from '@db/models/iguana.model';
import { booleanValid } from '@turf/boolean-valid';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';
// import { Point } from 'geojson';
import {
  associateAgeClassMarker,
  isValidAgeClassification,
} from '@db/models/age.classification.model';
import {
  associateStateClassMarker,
  isValidStateClassification,
} from '@db/models/state.model';
import { parseEdadIguana, parseEstadoIguana } from '../_repository/util';

const key: keyof CustomResponse = 'marker';

/**
 * @swagger
 * /api/marker:
 *   get:
 *     summary: Retrieve or filter iguanas
 *     tags: [Marker]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: The ID of the iguana
 *       - in: query
 *         name: init
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The start date for the filter
 *       - in: query
 *         name: finish
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The end date for the filter
 *       - in: query
 *         name: shapefileId
 *         schema:
 *           type: integer
 *         required: false
 *         description: The ID of the shapefile to use for filtering
 *       - in: body
 *         name: geometry
 *         schema:
 *           $ref: '#/components/schemas/Geometry'
 *         required: false
 *         description: The GeoJSON geometry to use for filtering
 *     responses:
 *       200:
 *         description: A list of iguanas or a filtered list of iguanas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Iguana'
 *       404:
 *         description: Iguana not found
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  const user_id: string | null = searchParams.get('user_id');
  const page: string | null = searchParams.get('page');
  const limit: string | null = searchParams.get('limit');

  try {
    let result: Iguana | Iguana[];
    if (id) result = await getIguanaMarkerById(id);
    if (user_id) result = await getIguanaMarkerByUserId(user_id);
    if (!id && !user_id) result = await getAllIguanaMarkers();
    if (result && Array.isArray(result) && page && limit) {
      const total: number = result.length;
      const paginatedResult: Iguana[] = result.slice(
        (Number(page) - 1) * Number(limit),
        Number(page) * Number(limit)
      );
      return Success(paginatedResult, total.toString());
    }
    if (result) return Success(result);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /endpoint:
 *   post:
 *     tags: [Marker]
 *     summary: Create a new iguana marker
 *     description: Create a new iguana marker with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - point
 *               - register_date
 *             properties:
 *               user_id:
 *                 type: integer
 *               point:
 *                 $ref: '#/components/schemas/Point'
 *               register_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Created iguana marker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Iguana'
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */ export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, point, register_date, sexo, edad, estado }: Iguana = body;

  if (!user_id || !point || !register_date)
    return ParamsRequired(['user_id', 'point', 'register_date']);

  try {
    // Validar el punto geográfico
    if (!booleanValid(point)) throw new Error('Points must be valid');

    // Procesar ageClass
    let ageClass: number | undefined = undefined;
    let verifyAgeRelation: boolean = false;
    if (edad) {
      ageClass = parseInt(parseEdadIguana(edad), 10);
      if (!isNaN(ageClass) && Number.isInteger(ageClass) && ageClass > 0)
        verifyAgeRelation = await isValidAgeClassification(String(ageClass));
    }

    // Procesar stateClass
    let stateClass: number | undefined = undefined;
    let verifyStateRelation: boolean = false;
    if (estado) {
      stateClass = parseInt(parseEstadoIguana(estado), 10);
      if (
        !isNaN(stateClass) &&
        Number.isInteger(stateClass) &&
        stateClass > 0
      ) {
        verifyStateRelation = await isValidStateClassification(
          String(stateClass)
        );
        console.log(`State class verified:`, verifyStateRelation);
      }
    }

    // Crear el marcador de iguana
    const result = await createIguanaMarker({
      user_id,
      point,
      register_date,
      sexo,
    });

    console.log(`created`, result.id);

    if (result) {
      // Asociar la clase de edad si es válida
      if (verifyAgeRelation)
        await associateAgeClassMarker(result.id, String(ageClass));

      // Asociar la clase de estado si es válida
      if (verifyStateRelation)
        await associateStateClassMarker(result.id, String(stateClass));

      return Success(result);
    } else {
      return NotFoundError(key, 'post');
    }
  } catch (error) {
    console.error('Error processing iguana marker:', error);
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /endpoint:
 *   put:
 *     tags: [Marker]
 *     summary: Update an existing iguana marker
 *     description: Update an existing iguana marker with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               point:
 *                 $ref: '#/components/schemas/Point'
 *               register_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Updated iguana marker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Iguana'
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Iguana marker not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, point, register_date }: Partial<Iguana> = body;

  if (!id) return ParamsRequired(['id']);
  try {
    const result = await updateIguanaMarker({ id, point, register_date });
    if (result) return Success(result);
    return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /endpoint:
 *   delete:
 *     tags: [Marker]
 *     summary: Delete an iguana marker
 *     description: Delete an iguana marker by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the iguana marker to delete
 *     responses:
 *       200:
 *         description: Deleted iguana marker
 *       404:
 *         description: Iguana marker not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);
  try {
    const deletedFeature = await deleteIguanaMarker(id);
    if (deletedFeature) return Success(deletedFeature);
    return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
