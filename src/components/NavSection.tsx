import React from 'react';
import { 
  Archive, 
  Layers, 
  BarChart3, 
  Moon,
  Sparkles
} from 'lucide-react';
import type { ViewTab, PortfolioStats } from '../types/wardrobe';

interface NavSectionProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  stats: PortfolioStats;
}

export const NavSection: React.FC<NavSectionProps> = ({
  currentTab,
  setCurrentTab,
  stats,
}) => {
  return (
    <section className="w-full bg-white/70 backdrop-blur-md border-b border-m3-outline-variant/30 py-3 sticky top-20 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Segmented Tab Controls */}
          <nav className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-m3-surface-container/80 border border-m3-outline-variant/30 overflow-x-auto max-w-full no-scrollbar shadow-soft-sm">
            
            {/* Tab 1: Wardrobe Vault */}
            <button
              onClick={() => setCurrentTab('vault')}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                currentTab === 'vault'
                  ? 'bg-white text-atelier-primary shadow-soft-sm scale-[1.01]'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-white/50'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Wardrobe Vault</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                currentTab === 'vault'
                  ? 'bg-atelier-primary-light text-atelier-primary'
                  : 'bg-m3-surface-variant text-m3-on-surface-variant'
              }`}>
                {stats.totalItems}
              </span>
            </button>

            {/* Tab 2: Dormant Capital */}
            <button
              onClick={() => setCurrentTab('dormant')}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 relative ${
                currentTab === 'dormant'
                  ? 'bg-white text-atelier-accent shadow-soft-sm scale-[1.01]'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-white/50'
              }`}
            >
              <Moon className="w-4 h-4 text-atelier-accent" />
              <span>Dormant Capital</span>
              {stats.dormantItemsCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-atelier-accent text-white font-black animate-pulse">
                  {stats.dormantItemsCount}
                </span>
              )}
            </button>

            {/* Tab 3: Outfit Studio */}
            <button
              onClick={() => setCurrentTab('outfits')}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                currentTab === 'outfits'
                  ? 'bg-white text-atelier-primary shadow-soft-sm scale-[1.01]'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Outfit Studio</span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Synergy
              </span>
            </button>

            {/* Tab 4: CPW Analytics */}
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                currentTab === 'analytics'
                  ? 'bg-white text-atelier-primary shadow-soft-sm scale-[1.01]'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>CPW Analytics</span>
            </button>

          </nav>

          {/* Right Context Hint (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 text-xs text-m3-on-surface-variant font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{stats.utilizationRate}% Closet Utilization Rate</span>
          </div>

        </div>

      </div>
    </section>
  );
};

