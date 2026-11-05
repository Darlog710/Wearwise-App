import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  AlertCircle, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Coins
} from 'lucide-react';
import type { PortfolioStats, WardrobeItem } from '../types/wardrobe';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';
import { calculateCPW } from '../utils/cpwCalculations';

interface PortfolioBannerProps {
  stats: PortfolioStats;
  currency: CurrencyCode;
  onExploreDormant: () => void;
  onSelectTopAsset: (item: WardrobeItem) => void;
}

export const PortfolioBanner: React.FC<PortfolioBannerProps> = ({
  stats,
  currency,
  onExploreDormant,
  onSelectTopAsset,
}) => {
  const topAssetCPW = stats.topAsset 
    ? calculateCPW(stats.topAsset.purchasePrice, stats.topAsset.wearsCount) 
    : 0;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-atelier-tertiary via-[#004B57] to-atelier-primary text-white shadow-soft-lg mb-8 border border-white/10">
      
      {/* Editorial Luxury Ambient Mesh Background */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-atelier-tertiary-tint/15 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-24 w-80 h-80 rounded-full bg-atelier-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 top-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/15">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wide text-atelier-tertiary-tint mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5 text-atelier-tertiary-tint" />
              <span>Wardrobe Capital Efficiency Index</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80 font-normal">Active in {currency}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white mb-3 leading-[1.15]">
              Personal Wardrobe Portfolio
            </h1>

            <p className="text-sm sm:text-base text-m3-surface-container/90 font-light leading-relaxed max-w-xl">
              Transforming stagnant garments into active financial equity. Every logged wear spreads depreciation and compounds your aesthetic return on investment.
            </p>
          </div>

          {/* MVP Star Performer Card */}
          {stats.topAsset && (
            <div 
              onClick={() => onSelectTopAsset(stats.topAsset!)}
              className="cursor-pointer group flex items-center gap-4 p-4 pr-6 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 transition-all duration-300 self-start lg:self-auto shadow-soft"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/20 flex-shrink-0">
                <img 
                  src={stats.topAsset.imageUrl} 
                  alt={stats.topAsset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-0 right-0 p-1 bg-amber-400 text-black rounded-bl-lg">
                  <Award className="w-3 h-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>MVP Asset (Highest ROI)</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-atelier-tertiary-tint transition-colors">
                  {stats.topAsset.brand} · {stats.topAsset.name}
                </h4>
                <p className="text-xs text-emerald-300 font-bold mt-0.5">
                  {formatCPW(topAssetCPW, currency)}/wear 
                  <span className="text-white/60 font-normal ml-1.5">({stats.topAsset.wearsCount} wears)</span>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Metrics Ledger */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
          
          {/* 1. Total Valuation */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-1.5">
              <span>Closet Valuation</span>
              <Coins className="w-4 h-4 text-atelier-tertiary-tint" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {formatMoney(stats.totalValuation, currency)}
            </div>
            <p className="text-xs text-white/60 mt-1.5 font-medium">
              Across {stats.totalItems} cataloged pieces
            </p>
          </div>

          {/* 2. Average CPW */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-1.5">
              <span>Portfolio Avg. CPW</span>
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-baseline gap-1">
              <span>{formatCPW(stats.averageCPW, currency)}</span>
              <span className="text-xs text-white/60 font-normal">/wear</span>
            </div>
            <p className="text-xs text-emerald-300 font-medium mt-1.5">
              {stats.totalWears} logged wears across portfolio
            </p>
          </div>

          {/* 3. Utilization Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-1.5">
              <span>Closet Utilization</span>
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {stats.utilizationRate}%
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-700" 
                style={{ width: `${stats.utilizationRate}%` }}
              />
            </div>
          </div>

          {/* 4. Sleeping / Dormant Capital */}
          <div 
            onClick={onExploreDormant}
            className="bg-atelier-accent/25 hover:bg-atelier-accent/35 cursor-pointer backdrop-blur-md rounded-2xl p-5 border border-atelier-accent/40 transition-all group shadow-accent-glow"
          >
            <div className="flex items-center justify-between text-xs text-amber-200 font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-atelier-accent-glow" />
                Sleeping Capital
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {formatMoney(stats.dormantCapital, currency)}
            </div>
            <p className="text-xs text-amber-200 font-medium mt-1.5">
              Locked in {stats.dormantItemsCount} unworn items (Tap to wake)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
