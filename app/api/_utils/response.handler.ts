// app/api/_utils/response.handler.ts
import { NextResponse } from 'next/server';
import {
  Responses,
  ApiRestResponse,
  CustomResponse,
} from '@utils/customResponse';

export function ServerError(
  error: unknown,
  key: keyof CustomResponse,
  method: keyof ApiRestResponse,
  status: number = 500
  // ): NextResponse<{ error: string }> {
): NextResponse<{ result: [] }> {
  console.error(Responses[key][method].serverError, error);
  // return NextResponse.json(
  //   { error: Responses[key][method].serverError, stackTrace: error },
  //   { status }
  // );
  return NextResponse.json({ result: [] }, { status });
}

export function ParamsRequired(
  params: string[],
  status: number = 400
  // ): NextResponse<{ error: string }> {
): NextResponse<{ result: [] }> {
  console.error('Params required:', params, 'status', status);
  // return NextResponse.json(
  //   { error: `${params.join(', ')} are required` },
  //   { status }
  // );
  return NextResponse.json({ result: [] }, { status });
}

export function NotFoundError(
  key: keyof CustomResponse,
  method: keyof ApiRestResponse,
  status: number = 200
  // ): NextResponse<{ error: string }> {
): NextResponse<{ result: [] }> {
  console.error(Responses[key][method].notFound);
  // return NextResponse.json(
  //   { error: Responses[key][method].notFound },
  //   { status }
  // );
  return NextResponse.json({ result: [] }, { status });
}

export function Success<T>(
  it: T,
  extra?: string,
  status: number = 200
): NextResponse<{ result: T }> {
  // console.log(`Success`, it);
  if (extra)
    return NextResponse.json(
      {
        result: it,
        extra,
      },
      { status }
    );
  else
    return NextResponse.json(
      {
        result: it,
      },
      { status }
    );
}
