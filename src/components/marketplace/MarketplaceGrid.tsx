import React from 'react';
import { MarketplaceProductGrid, type MarketplaceProductGridProps } from './MarketplaceProductGrid';

export type MarketplaceGridProps = MarketplaceProductGridProps;

/**
 * MarketplaceGrid Component
 * Re-exports the high-performance responsive product grid supporting direct Supabase image URLs,
 * multi-tier device responsiveness, sorting, filtering, and real-time state synchronization.
 */
export const MarketplaceGrid: React.FC<MarketplaceGridProps> = (props) => {
  return <MarketplaceProductGrid {...props} />;
};

export default MarketplaceGrid;
