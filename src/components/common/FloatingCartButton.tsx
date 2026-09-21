import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { loadCartFromSupabase } from '../../services/marketplaceService';

export interface FloatingCartButtonProps {
  onClick?: () => void;
  cartCountOverride?: number;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  onClick,
  cartCountOverride,
}) => {
  const { t, direction } = useLanguage();
  const [internalCount, setInternalCount] = useState<number>(0);

  const calculateCount = (cartObj: Record<string, number>) => {
    return Object.values(cartObj).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
  };

  const refreshCartCount = async () => {
    try {
      const cart = await loadCartFromSupabase();
      setInternalCount(calculateCount(cart));
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    if (cartCountOverride !== undefined) return;

    let isMounted = true;
    loadCartFromSupabase()
      .then((cart) => {
        if (isMounted) {
          setInternalCount(calculateCount(cart));
        }
      })
      .catch(() => {});

    const handleCartUpdate = (e: any) => {
      if (e?.detail && typeof e.detail === 'object') {
        setInternalCount(calculateCount(e.detail));
      } else {
        void refreshCartCount();
      }
    };

    window.addEventListener('abtalquest_cart_updated', handleCartUpdate);
    window.addEventListener('storage', refreshCartCount);

    return () => {
      isMounted = false;
      window.removeEventListener('abtalquest_cart_updated', handleCartUpdate);
      window.removeEventListener('storage', refreshCartCount);
    };
  }, [cartCountOverride]);

  const itemCount = cartCountOverride !== undefined ? cartCountOverride : internalCount;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 animate-fadeIn"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="View Quest Cart"
        title="View Quest Cart"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-[#fa8221]/30 group"
      >
        <ShoppingCart className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />

        {/* Dynamic Cart Count Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#7C3AED] text-white text-[11px] font-headline font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A2540] shadow-md animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}

        {/* Tooltip on Hover */}
        <span
          className={`absolute bottom-full mb-2 hidden group-hover:block px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900/90 backdrop-blur-md rounded-lg whitespace-nowrap shadow-lg ${
            direction === 'rtl' ? 'left-0' : 'right-0'
          }`}
        >
          {t('marketplace.cart_pill_label') || 'Quest Cart'} ({itemCount})
        </span>
      </button>
    </div>
  );
};

export default FloatingCartButton;
