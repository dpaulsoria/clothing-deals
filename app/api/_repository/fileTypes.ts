// app/api/_repository/fileTypes.ts
export const fileTypes: {
  [key: string]: { id: string; table: string; parameters: string[] };
} = {
  shp: {
    id: '1',
    table: '"GPG_SHAPEFILE"',
    parameters: [
      'id',
      'name',
      'ST_AsGeoJSON(geometry) AS geometry',
      'properties',
      'user_id',
      'is_global',
      'created_at',
      'updated_at',
    ],
  },
  shx: {
    id: '2',
    table: '"GPG_SHAPEINDEX"',
    parameters: [
      'id',
      'feature_id',
      'geom_offset',
      'content_length',
      'user_id',
      'is_global',
      'created_at',
      'updated_at',
    ],
  },
  tif: {
    id: '3',
    table: '"GPG_RASTERS"',
    parameters: [
      'id',
      'file_name',
      'file_path',
      'file_size',
      'description',
      'user_id',
      'ST_SRID(geom) as srid',
      'ST_AsGeoJSON(geom) AS geom',
      'raster_type',
      'is_global',
      'upload_date',
      'created_at',
      'updated_at',
    ],
  },
};
