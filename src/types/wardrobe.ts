export type Category = 
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Footwear'
  | 'Dresses'
  | 'Accessories';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';

export type ItemCondition = 'Mint' | 'Excellent' | 'Good' | 'Worn-in';

export interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subcategory: string;
  purchasePrice: number;
  purchaseDate: string; // YYYY-MM-DD
  wearsCount: number;
  targetCPW: number;
  lastWornDate: string; // YYYY-MM-DD
  imageUrl: string;
  colorHex: string;
  colorName: string;
  season: Season[];
  condition: ItemCondition;
  estimatedResaleValue: number;
  notes?: string;
  favorite?: boolean;
  wearHistory?: string[]; // Array of ISO dates
}

export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion: 'Casual' | 'Smart Casual' | 'Work / Formal' | 'Evening' | 'Athletic';
  season: Season;
  createdAt: string;
  wearsCount: number;
  notes?: string;
}

export type ViewTab = 'vault' | 'dormant' | 'outfits' | 'analytics';

export type SortOption = 
  | 'cpw-asc' 
  | 'cpw-desc' 
  | 'dormant-desc' 
  | 'price-desc' 
  | 'wears-desc' 
  | 'recent';

export interface PortfolioStats {
  totalValuation: number;
  totalItems: number;
  totalWears: number;
  averageCPW: number;
  dormantItemsCount: number;
  dormantCapital: number;
  activeItemsCount: number;
  utilizationRate: number; // percentage
  topAsset?: WardrobeItem;
  mostSleepingAsset?: WardrobeItem;
}

