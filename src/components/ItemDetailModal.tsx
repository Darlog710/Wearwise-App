import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Clock, 
  Layers, 
  ShoppingBag, 
  Check, 
  Copy, 
  Trash2
} from 'lucide-react';
import type { WardrobeItem } from '../types/wardrobe';
import { calculateCPW, getDaysSince, isDormant, getCPWTier, wearsNeededForTarget } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  currency: CurrencyCode;
  onClose: () => void;
  onLogWear: (itemId: string) => void;
  onSendToStudio: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  currency,
  onClose,
  onLogWear,
  onSendToStudio,
  onDeleteItem,
}) => {
  const [copiedListing, setCopiedListing] = useState(false);
  const [showListingDrawer, setShowListingDrawer] = useState(false);

  if (!item) return null;

  const cpw = calculateCPW(item.purchasePrice, item.wearsCount);
  const daysSince = getDaysSince(item.lastWornDate);
  const itemIsDormant = isDormant(item);
  const tier = getCPWTier(cpw, item.targetCPW);
  const wearsRemaining = wearsNeededForTarget(item.purchasePrice, item.wearsCount, item.targetCPW);

  // Consignment listing generator formatted in active currency
  const generatedTitle = `${item.brand} ${item.name} (${item.colorName}) - ${item.condition} Condition`;
  const generatedDesc = `Authentic ${item.brand} ${item.name}.
Category: ${item.category} / ${item.subcategory}
Color: ${item.colorName}
Condition: ${item.condition}
Originally purchased for ${formatMoney(item.purchasePrice, currency)}. Worn with care.
Ready for immediate shipping from a pet-free, smoke-free closet.`;

  const handleCopyListing = () => {
    const fullText = `${generatedTitle}\n\n${generatedDesc}\n\nSuggested Listing Price: ${formatMoney(item.estimatedResaleValue, currency)}`;
    navigator.clipboard.writeText(fullText);
    setCopiedListing(true);
    setTimeout(() => setCopiedListing(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-soft-lg border border-m3-outline-variant/40 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-m3-outline hover:text-m3-on-surface backdrop-blur-md shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Garment Image Visual */}
        <div className="md:w-5/12 bg-m3-surface-container relative min-h-[300px] md:min-h-full">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          
          <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
            <span className="text-xs uppercase font-bold tracking-wider text-atelier-tertiary-tint">
              {item.brand}
            </span>
            <h2 className="text-xl font-bold font-serif">{item.name}</h2>
          </div>
        </div>

        {/* Right: Financial & Aesthetic Details */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div>
            {/* Header tags */}
            <div className="hidden md:flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-atelier-secondary">
                {item.brand}
              </span>
              <span className="text-xs text-m3-outline-variant">·</span>
              <span className="text-xs text-m3-on-surface-variant font-medium">
                {item.category} / {item.subcategory}
              </span>
            </div>

            <h2 className="hidden md:block text-2xl sm:text-3xl font-bold font-serif text-m3-on-surface tracking-tight">
              {item.name}
            </h2>

            {/* Quick Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tier.badgeClass}`}>
                {tier.label}
              </span>

              {itemIsDormant ? (
                <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-atelier-accent-soft text-atelier-accent border border-atelier-accent/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Dormant for {daysSince} days</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-m3-surface-container text-m3-on-surface-variant">
                  <Clock className="w-3.5 h-3.5 text-atelier-primary" />
                  <span>Last worn {daysSince === 0 ? 'today' : `${daysSince}d ago`}</span>
                </span>
              )}

              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-m3-surface-container text-m3-on-surface-variant flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-sm" style={{ backgroundColor: item.colorHex }} />
                <span>{item.colorName}</span>
              </span>

              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-m3-surface-container text-m3-on-surface-variant">
                Condition: {item.condition}
              </span>
            </div>

            {/* Financial Ledger Section */}
            <div className="mt-6 p-5 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-atelier-primary">
                  Financial Amortization Ledger ({currency})
                </span>
                <span className="text-xs text-m3-on-surface-variant font-medium">
                  Bought {item.purchaseDate}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-xl p-3 border border-m3-outline-variant/30">
                  <span className="text-[11px] text-m3-on-surface-variant font-medium block">
                    Original Price
                  </span>
                  <span className="text-base sm:text-lg font-bold text-m3-on-surface">
                    {formatMoney(item.purchasePrice, currency)}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-m3-outline-variant/30">
                  <span className="text-[11px] text-m3-on-surface-variant font-medium block">
                    Current CPW
                  </span>
                  <span className="text-base sm:text-lg font-bold text-atelier-primary">
                    {formatCPW(cpw, currency)}
                  </span>
                  <span className="text-[10px] text-m3-on-surface-variant block">
                    {item.wearsCount} wears
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-m3-outline-variant/30">
                  <span className="text-[11px] text-m3-on-surface-variant font-medium block">
                    Target Goal
                  </span>
                  <span className="text-base sm:text-lg font-bold text-emerald-700">
                    {formatCPW(item.targetCPW, currency)}
                  </span>
                  <span className="text-[10px] text-m3-on-surface-variant block">
                    {wearsRemaining > 0 ? `${wearsRemaining} to go` : 'Hit!'}
                  </span>
                </div>
              </div>

              {/* Amortization Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-m3-on-surface-variant mb-1 font-medium">
                  <span>Progress to Target ({formatCPW(item.targetCPW, currency)}/wear)</span>
                  <span className="font-bold text-atelier-primary">
                    {wearsRemaining === 0 ? 'Goal Surpassed!' : `${wearsRemaining} more wears needed`}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-m3-outline-variant/30">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      wearsRemaining === 0 ? 'bg-emerald-500' : 'bg-atelier-primary'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (item.wearsCount / Math.max(Math.ceil(item.purchasePrice / item.targetCPW), 1)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Notes if present */}
            {item.notes && (
              <div className="mt-4 p-3 rounded-xl bg-m3-surface-container/60 border border-m3-outline-variant/20 text-xs text-m3-on-surface-variant italic">
                "{item.notes}"
              </div>
            )}

            {/* Consignment Drawer if expanded */}
            {showListingDrawer && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShoppingBag className="w-4 h-4 text-atelier-accent" />
                    <span>Instant Consignment Copilot</span>
                  </div>
                  <span className="text-amber-800 font-bold">
                    Est. Resale: {formatMoney(item.estimatedResaleValue, currency)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 text-m3-on-surface space-y-1">
                  <div className="font-bold">{generatedTitle}</div>
                  <div className="text-m3-on-surface-variant whitespace-pre-line text-[11px]">
                    {generatedDesc}
                  </div>
                </div>

                <button
                  onClick={handleCopyListing}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-900 transition-all shadow-sm"
                >
                  {copiedListing ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Listing for Poshmark / Grailed / Depop</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-m3-outline-variant/30 space-y-3">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Quick +1 Wear Button */}
              <button
                onClick={() => onLogWear(item.id)}
                className="py-3 px-4 rounded-xl bg-atelier-primary text-white font-bold text-sm hover:bg-atelier-primary-hover shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log Wear Today (+1)</span>
              </button>

              {/* Style in Outfit Studio */}
              <button
                onClick={() => {
                  onSendToStudio(item.id);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-atelier-primary-light text-atelier-primary font-bold text-sm hover:bg-atelier-primary/20 border border-atelier-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Style in Outfit Studio</span>
              </button>

            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              
              {/* Toggle Consignment listing */}
              <button
                onClick={() => setShowListingDrawer(!showListingDrawer)}
                className="text-atelier-accent font-bold hover:underline flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{showListingDrawer ? 'Hide Consignment Tool' : `Consign Capital (${formatMoney(item.estimatedResaleValue, currency)})`}</span>
              </button>

              {/* Delete Garment */}
              <button
                onClick={() => {
                  if (confirm(`Remove "${item.name}" from your wardrobe portfolio?`)) {
                    onDeleteItem(item.id);
                    onClose();
                  }
                }}
                className="text-m3-outline hover:text-rose-600 transition-colors flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
