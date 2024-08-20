'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600">
        Error de autenticación
      </h1>
      <p className="mt-4 text-lg text-red-500">
        {error
          ? `Error: ${error}`
          : 'Ocurrió un error durante la autenticación.'}
      </p>
      <button
        onClick={() => router.push('/login')}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-red-100">
      <Suspense fallback={<div>Cargando...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
