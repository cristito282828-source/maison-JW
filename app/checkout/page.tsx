'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  metodoPago: string;
}

export default function CheckoutPage() {
  const { cart, itemCount } = useCart();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    metodoPago: 'transferencia'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = () => {
    if (!cart?.contents.nodes || itemCount === 0) return;

    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.region) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    const rawPhoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '971501701872';
    const digitsOnly = rawPhoneNumber.replace(/[^\d]/g, '');

    let normalizedPhoneNumber = digitsOnly;
    if (normalizedPhoneNumber.startsWith('0')) {
      normalizedPhoneNumber = `57${normalizedPhoneNumber.slice(1)}`;
    } else if (!normalizedPhoneNumber.startsWith('57')) {
      normalizedPhoneNumber = `57${normalizedPhoneNumber}`;
    }

    normalizedPhoneNumber = `+${normalizedPhoneNumber}`;

    // Construir mensaje simplificado para evitar problemas con WhatsApp
    let message = '*NUEVO PEDIDO - Maison Joyería*%0A%0A';
    message += '*DATOS DEL CLIENTE*%0A';
    message += `Nombre: ${formData.nombre}%0A`;
    message += `Email: ${formData.email}%0A`;
    message += `Telefono: ${formData.telefono}%0A%0A`;

    message += '*DIRECCION DE ENVIO*%0A';
    message += `${formData.direccion}, ${formData.ciudad}%0A`;
    message += `Departamento: ${formData.region}%0A%0A`;

    message += '*PRODUCTOS*%0A';
    cart.contents.nodes.forEach((item, index) => {
      const productName = item.productName;
      const quantity = item.quantity;
      const price = item.priceDisplay;
      const sizeInfo = item.variationSize ? ` (${item.variationSize} ml)` : '';
      message += `${quantity}x ${productName}${sizeInfo} - ${price}%0A`;
    });

    message += `%0A*TOTAL: ${cart.total}*%0A`;
    message += `Pago: ${formData.metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Nequi/Daviplata'}%0A%0A`;
    message += 'Por favor confirmar mi pedido. Gracias!';

    // Abrir WhatsApp directamente sin encoding adicional
    const whatsappUrl = `https://wa.me/${normalizedPhoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    // Mostrar confirmación
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-white pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-700" />
              </div>
              <h1 className="font-belleza text-3xl font-light text-gray-900 mb-4">
                ¡Pedido Enviado!
              </h1>
              <p className="text-gray-600 mb-8">
                Tu pedido ha sido enviado correctamente por WhatsApp. Nos pondremos en contacto contigo a la brevedad para confirmar tu compra.
              </p>
              <div className="space-y-4">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
                >
                  Continuar Comprando
                </Link>
                <br />
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || itemCount === 0) {
    return (
      <main className="min-h-screen bg-white pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-belleza text-3xl font-light text-gray-900 mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-gray-600 mb-8">
                Agrega productos para finalizar tu compra
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                Explorar Productos
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al carrito
            </Link>
            <h1 className="font-belleza text-3xl lg:text-4xl font-light tracking-wide text-gray-900">
              Finalizar Compra
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de checkout */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de contacto */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-moderat text-lg font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      placeholder="+57 3XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-moderat text-lg font-semibold text-gray-900 mb-4">
                  Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      placeholder="Calle, número"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento *
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      >
                        <option value="">Selecciona un departamento</option>
                        <option value="Amazonas">Amazonas</option>
                        <option value="Antioquia">Antioquia</option>
                        <option value="Arauca">Arauca</option>
                        <option value="Atlántico">Atlántico</option>
                        <option value="Bogotá D.C.">Bogotá D.C.</option>
                        <option value="Bolívar">Bolívar</option>
                        <option value="Boyacá">Boyacá</option>
                        <option value="Caldas">Caldas</option>
                        <option value="Caquetá">Caquetá</option>
                        <option value="Casanare">Casanare</option>
                        <option value="Cauca">Cauca</option>
                        <option value="Cesar">Cesar</option>
                        <option value="Chocó">Chocó</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Cundinamarca">Cundinamarca</option>
                        <option value="Guainía">Guainía</option>
                        <option value="Guaviare">Guaviare</option>
                        <option value="Huila">Huila</option>
                        <option value="La Guajira">La Guajira</option>
                        <option value="Magdalena">Magdalena</option>
                        <option value="Meta">Meta</option>
                        <option value="Nariño">Nariño</option>
                        <option value="Norte de Santander">Norte de Santander</option>
                        <option value="Putumayo">Putumayo</option>
                        <option value="Quindío">Quindío</option>
                        <option value="Risaralda">Risaralda</option>
                        <option value="San Andrés y Providencia">San Andrés y Providencia</option>
                        <option value="Santander">Santander</option>
                        <option value="Sucre">Sucre</option>
                        <option value="Tolima">Tolima</option>
                        <option value="Valle del Cauca">Valle del Cauca</option>
                        <option value="Vaupés">Vaupés</option>
                        <option value="Vichada">Vichada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-moderat text-lg font-semibold text-gray-900 mb-4">
                  Método de Pago
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-700 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-700 focus:ring-green-700"
                    />
                    <span className="ml-3 font-medium text-gray-900">Transferencia bancaria</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-700 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="nequi"
                      checked={formData.metodoPago === 'nequi'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-700 focus:ring-green-700"
                    />
                    <span className="ml-3 font-medium text-gray-900">Nequi / Daviplata</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
                <h2 className="font-moderat text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{cart.subtotal}</span>
                  </div>

                  {cart.shippingTotal && cart.shippingTotal !== '$0' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium text-gray-900">{cart.shippingTotal}</span>
                    </div>
                  )}

                  {cart.discountTotal && cart.discountTotal !== '$0' && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Descuento</span>
                      <span className="font-medium">-{cart.discountTotal}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-green-700">{cart.total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-moderat font-medium transition-colors mb-3 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-700 text-white hover:bg-green-800'
                  }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Realizar Pedido'}
                </button>

                {/* Envío gratis */}
                {cart.subtotal && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      💚 Envío gratis a toda Colombia
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Al hacer clic en "Realizar Pedido" serás redirigido a WhatsApp para completar tu orden
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

