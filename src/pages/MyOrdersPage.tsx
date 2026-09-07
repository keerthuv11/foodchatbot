import React, { useState } from 'react';
import {
  ShoppingBag,
  RotateCcw,
  Star,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const MyOrdersPage: React.FC = () => {
  const { orders, navigate, reorder, rateOrder } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ONGOING' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [ratingModalOrder, setRatingModalOrder] = useState<Order | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ONGOING') {
      return o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED';
    }
    if (activeTab === 'DELIVERED') return o.orderStatus === 'DELIVERED';
    if (activeTab === 'CANCELLED') return o.orderStatus === 'CANCELLED';
    return true;
  });

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalOrder) return;
    rateOrder(ratingModalOrder.id, selectedStars, reviewComment || 'Delicious meal, fast delivery!');
    setRatingModalOrder(null);
    setReviewComment('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          My Food Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review past orders, track live food, and repeat favorite meals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'ONGOING', label: 'Active & Ongoing' },
          { id: 'DELIVERED', label: 'Delivered' },
          { id: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.orderStatus === 'DELIVERED';
            const isCancelled = order.orderStatus === 'CANCELLED';
            const isOngoing = !isDelivered && !isCancelled;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-6 space-y-4 hover:border-stone-300 transition"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs text-stone-400 font-mono">#{order.id}</span>
                    <h3 className="font-bold text-base text-stone-900">{order.restaurantName}</h3>
                    <p className="text-[11px] text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isOngoing
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : isDelivered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="text-base font-black text-stone-950 font-sans">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="space-y-1.5">
                  {order.items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-xs text-stone-700">
                      <span>
                        {item.quantity}x {item.foodItem.name}
                      </span>
                      <span className="font-semibold text-stone-900">
                        ₹{item.calculatedPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer action buttons */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-stone-500">
                    Paid via <strong className="text-stone-800">{order.paymentMethod}</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isOngoing && (
                      <button
                        onClick={() => navigate('track-order', { orderId: order.id })}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        Track Live
                      </button>
                    )}

                    {isDelivered && !order.rated && (
                      <button
                        onClick={() => setRatingModalOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Rate Meal
                      </button>
                    )}

                    {order.rated && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Rated {order.userRating}★
                      </span>
                    )}

                    <button
                      onClick={() => reorder(order)}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder
                    </button>

                    <button
                      onClick={() => navigate('order-details', { orderId: order.id })}
                      className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-stone-900"
                    >
                      View Invoice →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 p-8">
          <p className="text-sm font-semibold">No orders found in this tab.</p>
          <button
            onClick={() => navigate('explore')}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Meals Now
          </button>
        </div>
      )}

      {/* Rating & Review Submission Modal */}
      {ratingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-stone-900">
                Rate your meal from {ratingModalOrder.restaurantName}
              </h3>
              <button
                onClick={() => setRatingModalOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className="p-1 hover:scale-125 transition"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= selectedStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Write a Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the taste, portion size, and budget value?"
                  rows={3}
                  className="w-full mt-1 p-3 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
