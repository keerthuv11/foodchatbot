import React, { useState } from 'react';
import {
  Star,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  Search,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';

export const RestaurantDetailPage: React.FC = () => {
  const {
    selectedRestaurantId,
    restaurants,
    foods,
    navigate,
    setSelectedFoodItem,
    toggleFavoriteRestaurant,
    favoriteRestaurantIds
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchInMenu, setSearchInMenu] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const restaurant = restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];
  const isFavorite = favoriteRestaurantIds.includes(restaurant?.id || '');

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-stone-600">Restaurant not found.</p>
        <button
          onClick={() => navigate('restaurants')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  // Restaurant dishes
  const restaurantDishes = foods.filter((f) => f.restaurantId === restaurant.id);

  // Extract menu categories
  const categories = ['ALL', ...Array.from(new Set(restaurantDishes.map((f) => f.category)))];

  // Filtered dishes
  const displayedDishes = restaurantDishes.filter((dish) => {
    if (activeCategory !== 'ALL' && dish.category !== activeCategory) return false;
    if (vegOnly && dish.dietary !== 'VEG' && dish.dietary !== 'VEGAN' && dish.dietary !== 'JAIN') return false;
    if (searchInMenu.trim()) {
      const q = searchInMenu.toLowerCase();
      if (!dish.name.toLowerCase().includes(q) && !dish.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Hero */}
      <div className="relative h-64 sm:h-80 w-full bg-stone-900 overflow-hidden">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('restaurants')}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavoriteRestaurant(restaurant.id)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition z-10 ${
            isFavorite ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {restaurant.isPureVeg && (
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                100% PURE VEG
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
              FSSAI Lic. #{restaurant.fssaiNumber || '112233445566'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black">{restaurant.name}</h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            {restaurant.cuisineTypes.join(' • ')} • {restaurant.address}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white font-bold">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{restaurant.rating}</span>
              <span className="text-emerald-200">({restaurant.totalRatings} ratings)</span>
            </div>

            <div className="flex items-center gap-1 text-stone-200">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{restaurant.deliveryTimeMins} mins</span>
            </div>

            <div className="flex items-center gap-1 text-stone-200">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{restaurant.distanceKm} km</span>
            </div>

            <span className="text-stone-300 font-medium">
              ₹{restaurant.priceForTwo} for two
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Active Offers strip */}
        {restaurant.offers.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
            <Tag className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1 text-xs text-amber-900 font-bold">
              <span>Offers: {restaurant.offers.join(' • ')}</span>
            </div>
          </div>
        )}

        {/* Menu Navigation & Search */}
        <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md py-3 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search in menu & Veg filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search in menu..."
                value={searchInMenu}
                onChange={(e) => setSearchInMenu(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                vegOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              Veg Only
            </button>
          </div>
        </div>

        {/* Dishes list */}
        {displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedDishes.map((dish) => (
              <FoodCard
                key={dish.id}
                food={dish}
                onOpenDetails={(item) => setSelectedFoodItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-500 bg-stone-50 rounded-2xl">
            <p className="text-sm font-semibold">No dishes match your search in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
