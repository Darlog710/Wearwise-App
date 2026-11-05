import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Shirt, 
  RotateCcw,
  ChevronDown,
  Coins,
  Check
} from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '../utils/currency';

interface HeaderProps {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onOpenAddModal: () => void;
  onOpenTodayModal: () => void;
  onResetData: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  setCurrency,
  onOpenAddModal,
  onOpenTodayModal,
  onResetData,
  onLogoClick,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurrency = CURRENCIES[currency];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-m3-outline-variant/30 shadow-[0_4px_20px_-4px_rgba(0,103,120,0.05)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          
          {/* Left: Brand Identity & Tagline */}
          <div 
            onClick={onLogoClick}
            className="flex items-center gap-3.5 cursor-pointer group flex-shrink-0 select-none"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-atelier-primary via-[#005563] to-atelier-tertiary flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Shirt className="w-5 h-5 stroke-[2.2]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-atelier-accent border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[8px] text-white font-black leading-none">{activeCurrency.symbol}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-atelier-primary font-serif">
                  WearWise
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-atelier-primary-light text-atelier-primary border border-atelier-primary/20">
                  Portfolio OS
                </span>
              </div>
              <p className="text-[11px] text-m3-on-surface-variant font-medium tracking-wide hidden sm:block">
                Active Wardrobe Capital & Cost-Per-Wear (CPW) Intelligence
              </p>
            </div>
          </div>

          {/* Right: Aligned Action Suite & Currency Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector Pill */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                title="Switch active currency (Nigerian Naira default)"
                className="h-10 sm:h-11 flex items-center gap-2 px-3 sm:px-3.5 rounded-xl bg-m3-surface-container/70 hover:bg-white border border-m3-outline-variant/40 hover:border-atelier-primary/50 text-xs font-bold text-m3-on-surface transition-all shadow-soft-sm hover:shadow"
              >
                <span className="text-base leading-none">{activeCurrency.flag}</span>
                <span className="text-atelier-primary font-black text-sm">{activeCurrency.symbol}</span>
                <span className="hidden md:inline text-m3-on-surface font-semibold">{activeCurrency.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-m3-outline transition-transform duration-200 ${
                  currencyDropdownOpen ? 'rotate-180 text-atelier-primary' : ''
                }`} />
              </button>

              {/* Currency Dropdown Popover */}
              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-m3-outline-variant/40 shadow-soft-lg py-2 z-50 animate-fadeIn">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-m3-on-surface-variant border-b border-m3-outline-variant/20 flex items-center justify-between">
                    <span>Display Currency</span>
                    <Coins className="w-3.5 h-3.5 text-atelier-primary" />
                  </div>

                  <div className="p-1 space-y-0.5">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((curKey) => {
                      const cur = CURRENCIES[curKey];
                      const isSelected = currency === curKey;
                      const isNaira = curKey === 'NGN';

                      return (
                        <button
                          key={curKey}
                          onClick={() => {
                            setCurrency(curKey);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-atelier-primary-light text-atelier-primary font-bold'
                              : 'text-m3-on-surface hover:bg-m3-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{cur.flag}</span>
                            <div className="text-left">
                              <div className="flex items-center gap-1.5">
                                <span>{cur.name}</span>
                                <span className="font-bold text-atelier-primary">({cur.symbol})</span>
                                {isNaira && (
                                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-atelier-accent-soft text-atelier-accent">
                                    Main
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-m3-on-surface-variant font-normal">
                                {cur.code}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-atelier-primary stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Log Today's Outfit CTA */}
            <button
              onClick={onOpenTodayModal}
              title="Quick multi-piece daily wear logger"
              className="h-10 sm:h-11 flex items-center gap-2 px-3.5 sm:px-4 rounded-xl bg-atelier-accent text-white text-xs sm:text-sm font-bold hover:bg-atelier-accent-hover shadow-accent-glow transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Log Today</span>
              <span className="sm:hidden">Log</span>
            </button>

            {/* Add New Piece CTA */}
            <button
              onClick={onOpenAddModal}
              title="Add a new garment to your wardrobe portfolio"
              className="h-10 sm:h-11 flex items-center gap-1.5 px-3.5 sm:px-4 rounded-xl bg-atelier-primary text-white text-xs sm:text-sm font-bold hover:bg-atelier-primary-hover shadow-soft transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Piece</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset portfolio to default seed dataset"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-m3-outline hover:text-atelier-primary hover:bg-m3-surface-container flex items-center justify-center transition-all border border-transparent hover:border-m3-outline-variant/30"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

