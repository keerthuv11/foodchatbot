import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronRight,
  IndianRupee
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotals,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponsList, setShowCouponsList] = useState(false);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    setCouponError('');

    const targetCoupon = coupons.find((c) => c.code.toUpperCase() === code);
    if (!targetCoupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    const success = applyCoupon(targetCoupon);
    if (!success) {
      setCouponError(`Add items worth ₹${targetCoupon.minOrder - cartTotals.subtotal} more to use ${targetCoupon.code}!`);
    } else {
      setCouponCodeInput('');
      setShowCouponsList(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-900">Your Cart is Empty</h2>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Good food is waiting for you! Tell our AI your budget or explore delicious regional dishes.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            Find Meals by Budget
          </button>
          <button
            onClick={() => navigate('explore')}
            className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm transition"
          >
            Browse Food Catalog
          </button>
        </div>
      </div>
    );
  }

  const restaurantName = cart[0]?.foodItem.restaurantName || 'Verified Partner';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Your Order Cart
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Ordering from: <strong className="text-emerald-800">{restaurantName}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Dishes ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <img
                    src={item.foodItem.image}
                    alt={item.foodItem.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      {item.foodItem.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.foodItem.cuisine} • {item.foodItem.portionSize}
                    </p>

                    {/* Customizations summary */}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-amber-700 italic mt-1">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm sm:text-base font-black text-stone-950 font-sans">
                        ₹{item.calculatedPrice * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-stone-400">
                          (₹{item.calculatedPrice} each)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-stone-200 bg-stone-50 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.cartItemId, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.cartItemId, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('explore')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                + Add more items from menu
              </button>
            </div>
          </div>

          {/* Cooking instructions / Delivery Notes */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>BudgetBite Quality Assurance:</strong> Meals prepared strictly adhering to FSSAI hygiene standards. No hidden convenience fees.
            </span>
          </div>
        </div>

        {/* Right: Coupons & Bill Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupons Box */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                Apply Budget Coupons
              </h3>
              <button
                onClick={() => setShowCouponsList(!showCouponsList)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {showCouponsList ? 'Hide' : 'View Offers'}
              </button>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-xs text-emerald-900">
                    &lsquo;{appliedCoupon.code}&rsquo; Applied!
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Saved ₹{cartTotals.discount} on this order
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. BUDGET50)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs uppercase font-bold focus:outline-hidden focus:border-emerald-600"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                )}
              </div>
            )}

            {/* Expandable coupon list */}
            {showCouponsList && (
              <div className="space-y-2 pt-2 border-t border-stone-100 max-h-60 overflow-y-auto">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/50 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-black text-stone-900">{c.code}</span>
                      <p className="text-[11px] text-stone-500">{c.description}</p>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(c.code)}
                      className="text-xs font-bold text-emerald-700 hover:underline ml-2"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill Details strictly in INR (₹) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-bold text-stone-900">₹{cartTotals.subtotal}</span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartTotals.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {cartTotals.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${cartTotals.deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST & Restaurant Packaging (5%)</span>
                <span>₹{cartTotals.taxes}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{cartTotals.platformFee}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-stone-900">To Pay</span>
              <span className="text-2xl font-black text-stone-950 font-sans">
                ₹{cartTotals.total}
              </span>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
