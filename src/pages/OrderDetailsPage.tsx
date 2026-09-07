import React from 'react';
import { ArrowLeft, Printer, ShieldCheck, MapPin, CheckCircle2, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderDetailsPage: React.FC = () => {
  const { activeOrderId, orders, navigate } = useApp();

  const order = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold">Order not found.</p>
        <button
          onClick={() => navigate('my-orders')}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('my-orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
        >
          <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-black uppercase text-emerald-700">
              Tax Invoice / Bill of Supply
            </span>
            <h1 className="text-xl font-black text-stone-900 mt-0.5">Order #{order.id}</h1>
            <p className="text-xs text-stone-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
              {order.orderStatus.replace('_', ' ')}
            </span>
            <p className="text-xs text-stone-500 mt-1">Payment: {order.paymentMethod} (PAID)</p>
          </div>
        </div>

        {/* Vendor & Delivery info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-stone-100 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-stone-400 uppercase tracking-wider">Restaurant Vendor</p>
            <p className="font-bold text-stone-900 text-sm">{order.restaurantName}</p>
            <p className="text-stone-500">FSSAI Lic. #112233445566</p>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-stone-400 uppercase tracking-wider">Delivery To</p>
            <p className="font-bold text-stone-900">{order.deliveryAddress.label}</p>
            <p className="text-stone-500">
              {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400">
            Items Ordered
          </h3>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2.5 flex justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900">
                    {item.quantity}x {item.foodItem.name}
                  </span>
                  <p className="text-[11px] text-stone-500">{item.foodItem.portionSize}</p>
                </div>
                <span className="font-bold text-stone-950">
                  ₹{item.calculatedPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill calculation */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount ({order.couponApplied || 'OFFER'})</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Partner Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
          </div>
          <div className="flex justify-between">
            <span>GST & Service Tax (5%)</span>
            <span>₹{order.taxes}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{order.platformFee}</span>
          </div>
          <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
            <span className="font-black text-sm text-stone-900">Grand Total Paid</span>
            <span className="font-black text-2xl text-stone-950 font-sans">₹{order.total}</span>
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-2xl text-[11px] text-stone-500 text-center">
          Thank you for choosing BudgetBite AI. For invoice queries, please visit our Help & Support center.
        </div>
      </div>
    </div>
  );
};
