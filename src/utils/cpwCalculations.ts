import { WardrobeItem, PortfolioStats } from '../types/wardrobe';

/**
 * Calculates Cost-Per-Wear (CPW)
 */
export function calculateCPW(purchasePrice: number, wearsCount: number): number {
  if (wearsCount <= 0) return purchasePrice;
  return Number((purchasePrice / wearsCount).toFixed(2));
}

/**
 * Calculates days elapsed between an ISO date string and today
 */
export function getDaysSince(dateString: string): number {
  const past = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - past.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines whether an item is considered "Dormant"
 * Threshold: > 45 days since last worn
 */
export function isDormant(item: WardrobeItem, thresholdDays = 45): boolean {
  if (item.wearsCount === 0) return true;
  return getDaysSince(item.lastWornDate) >= thresholdDays;
}

/**
 * Returns a human-friendly amortization / CPW tier
 */
export interface CPWTier {
  label: string;
  badgeClass: string;
  description: string;
  isPaidOff: boolean;
}

export function getCPWTier(cpw: number, targetCPW: number = 5): CPWTier {
  if (cpw <= 3.0) {
    return {
      label: 'Portfolio Staple (Paid Off)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Exceptional ROI. This piece costs less than a coffee per wear!',
      isPaidOff: true,
    };
  }
  if (cpw <= targetCPW) {
    return {
      label: 'Target Hit',
      badgeClass: 'bg-atelier-primary-light text-atelier-primary border-atelier-primary/20',
      description: 'Achieved your financial goal. High aesthetic & value alignment.',
      isPaidOff: true,
    };
  }
  if (cpw <= 15.0) {
    return {
      label: 'Active Rotation',
      badgeClass: 'bg-m3-surface-container text-m3-on-surface-variant border-m3-outline-variant',
      description: 'Steadily amortizing. Keep styling to drop below target.',
      isPaidOff: false,
    };
  }
  if (cpw <= 35.0) {
    return {
      label: 'In Progress',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Requires more frequent rotation to justify initial investment.',
      isPaidOff: false,
    };
  }
  return {
    label: 'High Luxury / Dormant',
    badgeClass: 'bg-atelier-accent-soft text-atelier-accent border-atelier-accent/30',
    description: 'High capital locked per wear. Consider pairing in new outfits or consigning.',
    isPaidOff: false,
  };
}

/**
 * Aggregates overall Wardrobe Portfolio metrics
 */
export function calculatePortfolioStats(items: WardrobeItem[]): PortfolioStats {
  if (items.length === 0) {
    return {
      totalValuation: 0,
      totalItems: 0,
      totalWears: 0,
      averageCPW: 0,
      dormantItemsCount: 0,
      dormantCapital: 0,
      activeItemsCount: 0,
      utilizationRate: 0,
    };
  }

  const totalValuation = items.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalWears = items.reduce((sum, item) => sum + item.wearsCount, 0);
  
  const dormantItems = items.filter(item => isDormant(item));
  const dormantCapital = dormantItems.reduce((sum, item) => sum + item.purchasePrice, 0);
  const dormantItemsCount = dormantItems.length;
  const activeItemsCount = items.length - dormantItemsCount;
  
  const utilizationRate = Math.round((activeItemsCount / items.length) * 100);

  // Weighted average CPW
  const averageCPW = totalWears > 0 
    ? Number((totalValuation / totalWears).toFixed(2)) 
    : totalValuation;

  // Best investment asset (highest wears & lowest CPW among pieces > $50)
  const qualifiedAssets = [...items].filter(i => i.wearsCount > 5);
  qualifiedAssets.sort((a, b) => {
    const cpwA = calculateCPW(a.purchasePrice, a.wearsCount);
    const cpwB = calculateCPW(b.purchasePrice, b.wearsCount);
    return cpwA - cpwB;
  });
  const topAsset = qualifiedAssets[0] || items[0];

  // Most sleeping asset (highest purchase price among dormant pieces)
  const sortedDormant = [...dormantItems].sort((a, b) => b.purchasePrice - a.purchasePrice);
  const mostSleepingAsset = sortedDormant[0];

  return {
    totalValuation,
    totalItems: items.length,
    totalWears,
    averageCPW,
    dormantItemsCount,
    dormantCapital,
    activeItemsCount,
    utilizationRate,
    topAsset,
    mostSleepingAsset,
  };
}

/**
 * Calculates remaining wears required to achieve a target CPW
 */
export function wearsNeededForTarget(purchasePrice: number, currentWears: number, targetCPW: number): number {
  if (targetCPW <= 0) return 0;
  const totalWearsNeeded = Math.ceil(purchasePrice / targetCPW);
  return Math.max(0, totalWearsNeeded - currentWears);
}

