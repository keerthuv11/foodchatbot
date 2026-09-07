import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Search,
  ShoppingCart,
  Bell,
  Heart,
  User,
  Menu,
  X,
  Compass,
  Store,
  Tag,
  ShieldCheck,
  ChefHat,
  LogOut,
  ChevronDown,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_CITIES } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigate,
    selectedCity,
    setSelectedCity,
    detectLocation,
    cart,
    cartTotals,
    unreadNotifCount,
    user,
    setIsAIChatOpen,
    setIsAuthModalOpen,
    setAuthMode,
    logoutUser
  } = useApp();

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              id="nav-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-stone-900 font-sans">
                    BUDGETBITE
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                  Tell us budget. We find best meal.
                </p>
              </div>
            </button>

            {/* Location Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-colors border border-stone-200"
                id="nav-location-selector"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[90px] truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-stone-100">
                    <button
                      onClick={() => {
                        detectLocation();
                        setIsCityOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Detect Current Location
                    </button>
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    <p className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Select City
                    </p>
                    {INDIAN_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-50 flex items-center justify-between ${
                          selectedCity === city ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-stone-700'
                        }`}
                      >
                        {city}
                        {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentPage === 'home'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              id="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => navigate('explore')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentPage === 'explore'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              id="nav-explore"
            >
              <Compass className="w-4 h-4" />
              Explore Food
            </button>
            <button
              onClick={() => navigate('restaurants')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentPage === 'restaurants'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              id="nav-restaurants"
            >
              <Store className="w-4 h-4" />
              Restaurants
            </button>
            <button
              onClick={() => navigate('offers')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentPage === 'offers'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              id="nav-offers"
            >
              <Tag className="w-4 h-4 text-amber-500" />
              Offers
            </button>
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
              id="nav-ai-bot-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Assistant
            </button>
          </nav>

          {/* Right Action Controls: Search, Notifications, Favorites, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('explore')}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
              title="Search Dishes"
              id="nav-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('notifications')}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
              title="Notifications"
              id="nav-notifications-btn"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('favorites')}
              className="hidden sm:flex p-2 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Favorite Dishes & Restaurants"
              id="nav-favorites-btn"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('cart')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
              id="nav-cart-btn"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">₹{cartTotals.total}</span>
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 transition"
                id="nav-user-menu-btn"
              >
                <img
                  src={user.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden md:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email || user.phone}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      My Profile & Preferences
                    </button>
                    <button
                      onClick={() => {
                        navigate('my-orders');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <ShoppingCart className="w-4 h-4 text-stone-400" />
                      My Orders & Tracking
                    </button>
                    <button
                      onClick={() => {
                        navigate('addresses');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-stone-400" />
                      Saved Delivery Addresses
                    </button>
                    <button
                      onClick={() => {
                        navigate('support');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-stone-400" />
                      Help & Support Center
                    </button>
                    <a
                      href="/api/download-zip"
                      download="budgetbite-ai-source-code.zip"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 transition"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      Download Project Code (.ZIP)
                    </a>
                  </div>

                  {/* Role Switchers for testing */}
                  <div className="border-t border-stone-100 py-1 bg-stone-50/70">
                    <p className="px-4 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Management Portals
                    </p>
                    <button
                      onClick={() => {
                        navigate('vendor-dashboard');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100/50 flex items-center gap-2"
                    >
                      <ChefHat className="w-4 h-4 text-amber-600" />
                      Restaurant / Vendor Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('admin-dashboard');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100/50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Platform Admin Dashboard
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setAuthMode('login');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Switch Account / Login
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav Hamburger */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
              id="mobile-nav-toggle"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('home');
                  setIsMobileNavOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                  currentPage === 'home' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('explore');
                  setIsMobileNavOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                  currentPage === 'explore' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
                }`}
              >
                Explore Food Catalog
              </button>
              <button
                onClick={() => {
                  navigate('restaurants');
                  setIsMobileNavOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                  currentPage === 'restaurants' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
                }`}
              >
                All Restaurants
              </button>
              <button
                onClick={() => {
                  navigate('categories');
                  setIsMobileNavOpen(false);
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-stone-700"
              >
                Cuisines & Categories
              </button>
              <button
                onClick={() => {
                  navigate('offers');
                  setIsMobileNavOpen(false);
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-stone-700"
              >
                Discounts & Coupons (₹)
              </button>
              <button
                onClick={() => {
                  setIsAIChatOpen(true);
                  setIsMobileNavOpen(false);
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white flex items-center justify-between"
              >
                <span>Ask BudgetBite AI</span>
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigate('vendor-dashboard');
                  setIsMobileNavOpen(false);
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-amber-800 bg-amber-50"
              >
                Restaurant Vendor Portal
              </button>
              <button
                onClick={() => {
                  navigate('admin-dashboard');
                  setIsMobileNavOpen(false);
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-800 bg-indigo-50"
              >
                Admin Control Room
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
