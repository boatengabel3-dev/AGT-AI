import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { Store, Package, ShoppingCart, Plus, CheckCircle2, Truck } from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, orderData] = await Promise.all([
          api.getProducts(),
          api.getOrders(),
        ]);
        setProducts(prodData);
        setOrders(orderData);
      } catch (err) {
        console.error('Failed to load supplier data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const totalStockUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* Top Banner */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-10 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-[#D4AF37]">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Verified Agro-Supplier Portal
                </div>
                <h1 className="font-display text-2xl font-bold text-white">
                  {user?.fullName || 'AfriAgro Inputs Ltd'}
                </h1>
                <p className="text-xs text-[#F7F5EF]/80">
                  MoFA Certified Input Distributor &middot; Kumasi &amp; Sunyani Hubs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-2 border border-white/15 text-xs text-right">
                <div className="text-[10px] text-white/60">Supplier Verification</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Licensed &amp; Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Listed Agro-Inputs</div>
            <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">{products.length}</div>
            <div className="text-[11px] text-emerald-700 mt-1">100% MoFA Compliant</div>
          </div>
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Warehouse Stock on Hand</div>
            <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">{totalStockUnits.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">Granular Bags &amp; Seed Packets</div>
          </div>
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Incoming Farmer Orders</div>
            <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">{orders.length}</div>
            <div className="text-[11px] text-emerald-700 mt-1">Dispatched &amp; Ready for Pickup</div>
          </div>
        </div>

        {/* Product Catalog & Inventory */}
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-[#103B2D]">
                Managed Catalog &amp; Depot Stock
              </h3>
              <p className="text-xs text-slate-500">
                Live inventory synced to the farmer marketplace
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-[#E5E0D5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-display text-sm font-bold text-[#103B2D]">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    Category: <span className="capitalize">{p.category}</span> &middot; Location: {p.location}
                  </div>
                  {p.regulatoryApprovalNumber && (
                    <div className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                      {p.regulatoryApprovalNumber}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-[#103B2D]">
                      GHS {p.priceGHS}
                    </div>
                    <div className="text-[11px] text-slate-500">per {p.unit}</div>
                  </div>
                  <div className="text-right border-l pl-4 border-slate-200">
                    <div className="font-mono text-sm font-bold text-slate-900">
                      {p.stockQuantity}
                    </div>
                    <div className="text-[11px] text-slate-500">Units in Depot</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Queue */}
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-bold text-[#103B2D] mb-4">
            Customer Fulfillment Orders
          </h3>
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="rounded-xl border border-[#E5E0D5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="font-display text-sm font-bold text-[#103B2D]">
                    Order #{ord.id} &middot; Farmer: {ord.farmerName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Destination: {ord.deliveryAddress} &middot; Tracking: {ord.trackingNumber}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="font-mono text-sm font-bold text-[#103B2D]">
                    GHS {ord.totalAmountGHS.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-800">
                    {ord.fulfilmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
