import React from 'react';
import { Star, Clock, Plus, Heart, Sparkles, Check } from 'lucide-react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';

interface FoodCardProps {
  food: FoodItem;
  onOpenDetails?: (food: FoodItem) => void;
  showBestValueHighlight?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onOpenDetails,
  showBestValueHighlight = false
}) => {
  const { addToCart, cart, toggleFavoriteFood, favoriteFoodIds } = useApp();

  const isFavorite = favoriteFoodIds.includes(food.id);
  const cartItem = cart.find((ci) => ci.foodItem.id === food.id);
  const isAdded = !!cartItem;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (food.customizations && food.customizations.length > 0) {
      if (onOpenDetails) onOpenDetails(food);
    } else {
      addToCart(food, 1);
    }
  };

  const getDietaryBadge = () => {
    switch (food.dietary) {
      case 'VEG':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-xs border border-emerald-600 bg-white" title="Vegetarian">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          </span>
        );
      case 'NON_VEG':
        return (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-xs border border-rose-600 bg-white" title="Non-Vegetarian">
            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-600"></span>
          </span>
        );
      case 'VEGAN':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            🌱 Vegan
          </span>
        );
      case 'JAIN':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-purple-50 text-[10px] font-bold text-purple-700 border border-purple-200">
            🟣 Jain
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(food)}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden ${
        showBestValueHighlight || food.badges.includes('BEST VALUE')
          ? 'border-emerald-300 ring-1 ring-emerald-400/30'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Top badges & Favorite heart */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

        {/* Dietary symbol + Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
          <div className="p-0.5 bg-white/90 backdrop-blur-xs rounded-sm shadow-xs">
            {getDietaryBadge()}
          </div>

          {food.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide shadow-xs ${
                badge === 'BEST VALUE'
                  ? 'bg-emerald-600 text-white'
                  : badge === 'BESTSELLER'
                  ? 'bg-amber-500 text-stone-950'
                  : badge === 'BUDGET PICK'
                  ? 'bg-sky-600 text-white'
                  : 'bg-stone-900 text-white'
              }`}
            >
              {badge === 'BEST VALUE' && <Sparkles className="w-2.5 h-2.5 inline mr-1" />}
              {badge}
            </span>
          ))}
        </div>

        {/* Favorite heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteFood(food.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-10 ${
            isFavorite ? 'bg-rose-50 text-rose-600' : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          title="Add to Favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Prep time on image bottom */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{food.prepTimeMins} mins</span>
        </div>

        {/* Discount tag if any */}
        {food.discountPercent > 0 && (
          <div className="absolute bottom-2 right-2.5 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
            {food.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-1 mb-1">
          <p className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase truncate">
            {food.cuisine} • {food.restaurantName}
          </p>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{food.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {food.name}
        </h3>

        <p className="text-stone-500 text-xs line-clamp-2 mt-1 mb-3 leading-relaxed">
          {food.description}
        </p>

        {/* Price & Action Button Footer */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-stone-950 font-sans tracking-tight">
                ₹{food.finalPrice}
              </span>
              {food.price > food.finalPrice && (
                <span className="text-xs text-stone-400 line-through font-semibold">
                  ₹{food.price}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 font-medium">
              {food.portionSize}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              isAdded
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
