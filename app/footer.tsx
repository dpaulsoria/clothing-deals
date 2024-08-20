// app/footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos
          reservados.
        </p>
        <div className="mt-2">
          <Link
            href="/terminos-condiciones"
            className="text-blue-300 hover:underline mx-2"
          >
            Términos de Servicio
          </Link>
          <Link
            href="/politicas-privacidad"
            className="text-blue-300 hover:underline mx-2"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
