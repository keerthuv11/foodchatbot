import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Mic,
  Sliders,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle,
  Tag,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { CUISINE_CATEGORIES } from '../data/mockData';
import { FoodItem, DietaryType } from '../types';
import { calculateBudgetRecommendations } from '../services/recommendationService';

export const HomePage: React.FC = () => {
  const {
    foods,
    restaurants,
    navigate,
    setSelectedFoodItem,
    setIsAIChatOpen,
    searchQuery,
    setSearchQuery
  } = useApp();

  // Interactive Budget Slider Calculator
  const [sliderBudget, setSliderBudget] = useState<number>(250);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryType>('ALL');

  // Compute live recommendations based on slider
  const liveRecommendations = useMemo(() => {
    return calculateBudgetRecommendations(foods, restaurants, {
      budget: sliderBudget,
      peopleCount,
      dietary: dietaryPreference
    });
  }, [foods, restaurants, sliderBudget, peopleCount, dietaryPreference]);

  const quickBudgetChips = [
    { label: 'Under ₹100', budget: 100 },
    { label: 'Under ₹150', budget: 150 },
    { label: 'Under ₹200', budget: 200 },
    { label: 'Under ₹300', budget: 300 },
    { label: 'Meal for 2 (₹400)', budget: 400, people: 2 },
    { label: 'Healthy Veg Under ₹150', budget: 150, dietary: 'VEG' as DietaryType }
  ];

  const handleChipClick = (chip: (typeof quickBudgetChips)[0]) => {
    setSliderBudget(chip.budget);
    if (chip.people) setPeopleCount(chip.people);
    if (chip.dietary) setDietaryPreference(chip.dietary);
    const targetSection = document.getElementById('budget-engine-section');
    targetSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const budgetPickOfDay = foods.find((f) => f.badges.includes('BUDGET PICK')) || foods[0];
  const bestValueDeals = foods.filter((f) => f.badges.includes('BEST VALUE')).slice(0, 4);
  const popularRestaurants = restaurants.slice(0, 4);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white pt-16 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow ambient decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/20 via-teal-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>&ldquo;Tell us your budget. We&apos;ll find your best meal.&rdquo;</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Find the best food within{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                your budget.
              </span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Tell our AI what you want to eat, how much you want to spend, and we&apos;ll calculate
              the highest-value dishes from top-rated restaurants across India.
            </p>
          </div>

          {/* Search & Voice Bar */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate('explore');
              }}
              className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-stone-200"
            >
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search dishes, cuisines, or 'Dinner under ₹250'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-stone-900 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setIsAIChatOpen(true)}
                className="p-2.5 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition shrink-0"
                title="Voice / AI Assistant"
              >
                <Mic className="w-5 h-5 text-emerald-600" />
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shrink-0 shadow-md"
              >
                Search
              </button>
            </form>

            {/* Quick Budget Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">
                Quick Picks:
              </span>
              {quickBudgetChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white text-stone-200 text-xs font-semibold backdrop-blur-md border border-white/15 transition shadow-xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BUDGET FINDER & VALUE ENGINE */}
      <section id="budget-engine-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                AI Smart Budget Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                Dial your budget. See the highest-value meals.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500 font-medium">Scoring:</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                Budget Fit + Rating + Portions + Discounts
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-stone-100 items-center">
            {/* Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Target Budget
                </label>
                <span className="text-xl font-black text-emerald-700 font-sans">
                  ₹{sliderBudget}
                </span>
              </div>
              <input
                type="range"
                min={80}
                max={800}
                step={20}
                value={sliderBudget}
                onChange={(e) => setSliderBudget(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-medium">
                <span>₹80 (Quick Snack)</span>
                <span>₹400 (Couple)</span>
                <span>₹800 (Feast)</span>
              </div>
            </div>

            {/* People Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                Number of Servings
              </label>
              <div className="flex rounded-xl border border-stone-200 p-1 bg-stone-50">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setPeopleCount(count)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                      peopleCount === count
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {count === 4 ? '4+ People' : `${count} ${count === 1 ? 'Person' : 'People'}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Dietary Preference
              </label>
              <div className="flex rounded-xl border border-stone-200 p-1 bg-stone-50">
                {(['ALL', 'VEG', 'NON_VEG', 'JAIN'] as DietaryType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDietaryPreference(d)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                      dietaryPreference === d
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {d === 'ALL' ? 'All' : d === 'VEG' ? 'Veg' : d === 'NON_VEG' ? 'Non-Veg' : 'Jain'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Top Matches Under ₹{sliderBudget} ({liveRecommendations.length} available)
              </p>
              <button
                onClick={() => navigate('explore')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {liveRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {liveRecommendations.slice(0, 4).map((rec) => (
                  <div key={rec.foodItem.id} className="relative flex flex-col">
                    <FoodCard
                      food={rec.foodItem}
                      onOpenDetails={(food) => setSelectedFoodItem(food)}
                      showBestValueHighlight={rec.isBestValue}
                    />
                    {/* Reason why recommended */}
                    <div className="mt-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-900 font-medium">
                      💡 {rec.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-stone-500">
                <p className="text-sm font-semibold">
                  No items found under ₹{sliderBudget} for this dietary filter.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Try sliding the budget up slightly or switching to &apos;All&apos;.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. POPULAR CUISINES & CATEGORIES CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Explore Cuisines & Thalis
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Authentic Indian regional flavors and global favorites
            </p>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CUISINE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchQuery(cat.name);
                navigate('explore');
              }}
              className="flex flex-col items-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition text-center group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 bg-stone-100 ring-2 ring-stone-100 group-hover:ring-emerald-400 transition">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-700 line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                {cat.count}+ dishes
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. BUDGET PICK OF THE DAY SPOTLIGHT */}
      {budgetPickOfDay && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white overflow-hidden shadow-2xl p-6 sm:p-10 border border-stone-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" /> Budget Pick of the Day
                </div>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                  {budgetPickOfDay.name}
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {budgetPickOfDay.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-sans">
                      ₹{budgetPickOfDay.finalPrice}
                    </span>
                    <span className="text-base text-stone-400 line-through">
                      ₹{budgetPickOfDay.price}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-black">
                      {budgetPickOfDay.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl backdrop-blur-xs text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{budgetPickOfDay.rating}</span>
                    <span className="text-stone-400">({budgetPickOfDay.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl backdrop-blur-xs text-xs">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{budgetPickOfDay.prepTimeMins} mins</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedFoodItem(budgetPickOfDay)}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs sm:text-sm shadow-lg transition"
                  >
                    Order Now • ₹{budgetPickOfDay.finalPrice}
                  </button>
                  <button
                    onClick={() =>
                      navigate('restaurant-detail', { restaurantId: budgetPickOfDay.restaurantId })
                    }
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition"
                  >
                    View {budgetPickOfDay.restaurantName}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={budgetPickOfDay.image}
                    alt={budgetPickOfDay.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-white">
                    {budgetPickOfDay.portionSize}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. BEST VALUE DEALS OF THE HOUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Algorithmic Value Index
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Best Value Deals of the Hour
            </h2>
          </div>
          <button
            onClick={() => navigate('explore')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            See All Deals <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestValueDeals.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onOpenDetails={(item) => setSelectedFoodItem(item)}
            />
          ))}
        </div>
      </section>

      {/* 6. TOP BUDGET RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Verified Budget Restaurants
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              High ratings, generous portions, affordable delivery
            </p>
          </div>
          <button
            onClick={() => navigate('restaurants')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            View All ({restaurants.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 7. AI ASSISTANT CONCIERGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              AI Voice Concierge
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Unsure what to eat? Ask BudgetBite AI.
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Type or speak your mood, cravings, or wallet budget. Our neural agent searches
              menus in real time to assemble your ideal meal.
            </p>
          </div>

          <button
            onClick={() => setIsAIChatOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-emerald-950 font-black text-sm shadow-xl transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Launch AI Assistant</span>
          </button>
        </div>
      </section>
    </div>
  );
};
