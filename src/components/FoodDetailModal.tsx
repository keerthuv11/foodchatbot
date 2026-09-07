import React, { useState } from 'react';
import { X, Star, Clock, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose }) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    food?.customizations?.forEach((c) => {
      if (c.options.length > 0) {
        initial[c.id] = c.options[0].id;
      }
    });
    return initial;
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [addedToast, setAddedToast] = useState<boolean>(false);

  if (!food) return null;

  // Calculate dynamic price with add-ons and customizations
  let extraCost = 0;
  if (food.customizations) {
    Object.entries(selectedCustomizations).forEach(([cId, optId]) => {
      const cObj = food.customizations?.find((c) => c.id === cId);
      const opt = cObj?.options.find((o) => o.id === optId);
      if (opt) extraCost += opt.price;
    });
  }

  if (food.addons) {
    selectedAddons.forEach((addonId) => {
      const addon = food.addons?.find((a) => a.id === addonId);
      if (addon) extraCost += addon.price;
    });
  }

  const unitTotal = food.finalPrice + extraCost;
  const grandTotal = unitTotal * quantity;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    addToCart(food, quantity, selectedCustomizations, selectedAddons, specialInstructions);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-60 w-full bg-stone-100 shrink-0">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {food.badges.map((b) => (
              <span
                key={b}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-0.5">
              {food.cuisine} • {food.restaurantName}
            </p>
            <h2 className="text-xl sm:text-2xl font-black">{food.name}</h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Price, Portion & Rating */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-stone-900">
                  ₹{food.finalPrice}
                </span>
                {food.price > food.finalPrice && (
                  <span className="text-sm text-stone-400 line-through font-semibold">
                    ₹{food.price}
                  </span>
                )}
                {food.discountPercent > 0 && (
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-black rounded-md">
                    {food.discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {food.portionSize} {food.calories ? `• ${food.calories} kcal` : ''}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{food.rating}</span>
              <span className="text-xs text-stone-400">({food.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
              Description
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Ingredients & Allergens */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="text-xs">
                <span className="font-bold text-stone-700">Key Ingredients: </span>
                <span className="text-stone-600">{food.ingredients.join(', ')}</span>
              </div>
              {food.allergens && food.allergens.length > 0 && (
                <div className="text-xs">
                  <span className="font-bold text-rose-700">Allergen Notice: </span>
                  <span className="text-rose-600">{food.allergens.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Customizations */}
          {food.customizations && food.customizations.length > 0 && (
            <div className="space-y-4">
              {food.customizations.map((custom) => (
                <div key={custom.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {custom.title}
                    </h4>
                    {custom.required && (
                      <span className="text-[10px] text-rose-600 font-bold uppercase">Required</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {custom.options.map((opt) => {
                      const isSelected = selectedCustomizations[custom.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() =>
                            setSelectedCustomizations((prev) => ({ ...prev, [custom.id]: opt.id }))
                          }
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span>{opt.price > 0 ? `+₹${opt.price}` : 'Free'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add-ons */}
          {food.addons && food.addons.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Recommended Add-ons (Optional)
              </h4>
              <div className="space-y-2">
                {food.addons.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-stone-300"
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-bold text-stone-900">+₹{addon.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special instructions */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Special Cooking Instructions
            </h4>
            <input
              type="text"
              placeholder="e.g. Less spicy, extra lemon, no onion"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 text-xs text-stone-800"
            />
          </div>
        </div>

        {/* Footer sticky bar with quantity & Add to cart */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center border border-stone-200 bg-white rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
          >
            {addedToast ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add {quantity} to Cart • ₹{grandTotal}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
