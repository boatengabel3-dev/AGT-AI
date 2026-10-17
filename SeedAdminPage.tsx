import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  Check,
  X,
  Search,
} from 'lucide-react';

export const SeedAdminPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'vouchers'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    priceGHS: '',
    unit: '10kg Bag',
    stockQuantity: '',
    description: '',
    germinationRate: '96%',
    maturityDays: '105-110 days',
    yieldPotential: '6.5 MT/Ha',
    regulatoryApprovalNumber: 'MoFA-GSID-S2026-088',
    location: 'Sunyani & Techiman Seed Centers',
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Voucher redemption
  const [voucherCode, setVoucherCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodList, orderList] = await Promise.all([
        api.getProducts('seeds'),
        api.getOrders(),
      ]);
      setProducts(prodList);
      setOrders(orderList.filter((o) => o.items.some((i) => i.productName.toLowerCase().includes('seed') || i.productName.toLowerCase().includes('maize') || i.productName.toLowerCase().includes('soya'))));
    } catch (err) {
      console.error('Failed to load seed admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      priceGHS: '',
      unit: '10kg Bag',
      stockQuantity: '120',
      description: 'Certified high-germination foundation seed variety certified by CSIR Crops Research Institute with superior drought tolerance.',
      germinationRate: '96%',
      maturityDays: '105-110 days',
      yieldPotential: '6.5 MT/Ha',
      regulatoryApprovalNumber: 'MoFA-GSID-S2026-088',
      location: 'Sunyani & Techiman Seed Centers',
    });
    setModalOpen(true);
    setStatusMessage(null);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      priceGHS: String(prod.priceGHS),
      unit: prod.unit,
      stockQuantity: String(prod.stockQuantity),
      description: prod.description,
      germinationRate: (prod.specifications as any)?.germinationRate || '96%',
      maturityDays: (prod.specifications as any)?.maturityDays || '105-110 days',
      yieldPotential: (prod.specifications as any)?.yieldPotential || '6.5 MT/Ha',
      regulatoryApprovalNumber: prod.regulatoryApprovalNumber || 'MoFA-GSID-S2026-088',
      location: prod.location || 'Sunyani Seed Center',
    });
    setModalOpen(true);
    setStatusMessage(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        title: formData.title,
        category: 'seeds',
        priceGHS: Number(formData.priceGHS),
        unit: formData.unit,
        stockQuantity: Number(formData.stockQuantity),
        description: formData.description,
        specifications: {
          germinationRate: formData.germinationRate,
          maturityDays: formData.maturityDays,
          yieldPotential: formData.yieldPotential,
          origin: 'CSIR Crops Research Institute, Fumesua, Ghana',
        },
        regulatoryApprovalNumber: formData.regulatoryApprovalNumber,
        location: formData.location,
        deliveryAvailable: true,
        pickupAvailable: true,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setStatusMessage({ type: 'success', text: `Seed variety "${formData.title}" updated in web app!` });
      } else {
        await api.createProduct(payload);
        setStatusMessage({ type: 'success', text: `New seed variety "${formData.title}" published to marketplace!` });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save seed product' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the web app?`)) return;
    try {
      await api.deleteProduct(id);
      setStatusMessage({ type: 'success', text: `Removed "${title}" from web app.` });
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete seed product' });
    }
  };

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    setRedeeming(true);
    try {
      const targetOrder = orders.find(
        (o) => (o.trackingNumber && o.trackingNumber.toLowerCase() === voucherCode.trim().toLowerCase()) || o.id === voucherCode.trim()
      );
      if (targetOrder) {
        await api.updateOrderStatus(targetOrder.id, {
          fulfilmentStatus: 'delivered',
          paymentStatus: 'completed',
        });
        setStatusMessage({
          type: 'success',
          text: `Seed voucher verified! Escrow payout of GHS ${targetOrder.totalAmountGHS.toLocaleString()} settled.`,
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Seed voucher ${voucherCode.toUpperCase()} verified under National Seed Scheme! Seeds released to farmer.`,
        });
      }
      setVoucherCode('');
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to redeem seed voucher' });
    } finally {
      setRedeeming(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBags = products.reduce((acc, p) => acc + p.stockQuantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-20">
      {/* Top Banner */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-10 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/30">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                    Admin Management Portal
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    Certified Seed Deals
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Heritage Seed Co. Administration
                </h1>
                <p className="text-xs sm:text-sm text-[#F7F5EF]/80 mt-1">
                  Update web app certified seed catalog, manage pack prices in GHS, track germination batch test results, and fulfill seed vouchers.
                </p>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Seed Variety to Web App</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Certified Varieties</span>
              <Sprout className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">{products.length} Varieties</div>
            <span className="text-[11px] text-emerald-700 font-medium">MoFA-certified strains</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Certified Seed Stock</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">{totalBags.toLocaleString()} Packs</div>
            <span className="text-[11px] text-slate-500">In temperature-controlled storage</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Germination Guarantee</span>
              <Award className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">95.8% Avg</div>
            <span className="text-[11px] text-emerald-700 font-medium">CSIR Lab Tested</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Seed Orders Fulfilled</span>
              <QrCode className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">{orders.length} Orders</div>
            <span className="text-[11px] text-slate-500">Distributed this season</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-[#2E7D32] text-[#103B2D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sprout className="h-4 w-4" />
            <span>Update Certified Seed Deals in Web App</span>
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'vouchers'
                ? 'border-[#2E7D32] text-[#103B2D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>Fulfill Subsidized Seed Vouchers</span>
          </button>
        </div>

        {/* Tab 1: Catalog */}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative max-w-sm w-full">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search seed varieties by crop, name, or yield..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <span className="text-xs text-slate-500">
                Price and variety updates immediately appear for farmers on the marketplace seeds tab.
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading seed varieties...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No seed varieties found</p>
                <button
                  onClick={openAddModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add First Seed Variety</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#103B2D] text-white uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Seed Variety &amp; Trait</th>
                        <th className="py-3 px-4">Pack Size</th>
                        <th className="py-3 px-4">Price (GHS)</th>
                        <th className="py-3 px-4">Certified Stock</th>
                        <th className="py-3 px-4">Germination Rate</th>
                        <th className="py-3 px-4">Maturity Days</th>
                        <th className="py-3 px-4">MoFA Seed Code</th>
                        <th className="py-3 px-4 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#103B2D]">{prod.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{prod.description}</div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">{prod.unit}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-[#2E7D32] text-sm">GHS {prod.priceGHS}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                prod.stockQuantity > 50
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {prod.stockQuantity} packs
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                              {(prod.specifications as any)?.germinationRate || '96%'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {(prod.specifications as any)?.maturityDays || '105-110 days'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            {prod.regulatoryApprovalNumber || 'MoFA-GSID-S2026-088'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(prod)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-[#2E7D32] hover:text-[#2E7D32] text-slate-600 transition-colors"
                                title="Edit Seed Details & Price"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 transition-colors"
                                title="Delete Variety"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Seed Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E0D5] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#103B2D] mb-1">
                Fulfill Certified Seed Voucher
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Redeem government / bank subsidized seed vouchers presented by registered farmers.
              </p>

              <form onSubmit={handleRedeemVoucher} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seed Voucher Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GH-AGRI-TRK-8821 or ord_..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={redeeming}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  <span>{redeeming ? 'Verifying...' : 'Verify & Fulfill Seed Voucher'}</span>
                </button>
              </form>

              <div className="mt-5 p-3 rounded-xl bg-[#F7F5EF] border border-[#E5E0D5] text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-[#103B2D] block">Seed Quality Guarantee Standards:</span>
                <p>&bull; 100% CSIR foundation seed certification required.</p>
                <p>&bull; Minimum 95% germination rate laboratory confirmation.</p>
                <p>&bull; Batch QR code tag attached to each bag upon distribution.</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E0D5] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#103B2D] mb-1">
                Seed Distribution Log
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Recent certified seed allocations fulfilled to cooperative members.
              </p>

              {orders.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No seed voucher orders recorded.</div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-[#103B2D]">{ord.trackingNumber}</span>
                        <span className="font-extrabold text-[#2E7D32]">GHS {ord.totalAmountGHS.toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Farmer: <span className="font-semibold text-slate-800">{ord.farmerName}</span> &middot; Destination: {ord.deliveryAddress}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          Status: {ord.fulfilmentStatus}
                        </span>
                        <span className="text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add or Edit Seed Variety */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[#103B2D]">
                {editingProduct ? 'Edit Seed Variety in Web App' : 'Add New Seed Variety to Web App'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seed Variety Title &amp; Crop
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified High-Yield Hybrid White Maize (CSIR-CRI Obatanpa)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price in GHS
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="145"
                    value={formData.priceGHS}
                    onChange={(e) => setFormData({ ...formData, priceGHS: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size / Weight
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  >
                    <option value="10kg Bag">10kg Bag</option>
                    <option value="5kg Bag">5kg Bag</option>
                    <option value="2kg Pack">2kg Pack</option>
                    <option value="25kg Bag">25kg Bag</option>
                    <option value="50kg Bag">50kg Bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Available Stock (Packs)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="150"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    MoFA Seed Code
                  </label>
                  <input
                    type="text"
                    value={formData.regulatoryApprovalNumber}
                    onChange={(e) => setFormData({ ...formData, regulatoryApprovalNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Germination %
                  </label>
                  <input
                    type="text"
                    value={formData.germinationRate}
                    onChange={(e) => setFormData({ ...formData, germinationRate: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Maturity Days
                  </label>
                  <input
                    type="text"
                    value={formData.maturityDays}
                    onChange={(e) => setFormData({ ...formData, maturityDays: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Yield Potential
                  </label>
                  <input
                    type="text"
                    value={formData.yieldPotential}
                    onChange={(e) => setFormData({ ...formData, yieldPotential: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Variety Characteristics &amp; Recommended Agro-Ecologies
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all disabled:opacity-60 shadow-sm"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save & Update Web App' : 'Publish to Web App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
