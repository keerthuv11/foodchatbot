import { FoodItem, DietaryType, BudgetRecommendationParams, Restaurant } from '../types';

export interface ScoredRecommendation {
  foodItem: FoodItem;
  valueScore: number;
  explanation: string;
  isBestValue: boolean;
  budgetMargin: number; // budget - finalPrice
}

/**
 * BudgetBite AI Value Scoring Algorithm:
 * Evaluates food items against user budget, dietary preference, people count,
 * rating, discounts, and portion generosity.
 */
export function calculateBudgetRecommendations(
  foodItems: FoodItem[],
  restaurants: Restaurant[],
  params: BudgetRecommendationParams
): ScoredRecommendation[] {
  const { budget, peopleCount = 1, dietary = 'ALL', cuisine, ratingMin = 3.5 } = params;

  // Filter available items within budget
  const eligibleItems = foodItems.filter((item) => {
    if (!item.isAvailable) return false;

    // Budget check: item price must be <= budget
    if (item.finalPrice > budget) return false;

    // Dietary filter
    if (dietary !== 'ALL') {
      if (dietary === 'VEG' && item.dietary !== 'VEG' && item.dietary !== 'VEGAN' && item.dietary !== 'JAIN') {
        return false;
      }
      if (dietary === 'NON_VEG' && item.dietary !== 'NON_VEG') {
        return false;
      }
      if (dietary === 'VEGAN' && item.dietary !== 'VEGAN') {
        return false;
      }
      if (dietary === 'JAIN' && item.dietary !== 'JAIN' && !item.badges.includes('JAIN AVAILABLE')) {
        return false;
      }
    }

    // Rating filter
    if (item.rating < ratingMin) return false;

    // Cuisine filter
    if (cuisine && cuisine.trim().length > 0 && cuisine.toLowerCase() !== 'all') {
      const target = cuisine.toLowerCase();
      const matchCuisine = item.cuisine.toLowerCase().includes(target);
      const matchCat = item.category.toLowerCase().includes(target);
      if (!matchCuisine && !matchCat) return false;
    }

    return true;
  });

  // Calculate Value Score for each candidate
  const scoredList: ScoredRecommendation[] = eligibleItems.map((item) => {
    const restaurant = restaurants.find((r) => r.id === item.restaurantId);
    const restRating = restaurant?.rating || 4.0;

    // 1. Budget Fit Score (0-30):
    // Rewards getting close to user budget while leaving room for extras or savings
    const priceRatio = item.finalPrice / budget;
    // Optimal fit around 60% to 90% of budget
    let budgetFitScore = 20;
    if (priceRatio <= 0.95 && priceRatio >= 0.5) {
      budgetFitScore = 30;
    } else if (priceRatio < 0.5) {
      budgetFitScore = 24; // Great savings!
    } else {
      budgetFitScore = 18;
    }

    // 2. Rating Score (0-25):
    // 4.5+ gives high boost
    const ratingScore = Math.min(25, (item.rating / 5) * 25);

    // 3. Portion / Serves Score (0-20):
    // If user has >= 2 people, items that serve >= 2 get high bonus
    let portionScore = 10;
    if (peopleCount > 1) {
      if (item.serves >= peopleCount) {
        portionScore = 20;
      } else if (item.serves >= 2) {
        portionScore = 16;
      } else {
        portionScore = 8;
      }
    } else {
      // For 1 person, standard portion is great
      portionScore = 15;
    }

    // 4. Discount Factor (0-15):
    const discountScore = Math.min(15, (item.discountPercent / 30) * 15);

    // 5. Restaurant Quality (0-10):
    const restScore = (restRating / 5) * 10;

    const totalValueScore = Math.round(budgetFitScore + ratingScore + portionScore + discountScore + restScore);

    // Generate natural human-readable explanation
    const savings = budget - item.finalPrice;
    let reasonParts: string[] = [];

    reasonParts.push(`Fits your ₹${budget} budget perfectly at ₹${item.finalPrice}`);

    if (savings >= 50) {
      reasonParts.push(`saves you ₹${savings}`);
    }

    if (item.rating >= 4.7) {
      reasonParts.push(`rated a stellar ${item.rating}★`);
    } else {
      reasonParts.push(`rated ${item.rating}★`);
    }

    if (item.discountPercent > 0) {
      reasonParts.push(`features a ${item.discountPercent}% discount`);
    }

    if (peopleCount > 1 && item.serves >= 2) {
      reasonParts.push(`portions comfortably for ${item.serves} people`);
    }

    const explanation = `Recommended because it ${reasonParts.join(', ')}.`;

    return {
      foodItem: item,
      valueScore: totalValueScore,
      explanation,
      isBestValue: false,
      budgetMargin: savings
    };
  });

  // Sort descending by value score
  scoredList.sort((a, b) => b.valueScore - a.valueScore);

  // Mark top as Best Value
  if (scoredList.length > 0) {
    scoredList[0].isBestValue = true;
    if (scoredList[1] && scoredList[1].valueScore >= scoredList[0].valueScore - 2) {
      scoredList[1].isBestValue = true;
    }
  }

  return scoredList;
}

/**
 * Natural language budget parser: extracts budget numbers from text like
 * "dinner under 300", "₹250 biryani", "something for 150", "meals for 2 under 500"
 */
export function extractBudgetFromPrompt(text: string): {
  budget?: number;
  people?: number;
  cuisine?: string;
  isVeg?: boolean;
} {
  const result: { budget?: number; people?: number; cuisine?: string; isVeg?: boolean } = {};

  // Check budget in rupees (₹ or rs or under or for)
  const budgetMatch = text.match(/(?:₹|rs\.?|inr|under|budget|below|around|within|for)\s*([0-9]+)/i) ||
                      text.match(/([0-9]{2,4})\s*(?:₹|rs|rupees)/i) ||
                      text.match(/\b([1-9][0-9]{1,3})\b/);

  if (budgetMatch && budgetMatch[1]) {
    const num = parseInt(budgetMatch[1], 10);
    if (num >= 30 && num <= 5000) {
      result.budget = num;
    }
  }

  // Check people count
  const peopleMatch = text.match(/(?:for|serves)\s*([1-9])\s*(?:people|person|pax|friends)?/i) ||
                      text.match(/([1-9])\s*(?:people|pax)/i);
  if (peopleMatch && peopleMatch[1]) {
    result.people = parseInt(peopleMatch[1], 10);
  }

  // Check vegetarian
  if (/\b(veg|vegetarian|pure veg|jain)\b/i.test(text) && !/\b(non[-\s]?veg)\b/i.test(text)) {
    result.isVeg = true;
  }

  // Check cuisine keywords
  const cuisines = [
    'biryani', 'dosa', 'south indian', 'north indian', 'chinese', 'pizza',
    'burger', 'thali', 'noodles', 'momos', 'pav bhaji', 'street food', 'dessert',
    'pasta', 'gujarati', 'rajasthani', 'mughlai'
  ];

  for (const c of cuisines) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
      result.cuisine = c;
      break;
    }
  }

  return result;
}
