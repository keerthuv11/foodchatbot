import React, { useState } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Store,
  Tag,
  DollarSign,
  IndianRupee,
  Activity,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { orders, restaurants, foods, coupons, setCoupons } = useApp();

  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMinOrder, setNewMinOrder] = useState(199);
  const [newDiscount, setNewDiscount] = useState(40);
  const [couponCreatedMsg, setCouponCreatedMsg] = useState(false);

  // Platform metrics
  const totalGMV = orders.reduce((sum, o) => sum + o.total, 48250);
  const platformRevenue = Math.round(totalGMV * 0.08); // 8% platform fee & commission

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setCoupons((prev) => [
      ...prev,
      {
        code: newCode.toUpperCase().trim(),
        description: newDesc || `Save ₹${newDiscount} on orders above ₹${newMinOrder}`,
        discountType: 'FLAT',
        discountValue: Number(newDiscount),
        minOrder: Number(newMinOrder),
        maxDiscount: Number(newDiscount),
        expiryDate: '2026-12-31'
      }
    ]);

    setCouponCreatedMsg(true);
    setNewCode('');
    setNewDesc('');
    setTimeout(() => setCouponCreatedMsg(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-black uppercase tracking-wider">
              Super Admin Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-1">
            <ShieldAlert className="w-7 h-7 text-emerald-600" />
            BudgetBite AI Platform Operations
          </h1>
          <p className="text-xs text-stone-500">
            System health, financial settlements in Indian Rupees (₹), and partner network
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Gross Merchandise Value (GMV)
          </span>
          <p className="text-2xl font-black text-stone-900 font-sans mt-1">
            ₹{totalGMV.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">100% in INR (₹)</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Platform Net Earnings
          </span>
          <p className="text-2xl font-black text-emerald-700 font-sans mt-1">
            ₹{platformRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-stone-500">Commission & Platform Fee</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Verified Kitchens
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">
            {restaurants.length} Partners
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">All FSSAI Certified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Catalog Dishes
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">
            {foods.length} Live Items
          </p>
          <span className="text-[11px] text-stone-500">Avg price: ₹145</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders Across Platform */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-black text-stone-900">Recent Platform Transactions</h2>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-stone-100">
              {orders.map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-600">#{o.id}</span>
                      <span className="font-bold text-stone-900">{o.restaurantName}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {o.items.length} items • {o.deliveryAddress.city} • Pay: {o.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-stone-950 font-sans">
                      ₹{o.total}
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Coupon Creator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              Create Promo Coupon
            </h3>

            {couponCreatedMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Coupon activated!
              </div>
            )}

            <form onSubmit={handleAddCoupon} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH60"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-xs uppercase font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Flat Off (₹)</label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Description</label>
                <input
                  type="text"
                  placeholder="Special weekend dining offer"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Publish Coupon
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
