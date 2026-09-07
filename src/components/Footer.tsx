import React from 'react';
import { Sparkles, Shield, Heart, IndianRupee, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_CITIES } from '../data/mockData';

export const Footer: React.FC = () => {
  const { navigate, setSelectedCity } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-24 md:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                BUDGETBITE <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              &ldquo;Tell us your budget. We&apos;ll find your best meal.&rdquo; India&apos;s leading budget-first, AI-driven
              food ordering network. Delivering genuine value, multi-cuisine satisfaction, and live tracking strictly in Indian Rupees (₹).
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold">
                <IndianRupee className="w-3.5 h-3.5" /> 100% INR Only
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> FSSAI Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">
              Explore Food
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-white transition">
                  All Dishes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('restaurants')} className="hover:text-white transition">
                  Verified Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-white transition">
                  Cuisines & Thalis
                </button>
              </li>
              <li>
                <button onClick={() => navigate('offers')} className="hover:text-white transition">
                  Budget Coupons & Offers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('favorites')} className="hover:text-white transition">
                  Favorite Meals
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Portals */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">
              Portals & Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('my-orders')} className="hover:text-white transition">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('support')} className="hover:text-white transition">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('vendor-dashboard')} className="hover:text-amber-400 transition text-amber-300">
                  Restaurant Vendor Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-dashboard')} className="hover:text-indigo-400 transition text-indigo-300">
                  Admin Control Panel
                </button>
              </li>
              <li>
                <button onClick={() => navigate('settings')} className="hover:text-white transition">
                  Account Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Top Indian Metro Cities */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">
              Popular Cities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {INDIAN_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    navigate('explore');
                  }}
                  className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 transition flex items-center gap-1"
                >
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} BUDGETBITE AI Inc. All prices in Indian Rupees (₹ / INR). Designed with passion for foodies.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>FSSAI Hygiene Standards</span>
            <span className="flex items-center gap-1 text-stone-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
