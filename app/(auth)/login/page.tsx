'use client';
import React, { useState, useEffect, useId, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/app/services/auth.service';
import { User } from '@db/models/user.model';
import Image from 'next/image';

const images = ['/assets/img1c.jpg', '/assets/img2c.jpg', '/assets/img3c.jpg'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const idBase = useId();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email: string) => {
    const emailReges: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailReges.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!validateEmail(email)) {
      console.error('Email inválido');
      setError('Email inválido');
      setLoading(false);
      return;
    }

    if (!email || !password) {
      console.error('Ingrese los datos del login');
      setError('Ingrese los datos del login');
      setLoading(false);
      return;
    }

    try {
      const response: Partial<User> = await AuthService.loginUser(
        email,
        password
      );

      if (!response) {
        console.error(
          'Error en la respuesta del servidor:',
          response || 'Contraseña Incorrecta'
        );
        setError('Error en la respuesta del servidor, contraseña incorrecta');
        setLoading(false);
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(response));
      sessionStorage.setItem('token', JSON.stringify(response.token));
      setLoading(false);
      router.push('/maps');
    } catch (error) {
      console.error('Error durante el proceso de inicio de sesión:', error);
      setError(
        'Ocurrió un error durante el inicio de sesión, por favor intenta de nuevo.'
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-stone-600">
        <div className="w-4/6 h-5/6 rounded-3xl flex ">
          <div className="h-full relative w-3/6 bg-blue-600 rounded-l-3xl">
            {images.map((src, index) => (
              <div key={src} className="absolute w-full h-full">
                <Image
                  src={src}
                  width={500}
                  height={500}
                  alt={`Slide ${index + 1}`}
                  className={`w-full h-full rounded-l-3xl object-cover transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="absolute inset-0 rounded-l-3xl bg-black opacity-10"></div>
              </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={`${idBase}-${index}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full  transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75 '
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="h-full w-3/6 flex rounded-r-3xl items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full h-full grid place-content-stretch ">
              <div className="w-full grid  place-content-evenly">
                <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-700">
                  PARQUE NACIONAL GALÁPAGOS
                </h2>
                <h2 className=" text-center text-xl font-extrabold text-gray-700">
                  Iniciar
                </h2>
              </div>

              <form className="" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm ">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Correo electrónico
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="w-full relative">
                    <Link href={'/forgot-password'}>
                      <small className="text-gray-700 absolute inset-y-0 right-0 pr-2  cursor-pointer hover:text-blue-600">
                        Recuperar contraseña
                      </small>
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`group relative w-full flex mt-8 justify-center py-2 px-4 
                      border border-transparent text-sm font-medium rounded-md 
                      text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
                      ${
                        error
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 animate-shake'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      }`}
                  >
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                  </button>
                  <div className="cursor-pointer text-center mt-5">
                    {/*<Link href={'/registrar'}>*/}
                    {/*  <small className="text-gray-600 hover:text-blue-600">*/}
                    {/*    Crear cuenta?*/}
                    {/*  </small>*/}
                    {/*</Link>*/}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
