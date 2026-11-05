import React from 'react';
import { 
  Heart, 
  Plus, 
  Clock, 
  Target,
  Sparkles
} from 'lucide-react';
import type { WardrobeItem } from '../types/wardrobe';
import { calculateCPW, getDaysSince, isDormant, getCPWTier } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface ItemCardProps {
  item: WardrobeItem;
  viewMode: 'grid' | 'list';
  currency: CurrencyCode;
  onSelect: (item: WardrobeItem) => void;
  onQuickLogWear: (e: React.MouseEvent, itemId: string) => void;
  onToggleFavorite: (e: React.MouseEvent, itemId: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  viewMode,
  currency,
  onSelect,
  onQuickLogWear,
  onToggleFavorite,
}) => {
  const cpw = calculateCPW(item.purchasePrice, item.wearsCount);
  const daysSince = getDaysSince(item.lastWornDate);
  const itemIsDormant = isDormant(item);
  const tier = getCPWTier(cpw, item.targetCPW);

  // Target progress
  const targetWears = Math.ceil(item.purchasePrice / item.targetCPW);
  const progressPercent = Math.min(100, Math.round((item.wearsCount / Math.max(targetWears, 1)) * 100));

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(item)}
        className="group bg-white rounded-2xl p-4 sm:p-5 border border-m3-outline-variant/40 hover:border-atelier-primary/60 shadow-soft-sm card-hover-effect cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-m3-surface-container flex-shrink-0 border border-m3-outline-variant/30">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80';
              }}
            />
            {itemIsDormant && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-atelier-accent text-white text-[9px] font-black">
                {daysSince}d
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-atelier-secondary tracking-wider uppercase">
                {item.brand}
              </span>
              <span className="text-xs text-m3-outline-variant">·</span>
              <span className="text-xs text-m3-on-surface-variant font-medium">
                {item.category} / {item.subcategory}
              </span>
            </div>

            <h3 className="text-base font-bold text-m3-on-surface group-hover:text-atelier-primary transition-colors">
              {item.name}
            </h3>

            <div className="flex items-center gap-3 mt-1 text-xs text-m3-on-surface-variant">
              <span>Bought: <strong className="text-m3-on-surface">{formatMoney(item.purchasePrice, currency)}</strong></span>
              <span>·</span>
              <span>Worn <strong>{item.wearsCount}</strong> times</span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-sm" style={{ backgroundColor: item.colorHex }} />
                <span>{item.colorName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right stats and quick wear button */}
        <div className="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-m3-outline-variant/30 sm:pl-6">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1 sm:justify-end">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-m3-on-surface">
                {formatCPW(cpw, currency)}
              </span>
              <span className="text-xs text-m3-on-surface-variant">/wear</span>
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 border ${tier.badgeClass}`}>
              {tier.label}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onQuickLogWear(e, item.id)}
              title="Fast 1-click wear logger"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-atelier-primary/10 hover:bg-atelier-primary hover:text-white text-atelier-primary text-xs font-bold transition-all active:scale-95 border border-atelier-primary/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+1 Wear</span>
            </button>

            <button
              onClick={(e) => onToggleFavorite(e, item.id)}
              className={`p-2 rounded-xl transition-all ${
                item.favorite 
                  ? 'text-rose-500 bg-rose-50' 
                  : 'text-m3-outline hover:text-rose-500 hover:bg-m3-surface-container'
              }`}
            >
              <Heart className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div 
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl overflow-hidden border border-m3-outline-variant/40 hover:border-atelier-primary/60 shadow-soft-sm card-hover-effect cursor-pointer flex flex-col justify-between transition-all"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-[4/5] bg-m3-surface-container overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, item.id)}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            item.favorite 
              ? 'bg-white/95 text-rose-500 shadow-soft' 
              : 'bg-white/80 text-m3-outline hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Dormancy Warning or Target Hit */}
        {itemIsDormant ? (
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-accent text-white text-xs font-bold shadow-soft">
            <Clock className="w-3 h-3 stroke-[2.5]" />
            <span>Unworn {daysSince}d</span>
          </div>
        ) : tier.isPaidOff ? (
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-soft">
            <Sparkles className="w-3 h-3" />
            <span>Target Hit</span>
          </div>
        ) : null}

        {/* Floating Category Tag & +1 Wear Button */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/10">
            {item.category}
          </span>

          <button
            onClick={(e) => onQuickLogWear(e, item.id)}
            title="Fast 1-click wear logger"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 hover:bg-atelier-primary hover:text-white text-atelier-primary text-xs font-bold shadow-soft transition-all active:scale-95 backdrop-blur-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+1 Wear</span>
          </button>
        </div>
      </div>

      {/* Card Content & Financial Ledger */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between text-xs text-m3-on-surface-variant font-medium mb-1">
            <span className="font-bold text-atelier-secondary uppercase tracking-wider text-[10px]">
              {item.brand}
            </span>
            <span className="font-semibold text-m3-on-surface">
              {formatMoney(item.purchasePrice, currency)}
            </span>
          </div>

          <h3 className="text-base font-bold text-m3-on-surface group-hover:text-atelier-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
        </div>

        {/* Financial CPW Indicator */}
        <div className="mt-4 pt-3.5 border-t border-m3-outline-variant/30">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[11px] text-m3-on-surface-variant block font-medium">
                Cost-per-Wear
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-m3-on-surface">
                  {formatCPW(cpw, currency)}
                </span>
                <span className="text-xs text-m3-on-surface-variant">/wear</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-m3-on-surface-variant block font-medium">
                Logged
              </span>
              <span className="text-sm font-bold text-atelier-primary">
                {item.wearsCount} wears
              </span>
            </div>
          </div>

          {/* Progress to Target CPW */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] text-m3-on-surface-variant mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Target className="w-3 h-3 text-atelier-secondary" />
                <span>Target: {formatCPW(item.targetCPW, currency)}/w</span>
              </span>
              <span className="font-bold text-atelier-secondary">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-m3-surface-container rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  progressPercent >= 100 
                    ? 'bg-emerald-500' 
                    : itemIsDormant 
                      ? 'bg-atelier-accent' 
                      : 'bg-atelier-primary'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
