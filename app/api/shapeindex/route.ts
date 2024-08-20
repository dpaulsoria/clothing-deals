// app/api/shapeindex/route.js
/**
 * @swagger
 * tags:
 *   name: Shapeindex
 *   description: API for managing shape indexes
 */

import { NextRequest } from 'next/server';
import {
  saveShapeIndex,
  ShapeIndex,
  getShapeIndexById,
  getAllShapeIndex,
  updateShapeIndex,
  deleteShapeIndexById,
} from '@/db/models/shapeindex.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';
import {
  deleteShapeIndexByWorkspaceId,
  getShapeIndexByWorkspaceId,
} from '@db/models/workspace_files.model';
import { isValidWorkspace } from '@db/models/workspace.model';

const key: keyof CustomResponse = 'shapeindex';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Obligatorios
  const { geom_offset, content_length, user_id, workspace_id } = body;
  // Opcionales
  let { feature_id } = body;
  if (!feature_id) feature_id = 1;

  if (!geom_offset || !content_length || !user_id)
    return ParamsRequired(['geom_offset', 'content_length', 'user_id']);
  let is_global: boolean = await isValidWorkspace(workspace_id);
  if (!workspace_id) is_global = true;

  try {
    const result: ShapeIndex = await saveShapeIndex(
      {
        feature_id,
        geom_offset,
        content_length,
        user_id,
        is_global,
      },
      workspace_id
    );
    if (result) return Success(result);
    else return NotFoundError(key, 'post');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

export async function GET(req: NextRequest) {
  const searchParams: URLSearchParams = req.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  const workspaceId: string | null = searchParams.get('workspace_id');

  try {
    let feature: ShapeIndex | ShapeIndex[];
    if (id) feature = await getShapeIndexById(id);
    else if (workspaceId)
      feature = await getShapeIndexByWorkspaceId(workspaceId);
    else feature = await getAllShapeIndex();
    if (feature) return Success(feature);
    return NotFoundError(key, 'get');
  } catch (error) {
    console.error(`Error occurred while processing GET request:`, error);
    return ServerError(error, key, 'get');
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, feature_id, geom_offset, content_length } = body;
  let { is_global } = body;

  if (!id) return ParamsRequired(['id']);
  if (!is_global) is_global = false;
  try {
    const updateFields: Partial<ShapeIndex> = {
      id,
      feature_id,
      geom_offset,
      content_length,
      is_global,
    };
    const updatedFeature: ShapeIndex = await updateShapeIndex(updateFields);
    if (updatedFeature) return Success(updatedFeature);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, 'user', 'put');
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams: URLSearchParams = req.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  const workspaceId: string | null = searchParams.get('workspace_id');

  if (!id) return ParamsRequired(['id']);
  try {
    if (id) {
      const deletedFeature = await deleteShapeIndexById(id);
      if (deletedFeature) return Success(deletedFeature);
      return NotFoundError(key, 'delete');
    } else {
      let deleted: string[] = [];
      if (workspaceId) {
        deleted = await deleteShapeIndexByWorkspaceId(workspaceId);
        if (deleted.length > 0) return Success(deleted);
      } else return NotFoundError(key, 'delete');
    }
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
