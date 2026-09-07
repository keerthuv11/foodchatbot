import React from 'react';
import { CUISINE_CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { navigate, setSearchQuery } = useApp();

  const handleSelect = (categoryName: string) => {
    setSearchQuery(categoryName);
    navigate('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Multi-Cuisine Catalog
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Explore by Cuisine & Category
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Select any regional Indian specialty or global culinary favorite to discover budget-friendly dishes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CUISINE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat.name)}
            className="group bg-white rounded-3xl border border-stone-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
          >
            <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white font-extrabold text-base">
                {cat.name}
              </span>
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[11px] font-bold text-white">
                {cat.count}+ Dishes
              </span>
            </div>

            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-stone-500">Popular dishes under ₹199</span>
              <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
