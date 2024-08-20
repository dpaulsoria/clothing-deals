// app/api/raster/dinamic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ParamsRequired, ServerError, Success } from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';
import { query } from '@db/db';
import { filterRasters } from '@/db/models/raster.model';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('body', body);
    const { date, coordinates } = body[0];
    console.log(`date: ${date}, coordinates:`, coordinates);
    if (!date || !coordinates) {
      return ParamsRequired(['date', 'coordinates']);
    }

    const { northWest, northEast, southWest, southEast } = coordinates;

    if (!northWest || !northEast || !southWest || !southEast) {
      return ParamsRequired([
        'northWest',
        'northEast',
        'southWest',
        'southEast',
      ]);
    }

    const queryDate = new Date(date);
    const result = await filterRasters(
      northWest,
      northEast,
      southWest,
      southEast,
      queryDate
    );
    return Success(result);
  } catch (error) {
    console.error('Error in POST /api/raster/dinamic:', error);
    return ServerError(error, 'rasterfile' as keyof CustomResponse, 'post');
  }
}
