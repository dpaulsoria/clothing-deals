// app/(dashboard)/maps/google.tsx
'use client';

import React, { memo, useState, useEffect } from 'react';
import Script from 'next/script';
import { GoogleMap, Marker } from '@react-google-maps/api';

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Coordenadas de Puerto Ayora, Islas Galápagos
const center = {
  lat: -0.7393,
  lng: -90.3122,
};

function GoogleMapCustom() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      setIsScriptLoaded(true);
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`}
        strategy="beforeInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      {isScriptLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {/* Agregar cosas aquí */}
        </GoogleMap>
      )}
    </>
  );
}

export default memo(GoogleMapCustom);
