'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers } from 'lucide-react';

interface MapViewProps {
  geoJsonData: any;
  onSelectParcel: (parcelId: string) => void;
  onSelectMarket: (marketId: string) => void;
  lng?: number;
  lat?: number;
  zoom?: number;
}

export default function MapView({
  geoJsonData,
  onSelectParcel,
  onSelectMarket,
  lng = 73.8567, // Pune
  lat = 18.5204,
  zoom = 10,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [showFarms, setShowFarms] = useState(true);
  const [showMarkets, setShowMarkets] = useState(true);
  const [showConnections, setShowConnections] = useState(true);

  // Initialize map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE || 'https://demotiles.maplibre.org/style.json';

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add empty source for dynamic data updates
      map.current.addSource('food-system', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // 1. Supply Line Layer
      map.current.addLayer({
        id: 'supply-links-layer',
        type: 'line',
        source: 'food-system',
        filter: ['==', ['get', 'feature_type'], 'market_link'],
        paint: {
          'line-color': '#f59e0b',
          'line-width': 1.5,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2]
        }
      });

      // 2. Agricultural Parcels Polygon Fill Layer
      map.current.addLayer({
        id: 'parcels-fill-layer',
        type: 'fill',
        source: 'food-system',
        filter: ['==', ['get', 'feature_type'], 'parcel'],
        paint: {
          'fill-color': [
            'match',
            ['get', 'cultivation_status'],
            'active', '#10b981',
            'inactive', '#ef4444',
            '#f59e0b'
          ],
          'fill-opacity': 0.55
        }
      });

      // 3. Agricultural Parcels Outline Layer
      map.current.addLayer({
        id: 'parcels-outline-layer',
        type: 'line',
        source: 'food-system',
        filter: ['==', ['get', 'feature_type'], 'parcel'],
        paint: {
          'line-color': '#064e3b',
          'line-width': 1.2
        }
      });

      // 4. Wholesale Market Points
      map.current.addLayer({
        id: 'markets-point-layer',
        type: 'circle',
        source: 'food-system',
        filter: ['==', ['get', 'feature_type'], 'market'],
        paint: {
          'circle-radius': 9,
          'circle-color': '#f59e0b',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Event handlers for interactivity
      map.current.on('click', 'parcels-fill-layer', (e) => {
        if (e.features && e.features[0]) {
          const parcelId = e.features[0].properties.parcel_id;
          onSelectParcel(parcelId);
        }
      });

      map.current.on('click', 'markets-point-layer', (e) => {
        if (e.features && e.features[0]) {
          const marketId = e.features[0].properties.market_id;
          onSelectMarket(marketId);
        }
      });

      // Cursor styling
      const setCursorPointer = () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; };
      const resetCursor = () => { if (map.current) map.current.getCanvas().style.cursor = ''; };

      map.current.on('mouseenter', 'parcels-fill-layer', setCursorPointer);
      map.current.on('mouseleave', 'parcels-fill-layer', resetCursor);
      map.current.on('mouseenter', 'markets-point-layer', setCursorPointer);
      map.current.on('mouseleave', 'markets-point-layer', resetCursor);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lng, lat, zoom, onSelectParcel, onSelectMarket]);

  // Update GeoJSON source when data changes
  useEffect(() => {
    if (!map.current || !geoJsonData) return;
    const source = map.current.getSource('food-system') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(geoJsonData);
    }
  }, [geoJsonData]);

  // Layer visibility toggles
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (map.current.getLayer('parcels-fill-layer')) {
      map.current.setLayoutProperty('parcels-fill-layer', 'visibility', showFarms ? 'visible' : 'none');
      map.current.setLayoutProperty('parcels-outline-layer', 'visibility', showFarms ? 'visible' : 'none');
    }
    if (map.current.getLayer('markets-point-layer')) {
      map.current.setLayoutProperty('markets-point-layer', 'visibility', showMarkets ? 'visible' : 'none');
    }
    if (map.current.getLayer('supply-links-layer')) {
      map.current.setLayoutProperty('supply-links-layer', 'visibility', showConnections ? 'visible' : 'none');
    }
  }, [showFarms, showMarkets, showConnections]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map Layer Controls overlay */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-lg shadow-lg z-10 text-xs font-mono space-y-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold border-b border-slate-800 pb-1.5 mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Layer Controls</span>
        </div>

        <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showFarms}
            onChange={(e) => setShowFarms(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
          />
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
          Farms ({geoJsonData?.features?.filter((f: any) => f.properties.feature_type === 'parcel').length || 0})
        </label>

        <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showMarkets}
            onChange={(e) => setShowMarkets(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
          />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          Markets ({geoJsonData?.features?.filter((f: any) => f.properties.feature_type === 'market').length || 0})
        </label>

        <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showConnections}
            onChange={(e) => setShowConnections(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-amber-400 focus:ring-0"
          />
          <span className="w-4 h-0.5 border-b border-dashed border-amber-400 inline-block" />
          Supply Flows
        </label>
      </div>
    </div>
  );
}
