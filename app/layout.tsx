'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './_lib/fontAwesome';
import './globals.css';
import { ThemeProvider } from './ThemeContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import GalapagosIcon from './_components/icons/GalapagosIcon';
import Link from 'next/link';
import React from 'react';
import { NextFont } from 'next/dist/compiled/@next/font';

const inter: NextFont = Inter({ subsets: ['latin'] });
import { usePathname } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'PNG',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname: string = usePathname();
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        {pathname !== '/login' && (
          <header className="sticky top-0 z-[9999] bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link
                href="/"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <GalapagosIcon className="fill-indigo-800" />
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Acerca de
                </Link>
                <Link
                  href="/data"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Datos
                </Link>
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Iniciar Sesión
                </Link>
              </nav>
            </div>
          </header>
        )}
        <ThemeProvider>
          <div className="flex-1 text-gray-700 bg-gray-100">{children}</div>
        </ThemeProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
