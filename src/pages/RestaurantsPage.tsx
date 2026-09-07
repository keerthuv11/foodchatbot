import React, { useState } from 'react';
import { Search, Store, Star, Clock, MapPin, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from '../components/RestaurantCard';

export const RestaurantsPage: React.FC = () => {
  const { restaurants, selectedCity } = useApp();

  const [search, setSearch] = useState('');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  const filtered = restaurants.filter((r) => {
    if (pureVegOnly && !r.isPureVeg) return false;
    if (minRating > 0 && r.rating < minRating) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisineTypes.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchCuisine) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Store className="w-7 h-7 text-emerald-600" />
            Budget-Friendly Restaurants in {selectedCity}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Carefully curated local kitchens with verified hygiene and high-value menus
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 pb-2 border-b border-stone-200">
        <button
          onClick={() => setPureVegOnly(!pureVegOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            pureVegOnly
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
          Pure Veg Only
        </button>

        <div className="flex items-center gap-1">
          <span className="text-xs text-stone-400 font-semibold mr-1">Rating:</span>
          {[0, 4.0, 4.5].map((rate) => (
            <button
              key={rate}
              onClick={() => setMinRating(rate)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                minRating === rate
                  ? 'bg-amber-400 text-stone-950 border-amber-400'
                  : 'bg-white text-stone-700 border-stone-200'
              }`}
            >
              {rate === 0 ? 'All' : `${rate}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500">
          <p className="text-sm font-semibold">No restaurants match your filters.</p>
        </div>
      )}
    </div>
  );
};
