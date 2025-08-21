import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useState } from 'react';
import { Scanner } from '../components/pos/Scanner';
import { ProductCatalog } from '../components/pos/ProductCatalog';
import { Cart } from '../components/Cart';
import { PaymentModal } from '../components/pos/PaymentModal';
import { Navigation } from '../components/Navigation';
import { useCart } from '../hooks/useCart';
import { ScannedProduct, CartItem, PaymentDetails } from '../types/pos';
import { Scan, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCartSocket } from '../services/socketService';

export const Route = createFileRoute('/pos')({
  component: POSRoute,
});

function POSRoute() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'catalog'>('scanner');

  const { authState } = useAuth();
  const userId = authState?.user?.id;

  // const { emitCartUpdate } = useCartSocket(userId ||  '')
  
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total
  } = useCart();

  const handleProductScanned = (product: ScannedProduct) => {
    const cartItem: CartItem = {
      ...product,
      quantity: 1
    };
    // emitCartUpdate(cartItem);
    addItem(cartItem);
  };

  const handlePayment = (paymentDetails: PaymentDetails) => {
    console.log('Payment processed:', paymentDetails);
    clearCart();
    setShowPaymentModal(false);
  };

  return (
    <ProtectedRoute requiredRole="CASHIER">
      <div className='bg-gray-50'>
        <Navigation />
        <div className="min-h-screen">

          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-6 min-h-[calc(100vh-200px)]">
              {/* Left Panel - Scanner/Catalog */}
              <div className="flex-1 flex flex-col">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'scanner'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Scan size={20} />
                    Scanner
                  </button>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'catalog'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Package size={20} />
                    Catalog
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                  {activeTab === 'scanner' ? (
                    <Scanner
                      onProductScanned={handleProductScanned}
                      onManualAdd={handleProductScanned}
                      recentItems={items}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeItem}
                    />
                  ) : (
                    <ProductCatalog
                      onAddToCart={handleProductScanned}
                      cartItems={items}
                      userId={authState?.user?.id}
                    />
                  )}
                </div>
              </div>

              {/* Right Panel - Cart */}
              <div className="w-96">
                <Cart
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onCheckout={() => setShowPaymentModal(true)}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                />
              </div>
            </div>
          </div>

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onPayment={handlePayment}
            total={total}
            items={items}
            subtotal={subtotal}
            tax={tax}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}