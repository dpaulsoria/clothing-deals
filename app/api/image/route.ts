// app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CustomResponse } from '@utils/customResponse';
import axios from 'axios';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { ParamsRequired, ServerError, Success } from '@utils/response.handler';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    console.error('URL parameter is missing');
    return ParamsRequired(['url']);
  }

  try {
    console.log(`Fetching image from URL: ${url}`);
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    if (response.status !== 200) {
      console.error(`Error fetching image, status: ${response.status}`);
      return new NextResponse('Error fetching the image', {
        status: response.status,
      });
    }

    console.log('Image fetched successfully, setting headers...');
    const headers = new Headers();
    headers.set('Content-Type', response.headers['content-type']);

    return new NextResponse(response.data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Error during image fetching:', error);
    return ServerError(error, 'raster' as keyof CustomResponse, 'get');
  }
}

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const validImageExtensions = ['.jpeg', '.jpg', '.png', '.bmp', '.gif', '.webp'];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const description = formData.get('description')?.toString() || 'Image';

  if (!file) return ParamsRequired(['file']);

  const extname = path.extname(file.name).toLowerCase();
  if (!validImageExtensions.includes(extname)) {
    return ParamsRequired(['archivo con una extensión válida']);
  }

  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `original/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    await new Promise<void>((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('BlobStream Error:', err);
        reject(new Error('Error al subir el archivo al bucket de GCS'));
      });

      blobStream.on('finish', resolve);
      blobStream.end(buffer);
    });

    console.log(`Archivo subido a GCS: ${fileName}`);

    // URL pública del archivo
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

    const uploadedFile = {
      file_name: fileName,
      file_path: publicUrl,
      file_size: file.size,
      description,
      file_type: file.type,
    };

    return Success(uploadedFile);
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return ServerError(error, 'user', 'post');
  }
}
