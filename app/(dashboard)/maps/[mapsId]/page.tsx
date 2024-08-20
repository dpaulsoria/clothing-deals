'use client';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./clientSideMap'), {
  ssr: false,
  loading: () => <p>Cargando Mapa...</p>,
});
export default function MapaPage() {
  return (
    <div className="w-full h-full relative">
      <DynamicMap />
    </div>
  );
}
