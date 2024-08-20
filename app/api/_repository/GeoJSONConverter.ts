// app/api/_repository/GeoJSONConverter.ts
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Position,
} from 'geojson';

type GeoJSONCoordinates = Position | Position[] | Position[][] | Position[][][];

type ShapefilePrep = {
  type: Geometry['type'];
  coordinates: GeoJSONCoordinates;
  properties: GeoJsonProperties;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GeoJSONConverter {
  private readonly geoJSON: FeatureCollection;

  constructor(geoJSON: FeatureCollection) {
    this.geoJSON = geoJSON;
  }

  toWKT(): string[] {
    return this.geoJSON.features.map((feature) =>
      this.geometryToWKT(feature.geometry)
    );
  }

  private getCoordinates(geometry: Geometry): GeoJSONCoordinates {
    switch (geometry.type) {
      case 'Point':
        return geometry.coordinates;
      case 'MultiPoint':
      case 'LineString':
        return geometry.coordinates;
      case 'MultiLineString':
      case 'Polygon':
        return geometry.coordinates;
      case 'MultiPolygon':
        return geometry.coordinates;
      case 'GeometryCollection':
        // Para GeometryCollection, retornamos un array de coordenadas
        return geometry.geometries.map((geom) =>
          this.getCoordinates(geom)
        ) as GeoJSONCoordinates;
      default:
        throw new Error(`Tipo de geometría no soportado: ${geometry}`);
    }
  }

  private geometryToWKT(geometry: Geometry): string {
    switch (geometry.type) {
      case 'Point':
        return `POINT(${this.pointToWKT(geometry.coordinates)})`;
      case 'LineString':
        return `LINESTRING(${this.lineStringToWKT(geometry.coordinates)})`;
      case 'Polygon':
        return `POLYGON(${this.polygonToWKT(geometry.coordinates)})`;
      case 'MultiPoint':
        return `MULTIPOINT(${geometry.coordinates.map(this.pointToWKT).join(', ')})`;
      case 'MultiLineString':
        return `MULTILINESTRING(${geometry.coordinates.map(this.lineStringToWKT).join(', ')})`;
      case 'MultiPolygon':
        return `MULTIPOLYGON(${geometry.coordinates.map(this.polygonToWKT).join(', ')})`;
      case 'GeometryCollection':
        return `GEOMETRYCOLLECTION(${geometry.geometries.map((g) => this.geometryToWKT(g)).join(', ')})`;
      default:
        throw new Error(`Tipo de geometría no soportado: ${geometry}`);
    }
  }

  private pointToWKT(coordinates: Position): string {
    return coordinates.join(' ');
  }

  private lineStringToWKT(coordinates: Position[]): string {
    return coordinates.map(this.pointToWKT).join(', ');
  }

  private polygonToWKT(coordinates: Position[][]): string {
    return `(${coordinates.map((ring) => `(${this.lineStringToWKT(ring)})`).join(', ')})`;
  }

  toGeoPackage(): string {
    // Simulación de conversión a GeoPackage
    return JSON.stringify(this.geoJSON);
  }

  private featureToShapefilePrep(
    feature: Feature<Geometry, GeoJsonProperties>
  ): ShapefilePrep {
    return {
      type: feature.geometry.type,
      coordinates: this.getCoordinates(feature.geometry),
      properties: feature.properties || {},
    };
  }

  prepareForShapefile(): ShapefilePrep[] {
    return this.geoJSON.features.map((feature) =>
      this.featureToShapefilePrep(feature)
    );
  }

  toCSV(): string {
    let csv = 'id,geometry_type,coordinates,properties\n';
    this.geoJSON.features.forEach((feature, index) => {
      csv += `${index},${feature.geometry.type},"${JSON.stringify(this.getCoordinates(feature.geometry))}","${JSON.stringify(feature.properties)}"\n`;
    });
    return csv;
  }

  getGeometryTypesSummary(): { [key: string]: number } {
    const summary: { [key: string]: number } = {};
    this.geoJSON.features.forEach((feature) => {
      const type = feature.geometry.type;
      summary[type] = (summary[type] || 0) + 1;
    });
    return summary;
  }
}
