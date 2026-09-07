export type DietaryType = 'ALL' | 'VEG' | 'NON_VEG' | 'VEGAN' | 'JAIN';

export type UserRole = 'USER' | 'VENDOR' | 'ADMIN' | 'DELIVERY_PARTNER';

export type OrderStatus =
  | 'CONFIRMED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'COD';

export interface FoodCustomizationOption {
  id: string;
  name: string;
  price: number; // in ₹
}

export interface FoodCustomization {
  id: string;
  title: string;
  required: boolean;
  options: FoodCustomizationOption[];
}

export interface Addon {
  id: string;
  name: string;
  price: number; // in ₹
  dietary?: DietaryType;
}

export interface FoodItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  cuisine: string;
  category: string;
  description: string;
  dietary: DietaryType;
  price: number; // Original price in ₹
  discountPercent: number; // e.g. 20 for 20%
  finalPrice: number; // in ₹
  rating: number; // e.g. 4.6
  reviewsCount: number;
  prepTimeMins: number;
  isAvailable: boolean;
  portionSize: string; // e.g. "Serves 1-2 (450g)"
  serves: number;
  calories?: number;
  ingredients: string[];
  allergens: string[];
  customizations?: FoodCustomization[];
  addons?: Addon[];
  badges: string[]; // e.g. "BEST VALUE", "POPULAR", "BESTSELLER", "BUDGET PICK"
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisineTypes: string[];
  rating: number;
  totalRatings: number;
  deliveryTimeMins: number;
  distanceKm: number;
  minOrderPrice: number; // in ₹
  deliveryFee: number; // in ₹
  offers: string[]; // e.g. "Flat ₹50 OFF above ₹199"
  address: string;
  city: string;
  bannerImage: string;
  logoImage: string;
  isOpen: boolean;
  isPureVeg?: boolean;
  priceForTwo: number; // in ₹
}

export interface CartItem {
  cartItemId: string; // unique item id in cart
  foodItem: FoodItem;
  quantity: number;
  selectedCustomizations: Record<string, string>; // customizationId -> optionId
  selectedAddons: string[]; // addon ids
  specialInstructions?: string;
  calculatedPrice: number; // item price + addons
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  houseFlat: string;
  area: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  minOrder: number; // in ₹
  discountType: 'FLAT' | 'PERCENT';
  discountValue: number; // ₹ amount or %
  maxDiscount?: number; // max ₹ discount for percent
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  total: number; // in ₹
  couponApplied?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryAddress: Address;
  timeline: OrderTimelineStep[];
  cancellationReason?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  otp?: string;
  rated?: boolean;
  userRating?: number;
  userReviewText?: string;
}

export interface UserReview {
  id: string;
  orderId?: string;
  restaurantId: string;
  foodItemId?: string;
  foodName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface SupportTicket {
  id: string;
  category: string;
  orderId?: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  response?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'ORDER' | 'OFFER' | 'SYSTEM' | 'DELIVERY';
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePic?: string;
  dietaryPreference: DietaryType | 'ALL';
  savedAddresses: Address[];
  favoriteFoodIds: string[];
  favoriteRestaurantIds: string[];
  notificationCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  budgetDetected?: number;
  recommendedFoods?: FoodItem[];
  compareFoods?: FoodItem[];
  actionSuggestion?: {
    type: 'ADD_TO_CART' | 'VIEW_PAGE' | 'APPLY_FILTER' | 'CHECKOUT';
    label: string;
    payload?: any;
  };
}

export interface BudgetRecommendationParams {
  budget: number;
  peopleCount: number;
  dietary: DietaryType | 'ALL';
  cuisine?: string;
  location?: string;
  ratingMin?: number;
}
