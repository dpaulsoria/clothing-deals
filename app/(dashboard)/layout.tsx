'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import MenuIcon from '../_components/icons/MenuIcon';
import MapaIcon from '../_components/icons/MapaIcon';
import FileIcon from '../_components/icons/FileIcon';
import LayerIcon from '../_components/icons/LayerIcon';
import ChartIcon from '../_components/icons/DataIcon';
import RowIcon from '../_components/icons/RowIcon';
import { ModalProvider } from '@components/modal/LighModal';
import { Dropdown } from '@components/unitComponent/drowdown';
import DashboardIcon from '../_components/icons/DashboardIcon';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sections = {
  Mapa: { route: '/maps', icon: MapaIcon },
  Archivos: { route: '/archivos', icon: FileIcon },
  Estudio: { route: '/workspaces', icon: LayerIcon },
  Gráficos: { route: '/graficos', icon: ChartIcon },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.isadmin === 1) {
          sections['Admin'] = { route: '/admin/usuarios', icon: DashboardIcon };
        }
      } catch (error) {
        console.error('Error parsing user:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSidebar();
    }
  };

  if (!user) return null;

  return (
    <ModalProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${isExpanded ? 'w-64' : 'w-16'} 
            bg-white shadow-lg transition-all duration-300 ease-in-out
            flex flex-col h-full fixed left-0 top-0 z-[9999]
          `}
        >
          <div
            className="p-4 flex items-center gap-5 cursor-pointer"
            onClick={toggleSidebar}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
          >
            <MenuIcon className="fill-gray-700 hover:fill-indigo-600 transition-colors duration-300" />
            {isExpanded && (
              <span className="text-gray-700 font-semibold">PNG</span>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto">
            <div className="px-2 space-y-2">
              {Object.entries(sections).map(
                ([name, { route, icon: IconComponent }]) => (
                  <Link
                    key={route}
                    href={route}
                    className={`
                    py-2 px-3 flex items-center rounded-md
                    ${isExpanded ? 'hover:bg-indigo-100' : 'justify-center'} 
                    ${pathname === route ? 'bg-indigo-200' : ''}
                    transition-all duration-300 ease-in-out group
                  `}
                  >
                    <IconComponent
                      className={`
                      transition-colors duration-300
                      ${isExpanded ? 'mr-3' : ''}
                      ${pathname === route ? 'fill-indigo-700' : 'fill-gray-700 group-hover:fill-indigo-600'}
                    `}
                      width={20}
                      height={20}
                    />
                    {isExpanded && (
                      <span
                        className={`
                      text-sm whitespace-nowrap
                      ${pathname === route ? 'text-indigo-700' : 'text-gray-700 group-hover:text-indigo-600'}
                    `}
                      >
                        {name}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col ${isExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 overflow-auto bg-gray-100`}
        >
          {/* Header */}
          <header className="sticky top-0 z-[9999] py-3 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border-b border-gray-200 flex justify-end items-center px-4 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <Image
                  src="/assets/img1c.jpg"
                  alt="User logo"
                  className="object-cover w-full h-full"
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <Dropdown
                trigger={
                  <button className="ml-2 focus:outline-none">
                    <RowIcon className="fill-gray-500 cursor-pointer" />
                  </button>
                }
              >
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 z-[9999]"
                >
                  Perfil
                </Link>
                <Link
                  href="/config"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 z-[9999]"
                >
                  Configuraciones
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 z-[9999]"
                >
                  Salir
                </Link>
              </Dropdown>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 text-gray-700 ">{children}</div>
          <ToastContainer />
        </main>
      </div>
    </ModalProvider>
  );
};

export default Layout;
