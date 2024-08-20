import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Acerca de Nosotros
          </h1>
          <p className="text-lg text-gray-600">
            Nuestra plataforma está dedicada a ofrecer la mejor experiencia de
            compra personalizada y optimizada, en colaboración con tiendas de
            ropa y zapatos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
              Nuestra Misión
            </h2>
            <p className="text-gray-600">
              Ofrecer a los usuarios acceso a las mejores ofertas, comparar
              precios y localizar tiendas cercanas, todo mientras fomentamos la
              retroalimentación y la mejora continua de nuestros servicios.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
              Nuestra Visión
            </h2>
            <p className="text-gray-600">
              Ser la plataforma líder en la experiencia de compra personalizada
              en Ecuador, conectando a usuarios con las mejores tiendas y
              productos, mientras nos adaptamos continuamente a las necesidades
              de nuestros clientes.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
              Nuestros Valores
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Innovación continua</li>
              <li>Enfoque en el cliente</li>
              <li>Colaboración estratégica</li>
              <li>Transparencia y confianza</li>
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600">
              Contamos con un equipo de profesionales dedicados y apasionados,
              comprometidos en ofrecer la mejor experiencia de compra a nuestros
              usuarios, mientras fortalecemos nuestras alianzas con las tiendas
              más destacadas del país.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
