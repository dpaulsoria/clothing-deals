// app/api/ageClassification/route.ts
import { NextRequest } from 'next/server';
import {
  createAgeClassification,
  getAllAgeClassifications,
  getAgeClassificationById,
  AgeClassification,
  deleteAgeClassificationById,
  updateAgeClassificationById,
} from '@db/models/age.classification.model';
import { CustomResponse } from '@utils/customResponse';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';

const key: keyof CustomResponse = 'ageClassification';

export async function GET(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  try {
    let result: AgeClassification | AgeClassification[];
    if (id) result = await getAgeClassificationById(id);
    else result = await getAllAgeClassifications();
    if (result) return Success(result);
    return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description }: AgeClassification = body;

  if (!name || !description) return ParamsRequired(['name', 'description']);
  try {
    const result: AgeClassification = await createAgeClassification({
      name,
      description,
    });
    if (result) return Success(result);
    return NotFoundError(key, 'post');
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, description }: AgeClassification = body;
  if (!id || !name || !description)
    return ParamsRequired(['id', 'name', 'description']);
  try {
    const result = await updateAgeClassificationById({ id, name, description });
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const id: string | null = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);
  try {
    console.log('Id', id);
    const result: AgeClassification = await deleteAgeClassificationById(id);
    console.log('Result', result);
    if (result) return Success(result);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
