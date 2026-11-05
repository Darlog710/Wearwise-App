import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Target, 
  Zap
} from 'lucide-react';
import type { WardrobeItem, Category, ItemCondition } from '../types/wardrobe';
import { CurrencyCode, CURRENCIES, convertFromUSD, convertToUSD, formatMoney } from '../utils/currency';

interface AddItemModalProps {
  isOpen: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onAddItem: (item: WardrobeItem) => void;
}

const PRESET_TEMPLATES = [
  {
    name: 'Merino Wool Crewneck',
    brand: 'Norse Projects',
    category: 'Tops' as Category,
    subcategory: 'Knitwear',
    basePriceUSD: 180,
    baseTargetCPWUSD: 4.0,
    colorHex: '#313C47',
    colorName: 'Navy Slate',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    baseResaleUSD: 110,
  },
  {
    name: 'Straight Leg Raw Selvedge',
    brand: 'A.P.C. Petit New Standard',
    category: 'Bottoms' as Category,
    subcategory: 'Denim',
    basePriceUSD: 240,
    baseTargetCPWUSD: 2.5,
    colorHex: '#182436',
    colorName: 'Indigo',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    baseResaleUSD: 140,
  },
  {
    name: 'Classic Wool Chesterfield Coat',
    brand: 'Harris Wharf London',
    category: 'Outerwear' as Category,
    subcategory: 'Overcoat',
    basePriceUSD: 580,
    baseTargetCPWUSD: 8.0,
    colorHex: '#3D3734',
    colorName: 'Espresso',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80',
    baseResaleUSD: 390,
  },
  {
    name: 'Goodyear Welted Chelsea Boots',
    brand: 'R.M. Williams',
    category: 'Footwear' as Category,
    subcategory: 'Boots',
    basePriceUSD: 495,
    baseTargetCPWUSD: 3.5,
    colorHex: '#3F2C20',
    colorName: 'Chestnut Leather',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    baseResaleUSD: 320,
  }
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  currency,
  onClose,
  onAddItem,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'fast-preset'>('custom');

  // Initial values in active currency
  const defaultPrice = Math.round(convertFromUSD(180, currency));
  const defaultTarget = Number(convertFromUSD(5, currency).toFixed(1));

  // Form State in active currency
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('Tops');
  const [subcategory, setSubcategory] = useState('Knitwear');
  const [displayPrice, setDisplayPrice] = useState<number>(defaultPrice);
  const [displayTargetCPW, setDisplayTargetCPW] = useState<number>(defaultTarget);
  const [colorName, setColorName] = useState('Charcoal');
  const [colorHex, setColorHex] = useState('#2C3E50');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80');
  const [condition] = useState<ItemCondition>('Mint');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const targetWearsNeeded = displayTargetCPW > 0 ? Math.ceil(displayPrice / displayTargetCPW) : 0;
  const curSymbol = CURRENCIES[currency].symbol;

  const applyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setSubcategory(preset.subcategory);
    setDisplayPrice(Math.round(convertFromUSD(preset.basePriceUSD, currency)));
    setDisplayTargetCPW(Number(convertFromUSD(preset.baseTargetCPWUSD, currency).toFixed(1)));
    setColorHex(preset.colorHex);
    setColorName(preset.colorName);
    setImageUrl(preset.imageUrl);
    setActiveTab('custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || displayPrice <= 0) return;

    // Convert display values back to base USD for persistent consistency
    const basePriceUSD = convertToUSD(displayPrice, currency);
    const baseTargetCPWUSD = convertToUSD(displayTargetCPW, currency);
    const baseResaleUSD = Math.round(basePriceUSD * 0.65);

    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'Independent / Vintage',
      category,
      subcategory: subcategory || 'Essential',
      purchasePrice: Number(basePriceUSD.toFixed(2)),
      purchaseDate: new Date().toISOString().split('T')[0],
      wearsCount: 1, // First wear logged!
      targetCPW: Number(baseTargetCPWUSD.toFixed(2)),
      lastWornDate: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
      colorHex,
      colorName,
      season: ['All-Season'],
      condition,
      estimatedResaleValue: baseResaleUSD,
      notes,
      favorite: false,
      wearHistory: [new Date().toISOString()],
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-soft-lg border border-m3-outline-variant/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-m3-outline-variant/30 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-atelier-primary-light text-atelier-primary text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Friction-Free Ingestion</span>
              <span className="w-1 h-1 rounded-full bg-atelier-primary/30" />
              <span className="font-semibold text-atelier-secondary">Currency: {currency} ({curSymbol})</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-m3-on-surface">
              Add Garment to Portfolio
            </h2>
            <p className="text-xs text-m3-on-surface-variant">
              Establish target amortization and activate CPW tracking in {CURRENCIES[currency].name}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-m3-surface-container text-m3-outline hover:text-m3-on-surface transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Fast Preset vs Custom */}
        <div className="p-4 bg-m3-surface-container/40 border-b border-m3-outline-variant/20 flex gap-2">
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom' 
                ? 'bg-white text-atelier-primary shadow-soft-sm' 
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
          >
            Custom Piece Entry
          </button>
          <button
            onClick={() => setActiveTab('fast-preset')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'fast-preset' 
                ? 'bg-white text-atelier-accent shadow-soft-sm' 
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-atelier-accent" />
            <span>1-Tap Fast Presets</span>
          </button>
        </div>

        {/* Preset Gallery */}
        {activeTab === 'fast-preset' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-m3-on-surface-variant font-medium">
              Select an archetype template to prefill financial benchmarks and imagery instantly in <strong>{currency}</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_TEMPLATES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="p-3.5 rounded-2xl border border-m3-outline-variant/40 bg-white hover:border-atelier-primary cursor-pointer transition-all flex items-center gap-3.5 group shadow-soft-sm"
                >
                  <img 
                    src={preset.imageUrl} 
                    alt={preset.name} 
                    className="w-14 h-14 rounded-xl object-cover bg-m3-surface-container"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-atelier-secondary">
                      {preset.brand}
                    </span>
                    <h4 className="text-xs font-bold text-m3-on-surface group-hover:text-atelier-primary">
                      {preset.name}
                    </h4>
                    <div className="text-[11px] text-m3-on-surface-variant font-semibold">
                      {formatMoney(preset.basePriceUSD, currency)} · Goal: {formatMoney(preset.baseTargetCPWUSD, currency)}/w
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Row 1: Name & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Garment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oversized Alpaca Cardigan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs sm:text-sm outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Brand / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lemaire, Orange Culture, Vintage"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs sm:text-sm outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Row 2: Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs sm:text-sm outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Knitwear, Denim, Trench"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs sm:text-sm outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Financial Parameters: Purchase Price & Target CPW */}
            <div className="p-4 rounded-2xl bg-m3-surface-container/60 border border-m3-outline-variant/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-atelier-primary block">
                Financial Portfolio Targets ({currency})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-m3-on-surface mb-1">
                    Purchase Price ({curSymbol}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-atelier-primary">
                      {curSymbol}
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={displayPrice}
                      onChange={(e) => setDisplayPrice(Number(e.target.value))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-m3-outline-variant/40 focus:border-atelier-primary text-sm font-bold outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-on-surface mb-1">
                    Target Goal ({curSymbol}/wear)
                  </label>
                  <div className="relative">
                    <Target className="w-4 h-4 text-atelier-primary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step={currency === 'NGN' ? '500' : '0.5'}
                      min="1"
                      value={displayTargetCPW}
                      onChange={(e) => setDisplayTargetCPW(Number(e.target.value))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-m3-outline-variant/40 focus:border-atelier-primary text-sm font-bold outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Instant Forecast Calculator */}
              <div className="bg-white p-3 rounded-xl border border-m3-outline-variant/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-m3-on-surface-variant block">Forecasted Amortization</span>
                  <span className="font-bold text-atelier-primary text-sm">
                    {targetWearsNeeded} total wears needed
                  </span>
                </div>
                <div className="text-right text-[11px] text-m3-on-surface-variant">
                  At 2 wears/month: <strong className="text-m3-on-surface">~{Math.ceil(targetWearsNeeded / 2)} months</strong>
                </div>
              </div>
            </div>

            {/* Row 3: Image URL & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Photo URL or Unsplash Link
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-on-surface mb-1">
                  Color Name & Swatch
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-m3-outline-variant/40"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Oatmeal, Sage, Noir"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-m3-on-surface mb-1">
                Aesthetic Notes & Styling Ideas
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 100% heavy linen. Looks great tucked into tailored trousers."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-m3-surface-container/70 border border-transparent focus:border-atelier-primary focus:bg-white text-xs outline-none transition-all font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-m3-outline-variant/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-m3-on-surface-variant hover:text-m3-on-surface"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-atelier-primary text-white text-xs font-bold hover:bg-atelier-primary-hover shadow-soft transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Save to Portfolio</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
