import React from 'react';
import { 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Target, 
  PieChart, 
  ArrowUpRight
} from 'lucide-react';
import type { WardrobeItem, PortfolioStats, Category } from '../types/wardrobe';
import { calculateCPW } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface AnalyticsViewProps {
  items: WardrobeItem[];
  stats: PortfolioStats;
  currency: CurrencyCode;
  onSelectItem: (item: WardrobeItem) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  items,
  stats,
  currency,
  onSelectItem,
}) => {
  // 1. CPW Tier Distribution
  const tiersCount = {
    staples: items.filter(i => calculateCPW(i.purchasePrice, i.wearsCount) <= 3.0).length,
    targetHit: items.filter(i => {
      const cpw = calculateCPW(i.purchasePrice, i.wearsCount);
      return cpw > 3.0 && cpw <= i.targetCPW;
    }).length,
    inProgress: items.filter(i => {
      const cpw = calculateCPW(i.purchasePrice, i.wearsCount);
      return cpw > i.targetCPW && cpw <= 25.0;
    }).length,
    dormantLuxury: items.filter(i => calculateCPW(i.purchasePrice, i.wearsCount) > 25.0).length,
  };

  // 2. Capital by Category
  const categoryCapital: Record<Category, number> = {
    Tops: 0,
    Bottoms: 0,
    Outerwear: 0,
    Footwear: 0,
    Dresses: 0,
    Accessories: 0,
  };

  items.forEach(item => {
    categoryCapital[item.category] = (categoryCapital[item.category] || 0) + item.purchasePrice;
  });

  // 3. Wall of Fame: Top 3 Best ROI
  const bestROI = [...items]
    .filter(i => i.wearsCount > 5)
    .sort((a, b) => {
      const cpwA = calculateCPW(a.purchasePrice, a.wearsCount);
      const cpwB = calculateCPW(b.purchasePrice, b.wearsCount);
      return cpwA - cpwB;
    })
    .slice(0, 3);

  // 4. Close to Target (Within 3-4 wears)
  const closeToTarget = items.filter(item => {
    const cpw = calculateCPW(item.purchasePrice, item.wearsCount);
    if (cpw <= item.targetCPW) return false;
    const wearsNeeded = Math.ceil(item.purchasePrice / item.targetCPW) - item.wearsCount;
    return wearsNeeded > 0 && wearsNeeded <= 4;
  });

  return (
    <div className="space-y-8">
      
      {/* Analytics Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-atelier-primary px-3 py-1 rounded-full bg-atelier-primary-light">
            Portfolio Intelligence & Amortization ({currency})
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-m3-on-surface tracking-tight">
          Financial CPW Analytics & ROI Diagnostics
        </h2>
        <p className="text-xs sm:text-sm text-m3-on-surface-variant max-w-2xl mt-1">
          Tracking the financial trajectory of your fashion capital. See how each rotation lowers unit costs and shifts your wardrobe into high-efficiency equity in {currency}.
        </p>
      </div>

      {/* Grid: CPW Tiers & Category Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tier Distribution Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between border-b border-m3-outline-variant/20 pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-m3-on-surface">
                Amortization Tier Breakdown
              </h3>
              <p className="text-xs text-m3-on-surface-variant">
                Categorization by Cost-per-Wear performance
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-atelier-primary" />
          </div>

          <div className="space-y-4">
            
            {/* Tier 1 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Portfolio Staples (&le; {formatCPW(3.0, currency)}/wear)
                </span>
                <span className="text-m3-on-surface">
                  {tiersCount.staples} items ({Math.round((tiersCount.staples / items.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-m3-surface-container rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `${(tiersCount.staples / items.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tier 2 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-atelier-primary flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-atelier-primary" />
                  Target Hit (&le; User Goal)
                </span>
                <span className="text-m3-on-surface">
                  {tiersCount.targetHit} items ({Math.round((tiersCount.targetHit / items.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-m3-surface-container rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-atelier-primary h-2 rounded-full" 
                  style={{ width: `${(tiersCount.targetHit / items.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tier 3 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  In Progress ({formatCPW(5.0, currency)} - {formatCPW(25.0, currency)}/w)
                </span>
                <span className="text-m3-on-surface">
                  {tiersCount.inProgress} items ({Math.round((tiersCount.inProgress / items.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-m3-surface-container rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${(tiersCount.inProgress / items.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tier 4 */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-atelier-accent flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-atelier-accent" />
                  High Luxury / Dormant (&gt; {formatCPW(25.0, currency)}/w)
                </span>
                <span className="text-m3-on-surface">
                  {tiersCount.dormantLuxury} items ({Math.round((tiersCount.dormantLuxury / items.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-m3-surface-container rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-atelier-accent h-2 rounded-full" 
                  style={{ width: `${(tiersCount.dormantLuxury / items.length) * 100}%` }}
                />
              </div>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-m3-surface-container text-xs text-m3-on-surface-variant flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>{tiersCount.staples + tiersCount.targetHit} pieces</strong> have achieved full financial amortization, representing <strong>{Math.round(((tiersCount.staples + tiersCount.targetHit) / items.length) * 100)}%</strong> of your wardrobe.
            </span>
          </div>

        </div>

        {/* Capital Allocation by Category */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between border-b border-m3-outline-variant/20 pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-m3-on-surface">
                Capital Allocation by Category
              </h3>
              <p className="text-xs text-m3-on-surface-variant">
                Where your wardrobe financial equity resides
              </p>
            </div>
            <PieChart className="w-5 h-5 text-atelier-secondary" />
          </div>

          <div className="space-y-3.5">
            {(Object.keys(categoryCapital) as Category[]).map(cat => {
              const val = categoryCapital[cat];
              const pct = stats.totalValuation > 0 
                ? Math.round((val / stats.totalValuation) * 100) 
                : 0;

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-m3-on-surface">{cat}</span>
                    <span className="text-m3-on-surface-variant font-bold">
                      {formatMoney(val, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-m3-surface-container rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-atelier-secondary h-2 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-m3-on-surface-variant flex items-center justify-between border-t border-m3-outline-variant/30 font-medium">
            <span>Total Capital Cataloged</span>
            <strong className="text-sm text-m3-on-surface font-bold">{formatMoney(stats.totalValuation, currency)}</strong>
          </div>
        </div>

      </div>

      {/* Wall of Fame: Top 3 Best ROI Assets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-m3-on-surface flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Wall of Fame: Top Amortized Assets</span>
            </h3>
            <p className="text-xs text-m3-on-surface-variant">
              The highest financial ROI pieces delivering the greatest cost efficiency in {currency}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bestROI.map((item, idx) => {
            const cpw = calculateCPW(item.purchasePrice, item.wearsCount);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white rounded-3xl p-5 border border-m3-outline-variant/40 shadow-soft-sm card-hover-effect cursor-pointer flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-atelier-secondary block">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-bold text-m3-on-surface group-hover:text-atelier-primary transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-m3-surface-container mb-3 border border-m3-outline-variant/30">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                    {item.wearsCount} wears
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-m3-outline-variant/30 text-xs">
                  <span className="text-m3-on-surface-variant font-medium">Unit CPW:</span>
                  <span className="text-base font-bold text-emerald-700">
                    {formatCPW(cpw, currency)}/wear
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Threshold Watchlist: Pieces Close to Target */}
      {closeToTarget.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm">
          <div className="flex items-center justify-between mb-4 border-b border-m3-outline-variant/20 pb-3">
            <div>
              <h3 className="text-lg font-bold font-serif text-m3-on-surface flex items-center gap-2">
                <Target className="w-5 h-5 text-atelier-primary" />
                <span>Threshold Watchlist: 1–4 Wears to Target</span>
              </h3>
              <p className="text-xs text-m3-on-surface-variant">
                Items just on the verge of hitting your financial goal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {closeToTarget.map(item => {
              const wearsNeeded = Math.ceil(item.purchasePrice / item.targetCPW) - item.wearsCount;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="p-4 rounded-2xl bg-m3-surface-container hover:bg-m3-surface-container-high transition-all cursor-pointer flex items-center gap-3.5 border border-m3-outline-variant/30"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-xl object-cover bg-white" 
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-m3-on-surface truncate">
                      {item.name}
                    </h5>
                    <span className="text-[11px] text-atelier-primary font-bold block">
                      Only {wearsNeeded} wear{wearsNeeded > 1 ? 's' : ''} to pay off ({formatCPW(item.targetCPW, currency)} target)!
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-atelier-primary" />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
