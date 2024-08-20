// app/api/shapefile/route.js
/**
 * @swagger
 * tags:
 *   name: Shapefile
 *   description: API for managing geometries and shapefiles
 */

import { NextRequest } from 'next/server';
import { booleanValid } from '@turf/boolean-valid';
import {
  getFeatureById,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateFeature,
  getAllFeatures,
  deleteFeatureById,
  Shapefile,
  saveFeature,
} from '@/db/models/shapefile.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import {
  deleteFeaturesByWorkspaceId,
  getFeaturesByWorkspaceId,
} from '@db/models/workspace_files.model';
import { isValidWorkspace } from '@db/models/workspace.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'shapefile';

/**
 * @swagger
 * /api/shapefile:
 *   post:
 *     summary: Create a new shapefile
 *     tags: [Shapefile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the shapefile
 *                 example: "Prueba SHP"
 *               geometry:
 *                 type: object
 *                 description: GeoJSON geometry of the shapefile
 *                 example:
 *                   type: "Polygon"
 *                   coordinates:
 *                     -
 *                       - [-79.6308099, -2.1675496]
 *                       - [-79.63151180275773, -2.167555146870117]
 *                       - [-79.63150361265885, -2.166805675012526]
 *                       - [-79.6286467, -2.1666141]
 *                       - [-79.6286488, -2.1672795]
 *                       - [-79.6283393, -2.167312]
 *                       - [-79.62838325427322, -2.168406080947136]
 *                       - [-79.6308063, -2.1684498]
 *                       - [-79.6308099, -2.1675496]
 *               properties:
 *                 type: object
 *                 description: Properties of the shapefile
 *                 example: {}
 *               user_id:
 *                 type: integer
 *                 description: User ID associated with the shapefile
 *                 example: 7
 *               is_global:
 *                 type: boolean
 *                 description: Indicates if the shapefile is global
 *                 example: false
 *               workspaceId:
 *                 type: integer
 *                 description: Workspace ID associated with the shapefile
 *                 example: 1
 *     responses:
 *       200:
 *         description: Shapefile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shapefile'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, geometry, properties, user_id, workspace_id } = body;

  if (!name || !geometry || !user_id)
    return ParamsRequired(['name', 'geometry', 'user_id']);
  const is_not_global: boolean = await isValidWorkspace(workspace_id);
  console.log(`Is Not Global ${is_not_global} ${workspace_id}`);
  try {
    // Crear un Feature a partir de la geometría y propiedades proporcionadas
    const feature: Feature = {
      type: 'Feature',
      geometry: geometry as Geometry,
      properties: properties || {},
    };

    // Validar la geometría
    if (!booleanValid(feature.geometry)) throw new Error('Invalid geometry');

    // Guardar el feature
    const savedFeature: Shapefile = await saveFeature(
      {
        name,
        geometry: feature.geometry,
        properties: feature.properties,
        user_id,
        is_global: !is_not_global,
      },
      workspace_id
    );

    return Success(savedFeature);
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /api/shapefile:
 *   get:
 *     summary: Retrieve a shapefile by ID or all shapefiles, optionally by workspace ID
 *     tags: [Shapefile]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Shapefile ID
 *       - in: query
 *         name: workspace_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Workspace ID to filter shapefiles
 *     responses:
 *       200:
 *         description: Shapefile(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Shapefile'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shapefile'
 *       404:
 *         description: Shapefile not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const searchParams: URLSearchParams = req.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  const workspaceId: string | null = searchParams.get('workspace_id');
  console.log(`Workspace ID`, id, workspaceId);
  try {
    let feature: Shapefile | Shapefile[];
    if (id) feature = await getFeatureById(id);
    else if (workspaceId) feature = await getFeaturesByWorkspaceId(workspaceId);
    else feature = await getAllFeatures();
    if (feature) return Success(feature);
    return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /api/shapefile:
 *   put:
 *     summary: Update a shapefile by ID
 *     tags: [Shapefile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Shapefile ID
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the shapefile
 *                 example: "Prueba SHP"
 *               geometry:
 *                 type: object
 *                 description: GeoJSON geometry of the shapefile
 *                 example: { "type": "Polygon", "coordinates": [...] }
 *               properties:
 *                 type: object
 *                 description: Properties of the shapefile
 *                 example: {}
 *               is_global:
 *                 type: boolean
 *                 description: Indicates if the shapefile is global
 *                 example: false
 *     responses:
 *       200:
 *         description: Shapefile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feature updated successfully
 *                 feature:
 *                   $ref: '#/components/schemas/Shapefile'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Shapefile not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, geometry, properties } = body;
  let { is_global } = body;

  if (!id) return ParamsRequired(['id']);
  if (!is_global) is_global = false;
  try {
    const updateFields: Partial<Shapefile> = {
      id,
      name,
      geometry,
      properties,
      is_global,
    };
    const updatedFeature = await updateFeature(updateFields);
    if (updatedFeature) return Success(updatedFeature);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, 'user', 'put');
  }
}

/**
 * @swagger
 * /api/shapefile:
 *   delete:
 *     summary: Delete a shapefile by ID or by workspace ID
 *     tags: [Shapefile]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Shapefile ID
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Workspace ID
 *     responses:
 *       200:
 *         description: Shapefile(s) deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Shapefile'
 *                 - type: array
 *                   items:
 *                     type: integer
 *                     description: Deleted shapefile IDs
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Shapefile not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id: string | null = searchParams.get('id');
  const workspaceId: string | null = searchParams.get('workspaceId');
  if (!id) return ParamsRequired(['id']);
  try {
    if (id) {
      const deletedFeature = await deleteFeatureById(id);
      if (deletedFeature) return Success(deletedFeature);
      return NotFoundError(key, 'delete');
    } else {
      let deleted: string[] = [];
      if (workspaceId) {
        deleted = await deleteFeaturesByWorkspaceId(workspaceId);
        if (deleted.length > 0) return Success(deleted);
      } else return NotFoundError(key, 'delete');
    }
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
