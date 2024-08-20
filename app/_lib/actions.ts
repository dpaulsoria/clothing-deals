import { faker } from '@faker-js/faker';
import * as turf from '@turf/turf';
import { saveAs } from 'file-saver';
import L, { Marker } from 'leaflet';
import { ESTADOS_IGUANA, EDAD_IGUANA, Iguana } from '@lib/interfaces';
import { subMonths } from 'date-fns';
import _ from 'lodash';

export function filterMarkersByLayer(
  markers: Marker[],
  layer: L.Layer
): Marker[] {
  if (layer instanceof L.Circle) {
    const circleCenter = layer.getLatLng();
    const circleRadius = layer.getRadius();

    return markers.filter((marker) => {
      const [lng, lat] = marker.feature.geometry.coordinates;
      const distance = turf.distance(
        [lng, lat],
        [circleCenter.lng, circleCenter.lat],
        { units: 'meters' }
      );
      return distance <= circleRadius;
    });
  } else {
    const geoJSON = (layer as any).toGeoJSON();
    const polygon = turf.feature(geoJSON.geometry);

    return markers.filter((marker) => {
      const [lng, lat] = marker.feature.geometry.coordinates;
      const point = turf.point([lng, lat]);
      const condition = turf.booleanPointInPolygon(point, polygon);
      return condition;
    });
  }
}
function generateIguanaData(
  n: number,
  layer: L.Layer,
  fechaCaptura: Date,
  pastMonth: boolean = false
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoJSON = (layer as any).toGeoJSON();
  let polygon;

  if (geoJSON.geometry.type === 'Point') {
    const center = geoJSON.geometry.coordinates;
    const radius = (layer as L.Circle).getRadius() / 1000;
    polygon = turf.circle(center, radius);
  } else {
    polygon = turf.feature(geoJSON.geometry);
  }

  const bbox = turf.bbox(polygon);

  let csvContent = 'id,user_id,estado,edad,sexo,coordinates,fechaCaptura\n';
  let pointsGenerated = 0;

  const dateFrom = pastMonth ? subMonths(fechaCaptura, 1) : fechaCaptura;
  const dateTo = pastMonth ? fechaCaptura : new Date();

  while (pointsGenerated < n) {
    const point = turf.randomPoint(1, { bbox: bbox });
    if (turf.booleanPointInPolygon(point.features[0], polygon)) {
      const iguana = {
        id: faker.string.uuid(),
        user_id: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
        estado: faker.helpers.arrayElement(ESTADOS_IGUANA),
        edad: faker.helpers.arrayElement(EDAD_IGUANA),
        sexo: faker.helpers.arrayElement([0, 1]),
        coordinates: `"${point.features[0].geometry.coordinates[0]},${point.features[0].geometry.coordinates[1]}"`,
        fechaCaptura: faker.date
          .between({ from: dateFrom, to: dateTo })
          .toISOString(),
      };

      csvContent += `${iguana.id},${iguana.user_id},${iguana.estado},${iguana.edad},${iguana.sexo},${iguana.coordinates},${iguana.fechaCaptura}\n`;
      pointsGenerated++;
    }
  }

  return csvContent;
}

function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}

export function generateAndDownloadIguanaData(
  n: number,
  layer: L.Layer,
  fechaCaptura: Date,
  pastMonth: boolean = false
) {
  const csvContent = generateIguanaData(n, layer, fechaCaptura, pastMonth);
  const fileName = pastMonth
    ? `iguana_data_past_month_${fechaCaptura.toISOString()}.csv`
    : `iguana_data_${fechaCaptura.toISOString()}.csv`;
  downloadCSV(csvContent, fileName);
}

// Exportar la función original si se necesita sin `pastMonth`
export function generateAndDownloadIguanaDataOriginal(
  n: number,
  layer: L.Layer,
  fechaCaptura: Date
) {
  const csvContent = generateIguanaData(n, layer, fechaCaptura);
  downloadCSV(csvContent, `iguana_data_${fechaCaptura.toISOString()}.csv`);
}
