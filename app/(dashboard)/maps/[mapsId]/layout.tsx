'use client';
import { useModal } from '@/app/_components/modal/LighModal';
import './mapa.css';
export default function MapaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addModal } = useModal();
  return (
    <>
      {children}
    </>
  );
}
