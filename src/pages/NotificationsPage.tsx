import React from 'react';
import { Bell, Check, Trash2, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    navigate
  } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-emerald-600" />
            Notifications & Updates
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Stay updated with real-time order tracking, exclusive budget deals, and alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionUrl) {
                  const target = notif.actionUrl.replace('#', '');
                  if (target.startsWith('track-order/')) {
                    navigate('track-order', { orderId: target.replace('track-order/', '') });
                  } else if (target.startsWith('offers')) {
                    navigate('offers');
                  }
                }
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white border-stone-200 text-stone-700'
                  : 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/30 text-stone-900'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'ORDER'
                    ? 'bg-emerald-100 text-emerald-800'
                    : notif.type === 'OFFER'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {notif.type === 'ORDER' ? (
                  <ShoppingBag className="w-5 h-5" />
                ) : notif.type === 'OFFER' ? (
                  <Tag className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <Bell className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">You&apos;re all caught up!</h3>
          <p className="text-xs text-stone-500">No new notifications at this time.</p>
        </div>
      )}
    </div>
  );
};
