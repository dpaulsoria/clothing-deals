// app/api/filetype/route.ts
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';
import { NextRequest } from 'next/server';
import {
  createFileType,
  deleteFileTypeById,
  FileType,
  getAllFiletypes,
  getFileTypeByExtension,
  getFileTypeById,
  updateFileType,
} from '@db/models/filetype.model';

const key: keyof CustomResponse = 'filetype';

export async function GET(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const extension = searchParams.get('extension');
  try {
    let result: FileType | FileType[];
    if (id) result = await getFileTypeById(Number(id));
    else if (extension) result = await getFileTypeByExtension(extension);
    else result = await getAllFiletypes();
    if (result) return Success(result);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, extension }: FileType = body;
  if (!name || !extension) return ParamsRequired(['name', 'extension']);

  try {
    const result: FileType = await createFileType({
      name,
      extension,
    });
    if (result) return Success(result);
    else return NotFoundError(key, 'post');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, extension }: FileType = body;
  if (!id) return ParamsRequired(['id']);

  try {
    const result: FileType = await updateFileType({
      id,
      name,
      extension,
    });
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);
  try {
    const deletedFeature: FileType = await deleteFileTypeById(id);
    if (deletedFeature) return Success(deletedFeature);
    return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
