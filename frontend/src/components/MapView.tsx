'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  lng?: number;
  lat?: number;
  zoom?: number;
}

export default function MapView({
  lng = 73.8567, // Pune, Maharashtra, India
  lat = 18.5204,
  zoom = 11,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

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

    new maplibregl.Marker({ color: '#10B981' })
      .setLngLat([lng, lat])
      .setPopup(new maplibregl.Popup().setHTML('<h3 style="color:#000;font-weight:bold;">Pune, Maharashtra</h3><p style="color:#333;">AgriGuard-AI Target Region</p>'))
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lng, lat, zoom]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
