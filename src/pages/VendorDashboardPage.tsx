import React, { useState } from 'react';
import {
  ChefHat,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  IndianRupee,
  UtensilsCrossed,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, FoodItem } from '../types';

export const VendorDashboardPage: React.FC = () => {
  const {
    orders,
    foods,
    vendorUpdateOrderStatus,
    vendorAddFoodItem,
    vendorToggleAvailability
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU'>('ORDERS');
  const [isAddingDish, setIsAddingDish] = useState(false);

  // New dish state
  const [dishName, setDishName] = useState('');
  const [dishCuisine, setDishCuisine] = useState('North Indian');
  const [dishCategory, setDishCategory] = useState('Main Course');
  const [dishPrice, setDishPrice] = useState(180);
  const [dishDiscount, setDishDiscount] = useState(15);
  const [dishDietary, setDishDietary] = useState<'VEG' | 'NON_VEG'>('VEG');
  const [dishImage, setDishImage] = useState(
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
  );

  // Calculations
  const vendorOrders = orders.filter((o) => o.restaurantId === 'rest-1');
  const totalRevenue = vendorOrders.reduce((sum, o) => sum + o.total, 4850);
  const activeOrders = vendorOrders.filter(
    (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  );
  const restaurantFoods = foods.filter((f) => f.restaurantId === 'rest-1');

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    vendorAddFoodItem({
      name: dishName,
      cuisine: dishCuisine,
      category: dishCategory,
      price: Number(dishPrice),
      discountPercent: Number(dishDiscount),
      dietary: dishDietary,
      image: dishImage,
      restaurantId: 'rest-1',
      restaurantName: 'Nawabi Handi Biryani House'
    });

    setDishName('');
    setIsAddingDish(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
              Restaurant Partner Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-1">
            <ChefHat className="w-7 h-7 text-amber-600" />
            Nawabi Handi Biryani House
          </h1>
          <p className="text-xs text-stone-500">
            Real-time kitchen order processing & menu availability management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ORDERS'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Live Kitchen Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('MENU')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'MENU'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Manage Menu ({restaurantFoods.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Today&apos;s Revenue
          </span>
          <p className="text-2xl font-black text-stone-900 font-sans mt-1">
            ₹{totalRevenue}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">↑ 18% vs yesterday</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Active Prep Orders
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {activeOrders.length}
          </p>
          <span className="text-[11px] text-stone-500">Avg kitchen prep: 14 mins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Total Completed
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">
            {vendorOrders.length}
          </p>
          <span className="text-[11px] text-stone-500">100% fulfill rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Kitchen Rating
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            4.8 ★
          </p>
          <span className="text-[11px] text-stone-500">From 1,420+ customers</span>
        </div>
      </div>

      {/* Tab 1: Orders Pipeline */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-stone-900">Live Kitchen Queue</h2>
          {vendorOrders.length > 0 ? (
            <div className="space-y-4">
              {vendorOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-500">
                          #{order.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            order.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Customer OTP: <strong className="text-stone-900 font-mono">{order.otp}</strong>
                      </p>
                    </div>

                    <span className="text-lg font-black text-stone-950 font-sans">
                      ₹{order.total}
                    </span>
                  </div>

                  {/* Dishes in this order */}
                  <div className="space-y-1 text-xs text-stone-700">
                    {order.items.map((i) => (
                      <div key={i.cartItemId} className="flex justify-between">
                        <span>
                          {i.quantity}x {i.foodItem.name}
                        </span>
                        <span className="font-semibold">₹{i.calculatedPrice * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick status progress buttons */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-stone-400 font-medium">Update Kitchen Status:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED'] as OrderStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => vendorUpdateOrderStatus(order.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              order.orderStatus === st
                                ? 'bg-stone-900 text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
              No orders yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu Management */}
      {activeTab === 'MENU' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-stone-900">Your Menu Dishes</h2>
            <button
              onClick={() => setIsAddingDish(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Dish
            </button>
          </div>

          {/* Add Dish Form */}
          {isAddingDish && (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4 animate-in fade-in">
              <h3 className="text-base font-extrabold text-stone-900">Add Menu Item</h3>
              <form onSubmit={handleCreateDish} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700">Dish Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mutton Rogan Josh"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">Dietary</label>
                    <select
                      value={dishDietary}
                      onChange={(e: any) => setDishDietary(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                    >
                      <option value="VEG">Vegetarian</option>
                      <option value="NON_VEG">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">Price in ₹</label>
                    <input
                      type="number"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">Discount %</label>
                    <input
                      type="number"
                      value={dishDiscount}
                      onChange={(e) => setDishDiscount(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDish(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Add Dish to Catalog
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Dishes Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-100">
              {restaurantFoods.map((food) => (
                <div key={food.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900">{food.name}</h4>
                      <p className="text-xs text-stone-500">
                        {food.cuisine} • {food.category} • {food.portionSize}
                      </p>
                      <span className="font-black text-xs text-stone-950">
                        ₹{food.finalPrice} (MRP ₹{food.price})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        food.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {food.isAvailable ? 'In Stock' : 'Sold Out'}
                    </span>
                    <button
                      onClick={() => vendorToggleAvailability(food.id)}
                      className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs font-semibold hover:bg-stone-50"
                    >
                      Toggle Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
