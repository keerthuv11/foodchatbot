import React, { useState } from 'react';
import { Heart, Store, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { RestaurantCard } from '../components/RestaurantCard';

export const FavoritesPage: React.FC = () => {
  const {
    favoriteFoodIds,
    favoriteRestaurantIds,
    foods,
    restaurants,
    setSelectedFoodItem,
    navigate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DISHES' | 'RESTAURANTS'>('DISHES');

  const favoriteDishes = foods.filter((f) => favoriteFoodIds.includes(f.id));
  const favoriteRestaurants = restaurants.filter((r) => favoriteRestaurantIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          Saved Favorites
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Quickly reorder your beloved meals and trusted restaurants
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('DISHES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'DISHES'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Saved Dishes ({favoriteDishes.length})
        </button>
        <button
          onClick={() => setActiveTab('RESTAURANTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'RESTAURANTS'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Store className="w-4 h-4" />
          Saved Restaurants ({favoriteRestaurants.length})
        </button>
      </div>

      {activeTab === 'DISHES' ? (
        favoriteDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteDishes.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onOpenDetails={(item) => setSelectedFoodItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <Heart className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">No saved dishes yet</h3>
            <p className="text-xs text-stone-500">Tap the heart icon on any dish to save it here!</p>
            <button
              onClick={() => navigate('explore')}
              className="mt-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
            >
              Explore Dishes
            </button>
          </div>
        )
      ) : favoriteRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <Store className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">No saved restaurants yet</h3>
          <p className="text-xs text-stone-500">
            Tap the heart icon on any restaurant to bookmark it for fast ordering.
          </p>
          <button
            onClick={() => navigate('restaurants')}
            className="mt-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Browse Restaurants
          </button>
        </div>
      )}
    </div>
  );
};
