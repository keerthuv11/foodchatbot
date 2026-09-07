import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, IndianRupee, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Coupon } from '../types';

export const OffersPage: React.FC = () => {
  const { coupons, applyCoupon, navigate, cartTotals } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleApply = (coupon: Coupon) => {
    const success = applyCoupon(coupon);
    if (success) {
      setAppliedMsg(`Coupon ${coupon.code} applied to your active cart!`);
    } else {
      setAppliedMsg(`Your cart total is below ₹${coupon.minOrder}. Add more dishes to qualify.`);
    }
    setTimeout(() => setAppliedMsg(null), 3000);
  };

  const bankDeals = [
    {
      bank: 'HDFC Bank Credit Cards',
      offer: 'Flat ₹75 instant discount on orders above ₹299 with code HDFC75',
      code: 'HDFC75'
    },
    {
      bank: 'Paytm UPI Instant Pay',
      offer: 'Win up to ₹50 cashback on your first 3 food deliveries',
      code: 'PAYTM50'
    },
    {
      bank: 'SBI RuPay Platinum Cards',
      offer: 'Flat 20% off up to ₹100 on weekend orders',
      code: 'SBIRUPAY'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
          <Tag className="w-4 h-4 text-amber-500" />
          Budget Savings Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Discount Coupons & Bank Offers
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Apply active promo codes to save big on your meals in Indian Rupees (₹)
        </p>
      </div>

      {appliedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 animate-in fade-in">
          {appliedMsg}
        </div>
      )}

      {/* Featured Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 flex flex-col justify-between hover:border-emerald-500 transition space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-mono font-black tracking-widest border border-emerald-300">
                  {coupon.code}
                </span>
                <p className="text-xs text-stone-600 font-medium pt-1">
                  {coupon.description}
                </p>
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition"
                title="Copy Coupon"
              >
                {copiedCode === coupon.code ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Min. Order: <strong className="text-stone-800">₹{coupon.minOrder}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApply(coupon)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                >
                  Apply to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bank & Payment Partner Offers */}
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-black text-stone-900">Bank & Digital Wallet Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankDeals.map((deal) => (
            <div
              key={deal.code}
              className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3"
            >
              <h3 className="font-bold text-xs text-stone-900">{deal.bank}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{deal.offer}</p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="font-mono font-black text-stone-800">{deal.code}</span>
                <button
                  onClick={() => handleCopy(deal.code)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Copy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
