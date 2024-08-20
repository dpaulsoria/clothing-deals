import L, { Layer, LatLngBounds } from 'leaflet';
import { Geometry, Point } from 'geojson';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import { RasterFile } from '@/db/models/raster.model';

// import { Iguana } from '@/db/models/iguana.model';
interface rasterDinamicGet {
  id?: string;
  file_name?: string;
  file_path?: string;
  geom?: string;
  upload_date?: string;
}
export interface RastersDinamic extends rasterDinamicGet {
  date: string;
  coordinates: {
    northWest: {
      lat: number;
      lng: number;
    };
    northEast: {
      lat: number;
      lng: number;
    };
    southWest: {
      lat: number;
      lng: number;
    };
    southEast: {
      lat: number;
      lng: number;
    };
  };
}

export const ESTADOS_IGUANA = [
  'Robusta',
  'Saludable',
  'Delgada',
  'Esquelética',
  'Muerta',
];
export const SEXO = ['Macho', 'Hembra'];
export const sexoindex = [0, 1];
export const EDAD_IGUANA = ['Neonatas', 'Jóvenes', 'Adultas', 'Ancianas'];

// export const ESTADOSXEDAD = ESTADOS_IGUANA.flatMap((estado) =>
//   EDAD_IGUANA.map((edad) => `${estado} y ${edad}`)
// );

// export interface Iguana {
//   id?: number;
//   user_id: number;
//   point: Point;
//   register_date?: Date;
//   created_at?: Date;
//   updated_at?: Date;
// }

export interface Iguana {
  id: string;
  user_id?: number;
  sexo: (typeof SEXO)[number];
  estado: (typeof ESTADOS_IGUANA)[number];
  edad: (typeof EDAD_IGUANA)[number];
  coordinates: string;
  fechaCaptura: string;
}

export interface DatosGrafico {
  labels: string[];
  datasets: [
    {
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    },
  ];
}

// interfaces para leaflet
interface Properties {
  selected: boolean;
  visible: boolean;
  name?: string;
  [key: string]: unknown;
}
interface Feature {
  type: 'Feature';
  geometry: Geometry;
  properties: Properties;
}
export interface LayerWithCustomProperties extends Layer {
  id: string;
  feature: Feature;
  getBounds?: () => LatLngBounds;
  toGeoJSON?: () => unknown;
}

interface RasterCustomProperties {
  selected: boolean;
  visible: boolean;
  name?: string;
  opacity?: number;
  [key: string]: unknown;
}

type GeoRasterLayerInstance = InstanceType<typeof GeoRasterLayer>;

// Interfaz principal para rasters con propiedades personalizadas
export interface RasterLayerWithCustomProperties
  extends GeoRasterLayerInstance {
  id: string;
  properties: RasterCustomProperties;
  // getBounds: () => LatLngBounds;
  // setOpacity: (opacity: number) => void;
  // getOpacity: () => number;
}
export interface rasterFront extends RasterFile {
  visible: boolean;
  isDownloaded: boolean;
}
