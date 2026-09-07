import React, { createContext, useContext, useState, useEffect } from 'react';
import karthikaAvatar from '../assets/images/karthika_avatar_1788505371904.jpg';
import {
  FoodItem,
  Restaurant,
  CartItem,
  Order,
  Coupon,
  Address,
  UserProfile,
  NotificationItem,
  UserReview,
  SupportTicket,
  DietaryType,
  PaymentMethod,
  OrderStatus
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_RESTAURANTS,
  INITIAL_COUPONS,
  INITIAL_SAVED_ADDRESSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INDIAN_CITIES
} from '../data/mockData';

interface AppContextType {
  // Navigation & View
  currentPage: string;
  navigate: (page: string, params?: { restaurantId?: string; orderId?: string; foodItem?: FoodItem }) => void;
  selectedRestaurantId: string | null;
  selectedFoodItem: FoodItem | null;
  setSelectedFoodItem: (item: FoodItem | null) => void;
  activeOrderId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // City & Location
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  detectLocation: () => void;

  // Data Catalogs
  foods: FoodItem[];
  restaurants: Restaurant[];
  coupons: Coupon[];
  reviews: UserReview[];
  notifications: NotificationItem[];
  unreadNotifCount: number;

  // Cart
  cart: CartItem[];
  addToCart: (food: FoodItem, quantity?: number, customizations?: Record<string, string>, addons?: string[], specialInstructions?: string) => void;
  updateCartQty: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => boolean;
  removeCoupon: () => void;
  cartTotals: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    taxes: number;
    platformFee: number;
    total: number;
  };

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: PaymentMethod, deliveryAddress: Address) => Promise<Order>;
  cancelOrder: (orderId: string, reason: string) => void;
  rateOrder: (orderId: string, rating: number, comment: string) => void;
  reorder: (order: Order) => void;

  // Favorites
  favoriteFoodIds: string[];
  favoriteRestaurantIds: string[];
  toggleFavoriteFood: (foodId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;

  // User & Auth
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  loginUser: (emailOrPhone: string, role?: 'USER' | 'VENDOR' | 'ADMIN') => void;
  logoutUser: () => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // AI Assistant & Voice
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;

  // Vendor & Admin methods
  vendorUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  vendorAddFoodItem: (item: Partial<FoodItem>) => void;
  vendorToggleAvailability: (foodId: string) => void;

  // Support
  supportTickets: SupportTicket[];
  createSupportTicket: (category: string, subject: string, message: string, orderId?: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');

  // Catalogs
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-7291',
      restaurantId: 'rest-1',
      restaurantName: 'Nawabi Handi Biryani House',
      items: [
        {
          cartItemId: 'c-prev-1',
          foodItem: INITIAL_FOOD_ITEMS[0],
          quantity: 1,
          selectedCustomizations: { 'spice-level': 'sp-med' },
          selectedAddons: ['add-raita'],
          calculatedPrice: 224
        }
      ],
      subtotal: 224,
      discount: 45,
      deliveryFee: 25,
      taxes: 11,
      platformFee: 5,
      total: 220,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: '2026-09-02T19:30:00Z',
      estimatedDeliveryTime: 'Delivered in 28 mins',
      deliveryAddress: INITIAL_SAVED_ADDRESSES[0],
      rated: true,
      userRating: 5,
      timeline: [
        { status: 'CONFIRMED', label: 'Order Confirmed', description: 'Order received', timestamp: '7:30 PM', completed: true, current: false },
        { status: 'ACCEPTED', label: 'Restaurant Accepted', description: 'Kitchen started prep', timestamp: '7:32 PM', completed: true, current: false },
        { status: 'PREPARING', label: 'Food Prepared', description: 'Freshly cooked & packed', timestamp: '7:42 PM', completed: true, current: false },
        { status: 'ON_THE_WAY', label: 'Out for Delivery', description: 'Rider Rajesh on electric bike', timestamp: '7:48 PM', completed: true, current: false },
        { status: 'DELIVERED', label: 'Delivered', description: 'Handed over safely', timestamp: '7:58 PM', completed: true, current: true }
      ]
    }
  ]);

  // User & Auth
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-101',
    name: 'Karthika',
    email: 'karthika@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    profilePic: karthikaAvatar,
    dietaryPreference: 'ALL',
    savedAddresses: INITIAL_SAVED_ADDRESSES,
    favoriteFoodIds: ['food-101', 'food-103'],
    favoriteRestaurantIds: ['rest-1', 'rest-2'],
    notificationCount: 2
  });

  const [addresses, setAddresses] = useState<Address[]>(INITIAL_SAVED_ADDRESSES);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(['food-101', 'food-103']);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-1', 'rest-2']);

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Support tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-101',
      category: 'Order Issue',
      orderId: 'ORD-7291',
      subject: 'Compliment to the chef',
      message: 'The biryani was phenomenal, thank you BudgetBite team!',
      status: 'RESOLVED',
      createdAt: 'Yesterday',
      response: 'Thank you for your generous review, Rahul! We are delighted you loved the meal.'
    }
  ]);

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('restaurant/')) {
          const rId = hash.replace('restaurant/', '');
          setSelectedRestaurantId(rId);
          setCurrentPage('restaurant-detail');
        } else if (hash.startsWith('track-order/')) {
          const oId = hash.replace('track-order/', '');
          setActiveOrderId(oId);
          setCurrentPage('track-order');
        } else if (hash.startsWith('order-details/')) {
          const oId = hash.replace('order-details/', '');
          setActiveOrderId(oId);
          setCurrentPage('order-details');
        } else {
          setCurrentPage(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params?: { restaurantId?: string; orderId?: string; foodItem?: FoodItem }) => {
    if (params?.restaurantId) {
      setSelectedRestaurantId(params.restaurantId);
      window.location.hash = `restaurant/${params.restaurantId}`;
    } else if (params?.orderId) {
      setActiveOrderId(params.orderId);
      window.location.hash = `${page}/${params.orderId}`;
    } else {
      window.location.hash = page;
    }

    if (params?.foodItem) {
      setSelectedFoodItem(params.foodItem);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Location detection
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setSelectedCity('Bengaluru'); // High precision mock Indian metro
          setNotifications((prev) => [
            {
              id: 'notif-' + Date.now(),
              title: 'Location Updated 📍',
              message: 'Detected your current location: Koramangala, Bengaluru.',
              time: 'Just now',
              read: false,
              type: 'SYSTEM'
            },
            ...prev
          ]);
        },
        () => {
          setSelectedCity('Bengaluru');
        }
      );
    }
  };

  // Cart calculations
  const calculateCartTotals = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.calculatedPrice * item.quantity;
    });

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'FLAT') {
        discount = appliedCoupon.discountValue;
      } else {
        const percentDisc = (subtotal * appliedCoupon.discountValue) / 100;
        discount = appliedCoupon.maxDiscount ? Math.min(percentDisc, appliedCoupon.maxDiscount) : percentDisc;
      }
    }

    const deliveryFee = subtotal >= 199 || appliedCoupon?.code === 'FREEDEL' ? 0 : 25;
    const taxes = Math.round(subtotal * 0.05); // 5% GST on food services in India
    const platformFee = subtotal > 0 ? 5 : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee + taxes + platformFee);

    return { subtotal, discount, deliveryFee, taxes, platformFee, total };
  };

  const cartTotals = calculateCartTotals();

  const addToCart = (
    food: FoodItem,
    quantity = 1,
    customizations: Record<string, string> = {},
    addons: string[] = [],
    specialInstructions = ''
  ) => {
    let extraPrice = 0;
    if (food.customizations) {
      Object.entries(customizations).forEach(([customId, optId]) => {
        const customObj = food.customizations?.find((c) => c.id === customId);
        const optObj = customObj?.options.find((o) => o.id === optId);
        if (optObj) extraPrice += optObj.price;
      });
    }

    if (food.addons && addons.length > 0) {
      addons.forEach((addonId) => {
        const addObj = food.addons?.find((a) => a.id === addonId);
        if (addObj) extraPrice += addObj.price;
      });
    }

    const unitPrice = food.finalPrice + extraPrice;
    const cartItemId = `${food.id}-${JSON.stringify(customizations)}-${addons.sort().join(',')}`;

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((ci) =>
          ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            foodItem: food,
            quantity,
            selectedCustomizations: customizations,
            selectedAddons: addons,
            specialInstructions,
            calculatedPrice: unitPrice
          }
        ];
      }
    });
  };

  const updateCartQty = (cartItemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon): boolean => {
    if (cartTotals.subtotal < coupon.minOrder) {
      return false;
    }
    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Orders
  const placeOrder = async (paymentMethod: PaymentMethod, deliveryAddress: Address): Promise<Order> => {
    const restaurantId = cart[0]?.foodItem.restaurantId || 'rest-1';
    const restaurantName = cart[0]?.foodItem.restaurantName || 'Nawabi Handi Biryani House';

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      restaurantId,
      restaurantName,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      discount: cartTotals.discount,
      deliveryFee: cartTotals.deliveryFee,
      taxes: cartTotals.taxes,
      platformFee: cartTotals.platformFee,
      total: cartTotals.total,
      couponApplied: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-30 mins',
      deliveryAddress,
      deliveryPartnerName: 'Rajesh Kumar',
      deliveryPartnerPhone: '+91 98765 12345',
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      timeline: [
        {
          status: 'CONFIRMED',
          label: 'Order Confirmed',
          description: 'Your order was accepted by BudgetBite AI',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'ACCEPTED',
          label: 'Restaurant Accepted',
          description: 'Chef has received the recipe order',
          timestamp: 'Within 2 mins',
          completed: false,
          current: false
        },
        {
          status: 'PREPARING',
          label: 'Cooking in Progress',
          description: 'Fresh ingredients being seasoned & cooked',
          timestamp: 'Within 10 mins',
          completed: false,
          current: false
        },
        {
          status: 'RIDER_ASSIGNED',
          label: 'Delivery Partner Assigned',
          description: 'Rider Rajesh Kumar assigned',
          timestamp: 'Within 15 mins',
          completed: false,
          current: false
        },
        {
          status: 'ON_THE_WAY',
          label: 'On the Way',
          description: 'Rider en route on eco electric scooter',
          timestamp: 'Estimated 20-25 mins',
          completed: false,
          current: false
        },
        {
          status: 'DELIVERED',
          label: 'Delivered',
          description: 'Safe contactless handoff completed',
          timestamp: 'Estimated 30 mins',
          completed: false,
          current: false
        }
      ]
    };

    // Save order in state
    setOrders((prev) => [newOrder, ...prev]);

    // Send order confirmation notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Order ${newOrder.id} Placed! 🚀`,
        message: `Your food from ${newOrder.restaurantName} is confirmed for ₹${newOrder.total}. Track live!`,
        time: 'Just now',
        read: false,
        type: 'ORDER',
        actionUrl: `#track-order/${newOrder.id}`
      },
      ...prev
    ]);

    // Clear cart
    clearCart();
    setActiveOrderId(newOrder.id);

    // Realistic simulation: advance order status progressively every few seconds
    setTimeout(() => {
      advanceOrderStatus(newOrder.id, 'ACCEPTED');
    }, 12000);
    setTimeout(() => {
      advanceOrderStatus(newOrder.id, 'PREPARING');
    }, 28000);

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.orderStatus !== 'CANCELLED') {
          const statusOrder: OrderStatus[] = [
            'CONFIRMED',
            'ACCEPTED',
            'PREPARING',
            'READY',
            'RIDER_ASSIGNED',
            'ON_THE_WAY',
            'DELIVERED'
          ];
          const targetIndex = statusOrder.indexOf(nextStatus);

          const updatedTimeline = ord.timeline.map((step) => {
            const stepIdx = statusOrder.indexOf(step.status);
            return {
              ...step,
              completed: stepIdx <= targetIndex,
              current: step.status === nextStatus
            };
          });

          return {
            ...ord,
            orderStatus: nextStatus,
            timeline: updatedTimeline
          };
        }
        return ord;
      })
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: 'CANCELLED',
            cancellationReason: reason
          };
        }
        return ord;
      })
    );

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Order ${orderId} Cancelled ⚠️`,
        message: `Refund of ₹${orders.find((o) => o.id === orderId)?.total || 0} initiated to your original payment method.`,
        time: 'Just now',
        read: false,
        type: 'ORDER'
      },
      ...prev
    ]);
  };

  const rateOrder = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, rated: true, userRating: rating, userReviewText: comment } : ord))
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const newRev: UserReview = {
        id: 'rev-' + Date.now(),
        orderId,
        restaurantId: targetOrder.restaurantId,
        foodName: targetOrder.items[0]?.foodItem.name || 'Delicious Meal',
        userName: user.name,
        userAvatar: user.profilePic,
        rating,
        comment,
        date: 'Just now',
        verified: true
      };
      setReviews((prev) => [newRev, ...prev]);
    }
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.foodItem, item.quantity, item.selectedCustomizations, item.selectedAddons, item.specialInstructions);
    });
    navigate('cart');
  };

  // Favorites
  const toggleFavoriteFood = (foodId: string) => {
    setFavoriteFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurantIds((prev) =>
      prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId]
    );
  };

  // Addresses
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: 'addr-' + Date.now()
    };
    setAddresses((prev) => [...prev, newAddr]);
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  // User Profile
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const loginUser = (emailOrPhone: string, role: 'USER' | 'VENDOR' | 'ADMIN' = 'USER') => {
    setUser((prev) => ({
      ...prev,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'rahul.sharma@example.com',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
      role
    }));
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser((prev) => ({
      ...prev,
      role: 'USER',
      name: 'Guest User',
      email: 'guest@budgetbite.ai'
    }));
    navigate('home');
  };

  // Vendor & Admin
  const vendorUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    advanceOrderStatus(orderId, status);
  };

  const vendorAddFoodItem = (itemData: Partial<FoodItem>) => {
    const newItem: FoodItem = {
      id: 'food-' + Date.now(),
      name: itemData.name || 'Special Chef Creation',
      restaurantId: 'rest-1',
      restaurantName: 'Nawabi Handi Biryani House',
      cuisine: itemData.cuisine || 'North Indian',
      category: itemData.category || 'Main Course',
      description: itemData.description || 'Freshly cooked authentic specialty.',
      dietary: itemData.dietary || 'VEG',
      price: itemData.price || 199,
      discountPercent: itemData.discountPercent || 10,
      finalPrice: Math.round((itemData.price || 199) * (1 - (itemData.discountPercent || 10) / 100)),
      rating: 4.8,
      reviewsCount: 1,
      prepTimeMins: 20,
      isAvailable: true,
      portionSize: 'Serves 1-2',
      serves: itemData.serves || 1,
      ingredients: itemData.ingredients || ['Spices', 'Fresh herbs'],
      allergens: [],
      badges: ['NEW', 'CHEF SPECIAL'],
      image: itemData.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
    };
    setFoods((prev) => [newItem, ...prev]);
  };

  const vendorToggleAvailability = (foodId: string) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, isAvailable: !f.isAvailable } : f))
    );
  };

  // Support
  const createSupportTicket = (category: string, subject: string, message: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: 'TCK-' + Math.floor(100 + Math.random() * 900),
      category,
      orderId,
      subject,
      message,
      status: 'OPEN',
      createdAt: 'Just now'
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Ticket Raised #${newTicket.id}`,
        message: `Our customer support executive is reviewing your query: "${subject}".`,
        time: 'Just now',
        read: false,
        type: 'SYSTEM'
      },
      ...prev
    ]);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        selectedRestaurantId,
        selectedFoodItem,
        setSelectedFoodItem,
        activeOrderId,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        detectLocation,
        foods,
        restaurants,
        coupons,
        reviews,
        notifications,
        unreadNotifCount,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        orders,
        placeOrder,
        cancelOrder,
        rateOrder,
        reorder,
        favoriteFoodIds,
        favoriteRestaurantIds,
        toggleFavoriteFood,
        toggleFavoriteRestaurant,
        user,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        loginUser,
        logoutUser,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        isAIChatOpen,
        setIsAIChatOpen,
        vendorUpdateOrderStatus,
        vendorAddFoodItem,
        vendorToggleAvailability,
        supportTickets,
        createSupportTicket,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
