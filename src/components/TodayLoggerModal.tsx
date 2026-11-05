import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  Search, 
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WardrobeItem, Category } from '../types/wardrobe';
import { calculateCPW } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface TodayLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WardrobeItem[];
  currency: CurrencyCode;
  onLogMultipleWears: (itemIds: string[]) => void;
}

export const TodayLoggerModal: React.FC<TodayLoggerModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onLogMultipleWears,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredItems = items.filter(item => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedItems = items.filter(i => selectedIds.includes(i.id));
  const totalOutfitPrice = selectedItems.reduce((sum, i) => sum + i.purchasePrice, 0);
  const totalOutfitWears = selectedItems.reduce((sum, i) => sum + i.wearsCount, 0);
  const combinedCPW = totalOutfitWears > 0 
    ? (totalOutfitPrice / totalOutfitWears) 
    : 0;

  const handleConfirmLog = () => {
    if (selectedIds.length === 0) return;

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#006778', '#467882', '#D35E35', '#9FE1ED', '#10B981']
    });

    onLogMultipleWears(selectedIds);
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-soft-lg border border-m3-outline-variant/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-m3-outline-variant/30 flex items-center justify-between bg-m3-surface">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-atelier-accent-soft text-atelier-accent text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero-Friction Daily Capture</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-m3-on-surface">
              Log Today's Outfit
            </h2>
            <p className="text-xs text-m3-on-surface-variant">
              Tap the pieces you wore today to instantly compound your amortization in {currency}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-m3-surface-container text-m3-outline hover:text-m3-on-surface shadow-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Quick Filters */}
        <div className="p-4 bg-m3-surface-container/50 border-b border-m3-outline-variant/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-m3-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-m3-outline-variant/40 text-xs text-m3-on-surface outline-none focus:border-atelier-primary font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {(['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'] as ('All' | Category)[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === cat 
                    ? 'bg-atelier-primary text-white shadow-soft-sm' 
                    : 'bg-white text-m3-on-surface-variant hover:bg-m3-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Garment Selection Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredItems.map(item => {
            const isSelected = selectedIds.includes(item.id);
            const cpw = calculateCPW(item.purchasePrice, item.wearsCount);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 p-2 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-atelier-primary bg-atelier-primary-light/40 shadow-soft scale-[1.02]' 
                    : 'border-m3-outline-variant/30 bg-white hover:border-m3-outline'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-m3-surface-container mb-2">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-atelier-primary/25 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-atelier-primary text-white flex items-center justify-center shadow-soft">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-bold">
                    {formatCPW(cpw, currency)}/w
                  </span>
                </div>

                {/* Info */}
                <div>
                  <span className="text-[10px] font-bold text-atelier-secondary uppercase tracking-wider block">
                    {item.brand}
                  </span>
                  <h4 className="text-xs font-bold text-m3-on-surface line-clamp-1">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-m3-on-surface-variant font-medium">
                    {item.wearsCount} wears
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Drawer & Confirm CTA */}
        <div className="p-4 sm:p-6 bg-m3-surface border-t border-m3-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-m3-on-surface">
              {selectedIds.length} piece{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            {selectedIds.length > 0 && (
              <>
                <span className="text-m3-outline-variant">·</span>
                <span>Outfit Value: <strong className="text-m3-on-surface">{formatMoney(totalOutfitPrice, currency)}</strong></span>
                <span className="text-m3-outline-variant">·</span>
                <span>Outfit CPW: <strong className="text-atelier-primary">{formatCPW(combinedCPW, currency)}/wear</strong></span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-m3-on-surface-variant hover:text-m3-on-surface disabled:opacity-40"
            >
              Clear
            </button>

            <button
              onClick={handleConfirmLog}
              disabled={selectedIds.length === 0}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-atelier-accent text-white text-xs font-bold hover:bg-atelier-accent-hover disabled:opacity-40 shadow-accent-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Log Wear Today (+1)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
