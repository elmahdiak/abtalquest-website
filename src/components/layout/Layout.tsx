import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';

import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface LayoutProps {
  children: React.ReactNode;
  currentView?: 'home' | 'marketplace' | 'admin';
  onViewChange?: (view: 'home' | 'marketplace') => void;
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenContact?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onViewChange,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenContact,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#071727] text-slate-800 dark:text-slate-100 font-body selection:bg-[#fa8221]/20 selection:text-[#fa8221] w-full max-w-full overflow-x-hidden transition-colors duration-200">
      <Navbar 
        currentView={currentView} 
        onViewChange={onViewChange}
        user={user}
        onOpenAuth={onOpenAuth}
        onOpenProfile={onOpenProfile}
        onOpenContact={onOpenContact}
      />
      <main className="flex-1 w-full max-w-full flex flex-col overflow-x-hidden">
        {children}
      </main>
      <Footer onOpenContact={onOpenContact} />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
