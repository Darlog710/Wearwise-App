import React, { useState, useMemo } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Moon, 
  X,
  Filter
} from 'lucide-react';
import type { WardrobeItem, Category, SortOption } from '../types/wardrobe';
import { ItemCard } from './ItemCard';
import { calculateCPW, getDaysSince, isDormant } from '../utils/cpwCalculations';
import { CurrencyCode } from '../utils/currency';

interface VaultViewProps {
  items: WardrobeItem[];
  currency: CurrencyCode;
  onSelectItem: (item: WardrobeItem) => void;
  onQuickLogWear: (e: React.MouseEvent, itemId: string) => void;
  onToggleFavorite: (e: React.MouseEvent, itemId: string) => void;
  onOpenAddModal: () => void;
}

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Dresses',
  'Accessories'
];

export const VaultView: React.FC<VaultViewProps> = ({
  items,
  currency,
  onSelectItem,
  onQuickLogWear,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('cpw-asc');
  const [showDormantOnly, setShowDormantOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & sort
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query) ||
          item.colorName.toLowerCase().includes(query);

        const matchesCategory = 
          selectedCategory === 'All' || item.category === selectedCategory;

        const matchesDormant = 
          !showDormantOnly || isDormant(item);

        return matchesQuery && matchesCategory && matchesDormant;
      })
      .sort((a, b) => {
        const cpwA = calculateCPW(a.purchasePrice, a.wearsCount);
        const cpwB = calculateCPW(b.purchasePrice, b.wearsCount);
        const daysA = getDaysSince(a.lastWornDate);
        const daysB = getDaysSince(b.lastWornDate);

        switch (sortBy) {
          case 'cpw-asc':
            return cpwA - cpwB;
          case 'cpw-desc':
            return cpwB - cpwA;
          case 'dormant-desc':
            return daysB - daysA;
          case 'wears-desc':
            return b.wearsCount - a.wearsCount;
          case 'price-desc':
            return b.purchasePrice - a.purchasePrice;
          case 'recent':
            return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          default:
            return 0;
        }
      });
  }, [items, searchQuery, selectedCategory, sortBy, showDormantOnly]);

  return (
    <div className="space-y-6">
      
      {/* Modern Filter & Search Controls Panel */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-m3-outline-variant/30 shadow-soft-sm space-y-4">
        
        {/* Row 1: Search & Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-m3-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments by label, name, color, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs sm:text-sm text-m3-on-surface outline-none transition-all placeholder:text-m3-on-surface-variant/60 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-m3-outline hover:text-m3-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & View Mode */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-m3-surface-container/70 text-xs font-bold text-m3-on-surface">
                <ArrowUpDown className="w-3.5 h-3.5 text-atelier-primary" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent outline-none cursor-pointer text-xs font-bold text-m3-on-surface pr-1"
                >
                  <option value="cpw-asc">Lowest CPW (Best ROI)</option>
                  <option value="cpw-desc">Highest CPW (Needs Wear)</option>
                  <option value="dormant-desc">Most Dormant (Days Unworn)</option>
                  <option value="wears-desc">Most Worn</option>
                  <option value="price-desc">Highest Purchase Price</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-m3-surface-container/70 border border-m3-outline-variant/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-atelier-primary shadow-soft-sm' 
                    : 'text-m3-outline hover:text-m3-on-surface'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-atelier-primary shadow-soft-sm' 
                    : 'text-m3-outline hover:text-m3-on-surface'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: Category Filters & Dormant Quick Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-m3-outline-variant/20">
          
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-atelier-primary text-white shadow-soft-sm'
                    : 'bg-m3-surface-container/70 text-m3-on-surface-variant hover:bg-m3-surface-variant hover:text-m3-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filter: Show Dormant Items */}
          <button
            onClick={() => setShowDormantOnly(!showDormantOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showDormantOnly
                ? 'bg-atelier-accent text-white border-atelier-accent shadow-accent-glow'
                : 'bg-white text-m3-on-surface-variant border-m3-outline-variant/40 hover:border-atelier-accent/50'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dormant Only (&gt;45d)</span>
          </button>

        </div>

      </div>

      {/* Item Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-m3-on-surface-variant px-1 font-medium">
        <span>
          Showing <strong className="text-m3-on-surface font-bold">{filteredItems.length}</strong> of {items.length} garments in vault
        </span>
        {showDormantOnly && (
          <span className="text-atelier-accent font-bold flex items-center gap-1">
            <Moon className="w-3 h-3" />
            Filtered by dormant capital
          </span>
        )}
      </div>

      {/* Grid or List of Garments */}
      {filteredItems.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-3'
        }>
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              currency={currency}
              onSelect={onSelectItem}
              onQuickLogWear={onQuickLogWear}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-m3-outline-variant/30 shadow-soft-sm">
          <div className="w-16 h-16 rounded-3xl bg-m3-surface-container text-atelier-primary flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-m3-on-surface mb-1">
            No garments match your filters
          </h3>
          <p className="text-xs sm:text-sm text-m3-on-surface-variant max-w-md mx-auto mb-6">
            Try adjusting your search query, selecting "All" categories, or toggling off the dormant filter.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowDormantOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-m3-surface-container hover:bg-m3-surface-variant text-m3-on-surface text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-atelier-primary text-white text-xs font-bold hover:bg-atelier-primary-hover shadow-soft transition-all"
            >
              + Add New Piece
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
