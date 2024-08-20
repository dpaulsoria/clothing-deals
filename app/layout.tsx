import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './_lib/fontAwesome';
import './globals.css';
import { ThemeProvider } from './ThemeContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import GalapagosIcon from "./_components/icons/GalapagosIcon";
import Link from "next/link";
import React from "react";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PNG',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <GalapagosIcon className="fill-indigo-800" />
                <nav className="flex items-center gap-6">
                    <Link href="/about" className="text-gray-700 hover:text-blue-600">
                        Acerca de
                    </Link>
                    <Link href="/maps" className="text-gray-700 hover:text-blue-600">
                        Mapas
                    </Link>
                    <Link href="/data" className="text-gray-700 hover:text-blue-600">
                        Datos
                    </Link>
                    <Link
                        href="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Iniciar Sesión
                    </Link>
                </nav>
            </div>
        </header>
        <ThemeProvider>{children}</ThemeProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
