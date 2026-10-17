import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ShoppingCart,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  ArrowRight,
  PackageCheck,
  X,
} from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

export const MarketplacePage: React.FC = () => {
  const { user, setActiveView } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts(selectedCategory, searchQuery);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.product.priceGHS * item.quantity,
    0
  );

  const handleCheckout = async (paymentModel: 'direct_purchase' | 'loan_financed') => {
    if (!user) {
      setCheckoutError('Please sign in to your confidential account to complete your input purchase.');
      return;
    }
    setSubmittingOrder(true);
    setCheckoutError(null);
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        deliveryAddress: 'Fiapre Agricultural Junction, Sunyani Depot',
        paymentModel,
      };

      const res = await api.placeOrder(orderPayload);

      // Sync to Cloud Firestore
      const { syncOrderToFirestore } = await import('../services/firebase');
      await syncOrderToFirestore(res.order);

      setCheckoutSuccess(res.order);
      setCart([]);
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Inputs' },
    { id: 'fertilizers', label: 'Fertilizers' },
    { id: 'seeds', label: 'Certified Seeds' },
    { id: 'irrigation', label: 'Irrigation' },
    { id: 'tools', label: 'Farming Tools' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-20">
      {/* Page Header */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-12 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                Model A &middot; Verified Agricultural Inputs
              </div>
              <h1 className="font-display text-3xl font-extrabold text-white">
                Certified Agro-Input Marketplace
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#F7F5EF]/80 max-w-2xl leading-relaxed">
                Source authenticated hybrid seeds, blended soil fertilizers, and precision drip irrigation tubing from licensed Ghanaian dealers with guaranteed batch quality.
              </p>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setShowCartModal(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#103B2D] text-xs font-bold hover:bg-[#e2bd44] transition-all shadow-md self-start md:self-center"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Input Cart ({cart.reduce((c, i) => c + i.quantity, 0)})</span>
              <span className="font-mono font-bold ml-1">
                GHS {totalCartAmount.toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Functional Filter Tabs (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EAE5D9] rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[38px] ${
                  selectedCategory === cat.id
                    ? 'bg-[#103B2D] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, NPK, irrigation..."
              className="w-full rounded-xl border border-[#CBD5E1] bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl border border-[#E5E0D5] bg-white overflow-hidden shadow-sm hover:border-[#103B2D] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image Slot with Fallback Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={prod.imageUrl || '/src/assets/images/agricultural_inputs_display_1791938388813.jpg'}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  {prod.regulatoryApprovalNumber && (
                    <div className="absolute top-3 left-3 bg-[#103B2D]/90 backdrop-blur-sm text-[#D4AF37] text-[10px] font-mono px-2 py-0.5 rounded shadow">
                      {prod.regulatoryApprovalNumber}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#2E7D32] capitalize">{prod.category}</span>
                    <span>{prod.location}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#103B2D] leading-snug">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                    <span>Supplier: {prod.supplierName}</span>
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div>
                  <div className="font-mono text-lg font-bold text-[#103B2D]">
                    GHS {prod.priceGHS.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">per {prod.unit}</div>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart & Checkout Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#F7F5EF] p-6 shadow-2xl border border-[#E5E0D5]">
            <button
              onClick={() => {
                setShowCartModal(false);
                setCheckoutSuccess(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D32] text-white mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#103B2D]">
                  Order Placed Successfully!
                </h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>Order #{checkoutSuccess.id}</p>
                  <p className="font-mono font-semibold">Tracking: {checkoutSuccess.trackingNumber}</p>
                  <p>Total: GHS {checkoutSuccess.totalAmountGHS.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    setCheckoutSuccess(null);
                    setActiveView('farmer_dashboard');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#103B2D] text-white text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-bold text-[#103B2D] mb-4">
                  Input Shopping Basket
                </h3>

                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-900">{item.product.title}</div>
                            <div className="text-slate-500 text-[11px]">
                              GHS {item.product.priceGHS} / {item.product.unit}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1 bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-0.5 hover:bg-slate-200 rounded"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-mono font-bold px-1.5">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-0.5 hover:bg-slate-200 rounded"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-mono font-bold text-[#103B2D]">
                              GHS {(item.product.priceGHS * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#E5E0D5] pt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">Total Amount:</span>
                      <span className="font-mono font-bold text-lg text-[#103B2D]">
                        GHS {totalCartAmount.toLocaleString()}
                      </span>
                    </div>

                    {checkoutError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                        {checkoutError}
                      </div>
                    )}

                    {/* Checkout Options: Direct Purchase vs Loan-Financed */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleCheckout('direct_purchase')}
                        disabled={submittingOrder}
                        className="py-2.5 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors disabled:opacity-50"
                      >
                        Direct Purchase
                      </button>
                      <button
                        onClick={() => handleCheckout('loan_financed')}
                        disabled={submittingOrder}
                        className="py-2.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#256629] transition-colors disabled:opacity-50"
                      >
                        Link to Crop Loan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
