// app/api/workspace/route.ts
/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: API for managing workspaces
 */

import { NextRequest } from 'next/server';
import {
  createWorkspace,
  getWorkspaceById,
  getWorkspaceByUserId,
  updateWorkspaceById,
  deleteWorkspaceById,
  getAllWorkspaces,
  Workspace,
} from '@db/models/workspace.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'workspace';

/**
 * @swagger
 * /api/workspace:
 *   get:
 *     summary: Get a workspace by ID, user ID or all workspaces
 *     tags: [Workspace]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Workspace ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID
 *     responses:
 *       200:
 *         description: Workspaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Workspace'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workspace'
 *       404:
 *         description: Workspace not found
 *       500:
 *         description: Failed to fetch workspace
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const user_id = searchParams.get('user_id');
  try {
    let result: Workspace | Workspace[];
    if (id) result = await getWorkspaceById(id);
    else if (user_id) result = await getWorkspaceByUserId(user_id);
    else result = await getAllWorkspaces();
    if (result) return Success(result);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /api/workspace:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: User ID
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Workspace name
 *                 example: "My Workspace"
 *               description:
 *                 type: string
 *                 description: Workspace description
 *                 example: "This is a description"
 *               is_global:
 *                 type: boolean
 *                 description: Is the workspace global
 *                 example: false
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create workspace
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, name, description } = body;
  let { is_global, state } = body;
  // Set is_global = false by default
  if (!user_id || !name || !description)
    return ParamsRequired(['user_id', 'name', 'description']);
  if (!is_global) is_global = false;
  if (!state) state = 0;
  try {
    const result = await createWorkspace({
      user_id,
      name,
      description,
      state,
      is_global,
    });
    if (result) return Success(result);
    else return NotFoundError(key, 'post');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /api/workspace:
 *   put:
 *     summary: Update a workspace by ID
 *     tags: [Workspace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Workspace ID
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Workspace name
 *                 example: "Updated Workspace"
 *               description:
 *                 type: string
 *                 description: Workspace description
 *                 example: "This is an updated description"
 *               is_global:
 *                 type: boolean
 *                 description: Is the workspace global
 *                 example: false
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Workspace not found
 *       500:
 *         description: Failed to update workspace
 */
export async function PUT(request: NextRequest) {
  const workspaceData: Partial<Workspace> = await request.json();
  if (!workspaceData.id) return ParamsRequired(['id']);
  if (Object.keys(workspaceData).length === 1)
    return ParamsRequired(['user_id', 'name', 'description', 'is_global']);
  try {
    const result = await updateWorkspaceById(workspaceData);
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /api/workspace:
 *   delete:
 *     summary: Delete a workspace by ID
 *     tags: [Workspace]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Workspace not found
 *       500:
 *         description: Failed to delete workspace
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);

  try {
    const result = await deleteWorkspaceById(id);
    if (result) return Success(result);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
