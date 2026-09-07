import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Sparkles,
  ArrowUpDown,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { DietaryType, FoodItem } from '../types';

export const ExplorePage: React.FC = () => {
  const { foods, setSelectedFoodItem, searchQuery, setSearchQuery } = useApp();

  // Filters state
  const [selectedCuisine, setSelectedCuisine] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'VALUE' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING' | 'TIME'>('VALUE');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Extract unique cuisines and categories
  const cuisines = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => set.add(f.cuisine));
    return ['ALL', ...Array.from(set)];
  }, [foods]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => set.add(f.category));
    return ['ALL', ...Array.from(set)];
  }, [foods]);

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    let list = foods.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCuisine = item.cuisine.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchRest = item.restaurantName.toLowerCase().includes(q);
        if (!matchName && !matchCuisine && !matchCat && !matchRest) return false;
      }

      // Cuisine
      if (selectedCuisine !== 'ALL' && item.cuisine !== selectedCuisine) {
        return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Dietary
      if (selectedDietary !== 'ALL') {
        if (selectedDietary === 'VEG' && item.dietary !== 'VEG' && item.dietary !== 'VEGAN' && item.dietary !== 'JAIN') {
          return false;
        }
        if (selectedDietary === 'NON_VEG' && item.dietary !== 'NON_VEG') {
          return false;
        }
        if (selectedDietary === 'VEGAN' && item.dietary !== 'VEGAN') {
          return false;
        }
        if (selectedDietary === 'JAIN' && item.dietary !== 'JAIN' && !item.badges.includes('JAIN AVAILABLE')) {
          return false;
        }
      }

      // Price
      if (item.finalPrice > maxPrice) {
        return false;
      }

      // Rating
      if (item.rating < minRating) {
        return false;
      }

      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'VALUE') {
        const aVal = a.discountPercent * 2 + a.rating * 10 - a.finalPrice * 0.1;
        const bVal = b.discountPercent * 2 + b.rating * 10 - b.finalPrice * 0.1;
        return bVal - aVal;
      }
      if (sortBy === 'PRICE_ASC') return a.finalPrice - b.finalPrice;
      if (sortBy === 'PRICE_DESC') return b.finalPrice - a.finalPrice;
      if (sortBy === 'RATING') return b.rating - a.rating;
      if (sortBy === 'TIME') return a.prepTimeMins - b.prepTimeMins;
      return 0;
    });

    return list;
  }, [foods, searchQuery, selectedCuisine, selectedCategory, selectedDietary, maxPrice, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCuisine('ALL');
    setSelectedCategory('ALL');
    setSelectedDietary('ALL');
    setMaxPrice(500);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Explore Food Dishes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {filteredFoods.length} budget-friendly dishes priced strictly in ₹ INR
          </p>
        </div>

        {/* Global Search Box */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by dish or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-600 text-xs text-stone-900 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Horizontal Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/80">
        {/* Dietary Pills */}
        <div className="flex rounded-xl border border-stone-200 p-1 bg-white shadow-xs">
          {(['ALL', 'VEG', 'NON_VEG', 'JAIN'] as DietaryType[]).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDietary(d)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedDietary === d
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {d === 'ALL' ? 'All Diets' : d === 'VEG' ? 'Pure Veg' : d === 'NON_VEG' ? 'Non-Veg' : 'Jain'}
            </button>
          ))}
        </div>

        {/* Cuisines Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {cuisines.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCuisine === c
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-stone-400 font-semibold hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold bg-white text-stone-800 focus:outline-hidden"
          >
            <option value="VALUE">Best Value (Score)</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="RATING">Rating: 4.5+ first</option>
            <option value="TIME">Fastest Delivery</option>
          </select>

          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
            title="More Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer / Expanded Box */}
      {isFilterDrawerOpen && (
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
          {/* Max Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>Max Price Cap:</span>
              <span className="text-emerald-700 font-black font-sans">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={70}
              max={600}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹70</span>
              <span>₹300</span>
              <span>₹600</span>
            </div>
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700">Minimum Rating</label>
            <div className="flex gap-2">
              {[0, 3.5, 4.0, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                    minRating === r
                      ? 'bg-amber-400 text-stone-950 border-amber-500'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  {r === 0 ? 'Any' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-end justify-between sm:justify-end gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-300"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Foods Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onOpenDetails={(item) => setSelectedFoodItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No dishes match your criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try loosening your price cap or switching to &apos;All Cuisines&apos; to view more options.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
