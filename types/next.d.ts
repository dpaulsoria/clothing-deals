// types/next.d.ts
import { IncomingHttpHeaders } from 'http';
import { Readeable } from 'stream';

declare module 'next' {
  import { NextApiRequest } from 'next';
  import { File } from 'multer';

  interface NextApiRequest {
    file?: File;
    files?: File[];
  }
}