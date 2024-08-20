// app/api/marker/csv/route.ts
import { NextRequest } from 'next/server';
import { ParamsRequired, ServerError, Success } from '@utils/response.handler';
import { Iguana, createIguanaMarker } from '@db/models/iguana.model';
import { booleanValid } from '@turf/boolean-valid';
import { CustomResponse } from '@utils/customResponse';
import { Point } from 'geojson';
import { EDAD_IGUANA, ESTADOS_IGUANA } from '@lib/interfaces';
import {
  associateAgeClassMarker,
  isValidAgeClassification,
} from '@db/models/age.classification.model';
import {
  associateStateClassMarker,
  isValidStateClassification,
} from '@db/models/state.model';
import { parseEdadIguana, parseEstadoIguana } from '@repository/util';

const key: keyof CustomResponse = 'marker';

export async function POST(request: NextRequest) {
  console.log(`Request`, request);
  const body = await request.json();
  const { results, user_id } = body;
  console.log(`Body`, body);
  if (!user_id) return ParamsRequired(['user_id']);
  if (!results || !Array.isArray(results) || results.length === 0)
    return ParamsRequired(['results']);

  try {
    const res: string[] = await Promise.all(
      results.map(async (item) => {
        console.log(`item`, item);
        const { estado, edad, par_coordenado, fechaCaptura, sexo } = item;
        const coord = par_coordenado.split(',');
        const point: Point = {
          type: 'Point',
          coordinates: [Number(coord[1]), Number(coord[0])],
        };
        const marker: Iguana = {
          user_id,
          point,
          sexo,
          register_date: new Date(fechaCaptura),
        };

        const ageClass = parseInt(parseEdadIguana(edad), 10);
        const stateClass = parseInt(parseEstadoIguana(estado), 10);
        let verifyAgeRelation: boolean = false;
        let verifyStateRelation: boolean = false;

        console.log(`Relation with age`, ageClass);
        console.log(`Relation with state`, stateClass);

        if (!isNaN(ageClass) && Number.isInteger(ageClass) && ageClass > 0) {
          console.log(`Relation with age TRUE`);
          verifyAgeRelation = await isValidAgeClassification(String(ageClass));
          console.log(`Ok`);
        }

        if (
          !isNaN(stateClass) &&
          Number.isInteger(stateClass) &&
          stateClass > 0
        ) {
          console.log(`Relation with state TRUE`);
          verifyStateRelation = await isValidStateClassification(
            String(stateClass)
          );
          console.log(`Ok`);
        }

        if (!booleanValid(point)) throw new Error('Points must be valid');

        const result = await createIguanaMarker(marker);
        /**
         * La asociacion polimorfica en el caso de marker se hace
         * en este metodo, sin embargo en Shapefile, se hace dentro
         * del metodo saveFeature en shapefile.model.ts
         * */
        console.log(`created`, result.id);

        if (result) {
          if (verifyAgeRelation)
            await associateAgeClassMarker(result.id, String(ageClass));
          if (verifyStateRelation)
            await associateStateClassMarker(result.id, String(stateClass));
          return result.id;
        } else throw new Error('Failed to create iguana marker');
      })
    );

    return Success(res.filter((id) => id !== null));
  } catch (error) {
    console.error('Error processing list of iguanas:', error);
    return ServerError(error, key, 'post');
  }
}
