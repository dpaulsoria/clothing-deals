// app/api/state/route.ts
/**
 * @swagger
 * tags:
 *   name: State
 *   description: API for managing states
 */

import { NextRequest } from 'next/server';
import {
  createState,
  deleteStateById,
  getAllStates,
  getStateById,
  State,
  updateStateById,
} from '@db/models/state.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'state';

/**
 * @swagger
 * /api/state:
 *   get:
 *     summary: Retrieve all states or a specific state by ID
 *     tags: [State]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: State ID
 *     responses:
 *       200:
 *         description: State(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/State'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/State'
 *       404:
 *         description: State not found
 *       500:
 *         description: Failed to retrieve state(s)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  try {
    let result: State | State[] | null;
    if (id) result = await getStateById(id);
    else result = await getAllStates();
    if (result) return Success(result);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /api/state:
 *   post:
 *     summary: Create a new state
 *     tags: [State]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: State name
 *                 example: "California"
 *               description:
 *                 type: string
 *                 description: State description
 *                 example: "The Golden State"
 *     responses:
 *       201:
 *         description: State created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create state
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description }: State = body;
  if (!name || !description) return ParamsRequired(['name', 'description']);

  try {
    const result = await createState({ name, description });
    if (result) return Success(result);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /api/state:
 *   put:
 *     summary: Update a state by ID
 *     tags: [State]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: State ID
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: State name
 *                 example: "California"
 *               description:
 *                 type: string
 *                 description: State description
 *                 example: "The Golden State"
 *     responses:
 *       200:
 *         description: State updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: State not found
 *       500:
 *         description: Failed to update state
 */
export async function PUT(request: NextRequest) {
  const stateData: Partial<State> = await request.json();
  if (!stateData.id) return ParamsRequired(['id']);
  if (Object.keys(stateData).length === 1)
    return ParamsRequired(['name', 'description']);

  try {
    const result = await updateStateById(stateData);
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /api/state:
 *   delete:
 *     summary: Delete a state by ID
 *     tags: [State]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: State ID
 *     responses:
 *       200:
 *         description: State deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: State not found
 *       500:
 *         description: Failed to delete state
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);
  try {
    const result = await deleteStateById(id);
    if (result) return Success(result);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
