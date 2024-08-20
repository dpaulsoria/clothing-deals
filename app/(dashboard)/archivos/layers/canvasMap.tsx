'use client';
import React, { useRef, useEffect } from 'react';

export default function CanvasMap({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!canvas || !ctx) {
      console.error('Canvas o contexto no disponible.');
      return;
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar un fondo básico
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calcular los límites (bounding box) de las coordenadas
    const calculateBoundingBox = (coordinates) => {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      coordinates.forEach(([lon, lat]) => {
        if (lon < minX) minX = lon;
        if (lat < minY) minY = lat;
        if (lon > maxX) maxX = lon;
        if (lat > maxY) maxY = lat;
      });

      return { minX, minY, maxX, maxY };
    };

    // Ajustar las coordenadas al canvas
    const fitCoordinatesToCanvas = (coordinates) => {
      const { minX, minY, maxX, maxY } = calculateBoundingBox(coordinates);

      const scaleX = canvas.width / (maxX - minX);
      const scaleY = canvas.height / (maxY - minY);
      const scale = Math.min(scaleX, scaleY) * 0.9; // Ajuste de escala para dejar un margen

      const offsetX = canvas.width / 2 - (scale * (minX + maxX)) / 2;
      const offsetY = canvas.height / 2 - (scale * (minY + maxY)) / 2;

      return coordinates.map(([lon, lat]) => ({
        x: scale * lon + offsetX,
        y: scale * lat + offsetY,
      }));
    };

    // Función para dibujar un punto
    const drawPoint = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 120; // Ajusta el radio del círculo según sea necesario

      ctx.fillStyle = 'rgba(76, 175, 80, 0.5)'; // Color verde translúcido
      ctx.strokeStyle = '#4CAF50'; // Borde verde
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    // Función para dibujar una línea
    const drawLine = (coordinates) => {
      const adjustedCoordinates = fitCoordinatesToCanvas(coordinates);
      ctx.strokeStyle = '#2196F3'; // Color azul
      ctx.lineWidth = 2;
      ctx.beginPath();
      adjustedCoordinates.forEach(({ x, y }, index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    };

    // Función para dibujar un polígono
    const drawPolygon = (coordinates) => {
      const adjustedCoordinates = fitCoordinatesToCanvas(coordinates[0]);
      ctx.fillStyle = 'rgba(76, 175, 80, 0.5)'; // Color verde translúcido
      ctx.strokeStyle = '#4CAF50'; // Borde verde
      ctx.lineWidth = 2;
      ctx.beginPath();
      adjustedCoordinates.forEach(({ x, y }, index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke(); // Dibuja el borde del polígono
    };

    const drawGeometry = (geometry) => {
      switch (geometry.type) {
        case 'Point':
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          drawPoint(geometry.coordinates);
          break;
        case 'LineString':
          drawLine(geometry.coordinates);
          break;
        case 'Polygon':
          drawPolygon(geometry.coordinates);
          break;
        case 'MultiPoint':
          geometry.coordinates.forEach(drawPoint);
          break;
        case 'MultiLineString':
          geometry.coordinates.forEach(drawLine);
          break;
        case 'MultiPolygon':
          geometry.coordinates.forEach(drawPolygon);
          break;
        default:
          console.error('Tipo de geometría no soportado:', geometry.type);
      }
    };

    try {
      const geometry = JSON.parse(data.geometry);

      if (geometry.type) {
        drawGeometry(geometry);
      } else {
        console.error(
          'No se encontró un tipo de geometría válido en los datos.'
        );
      }
    } catch (error) {
      console.error('Error al parsear la geometría:', error);
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={500} // Aumenta el tamaño del canvas si es necesario
      height={400} // Aumenta el tamaño del canvas si es necesario
      className="w-full h-auto"
    />
  );
}
