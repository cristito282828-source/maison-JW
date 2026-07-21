import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestiona tu cuenta y pedidos',
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="font-belleza text-4xl font-light text-gray-900 mb-4">
            Mi Cuenta
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            La gestión de cuentas estará disponible pronto.
          </p>
          <Link
            href="/"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}