'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import GalapagosIcon from './_components/icons/GalapagosIcon';

const images = ['/assets/img1c.jpg', '/assets/img2c.jpg', '/assets/img3c.jpg'];
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    // <main className="relative h-screen w-full overflow-hidden">
    //   <video
    //     autoPlay
    //     muted
    //     loop
    //     className="absolute inset-0 w-full h-full object-cover"
    //   >
    //     <source src="/assets/Hero-video.mp4" type="video/mp4" />
    //   </video>
    //   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-center">
    //     <h1 className="text-5xl font-bold mb-4">Parque nacional Galápagos </h1>
    //     <p className="text-2xl">
    //       Conservación Inteligente en el Corazón de Galápagos
    //     </p>
    //     <Link href="/login">
    //       <button className="bg-gray-300 py-2 px-4 rounded-lg mt-5 text-black text-lg">
    //         Iniciar
    //       </button>
    //     </Link>
    //   </div>

    // </main>
    <div className="flex flex-col min-h-screen text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-50 min-h-[calc(100vh-4rem)] flex items-center ">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl font-bold mb-6">
              Plataforma GIS para Galápagos
            </h1>
            <p className="text-xl mb-8">
              Explora, analiza y visualiza datos geoespaciales de las Islas
              Galápagos. Una herramienta poderosa para investigadores,
              conservacionistas y amantes de la naturaleza.
            </p>
            <Link
              href="/explore"
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700"
            >
              Explorar Mapas
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative h-[296px] w-full overflow-hidden rounded-lg shadow-lg">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Imagen de Galápagos ${index + 1}`}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              ))}
            </div>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200"
              aria-label="Imagen siguiente"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" bg-orange-100 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mapas Interactivos</h3>
              <p>
                Explora las islas con mapas detallados y capas de información
                personalizables.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Análisis de Datos</h3>
              <p>
                Herramientas avanzadas para analizar patrones de biodiversidad y
                cambios ambientales.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-6 inline-block mb-4">
                <svg
                  className="w-12 h-12 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Base de Datos Integrada
              </h3>
              <p>
                Accede a una extensa base de datos de especies, hábitats y datos
                ambientales de Galápagos.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de Capas de Datos */}
      <section className="bg-blue-50 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Capas de Datos Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Biodiversidad</h3>
              <ul className="list-disc list-inside">
                <li>Distribución de especies endémicas</li>
                <li>Puntos de avistamiento de fauna</li>
                <li>Áreas de conservación prioritarias</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Geología</h3>
              <ul className="list-disc list-inside">
                <li>Formaciones volcánicas</li>
                <li>Tipos de suelo</li>
                <li>Riesgos geológicos</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Oceanografía</h3>
              <ul className="list-disc list-inside">
                <li>Corrientes marinas</li>
                <li>Temperatura superficial del mar</li>
                <li>Zonas de pesca sostenible</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de Herramientas de Análisis */}
      <section className="bg-orange-100 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Herramientas de Análisis GIS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Análisis de Hábitat
              </h3>
              <p>
                Evalúa la idoneidad del hábitat para especies específicas basado
                en múltiples capas de datos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Modelado de Cambio Climático
              </h3>
              <p>
                Proyecta cambios en ecosistemas y distribución de especies bajo
                diferentes escenarios climáticos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Análisis de Impacto Humano
              </h3>
              <p>
                Evalúa el impacto de actividades humanas en áreas sensibles y
                propone medidas de mitigación.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de Casos de Estudio */}
      <section className="bg-blue-50 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Casos de Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Conservación de Tortugas Marinas
              </h3>
              <p>
                Análisis de patrones de anidación y rutas migratorias para
                mejorar estrategias de conservación.
              </p>
              <Link
                href="/case-studies/turtles"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Leer más
              </Link>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Restauración de Manglares
              </h3>
              <p>
                Identificación de áreas prioritarias para la restauración de
                manglares utilizando análisis multicriterio.
              </p>
              <Link
                href="/case-studies/mangroves"
                className="mt-4 inline-block text-green-600 hover:underline"
              >
                Leer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8 md:mb-0 flex gap-6 flex-col">
              <GalapagosIcon className="fill-orange-300 " />
              <p className="text-sm">
                Plataforma de Información Geográfica para la conservación e
                investigación en las Islas Galápagos.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Explorar</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/mapas"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Mapas Interactivos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/datos"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Conjuntos de Datos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analisis"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Herramientas de Análisis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proyectos"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Proyectos de Investigación
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tutoriales"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Tutoriales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documentacion"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Documentación API
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soporte"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    Soporte Técnico
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>Email: info@galapagosgis.org</li>
                <li>Teléfono: +593 (5) 2526-189</li>
                <li>
                  Dirección: Av. Charles Darwin, Puerto Ayora, Santa Cruz,
                  Galápagos, Ecuador
                </li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-blue-300 transition duration-300"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-blue-300 transition duration-300"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-blue-300 transition duration-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-blue-300 transition duration-300"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} Galápagos GIS. Todos los
              derechos reservados.
            </p>
            <div className="mt-2">
              <Link
                href="/privacidad"
                className="hover:text-blue-300 transition duration-300 mr-4"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terminos"
                className="hover:text-blue-300 transition duration-300"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
