export type ItemCategory = 
  | 'grocery_fresh'
  | 'beverages_bar'
  | 'decorations_theme'
  | 'tableware_disposables'
  | 'games_favors'
  | 'equipment_rentals'
  | 'other';

export type StoreType = 
  | 'CymbalMart Supercenter'
  | 'CymbalMart Grocery & Deli'
  | 'CymbalMart Beverage & Spirits'
  | 'CymbalMart Party & Home'
  | 'Costco / Wholesale Club'
  | 'Supermarket / Grocery'
  | 'Liquor / Beverage Store'
  | 'Party Supply / Dollar Tree'
  | 'Amazon / Online'
  | 'Bakery / Specialty Store'
  | 'Local Market';

export interface ItemSubstitute {
  name: string;
  cost: number;
  savings: number;
  reason: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  store: StoreType;
  quantity: number | string;
  unit: string;
  estimatedCost: number;
  actualCost?: number;
  checked: boolean;
  notes?: string;
  dietaryTags?: string[];
  priority: 'essential' | 'recommended' | 'optional';
  bulkTip?: string;
  aisleLocation?: string;
  isCymbalMartBrand?: boolean;
  substituteOption?: ItemSubstitute;
}

export interface CymbalMartOrder {
  id: string;
  orderNumber: string;
  partyTitle: string;
  fulfillmentType: 'express_delivery' | 'curbside_pickup' | 'in_store_scan';
  pickupOrDeliverySlot: string;
  storeBranch: string;
  addressOrBay: string;
  subtotal: number;
  memberDiscount: number;
  estimatedTax: number;
  deliveryFee: number;
  finalTotal: number;
  itemsCount: number;
  orderStatus: 'confirmed' | 'picking' | 'ready_for_pickup' | 'out_for_delivery';
  createdAt: string;
  barcode: string;
  dietaryNotesChecked: boolean;
}

export interface PartyMenuRecipe {
  id: string;
  name: string;
  course: 'appetizer' | 'main' | 'side' | 'dessert' | 'cocktail_drink' | 'snack';
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes?: number;
  description: string;
  ingredients: {
    item: string;
    amount: string;
    inShoppingList?: boolean;
  }[];
  instructions: string[];
  dietaryTags: string[];
  makeAheadTips?: string;
}

export interface TimelineStep {
  id: string;
  timeframe: '3-4 Days Before' | '1-2 Days Before' | 'Day of Party (Morning)' | '2 Hours Before Guests Arrive' | 'Party Kickoff';
  task: string;
  category: 'Shopping' | 'Prep & Cooking' | 'Decor & Setup' | 'Beverages' | 'Host Readiness';
  completed: boolean;
  tip?: string;
}

export interface DrinkCalculatorData {
  totalEstimatedDrinks: number;
  beerCansBottles: number;
  wineBottles750ml: number;
  liquorBottles750ml: number;
  mixerLiters: number;
  sodaAndNonAlcoholicCans: number;
  icePounds: number;
  cupsTotal: number;
  garnishNotes: string;
  calculationFormula: string;
}

export interface PartyDetails {
  id: string;
  title: string;
  eventType: string;
  theme: string;
  guestCountAdults: number;
  guestCountKids: number;
  guestCountTeens: number;
  durationHours: number;
  budgetLimit: number;
  currency: string;
  venue: 'Home Indoor' | 'Backyard / Outdoor' | 'Park / Picnic' | 'Rented Venue / Hall' | 'Office / Workplace';
  vibe: 'Casual & Relaxed' | 'Lively & High-Energy' | 'Elegant & Sophisticated' | 'Family & Kid Friendly' | 'Budget-Conscious' | 'Gourmet Foodie';
  dietaryRestrictions: string[];
  drinkPreference: 'Full Bar (Cocktails + Beer + Wine)' | 'Beer & Wine + Non-Alcoholic' | 'Mocktails & Punch (Non-Alcoholic)' | 'BYOB + Mixers & Ice' | 'Family Variety';
  specialRequests: string;
}

export interface PartyPlan {
  id: string;
  details: PartyDetails;
  shoppingList: ShoppingItem[];
  menuRecipes: PartyMenuRecipe[];
  timeline: TimelineStep[];
  drinkCalculator: DrinkCalculatorData;
  themeAndDecorIdeas: string[];
  playlistAndVibeTips: string[];
  budgetTips: string[];
  estimatedTotalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    type: 'add_items' | 'adjust_budget' | 'apply_dietary' | 'change_theme' | 'regenerate';
    payload?: any;
  };
  modifiedItemsSummary?: string[];
  recalculatedBudget?: {
    previousTotal: number;
    newTotal: number;
    budgetLimit: number;
    variance: number;
    itemsCount: number;
    totalSavings?: number;
  };
}
