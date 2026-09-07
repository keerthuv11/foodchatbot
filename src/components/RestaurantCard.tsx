import React from 'react';
import { Star, Clock, MapPin, Tag, Heart } from 'lucide-react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { navigate, toggleFavoriteRestaurant, favoriteRestaurantIds } = useApp();
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  return (
    <div
      onClick={() => navigate('restaurant-detail', { restaurantId: restaurant.id })}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

        {/* Veg badge / Offers */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          {restaurant.isPureVeg && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              100% PURE VEG
            </span>
          )}
          {restaurant.offers.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {restaurant.offers[0]}
            </span>
          )}
        </div>

        {/* Favorite heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-rose-50 text-rose-600' : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          title="Save Restaurant"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Distance & Time pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white font-medium">
          <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{restaurant.deliveryTimeMins} mins</span>
            <span className="text-stone-400">•</span>
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{restaurant.distanceKm} km</span>
          </div>

          <span className="bg-emerald-700/90 text-white font-bold px-2 py-0.5 rounded-md text-[11px]">
            ₹{restaurant.priceForTwo} for two
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shrink-0">
            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            <span>{restaurant.rating}</span>
            <span className="text-emerald-600/60 font-normal">({restaurant.totalRatings})</span>
          </div>
        </div>

        <p className="text-xs text-emerald-700 font-semibold mb-1 truncate">
          {restaurant.cuisineTypes.join(' • ')}
        </p>

        <p className="text-xs text-stone-500 line-clamp-1 mb-3">
          {restaurant.address}
        </p>

        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <span className="text-stone-500">
            Min order: <strong className="text-stone-800">₹{restaurant.minOrderPrice}</strong>
          </span>
          <span className="text-emerald-700 font-bold hover:underline">
            View Menu →
          </span>
        </div>
      </div>
    </div>
  );
};
