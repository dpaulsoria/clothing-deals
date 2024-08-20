'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className=" sticky group top-16 max-w-7xl mb-3 mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex flex-row">
          <Link
            href="/admin/usuarios"
            className={`w-full group-has-[]: p-3 text-center transition-colors duration-200 ${pathname === "/admin/usuarios"
              ? 'bg-purple-400 text-white'
              : 'bg-gray-50 hover:bg-indigo-200 text-gray-700'
              }`}
          >
            Usuarios
          </Link>
          <Link
            href='/admin/iguanas'
            className={`w-full p-3 text-center transition-colors duration-200 ${pathname === "/admin/iguanas"
              ? 'bg-purple-400 text-white'
              : 'bg-gray-50 hover:bg-indigo-200 text-gray-700'
              }`}
          >
            Iguanas
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >

        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">Panel de Administración</h1>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

