import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Bike,
  Store,
  Home,
  Sparkles,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const {
    activeOrderId,
    orders,
    cancelOrder,
    navigate,
    createSupportTicket
  } = useApp();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Placed by mistake');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportQuery, setSupportQuery] = useState('');

  const order = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-stone-600">No active order to track.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'DELIVERED';
  const isCancelled = order.orderStatus === 'CANCELLED';

  const handleCancel = () => {
    cancelOrder(order.id, cancelReason);
    setCancelModalOpen(false);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket('Order Issue', `Help for ${order.id}`, supportQuery, order.id);
    setSupportModalOpen(false);
    setSupportQuery('');
    alert('Support ticket created! An agent is reviewing your query.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider text-amber-300">
              {isCancelled ? 'Order Cancelled' : isDelivered ? 'Delivered' : 'Live Order Tracking'}
            </span>
            <span className="text-xs text-stone-300">ID: #{order.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {isCancelled
              ? 'This order was cancelled'
              : isDelivered
              ? 'Enjoy your delicious meal! 🎉'
              : `Arriving in ${order.estimatedDeliveryTime}`}
          </h1>
          <p className="text-xs text-emerald-100">
            From <strong>{order.restaurantName}</strong> to {order.deliveryAddress.street}
          </p>
        </div>

        {/* Order OTP Box */}
        {!isDelivered && !isCancelled && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center shrink-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
              Delivery OTP
            </p>
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white font-mono">
              {order.otp || '4821'}
            </span>
            <p className="text-[10px] text-stone-300 mt-0.5">Share with rider upon arrival</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map Simulation + Rider Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulated Map Visualizer */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl overflow-hidden relative aspect-16/10 flex items-center justify-center p-6 text-white">
            {/* Visual map grid lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #34d399 1px, transparent 1px), linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Simulated route path SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500" fill="none">
              <path
                d="M 120 180 Q 250 80, 420 140 T 680 180"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Restaurant Marker */}
            <div className="absolute left-[15%] top-[55%] flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                <Store className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 text-[10px] font-bold border border-stone-700">
                {order.restaurantName}
              </span>
            </div>

            {/* Rider Marker in Transit */}
            {!isDelivered && !isCancelled && (
              <div className="absolute left-[50%] top-[35%] flex flex-col items-center -translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-emerald-400/30">
                  <Bike className="w-6 h-6 animate-pulse" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-emerald-950 text-[10px] font-black text-emerald-300 border border-emerald-700">
                  Rajesh (Electric Scooter)
                </span>
              </div>
            )}

            {/* User Destination Marker */}
            <div className="absolute right-[15%] bottom-[25%] flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 text-[10px] font-bold border border-stone-700">
                Your Delivery Spot
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-800 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live GPS Simulation Active</span>
            </div>
          </div>

          {/* Delivery Partner Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold text-base border border-stone-200">
                RK
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {order.deliveryPartnerName || 'Rajesh Kumar'}
                </h3>
                <p className="text-xs text-stone-500">Delivery Partner (Eco Electric Bike)</p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mt-0.5">
                  <span>★ 4.9 Rating</span>
                  <span>•</span>
                  <span>1,200+ Safe Deliveries</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+919876512345"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition"
              >
                <Phone className="w-4 h-4" /> Call Rider
              </a>
              <button
                onClick={() => setSupportModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                <HelpCircle className="w-4 h-4" /> Help
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status Stepper & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
                Live Order Milestones
              </h3>
              <span className="text-xs font-bold text-emerald-700">
                Total: ₹{order.total} (INR)
              </span>
            </div>

            {/* Stepper */}
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {order.timeline.map((step) => (
                <div key={step.status} className="relative flex items-start gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 text-xs font-bold ${
                      step.completed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                        : step.current
                        ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100 animate-pulse'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : '•'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          step.completed || step.current ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-[10px] text-stone-400">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              {!isDelivered && !isCancelled && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                >
                  Cancel Order
                </button>
              )}
              <button
                onClick={() => navigate('order-details', { orderId: order.id })}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition"
              >
                View Complete Invoice (₹{order.total})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Reason Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Cancel Order #{order.id}?</h3>
            <p className="text-xs text-stone-500">
              Full refund of ₹{order.total} will be returned to your original payment method immediately.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">Reason for cancellation:</label>
              {[
                'Placed by mistake',
                'Need to change delivery address',
                'Delivery time is too long',
                'Forgot to apply discount coupon'
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 text-xs cursor-pointer hover:bg-stone-50"
                >
                  <input
                    type="radio"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="text-emerald-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border text-xs font-bold text-stone-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-stone-900">Support for #{order.id}</h3>
              <button onClick={() => setSupportModalOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSupportSubmit} className="space-y-3">
              <p className="text-xs text-stone-500">
                Tell us what you need help with (Missing item, rider contact, bill query):
              </p>
              <textarea
                value={supportQuery}
                onChange={(e) => setSupportQuery(e.target.value)}
                placeholder="Describe your issue..."
                rows={3}
                className="w-full p-3 border rounded-xl text-xs"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
