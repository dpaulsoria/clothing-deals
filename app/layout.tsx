import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './_lib/fontAwesome';
import './globals.css';
import { ThemeProvider } from './ThemeContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
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
        <ThemeProvider>{children}</ThemeProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
