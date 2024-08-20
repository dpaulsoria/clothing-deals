// app/api/_interface/feature.d.ts
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { ShapeIndex } from '@db/models/shapeindex.model';
import { RasterFile } from '@db/models/raster.model';

export interface AllFeatures {
  workspaceId: string;
  shp: Feature<Geometry, GeoJsonProperties>[];
  shx: ShapeIndex[];
  tif: RasterFile[];
}
