import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_FOOD_ITEMS, INITIAL_RESTAURANTS, INITIAL_COUPONS } from './src/data/mockData.ts';
import { calculateBudgetRecommendations, extractBudgetFromPrompt } from './src/services/recommendationService.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent database states for the demo
let foodsDatabase = [...INITIAL_FOOD_ITEMS];
let restaurantsDatabase = [...INITIAL_RESTAURANTS];
let ordersDatabase: any[] = [];
let couponsDatabase = [...INITIAL_COUPONS];
let reviewsDatabase: any[] = [];

// Initialize Gemini Client server-side if key exists
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini initialization skipped or failed:', err);
  }
}

// 1. Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'BUDGETBITE AI',
    currency: 'INR (₹)',
    hasGemini: !!geminiClient,
    timestamp: new Date().toISOString(),
  });
});

// Download Project ZIP API
app.get(['/api/download-zip', '/download-zip', '/budgetbite-ai.zip'], (req, res) => {
  const zipFilePath = path.join(process.cwd(), 'public', 'budgetbite-ai-code.zip');
  res.download(zipFilePath, 'budgetbite-ai-source-code.zip', (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download zip file' });
      }
    }
  });
});

// 2. Food catalog API (with dynamic search, budget, cuisine, category filters)
app.get('/api/foods', (req, res) => {
  const { search, cuisine, category, maxPrice, dietary, isPureVeg } = req.query;
  let items = [...foodsDatabase];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.cuisine.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.restaurantName.toLowerCase().includes(q)
    );
  }

  if (cuisine && typeof cuisine === 'string' && cuisine !== 'all') {
    const c = cuisine.toLowerCase();
    items = items.filter((f) => f.cuisine.toLowerCase().includes(c));
  }

  if (category && typeof category === 'string' && category !== 'all') {
    const cat = category.toLowerCase();
    items = items.filter((f) => f.category.toLowerCase().includes(cat));
  }

  if (maxPrice) {
    const p = Number(maxPrice);
    if (!isNaN(p)) {
      items = items.filter((f) => f.finalPrice <= p);
    }
  }

  if (dietary && typeof dietary === 'string' && dietary !== 'ALL') {
    items = items.filter((f) => f.dietary === dietary);
  }

  res.json({ success: true, count: items.length, foods: items });
});

// Single food detail
app.get('/api/foods/:id', (req, res) => {
  const item = foodsDatabase.find((f) => f.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }
  res.json({ success: true, food: item });
});

// Vendor add food
app.post('/api/foods', (req, res) => {
  const newItem = {
    ...req.body,
    id: 'food-' + Date.now(),
    rating: 4.5,
    reviewsCount: 1,
    isAvailable: true,
    badges: req.body.badges || ['NEW'],
  };
  foodsDatabase.unshift(newItem);
  res.status(201).json({ success: true, food: newItem });
});

// 3. Restaurants API
app.get('/api/restaurants', (req, res) => {
  const { city, cuisine, minRating } = req.query;
  let list = [...restaurantsDatabase];

  if (city && typeof city === 'string') {
    list = list.filter((r) => r.city.toLowerCase() === city.toLowerCase());
  }

  if (cuisine && typeof cuisine === 'string' && cuisine !== 'all') {
    const c = cuisine.toLowerCase();
    list = list.filter((r) => r.cuisineTypes.some((t) => t.toLowerCase().includes(c)));
  }

  if (minRating) {
    const r = Number(minRating);
    if (!isNaN(r)) {
      list = list.filter((item) => item.rating >= r);
    }
  }

  res.json({ success: true, count: list.length, restaurants: list });
});

app.get('/api/restaurants/:id', (req, res) => {
  const r = restaurantsDatabase.find((item) => item.id === req.params.id);
  if (!r) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }
  const restaurantFoods = foodsDatabase.filter((f) => f.restaurantId === r.id);
  res.json({ success: true, restaurant: r, menu: restaurantFoods });
});

// 4. Recommendation Engine API
app.post('/api/recommendations', (req, res) => {
  const { budget = 300, peopleCount = 1, dietary = 'ALL', cuisine, location, ratingMin = 3.8 } = req.body;
  const scored = calculateBudgetRecommendations(foodsDatabase, restaurantsDatabase, {
    budget: Number(budget),
    peopleCount: Number(peopleCount),
    dietary,
    cuisine,
    location,
    ratingMin: Number(ratingMin),
  });

  res.json({
    success: true,
    budget: Number(budget),
    recommendationsCount: scored.length,
    recommendations: scored,
  });
});

// 5. AI Chatbot API with Gemini or Smart Fallback
app.post('/api/chat', async (req, res) => {
  const { message, history = [], currentBudget, userDietary = 'ALL', cartItems = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  // Extract budget or parameters from text
  const extracted = extractBudgetFromPrompt(message);
  const targetBudget = extracted.budget || currentBudget || 300;
  const targetCuisine = extracted.cuisine;
  const targetDietary = extracted.isVeg ? 'VEG' : userDietary;

  // Run our structured recommendation algorithm
  const recommendations = calculateBudgetRecommendations(foodsDatabase, restaurantsDatabase, {
    budget: targetBudget,
    peopleCount: extracted.people || 1,
    dietary: targetDietary as any,
    cuisine: targetCuisine,
  }).slice(0, 3);

  let aiReplyText = '';

  // If Gemini API is available, ask Gemini to provide a conversational, Indian-food-knowledgeable response
  if (geminiClient) {
    try {
      const systemInstruction = `You are "BudgetBite AI", an expert conversational Indian food assistant whose tagline is "Tell us your budget. We'll find your best meal."
Your job is to help the user discover the best value meals strictly in Indian Rupees (₹ / INR).
Never mention foreign currencies like $, €, £.
Always be warm, enthusiastic about food, concise, and helpful.
Available database food options matching their query:
${recommendations
  .map(
    (r, i) =>
      `${i + 1}. "${r.foodItem.name}" from ${r.foodItem.restaurantName} at ₹${r.foodItem.finalPrice} (Original: ₹${r.foodItem.price}, Rating: ${r.foodItem.rating}★). ${r.explanation}`
  )
  .join('\n')}

If user specifies a budget like "₹200" or "under 300", highlight the savings and why these items fit their wallet best.
If user asks to add something to cart, tell them they can click "Add to Cart" directly below.
Keep your response conversational, friendly, under 3 paragraphs.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User message: "${message}". Cart currently has ${cartItems.length} items. Budget: ₹${targetBudget}.`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      aiReplyText = response.text || '';
    } catch (err) {
      console.warn('Gemini generateContent error, falling back to smart engine:', err);
    }
  }

  // Fallback intelligent response if Gemini is unavailable
  if (!aiReplyText) {
    if (extracted.budget) {
      if (recommendations.length > 0) {
        aiReplyText = `I found ${recommendations.length} outstanding meal options for you under ₹${targetBudget}! My top recommendation is the **${recommendations[0].foodItem.name}** at just ₹${recommendations[0].foodItem.finalPrice} (${recommendations[0].explanation}). You can tap 'Add to Cart' or 'Compare' below!`;
      } else {
        aiReplyText = `I couldn't find any dishes within ₹${targetBudget} for your exact criteria. Try increasing your budget to ₹150 or ₹200 to unlock our best-value street food and tiffin combos!`;
      }
    } else if (/order status|where is my order|track/i.test(message)) {
      aiReplyText = `You can track all active orders live by heading to the "Live Order Tracking" tab in the navigation bar. Our riders are on the move with fresh, piping-hot meals!`;
    } else if (/discount|coupon|offer/i.test(message)) {
      aiReplyText = `We have active coupons today! Try **BUDGET50** for flat ₹50 OFF on ₹149+, or **BITE100** for ₹100 OFF on orders above ₹399.`;
    } else {
      aiReplyText = `Hello food lover! 👋 What are you craving today? Tell me your budget (e.g., *"Dinner under ₹250"* or *"Spicy biryani for two"*), and I'll find your best value meal!`;
    }
  }

  res.json({
    success: true,
    reply: aiReplyText,
    budgetDetected: extracted.budget,
    recommendedFoods: recommendations.map((r) => r.foodItem),
    recommendationsDetails: recommendations,
  });
});

// 6. Orders API
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    orderStatus: 'CONFIRMED',
    otp: String(Math.floor(1000 + Math.random() * 9000)),
    timeline: [
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        description: 'Your order has been received by BudgetBite AI',
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        status: 'ACCEPTED',
        label: 'Restaurant Accepted',
        description: 'Kitchen has accepted your order and begun prep',
        timestamp: 'Within 2 mins',
        completed: false,
        current: false,
      },
      {
        status: 'PREPARING',
        label: 'Food Being Prepared',
        description: 'Chef is cooking your fresh dishes',
        timestamp: 'Within 10 mins',
        completed: false,
        current: false,
      },
      {
        status: 'RIDER_ASSIGNED',
        label: 'Delivery Partner Assigned',
        description: 'Rider Rajesh Kumar (+91 98765 12345) assigned',
        timestamp: 'Within 15 mins',
        completed: false,
        current: false,
      },
      {
        status: 'ON_THE_WAY',
        label: 'On the Way',
        description: 'Rider is on electric bike heading to your location',
        timestamp: 'Estimated 25 mins',
        completed: false,
        current: false,
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        description: 'Food handed over safely. Enjoy your meal!',
        timestamp: 'Estimated 30 mins',
        completed: false,
        current: false,
      },
    ],
  };

  ordersDatabase.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders: ordersDatabase });
});

app.get('/api/orders/:id', (req, res) => {
  const order = ordersDatabase.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// Update order status (for vendor/admin tracking)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ordersDatabase.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.orderStatus = status;

  // Update timeline
  const statuses = ['CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY', 'RIDER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
  const currentIndex = statuses.indexOf(status);

  order.timeline = order.timeline.map((step: any) => {
    const stepIdx = statuses.indexOf(step.status);
    if (stepIdx <= currentIndex && currentIndex !== -1) {
      return { ...step, completed: true, current: step.status === status };
    }
    return { ...step, completed: false, current: false };
  });

  res.json({ success: true, order });
});

// Cancel order
app.post('/api/orders/:id/cancel', (req, res) => {
  const order = ordersDatabase.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  if (order.orderStatus === 'ON_THE_WAY' || order.orderStatus === 'DELIVERED') {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled once picked up by rider. Please contact support.',
    });
  }
  order.orderStatus = 'CANCELLED';
  order.cancellationReason = req.body.reason || 'User requested cancellation';
  res.json({ success: true, order });
});

// 7. Coupons API
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, coupons: couponsDatabase });
});

// 8. Reviews API
app.post('/api/reviews', (req, res) => {
  const newRev = {
    ...req.body,
    id: 'rev-' + Date.now(),
    date: 'Just now',
    verified: true,
  };
  reviewsDatabase.unshift(newRev);
  res.status(201).json({ success: true, review: newRev });
});

// Start Server and mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BUDGETBITE AI Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
