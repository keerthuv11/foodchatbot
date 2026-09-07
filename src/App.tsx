import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OffersPage } from './pages/OffersPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddressesPage } from './pages/AddressesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SupportPage } from './pages/SupportPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, isAIChatOpen, setIsAIChatOpen, cart } = useApp();

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'restaurants':
        return <RestaurantsPage />;
      case 'restaurant-detail':
        return <RestaurantDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'track-order':
        return <OrderTrackingPage />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'order-details':
        return <OrderDetailsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'offers':
        return <OffersPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'addresses':
        return <AddressesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'support':
        return <SupportPage />;
      case 'vendor':
        return <VendorDashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200">
      {/* Global Top Navigation */}
      <Navbar />

      {/* Primary Page Canvas */}
      <main className="flex-1 w-full">{renderPage()}</main>

      {/* Global Footer */}
      <Footer />

      {/* Floating AI Chat Assistant Toggle */}
      {!isAIChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-stone-950 text-white shadow-2xl hover:bg-emerald-950 border border-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide">AI Food Concierge</span>
                <span className="px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-stone-400 group-hover:text-stone-300">
                Tell us your budget in ₹
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <FoodDetailModal />
      <AIChatDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
