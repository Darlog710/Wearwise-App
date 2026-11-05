import React, { useState } from 'react';
import { 
  Moon, 
  ShoppingBag, 
  Layers, 
  Check, 
  Copy,
  Zap
} from 'lucide-react';
import type { WardrobeItem } from '../types/wardrobe';
import { calculateCPW, getDaysSince, isDormant } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface DormantHubProps {
  items: WardrobeItem[];
  currency: CurrencyCode;
  onSendToStudio: (itemId: string) => void;
  onQuickLogWear: (e: React.MouseEvent, itemId: string) => void;
}

export const DormantHub: React.FC<DormantHubProps> = ({
  items,
  currency,
  onSendToStudio,
  onQuickLogWear,
}) => {
  const [selectedConsignItem, setSelectedConsignItem] = useState<WardrobeItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter dormant items (unworn >= 45 days)
  const dormantItems = items
    .filter(i => isDormant(i))
    .sort((a, b) => b.purchasePrice - a.purchasePrice);

  const totalSleepingCapital = dormantItems.reduce((sum, i) => sum + i.purchasePrice, 0);
  const totalPotentialResale = dormantItems.reduce((sum, i) => sum + i.estimatedResaleValue, 0);

  const handleCopyConsignment = (item: WardrobeItem) => {
    const text = `Title: ${item.brand} ${item.name} (${item.colorName})\nCategory: ${item.category} / ${item.subcategory}\nCondition: ${item.condition}\nOriginal Price: ${formatMoney(item.purchasePrice, currency)}\nSuggested Resale: ${formatMoney(item.estimatedResaleValue, currency)}\nDescription: Authentic ${item.brand} piece in ${item.condition} condition. Ready to wear.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Sleeping Capital Hero Callout */}
      <div className="bg-gradient-to-br from-atelier-accent/90 via-[#B94E27] to-atelier-accent rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-soft-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
              <Moon className="w-3.5 h-3.5" />
              <span>Dormant Capital Diagnostics</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80 font-normal">Active in {currency}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight mb-2">
              Wake Up Your Sleeping Wardrobe Capital
            </h2>
            <p className="text-sm text-white/90 font-light leading-relaxed">
              Clothes resting unworn in your closet represent locked equity. WearWise helps you take decisive action: either unlock fresh outfit formulas or liquidate through consignment.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-center min-w-[260px] shadow-soft">
            <span className="text-xs text-white/80 font-semibold mb-1">
              Total Sleeping Value
            </span>
            <span className="text-3xl sm:text-4xl font-bold tracking-tight">
              {formatMoney(totalSleepingCapital, currency)}
            </span>
            <span className="text-xs text-amber-200 mt-1.5 font-medium">
              Across {dormantItems.length} dormant pieces · Est. Resale: {formatMoney(totalPotentialResale, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Matrix Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-m3-outline-variant/30 shadow-soft-sm flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-atelier-primary-light text-atelier-primary flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-m3-on-surface">
              Path 1: Resuscitate with Outfit Formulas
            </h4>
            <p className="text-xs text-m3-on-surface-variant mt-1.5 leading-relaxed">
              Pair a dormant statement piece with high-rotation daily staples (like your best-performing jeans or trench coat) to drop its CPW and renew its wear cycle.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-m3-outline-variant/30 shadow-soft-sm flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-atelier-accent-soft text-atelier-accent flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-m3-on-surface">
              Path 2: Consign & Reinvest Capital
            </h4>
            <p className="text-xs text-m3-on-surface-variant mt-1.5 leading-relaxed">
              If a piece no longer fits your aesthetic lifestyle, let it go. Copy our auto-generated listing metadata and recoup up to {formatMoney(totalPotentialResale, currency)} in liquid wardrobe budget.
            </p>
          </div>
        </div>
      </div>

      {/* Dormant Items List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-serif text-m3-on-surface">
            Identified Dormant Pieces ({dormantItems.length})
          </h3>
          <span className="text-xs text-m3-on-surface-variant font-medium">
            Unworn for &gt;45 days
          </span>
        </div>

        {dormantItems.length > 0 ? (
          <div className="space-y-4">
            {dormantItems.map((item) => {
              const cpw = calculateCPW(item.purchasePrice, item.wearsCount);
              const daysSince = getDaysSince(item.lastWornDate);

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-m3-outline-variant/40 shadow-soft-sm card-hover-effect flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-m3-surface-container flex-shrink-0 border border-m3-outline-variant/30">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-atelier-accent text-white text-[9px] font-black">
                        {daysSince}d asleep
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-atelier-secondary uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-xs text-m3-outline-variant">·</span>
                        <span className="text-xs text-m3-on-surface-variant font-medium">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-m3-on-surface mt-0.5">
                        {item.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-m3-on-surface-variant font-medium">
                        <span>Original: <strong className="text-m3-on-surface">{formatMoney(item.purchasePrice, currency)}</strong></span>
                        <span>·</span>
                        <span className="text-atelier-accent font-bold">
                          Current CPW: {formatCPW(cpw, currency)}/wear
                        </span>
                        <span>·</span>
                        <span>{item.wearsCount} total wears</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:border-l lg:border-m3-outline-variant/30 lg:pl-6">
                    
                    <button
                      onClick={() => onSendToStudio(item.id)}
                      className="px-4 py-2.5 rounded-xl bg-atelier-primary text-white text-xs font-bold hover:bg-atelier-primary-hover shadow-soft transition-all flex items-center justify-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Resuscitate in Studio</span>
                    </button>

                    <button
                      onClick={(e) => onQuickLogWear(e, item.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-m3-surface-container hover:bg-m3-surface-variant text-m3-on-surface text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-atelier-primary" />
                      <span>Wear Today (+1)</span>
                    </button>

                    <button
                      onClick={() => setSelectedConsignItem(item)}
                      className="px-3.5 py-2.5 rounded-xl border border-atelier-accent/40 text-atelier-accent hover:bg-atelier-accent-soft text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Consign ({formatMoney(item.estimatedResaleValue, currency)})</span>
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-m3-outline-variant/30 shadow-soft-sm">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-m3-on-surface mb-1">
              Zero Dormant Capital!
            </h3>
            <p className="text-xs sm:text-sm text-m3-on-surface-variant max-w-md mx-auto">
              Outstanding wardrobe discipline! All garments in your vault have been worn recently. Your closet utilization rate is at peak efficiency.
            </p>
          </div>
        )}
      </div>

      {/* Consignment Popover Modal */}
      {selectedConsignItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-soft-lg border border-m3-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between border-b border-m3-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-atelier-accent" />
                <h3 className="text-lg font-bold font-serif text-m3-on-surface">
                  Consignment & Resale Copilot
                </h3>
              </div>
              <button
                onClick={() => setSelectedConsignItem(null)}
                className="p-1 rounded-full text-m3-outline hover:text-m3-on-surface"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-m3-on-surface-variant">
              Copy this optimized listing metadata formatted in <strong>{currency}</strong>:
            </p>

            <div className="bg-m3-surface-container p-4 rounded-2xl text-xs space-y-2 border border-m3-outline-variant/30">
              <div className="font-bold text-m3-on-surface">
                {selectedConsignItem.brand} {selectedConsignItem.name} ({selectedConsignItem.colorName})
              </div>
              <div className="text-m3-on-surface-variant text-[11px] leading-relaxed">
                Condition: {selectedConsignItem.condition}<br />
                Originally purchased for: {formatMoney(selectedConsignItem.purchasePrice, currency)}<br />
                Recommended Listing Price: <strong>{formatMoney(selectedConsignItem.estimatedResaleValue, currency)}</strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleCopyConsignment(selectedConsignItem)}
                className="flex-1 py-3 rounded-xl bg-atelier-accent text-white font-bold text-xs flex items-center justify-center gap-2 shadow-accent-glow hover:bg-atelier-accent-hover transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Listing Metadata'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
