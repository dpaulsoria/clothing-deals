'use client';

import { Suspense, useState, useEffect, useId, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';

export default function CambiarContrasenia() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const idBase = useId();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!email || !token) {
      router.replace('/404');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await AuthService.verifyTokenRecoverPassword(
          email,
          token,
          'reset'
        );
        if (response) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast.error('Token inválido o expirado');
          router.push('/error-page');
        }
      } catch (error) {
        setIsValidToken(false);
        toast.error('Hubo un problema al verificar el token');
        console.error('Error:', error);
        router.push('/error-page');
      }
    };

    verifyToken();
  }, [email, token, router]);

  if (isValidToken === null) {
    return <div>Verificando token...</div>;
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-stone-600">
      <div className="w-4/6 h-5/6 rounded-3xl flex">
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
              <div className="absolute inset-0 rounded-l-3xl bg-black opacity-10"></div>
            </div>
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={`${idBase}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
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
              <h2 className="text-center text-xl font-extrabold text-gray-700">
                Escribe tu nueva contraseña
              </h2>
            </div>
            <ResetPasswordForm email={email!} token={token!} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const [confirm_password, setConfirm_password] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm_password) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.changePassword(email, password);
      if (response) {
        toast.success('Contraseña cambiada exitosamente');
        router.push('/login');
      } else {
        toast.error('Hubo un problema al cambiar la contraseña');
      }
    } catch (error) {
      toast.error('Hubo un problema al cambiar la contraseña');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm">
        <div>
          <label htmlFor="password" className="sr-only">
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirgmPassword" className="sr-only">
            Confirmar nueva contraseña
          </label>
          <input
            id="confirgmPassword"
            name="confirgmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirmar nueva contraseña"
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex mt-8 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
      </div>
    </form>
  );
}

const images: string[] = [
  '/assets/img1c.jpg',
  '/assets/img2c.jpg',
  '/assets/img3c.jpg',
];
