'use client';
import { useState, useEffect, useId, FormEvent } from 'react';
import Image from 'next/image';
import { AuthService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';

const images = ['/assets/img1c.jpg', '/assets/img2c.jpg', '/assets/img3c.jpg'];

export default function RecuperarContrasenia() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textButton, setTextButton] = useState('Enviar correo de recuperación');
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const idBase = useId();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar el correo electrónico
    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido');
      setEmailSent(false);
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Limpiar cualquier mensaje de error previo
    try {
      // Llamar al servicio de recuperación de contraseña
      const response = await AuthService.sendEmailRecoverPassword(email);

      if (response) {
        setEmailSent(true);
        setTextButton('Correo de recuperación enviado exitosamente');
        toast.success('Correo de recuperación enviado exitosamente');
      } else {
        setEmailSent(false);
        setTextButton('No se pudo enviar el correo de recuperación');
        setErrorMessage('No se pudo enviar el correo de recuperación');
        toast.error('No se pudo enviar el correo de recuperación');
      }
    } catch (error) {
      setEmailSent(false);
      setTextButton('Hubo un problema al enviar el correo');
      setErrorMessage('Hubo un problema al enviar el correo de recuperación');
      toast.error('Hubo un problema al enviar el correo de recuperación');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-stone-600">
        <div className="w-4/6 h-5/6 rounded-3xl flex ">
          <div className="h-full relative w-3/6 bg-blue-600 rounded-l-3xl">
            {images.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  height={500}
                  width={500}
                  alt={`Slide ${index + 1}`}
                  className={`absolute w-full rounded-l-3xl h-full object-cover transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="absolute inset-0 rounded-l-3xl  bg-black opacity-10"></div>
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
            <div className="max-w-md w-full h-full grid place-content-stretch">
              <div className="w-full grid place-content-evenly">
                <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-700">
                  PARQUE NACIONAL GALÁPAGOS
                </h2>
                <h2 className=" text-center text-xl font-extrabold text-gray-700">
                  Recuperar Contraseña
                </h2>
              </div>

              <form className="" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm ">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
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
                </div>

                <div>
                  <button
                    type="submit"
                    className={`group relative w-full flex mt-8 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      emailSent ? 'bg-indigo-600' : 'bg-red-600'
                    } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : textButton}
                  </button>
                </div>

                {errorMessage && (
                  <div className="mt-4 text-center text-red-600">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
