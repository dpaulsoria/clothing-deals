'use client';
import React, { useCallback, useEffect, useState } from 'react';
import L, { Path } from 'leaflet';
import 'leaflet-draw';
import './mapa.css';
import Timeline from '../../_component/timeLine';
import {
  RastersDinamic,
  LayerWithCustomProperties,
  rasterFront,
  EDAD_IGUANA,
} from '@lib/interfaces';
import { Polygon } from 'react-leaflet';

import ToolBarComponent from '../component/toolBarComponents';
import { useLayers } from '../hooks/layerHook';
import { useVectorGrid } from '../hooks/markersHook';
import { useMapInitialization } from '../hooks/mapInitializationHook';
import { useTimeLine } from '../hooks/TimeLineHook';
import { useRouter, useSearchParams } from 'next/navigation';
import { isWithinInterval, parseISO, parse, format } from 'date-fns';
import LayerBarComponent from '../component/layersBarComponent';
import { useModal } from '@/app/_components/modal/LighModal';
import { MapService } from '@/app/services/map.service';
import { Iguana as IguanaPaul } from '@/db/models/iguana.model';
import LoadingScreen from '../../_component/loadingScreen';
import { Shapefile } from '@db/models/shapefile.model';
import { createEditableNamePopup } from './mapActions';
import { useRasters } from '@/app/(dashboard)/maps/hooks/rasterHook';
import MarkerFilterComponent from '@/app/(dashboard)/maps/component/markerFilterComponent';
export default function ClientSideMap() {
  const routerSearch = useSearchParams();
  const WorkespaceId = routerSearch.get('id');
  const user_id = routerSearch.get('user_id');
  const [mapRef] = useMapInitialization();
  const {
    saveEditedLayers,
    ready,
    featureGroupLayers,
    justLayerGroup,
    setJustLayersGroup,
    addLayerExistentRef,
    removeLayerExistentRef,
  } = useLayers(mapRef, parseInt(WorkespaceId));
  const { setRasterDynamic, isRastersDynamicActive, setIsRasterDynamicActive } =
    useRasters(mapRef);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    startDate,
    endDate,
    progressDate,
    setStartDate,
    setEndDate,
    setProgressDate,
  } = useTimeLine();

  const router = useRouter();
  const { addModal } = useModal();
  const [iguanas, setIguanas] = useState<IguanaPaul[]>([]);

  const { setPropertyKey, setIguanaDataVectorGrid } = useVectorGrid(mapRef);

  const creatingLayerFromFetch = async (geoJSON: {
    geometry: any;
    toGeoJSON: () => any;
    properties: {
      name: any;
      selected: any;
      visible: any;
      [key: string]: any;
    };
    id: string;
  }): Promise<Shapefile> => {
    console.log('mira este laYERRR', geoJSON);
    const layerForEndpoint = {
      name: geoJSON.properties.name,
      user_id: user_id,
      workspace_id: WorkespaceId,
      is_global: false,
      properties: geoJSON.properties,
      geometry: geoJSON.geometry,
    };

    return await MapService.saveShapefile(layerForEndpoint);
  };

  const handleCreated = useCallback(
    async (e: L.DrawEvents.Created): Promise<void> => {
      if (!mapRef.current) return;
      const layer: LayerWithCustomProperties =
        e.layer as unknown as LayerWithCustomProperties;
      const geoJSON = e.layer.toGeoJSON();

      let editedName: string = 'Simple linea';
      if (geoJSON.geometry.type !== 'LineString') {
        editedName = `Capa ${
          (featureGroupLayers.current
            ? featureGroupLayers.current.getLayers().length
            : 0) + 1
        }`;
      }
      geoJSON.properties = {
        selected: false,
        visible: true,
        name: editedName,
      };
      if (e.layerType === 'circle') {
        const LayerWithRadius: L.Circle = e.layer as L.Circle;
        geoJSON.properties.radius = LayerWithRadius.options?.radius;
      }
      addIdeTOLAyer(geoJSON, layer, editedName);
      addLayerExistentRef(layer);
    },
    [mapRef, addLayerExistentRef]
  );
  const addIdeTOLAyer = async (geoJSON, layer, editedName) => {
    const layerPostResponse: Shapefile = await creatingLayerFromFetch(geoJSON);
    const customLayer: LayerWithCustomProperties =
      layer as LayerWithCustomProperties;
    geoJSON.properties.id = layerPostResponse.id;
    customLayer.feature = geoJSON;
    createEditableNamePopup(
      customLayer,
      editedName,
      mapRef.current,
      setJustLayersGroup
    );
    removeLayerExistentRef(layer);
    addLayerExistentRef(customLayer);
    setJustLayersGroup((prevLayers) => [customLayer, ...prevLayers]);
  };
  const toggleLayerSelection = useCallback(
    (layerSelected: LayerWithCustomProperties) => {
      if (layerSelected.feature.properties.visible === false) return;
      const isSelected = !layerSelected.feature.properties.selected;
      layerSelected.feature.properties.selected = isSelected;
      if (layerSelected instanceof Path) {
        layerSelected.setStyle({ color: isSelected ? '#ff3388' : '#3388ff' });
      }

      setJustLayersGroup((prevLayers) => {
        return prevLayers.map((layer) =>
          layer.feature.properties.id === layerSelected.feature.properties.id
            ? layerSelected
            : layer
        );
      });
    },
    []
  );

  const toggleLayerVisibility = useCallback(
    (layerToToggle: LayerWithCustomProperties) => {
      if (layerToToggle.feature.properties.selected === true) {
        toggleLayerSelection(layerToToggle);
      }

      setJustLayersGroup((prevLayers) =>
        prevLayers.map((layer) => {
          if (
            layer.feature.properties.id === layerToToggle.feature.properties.id
          ) {
            layer.feature.properties.visible =
              !layer.feature.properties.visible;
            if (layer.feature.properties.visible) {
              addLayerExistentRef(layer);
            } else {
              removeLayerExistentRef(layer);
            }
          }
          return layer;
        })
      );
    },
    [addLayerExistentRef, removeLayerExistentRef, toggleLayerSelection]
  );
  const focusLayer = useCallback(
    (layer: LayerWithCustomProperties) => {
      if (
        mapRef.current &&
        layer.getBounds &&
        typeof layer.getBounds === 'function'
      ) {
        mapRef.current.fitBounds(layer.getBounds());
      }
    },
    [mapRef]
  );

  const hideAllLayers = useCallback(() => {
    justLayerGroup.forEach((layer) => {
      if (layer.feature.properties.visible === true) {
        toggleLayerVisibility(layer);
      }
    });
  }, [justLayerGroup, toggleLayerVisibility]);

  const convertToISOFormat = (date) => {
    return date.toISOString();
  };
  const startOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return convertToISOFormat(newDate);
  };

  const endOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setUTCHours(23, 59, 59, 999);
    return convertToISOFormat(newDate);
  };

  const getMarkersbydate = async (startDate, endDate) => {
    const initDateISO = startOfDay(startDate);
    const finishDateISO = endOfDay(endDate);
    const dataIguanas = await MapService.getMarkersByTimeline(
      initDateISO,
      finishDateISO
    );
    setIguanas(dataIguanas);
    setIguanaDataVectorGrid(filterIguanasByDate(dataIguanas));
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const mapInstance = mapRef.current;

    mapInstance.on(
      L.Draw.Event.CREATED,
      handleCreated as L.LeafletEventHandlerFn
    );
    return () => {
      if (mapInstance) {
        mapInstance.off(
          L.Draw.Event.CREATED,
          handleCreated as L.LeafletEventHandlerFn
        );
      }
    };
  }, [handleCreated, mapRef]);

  const filterIguanasByDate = useCallback(
    (iguanas: IguanaPaul[]) => {
      if (!iguanas) return [];
      return iguanas.filter((iguana) => {
        const iguanaDate: Date = parseISO(
          iguana.register_date as unknown as string
        );
        return isWithinInterval(iguanaDate, {
          start: progressDate,
          end: endDate,
        });
      });
    },
    [endDate, progressDate]
  );
  useEffect(() => {
    getMarkersbydate(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    console.log('progressDate', progressDate);
    setIguanaDataVectorGrid(filterIguanasByDate(iguanas));
  }, [startDate, endDate, progressDate]);

  useEffect(() => {
    if (!mapRef.current) return;
    const updateBounds = () => {
      const bounds = mapRef.current.getBounds();
      const northWest = bounds.getNorthWest();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      const southEast = bounds.getSouthEast();
      const date = new Date(progressDate);
      const rasterData: RastersDinamic = {
        date: format(date, 'yyyy-MM-dd'),
        coordinates: {
          northWest: { lat: northWest.lat, lng: northWest.lng },
          northEast: { lat: northEast.lat, lng: northEast.lng },
          southWest: { lat: southWest.lat, lng: southWest.lng },
          southEast: { lat: southEast.lat, lng: southEast.lng },
        },
      };
      setRasterDynamic(rasterData);
    };
    mapRef.current.on('moveend', updateBounds);
    updateBounds();
    return () => {
      mapRef.current.off('moveend', updateBounds);
    };
  }, [startDate, endDate, progressDate, mapRef, setRasterDynamic]);

  const guardarEstado = () => {
    addModal('Guardado exitosamente');
    saveEditedLayers(justLayerGroup);
  };

  const handleClickEstadisticas = () => {
    // toast

    const selectedLayers = justLayerGroup.filter(
      (layer) => layer.feature.properties.selected
    );
    if (selectedLayers.length !== 0) {
      guardarEstado();
      router.push(
        `/chart/chards?workespaceid=${WorkespaceId}&stats_name=${'Nuevo Análisis'}&user_id=${user_id}&progressDate=${progressDate}&endDate=${endDate}&layersid=${selectedLayers.map((layer) => layer.feature.properties.id).join(',')}`
      );
    }
  };

  const handleSelectChange = (option: string, list: any[]) => {
    console.log('option', option);
    console.log('list', list);

    const iguanasFiltered = iguanas.filter((iguana) => {
      // Verifica si TODOS los filtros coinciden
      const matchesEstado = list.includes(iguana.estado);
      const matchesEdad = list.includes(iguana.edad);
      const matchesSexo = list.includes(iguana.sexo === 0 ? 'Macho' : 'Hembra');

      // Retorna true solo si coincide con estado, edad y sexo
      return matchesEstado && matchesEdad && matchesSexo;
    });

    setPropertyKey(option);
    setIguanaDataVectorGrid(filterIguanasByDate(iguanasFiltered));
  };

  return (
    <>
      <div id="map" className="w-full h-full" />
      <MarkerFilterComponent onFilterChange={handleSelectChange} />

      <>
        <LoadingScreen isLoading={!ready} />

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[400] w-full ">
          <div className=" h-full justify-center  flex flex-row items-end gap-5  ">
            <ToolBarComponent
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              hideAllLayers={hideAllLayers}
              triggerFileInput={guardarEstado}
              setIsRasterDynamicActive={setIsRasterDynamicActive}
              isRastersDynamicActive={isRastersDynamicActive}
              handleClickEstadisticas={handleClickEstadisticas}
            />

            <Timeline
              startDate={startDate}
              endDate={endDate}
              progressDate={progressDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setProgressDate={setProgressDate}
            />
          </div>
        </div>
        {isModalOpen && (
          <LayerBarComponent
            layersGroup={justLayerGroup}
            toggleLayerSelection={toggleLayerSelection}
            focusLayer={focusLayer}
            toggleLayerVisibility={toggleLayerVisibility}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </>
    </>
  );
}
