import L, { FeatureGroup, LayerGroup, Marker, Path } from 'leaflet';
import React, { MutableRefObject } from 'react';
import { LayerWithCustomProperties } from '@lib/interfaces';

// function to set up options in leaflet draw control
export const optionsToLeafLetDraw = (
  mapRef: React.RefObject<L.Map | null>,
  featureGroupLayers: MutableRefObject<L.FeatureGroup>
) => {
  const lg: L.FeatureGroup = new FeatureGroup();
  mapRef.current.addLayer(lg);
  featureGroupLayers.current = lg;
  const drawOptions: L.Control.DrawConstructorOptions = {
    position: 'bottomleft',
    draw: {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: "<strong>Oh snap!</strong> you can't draw that!",
        },
        shapeOptions: {
          color: '#97009c',
        },
      },
      polyline: {
        shapeOptions: {
          color: '#f357a1',
          weight: 4,
        },
      },
      // circle: false,
      circle: {
        shapeOptions: {
          color: '#662d91',
        },
      },
      rectangle: {
        shapeOptions: {
          color: '#fbb03b',
        },
      },
      circlemarker: false,
      marker: false,
    },
    edit: {
      featureGroup: lg,
      remove: true,
    },
  };
  return drawOptions;
};

export const createEditableNamePopup = (
  layer: LayerWithCustomProperties,
  initialName: string,
  map: L.Map,
  setJustLayersGroup: React.Dispatch<
    React.SetStateAction<LayerWithCustomProperties[]>
  >
) => {
  const popupContent = document.createElement('div');
  popupContent.style.display = 'inline-block';
  popupContent.style.padding = '5px';
  popupContent.style.backgroundColor = 'white';
  popupContent.style.borderRadius = '4px';
  const input = document.createElement('input');
  input.type = 'text';
  input.value = initialName;
  input.style.fontSize = '14px';
  input.style.padding = '5px';
  input.style.border = 'none';
  input.style.outline = 'none';
  input.style.backgroundColor = 'transparent';
  input.style.width = '80px';
  input.style.textAlign = 'center';
  popupContent.appendChild(input);
  const saveChanges = () => {
    const newName = input.value.trim();
    if (newName && newName !== initialName) {
      setJustLayersGroup((prevLayers) => {
        return prevLayers.map((layerWithProp) => {
          if (
            layerWithProp.feature.properties.id === layer.feature.properties.id
          ) {
            layerWithProp.feature.properties.name = newName;
            layerWithProp.feature.properties.edited = true;
          }
          return layerWithProp;
        });
      });
      map.fire('layernamechange', { layer: layer, newName: newName });
    }
  };

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveChanges();
      e.preventDefault();
      layer.closePopup();
    }
  });
  if (layer instanceof Path || layer instanceof Marker) {
    layer.bindPopup(popupContent, {
      closeButton: false,
      className: 'custom-popup',
    });
  }
  layer.openPopup();
  return popupContent;
};
