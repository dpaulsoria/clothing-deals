// app/api/shapefile/list/route.ts

import { NextRequest } from 'next/server';
import { ParamsRequired, ServerError, Success } from '@utils/response.handler';
import { isValidWorkspace } from '@db/models/workspace.model';
import { Feature, Geometry } from 'geojson';
import { booleanValid } from '@turf/boolean-valid';
import { saveFeature, Shapefile } from '@db/models/shapefile.model';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'shapefile';

// Debe permitir subir una lista de shapefiles, para el mismo workspaceID y userID
// Todos los campos son obligatorios
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shapefiles, user_id, workspace_id } = body;

    // Validación básica
    if (!shapefiles || !Array.isArray(shapefiles) || shapefiles.length === 0)
      return ParamsRequired(['shapefiles']);

    if (!user_id || !workspace_id)
      return ParamsRequired(['user_id', 'workspace_id']);

    const is_global: boolean = await isValidWorkspace(workspace_id);
    console.log(`Is Global: ${is_global} Workspace ID: ${workspace_id}`);

    // Procesar todos los shapefiles en paralelo usando Promise.all
    const savedFeatures: Shapefile[] = await Promise.all(
      shapefiles.map(async (shapefile) => {
        const { name, coordinates, properties } = shapefile;

        if (!name || !coordinates || !Array.isArray(coordinates))
          throw new Error(
            `Missing or invalid name or coordinates for shapefile`
          );

        console.log(`Coor`, coordinates);

        // Crear un objeto Geometry a partir de las coordenadas
        const geometry: Geometry = {
          type: 'Polygon',
          coordinates: coordinates as number[][][],
        };

        // Crear un Feature a partir de la geometría y propiedades proporcionadas
        const feature: Feature = {
          type: 'Feature',
          geometry: geometry,
          properties: properties || {},
        };

        // Validar la geometría
        if (!booleanValid(feature.geometry))
          throw new Error(`Invalid geometry for shapefile: ${name}`);

        // Guardar el feature
        return await saveFeature(
          {
            name,
            geometry: feature.geometry,
            properties: feature.properties,
            user_id,
            is_global,
          },
          workspace_id
        );
      })
    );

    return Success(savedFeatures);
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}
