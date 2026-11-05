import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Trash2,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WardrobeItem, Outfit, Category } from '../types/wardrobe';
import { calculateCPW, isDormant } from '../utils/cpwCalculations';
import { CurrencyCode, formatMoney, formatCPW } from '../utils/currency';

interface OutfitStudioProps {
  items: WardrobeItem[];
  outfits: Outfit[];
  currency: CurrencyCode;
  activeStudioItemId?: string | null;
  onClearActiveStudioItem?: () => void;
  onSaveOutfit: (outfit: Outfit) => void;
  onLogOutfitWear: (itemIds: string[]) => void;
  onDeleteOutfit: (outfitId: string) => void;
}

export const OutfitStudio: React.FC<OutfitStudioProps> = ({
  items,
  outfits,
  currency,
  activeStudioItemId,
  onClearActiveStudioItem,
  onSaveOutfit,
  onLogOutfitWear,
  onDeleteOutfit,
}) => {
  // Current Canvas Selection
  const [selectedTopId, setSelectedTopId] = useState<string | null>(null);
  const [selectedBottomId, setSelectedBottomId] = useState<string | null>(null);
  const [selectedOuterwearId, setSelectedOuterwearId] = useState<string | null>(null);
  const [selectedFootwearId, setSelectedFootwearId] = useState<string | null>(null);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string | null>(null);

  // Active slot picker modal
  const [activePickerSlot, setActivePickerSlot] = useState<Category | null>(null);

  // Outfit metadata for saving
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState<Outfit['occasion']>('Smart Casual');

  // Preselected item handling
  React.useEffect(() => {
    if (activeStudioItemId) {
      const target = items.find(i => i.id === activeStudioItemId);
      if (target) {
        if (target.category === 'Tops') setSelectedTopId(target.id);
        else if (target.category === 'Bottoms') setSelectedBottomId(target.id);
        else if (target.category === 'Outerwear') setSelectedOuterwearId(target.id);
        else if (target.category === 'Footwear') setSelectedFootwearId(target.id);
        else if (target.category === 'Accessories') setSelectedAccessoryId(target.id);
      }
    }
  }, [activeStudioItemId, items]);

  const selectedItemIds = [
    selectedTopId,
    selectedBottomId,
    selectedOuterwearId,
    selectedFootwearId,
    selectedAccessoryId,
  ].filter(Boolean) as string[];

  const canvasItems = items.filter(i => selectedItemIds.includes(i.id));
  const hasDormantItem = canvasItems.some(i => isDormant(i));

  const totalOutfitPrice = canvasItems.reduce((sum, i) => sum + i.purchasePrice, 0);
  const totalWears = canvasItems.reduce((sum, i) => sum + i.wearsCount, 0);
  const averageOutfitCPW = totalWears > 0 ? (totalOutfitPrice / totalWears) : 0;

  // Auto-unlock synergy look
  const handleSmartUnlock = () => {
    const dormantList = items.filter(i => isDormant(i));
    const activeList = items.filter(i => !isDormant(i) && i.wearsCount > 5);

    const bestBottom = activeList.find(i => i.category === 'Bottoms') || items.find(i => i.category === 'Bottoms');
    const bestTop = activeList.find(i => i.category === 'Tops') || items.find(i => i.category === 'Tops');
    const bestShoes = activeList.find(i => i.category === 'Footwear') || items.find(i => i.category === 'Footwear');
    const bestCoat = items.find(i => i.category === 'Outerwear');
    const dormantStatement = dormantList[0];

    if (dormantStatement) {
      if (dormantStatement.category === 'Outerwear') {
        setSelectedOuterwearId(dormantStatement.id);
        if (bestTop) setSelectedTopId(bestTop.id);
        if (bestBottom) setSelectedBottomId(bestBottom.id);
      } else if (dormantStatement.category === 'Tops') {
        setSelectedTopId(dormantStatement.id);
        if (bestBottom) setSelectedBottomId(bestBottom.id);
        if (bestCoat) setSelectedOuterwearId(bestCoat.id);
      } else if (dormantStatement.category === 'Bottoms') {
        setSelectedBottomId(dormantStatement.id);
        if (bestTop) setSelectedTopId(bestTop.id);
        if (bestCoat) setSelectedOuterwearId(bestCoat.id);
      } else {
        if (bestTop) setSelectedTopId(bestTop.id);
        if (bestBottom) setSelectedBottomId(bestBottom.id);
        setSelectedAccessoryId(dormantStatement.id);
      }
    } else {
      if (bestTop) setSelectedTopId(bestTop.id);
      if (bestBottom) setSelectedBottomId(bestBottom.id);
    }
    if (bestShoes) setSelectedFootwearId(bestShoes.id);

    setOutfitName('Resuscitation Synergy Look');
  };

  const handleWearCanvasOutfit = () => {
    if (selectedItemIds.length === 0) return;

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#006778', '#D35E35', '#467882', '#9FE1ED']
    });

    onLogOutfitWear(selectedItemIds);
  };

  const handleSaveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemIds.length === 0) return;

    const newOutfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name: outfitName.trim() || 'Curated Ensemble',
      itemIds: selectedItemIds,
      occasion,
      season: 'All-Season',
      createdAt: new Date().toISOString().split('T')[0],
      wearsCount: 1,
    };

    onSaveOutfit(newOutfit);
    setOutfitName('');
  };

  const clearCanvas = () => {
    setSelectedTopId(null);
    setSelectedBottomId(null);
    setSelectedOuterwearId(null);
    setSelectedFootwearId(null);
    setSelectedAccessoryId(null);
    if (onClearActiveStudioItem) onClearActiveStudioItem();
  };

  return (
    <div className="space-y-8">
      
      {/* Studio Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unlock New Combinations From What You Own</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-m3-on-surface tracking-tight">
            Outfit Studio & Style Amortization Canvas
          </h2>
          <p className="text-xs sm:text-sm text-m3-on-surface-variant max-w-xl mt-1 leading-relaxed">
            Eliminate outfit fatigue without buying new clothes. Mix and match wardrobe layers to unlock new silhouettes, drop your average CPW in {currency}, and awaken dormant pieces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSmartUnlock}
            className="px-4 py-2.5 rounded-xl bg-atelier-primary text-white text-xs font-bold hover:bg-atelier-primary-hover shadow-soft transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Unlock Synergy Look</span>
          </button>

          <button
            onClick={clearCanvas}
            className="px-3 py-2.5 rounded-xl bg-m3-surface-container hover:bg-m3-surface-variant text-m3-on-surface-variant text-xs font-semibold transition-all"
          >
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Main Studio Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Visual Layer Slots Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-m3-outline-variant/20 pb-4">
            <h3 className="text-lg font-bold font-serif text-m3-on-surface flex items-center gap-2">
              <Layers className="w-5 h-5 text-atelier-primary" />
              <span>Garment Layer Canvas</span>
            </h3>

            {hasDormantItem && (
              <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-atelier-accent-soft text-atelier-accent border border-atelier-accent/30 animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                <span>+40% Efficiency: Resuscitating Dormant Piece!</span>
              </span>
            )}
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            
            <SlotCard
              label="Top Layer"
              category="Tops"
              currency={currency}
              item={items.find(i => i.id === selectedTopId)}
              onSelectSlot={() => setActivePickerSlot('Tops')}
              onRemove={() => setSelectedTopId(null)}
            />

            <SlotCard
              label="Bottom"
              category="Bottoms"
              currency={currency}
              item={items.find(i => i.id === selectedBottomId)}
              onSelectSlot={() => setActivePickerSlot('Bottoms')}
              onRemove={() => setSelectedBottomId(null)}
            />

            <SlotCard
              label="Outerwear"
              category="Outerwear"
              currency={currency}
              item={items.find(i => i.id === selectedOuterwearId)}
              onSelectSlot={() => setActivePickerSlot('Outerwear')}
              onRemove={() => setSelectedOuterwearId(null)}
            />

            <SlotCard
              label="Footwear"
              category="Footwear"
              currency={currency}
              item={items.find(i => i.id === selectedFootwearId)}
              onSelectSlot={() => setActivePickerSlot('Footwear')}
              onRemove={() => setSelectedFootwearId(null)}
            />

            <SlotCard
              label="Accessory / Bag"
              category="Accessories"
              currency={currency}
              item={items.find(i => i.id === selectedAccessoryId)}
              onSelectSlot={() => setActivePickerSlot('Accessories')}
              onRemove={() => setSelectedAccessoryId(null)}
            />

          </div>

          {/* Live Outfit Amortization Metrics Banner */}
          <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-m3-on-surface-variant block">Total Outfit Value</span>
                <span className="text-lg font-bold text-m3-on-surface">{formatMoney(totalOutfitPrice, currency)}</span>
              </div>
              <div className="h-8 w-px bg-m3-outline-variant/40" />
              <div>
                <span className="text-m3-on-surface-variant block">Combined CPW</span>
                <span className="text-lg font-bold text-atelier-primary">{formatCPW(averageOutfitCPW, currency)}/wear</span>
              </div>
              <div className="h-8 w-px bg-m3-outline-variant/40" />
              <div>
                <span className="text-m3-on-surface-variant block">Active Layers</span>
                <span className="text-lg font-bold text-emerald-700">{canvasItems.length} items</span>
              </div>
            </div>

            <button
              onClick={handleWearCanvasOutfit}
              disabled={canvasItems.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-atelier-accent text-white font-bold text-xs hover:bg-atelier-accent-hover disabled:opacity-40 shadow-accent-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Wear This Outfit Today (+1 to all)</span>
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Save Outfit & Lookbook Meta */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-m3-outline-variant/30 shadow-soft-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold font-serif text-m3-on-surface mb-2">
              Save to Lookbook
            </h3>
            <p className="text-xs text-m3-on-surface-variant mb-4">
              Catalog this synergy look for 1-click rotation in your morning routine.
            </p>

            <form onSubmit={handleSaveOutfit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Outfit Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lagos Gallery Friday, Raincoat Minimalist"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as Outfit['occasion'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs outline-none transition-all font-medium"
                >
                  <option value="Casual">Casual</option>
                  <option value="Smart Casual">Smart Casual</option>
                  <option value="Work / Formal">Work / Formal</option>
                  <option value="Evening">Evening</option>
                  <option value="Athletic">Athletic</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={canvasItems.length === 0}
                className="w-full py-2.5 rounded-xl bg-atelier-primary text-white text-xs font-bold hover:bg-atelier-primary-hover disabled:opacity-40 shadow-soft transition-all"
              >
                Save Curated Outfit
              </button>
            </form>
          </div>

          <div className="p-4 rounded-2xl bg-atelier-primary-light/40 border border-atelier-primary/20 text-xs text-atelier-primary space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Aesthetic Portfolio Tip</span>
            </div>
            <p className="text-m3-on-surface-variant text-[11px] leading-relaxed">
              Pairing an investment coat alongside everyday trousers balances outfit amortization. Every logged wear spreads depreciation across your entire collection.
            </p>
          </div>

        </div>

      </div>

      {/* Curated Outfits Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-serif text-m3-on-surface">
            Curated Outfits Lookbook ({outfits.length})
          </h3>
          <span className="text-xs text-m3-on-surface-variant font-medium">
            Saved rotation recipes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => {
            const outfitPieces = items.filter(i => outfit.itemIds.includes(i.id));
            const outfitValuation = outfitPieces.reduce((s, i) => s + i.purchasePrice, 0);

            return (
              <div
                key={outfit.id}
                className="bg-white rounded-3xl p-5 border border-m3-outline-variant/40 shadow-soft-sm card-hover-effect flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-m3-on-surface-variant mb-2">
                    <span className="font-bold text-atelier-primary uppercase tracking-wider text-[10px]">
                      {outfit.occasion}
                    </span>
                    <span>Worn {outfit.wearsCount} times</span>
                  </div>

                  <h4 className="text-base font-bold text-m3-on-surface mb-3">
                    {outfit.name}
                  </h4>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {outfitPieces.map(piece => (
                      <div 
                        key={piece.id}
                        className="relative w-14 h-14 rounded-xl overflow-hidden bg-m3-surface-container flex-shrink-0 border border-m3-outline-variant/30 group"
                        title={`${piece.brand} - ${piece.name}`}
                      >
                        <img 
                          src={piece.imageUrl} 
                          alt={piece.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-m3-on-surface-variant mt-2">
                    Combined Value: <strong className="text-m3-on-surface">{formatMoney(outfitValuation, currency)}</strong>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-m3-outline-variant/30 flex items-center justify-between">
                  <button
                    onClick={() => onLogOutfitWear(outfit.itemIds)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-atelier-primary/10 hover:bg-atelier-primary hover:text-white text-atelier-primary text-xs font-bold transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Wear Today (+1)</span>
                  </button>

                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-1.5 text-m3-outline hover:text-rose-600 transition-colors"
                    title="Delete outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garment Picker Modal */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col p-6 shadow-soft-lg border border-m3-outline-variant/40">
            <div className="flex items-center justify-between border-b border-m3-outline-variant/30 pb-3 mb-4">
              <h3 className="text-lg font-bold font-serif text-m3-on-surface">
                Select {activePickerSlot}
              </h3>
              <button
                onClick={() => setActivePickerSlot(null)}
                className="p-1.5 rounded-full text-m3-outline hover:text-m3-on-surface"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items
                .filter(i => i.category === activePickerSlot)
                .map(item => {
                  const cpw = calculateCPW(item.purchasePrice, item.wearsCount);
                  const isSleeping = isDormant(item);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (activePickerSlot === 'Tops') setSelectedTopId(item.id);
                        else if (activePickerSlot === 'Bottoms') setSelectedBottomId(item.id);
                        else if (activePickerSlot === 'Outerwear') setSelectedOuterwearId(item.id);
                        else if (activePickerSlot === 'Footwear') setSelectedFootwearId(item.id);
                        else if (activePickerSlot === 'Accessories') setSelectedAccessoryId(item.id);
                        setActivePickerSlot(null);
                      }}
                      className="p-2 rounded-2xl border border-m3-outline-variant/30 hover:border-atelier-primary bg-white cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-m3-surface-container mb-2">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                        {isSleeping && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-atelier-accent text-white text-[9px] font-bold">
                            Dormant
                          </span>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-bold">
                          {formatCPW(cpw, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-atelier-secondary block">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-bold text-m3-on-surface line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

interface SlotCardProps {
  label: string;
  category: Category;
  currency: CurrencyCode;
  item?: WardrobeItem;
  onSelectSlot: () => void;
  onRemove: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({
  label,
  category,
  currency,
  item,
  onSelectSlot,
  onRemove,
}) => {
  const isSleeping = item ? isDormant(item) : false;

  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-bold text-m3-on-surface-variant uppercase tracking-wider mb-1.5 block">
        {label}
      </span>

      {item ? (
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-atelier-primary bg-m3-surface-container group shadow-soft-sm">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-tertiary-tint">
              {item.brand}
            </span>
            <span className="text-xs font-bold line-clamp-1">
              {item.name}
            </span>
            <span className="text-[10px] text-white/90 font-medium">
              {formatCPW(calculateCPW(item.purchasePrice, item.wearsCount), currency)}/wear
            </span>
          </div>

          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-all shadow-sm"
            title="Remove item"
          >
            ✕
          </button>

          {isSleeping && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-atelier-accent text-white text-[9px] font-bold">
              Dormant
            </span>
          )}
        </div>
      ) : (
        <div
          onClick={onSelectSlot}
          className="aspect-[3/4] rounded-2xl border-2 border-dashed border-m3-outline-variant/60 hover:border-atelier-primary hover:bg-atelier-primary-light/30 cursor-pointer transition-all flex flex-col items-center justify-center p-3 text-center text-m3-outline hover:text-atelier-primary group"
        >
          <div className="w-10 h-10 rounded-full bg-m3-surface-container group-hover:bg-white flex items-center justify-center mb-1.5 shadow-sm transition-all">
            <Plus className="w-5 h-5 text-m3-outline group-hover:text-atelier-primary" />
          </div>
          <span className="text-xs font-bold text-m3-on-surface">Add {category}</span>
          <span className="text-[10px] text-m3-on-surface-variant">Tap to pick</span>
        </div>
      )}
    </div>
  );
};
