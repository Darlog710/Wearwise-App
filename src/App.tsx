import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { NavSection } from './components/NavSection';
import { PortfolioBanner } from './components/PortfolioBanner';
import { VaultView } from './components/VaultView';
import { DormantHub } from './components/DormantHub';
import { OutfitStudio } from './components/OutfitStudio';
import { AnalyticsView } from './components/AnalyticsView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AddItemModal } from './components/AddItemModal';
import { TodayLoggerModal } from './components/TodayLoggerModal';

import type { WardrobeItem, Outfit, ViewTab } from './types/wardrobe';
import { INITIAL_WARDROBE_ITEMS, INITIAL_OUTFITS } from './data/mockData';
import { calculatePortfolioStats, calculateCPW } from './utils/cpwCalculations';
import { CurrencyCode, CURRENCIES } from './utils/currency';
import confetti from 'canvas-confetti';

const STORAGE_KEY_ITEMS = 'wearwise_wardrobe_items_v2';
const STORAGE_KEY_OUTFITS = 'wearwise_outfits_v2';
const STORAGE_KEY_CURRENCY = 'wearwise_currency_v2';

export function App() {
  // Currency state: Defaults to Nigerian Naira ('NGN') as explicitly requested!
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
      if (saved && ['NGN', 'USD', 'GBP', 'EUR'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch (e) {
      console.error('Failed to parse saved currency', e);
    }
    return 'NGN'; // MAIN / DEFAULT CURRENCY IS NAIRA
  });

  // Load items from local storage or fallback to curated seeds
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved items', e);
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OUTFITS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved outfits', e);
    }
    return INITIAL_OUTFITS;
  });

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('vault');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<WardrobeItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTodayLoggerOpen, setIsTodayLoggerOpen] = useState(false);
  const [activeStudioItemId, setActiveStudioItemId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch (e) {
      console.error('Error saving currency to localStorage', e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving items to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OUTFITS, JSON.stringify(outfits));
    } catch (e) {
      console.error('Error saving outfits to localStorage', e);
    }
  }, [outfits]);

  // Aggregate Portfolio Stats
  const stats = useMemo(() => calculatePortfolioStats(items), [items]);

  // Quick 1-click wear logger (from card or modal)
  const handleQuickLogWear = (e: React.MouseEvent | null, itemId: string) => {
    if (e) e.stopPropagation();

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextWears = item.wearsCount + 1;
        const newCPW = calculateCPW(item.purchasePrice, nextWears);
        const oldCPW = calculateCPW(item.purchasePrice, item.wearsCount);

        // Check if just hit target
        if (oldCPW > item.targetCPW && newCPW <= item.targetCPW) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#006778', '#D35E35', '#10B981']
          });
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const updatedHistory = item.wearHistory ? [...item.wearHistory, todayStr] : [todayStr];

        return {
          ...item,
          wearsCount: nextWears,
          lastWornDate: todayStr,
          wearHistory: updatedHistory,
        };
      }
      return item;
    }));

    // If modal is open for this item, keep modal data updated
    if (selectedItemForDetail && selectedItemForDetail.id === itemId) {
      setSelectedItemForDetail(prev => prev ? {
        ...prev,
        wearsCount: prev.wearsCount + 1,
        lastWornDate: new Date().toISOString().split('T')[0],
      } : null);
    }
  };

  // Multi-item wear logger (from Today's Logger modal or Outfit Studio)
  const handleLogMultipleWears = (itemIds: string[]) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setItems(prev => prev.map(item => {
      if (itemIds.includes(item.id)) {
        return {
          ...item,
          wearsCount: item.wearsCount + 1,
          lastWornDate: todayStr,
          wearHistory: item.wearHistory ? [...item.wearHistory, todayStr] : [todayStr],
        };
      }
      return item;
    }));
  };

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    }));
  };

  // Add new item
  const handleAddItem = (newItem: WardrobeItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    setOutfits(prev => prev.map(outfit => ({
      ...outfit,
      itemIds: outfit.itemIds.filter(id => id !== itemId),
    })));
  };

  // Outfits
  const handleSaveOutfit = (newOutfit: Outfit) => {
    setOutfits(prev => [newOutfit, ...prev]);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(prev => prev.filter(o => o.id !== outfitId));
  };

  const handleLogOutfitWear = (itemIds: string[]) => {
    handleLogMultipleWears(itemIds);
  };

  // Navigate to Outfit Studio with preselected item
  const handleSendToStudio = (itemId: string) => {
    setActiveStudioItemId(itemId);
    setCurrentTab('outfits');
  };

  // Reset to default dataset
  const handleResetData = () => {
    if (confirm('Reset to the default curated WearWise portfolio dataset?')) {
      setItems(INITIAL_WARDROBE_ITEMS);
      setOutfits(INITIAL_OUTFITS);
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_OUTFITS);
    }
  };

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface flex flex-col font-sans selection:bg-atelier-primary-light selection:text-atelier-primary">
      
      {/* 1. Header: Top Bar Container (Logo, Brand Title, Currency Switcher, Action Suite) */}
      <Header
        currency={currency}
        setCurrency={setCurrency}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenTodayModal={() => setIsTodayLoggerOpen(true)}
        onResetData={handleResetData}
        onLogoClick={() => setCurrentTab('vault')}
      />

      {/* 2. Separate Navigation Section Container Below Header */}
      <NavSection
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Financial Portfolio Summary Banner */}
        <PortfolioBanner
          stats={stats}
          currency={currency}
          onExploreDormant={() => setCurrentTab('dormant')}
          onSelectTopAsset={(item) => setSelectedItemForDetail(item)}
        />

        {/* View Switcher */}
        {currentTab === 'vault' && (
          <VaultView
            items={items}
            currency={currency}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onQuickLogWear={handleQuickLogWear}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {currentTab === 'dormant' && (
          <DormantHub
            items={items}
            currency={currency}
            onSendToStudio={handleSendToStudio}
            onQuickLogWear={handleQuickLogWear}
          />
        )}

        {currentTab === 'outfits' && (
          <OutfitStudio
            items={items}
            outfits={outfits}
            currency={currency}
            activeStudioItemId={activeStudioItemId}
            onClearActiveStudioItem={() => setActiveStudioItemId(null)}
            onSaveOutfit={handleSaveOutfit}
            onLogOutfitWear={handleLogOutfitWear}
            onDeleteOutfit={handleDeleteOutfit}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            items={items}
            stats={stats}
            currency={currency}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
          />
        )}

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-m3-outline-variant/30 bg-white/80 py-8 text-xs text-m3-on-surface-variant backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-atelier-primary">WearWise</span>
            <span>·</span>
            <span>Active Financial & Aesthetic Portfolio OS</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-m3-surface-container border border-m3-outline-variant/30">
              <span>Default Currency:</span>
              <strong className="text-atelier-primary font-bold">₦ Nigerian Naira</strong>
            </span>
            <span>·</span>
            <span>Multi-Currency Amortization Engine</span>
            <span>·</span>
            <span>Material Design 3</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemDetailModal
        item={selectedItemForDetail}
        currency={currency}
        onClose={() => setSelectedItemForDetail(null)}
        onLogWear={(id) => handleQuickLogWear(null, id)}
        onSendToStudio={handleSendToStudio}
        onDeleteItem={handleDeleteItem}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        currency={currency}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <TodayLoggerModal
        isOpen={isTodayLoggerOpen}
        items={items}
        currency={currency}
        onClose={() => setIsTodayLoggerOpen(false)}
        onLogMultipleWears={handleLogMultipleWears}
      />

    </div>
  );
}

export default App;
