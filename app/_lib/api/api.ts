import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fileName } = req.query;
    
    // Asegúrate de que esta ruta coincida con la ubicación real de tus archivos
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, fileName as string);

    try {
        const imageBuffer = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);
        res.setHeader('Content-Type', contentType);
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        res.status(404).json({ error: 'Image not found' });
    }
}

function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.tif':
        case '.tiff':
            return 'image/tiff';
        default:
            return 'application/octet-stream';
    }
}