// src/app/worker/dashboard/WorkerMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

function AutoFitBounds({ bounds }: { bounds: LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

const workerIcon = L.divIcon({
  className: 'worker-location-icon',
  html: renderToStaticMarkup(
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
      <div style={{ position: 'absolute', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.25)', animation: 'pulse-ring 2s ease-out infinite' }}></div>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', border: '2px solid #fff' }}></div>
      <style>{` @keyframes pulse-ring { 0% { transform: scale(0.33); opacity: 1; } 80%, 100% { transform: scale(2); opacity: 0; } } `}</style>
    </div>
  ),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Updated to use a simple div icon instead of external image URLs
const clientIcon = L.divIcon({
  className: 'client-location-icon',
  html: renderToStaticMarkup(
    <div style={{ 
      width: '25px', 
      height: '41px', 
      background: '#10b981', 
      borderRadius: '50% 50% 50% 0',
      transform: 'rotate(-45deg)',
      border: '2px solid #fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: '8px',
        height: '8px',
        background: '#fff',
        borderRadius: '50%'
      }}></div>
    </div>
  ),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function WorkerMap({ 
    workerPosition, 
    clientPosition, 
    route 
}: { 
    workerPosition: LatLngExpression, 
    clientPosition: LatLngExpression | null,
    route: LatLngExpression[] | null
}) {
  const bounds = route ? new LatLngBounds(route as [number, number][]) : null;

  return (
    <MapContainer center={workerPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
      {bounds && <AutoFitBounds bounds={bounds} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={workerPosition} icon={workerIcon}>
        <Popup>Your current location</Popup>
      </Marker>
      {clientPosition && (
        <Marker position={clientPosition} icon={clientIcon}>
          <Popup>Client's Destination</Popup>
        </Marker>
      )}
      {route && <Polyline positions={route} color="#3b82f6" weight={5} />}
    </MapContainer>
  );
}