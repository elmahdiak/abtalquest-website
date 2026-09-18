import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export interface LayoutProps {
  children: React.ReactNode;
  currentView?: 'home' | 'marketplace';
  onViewChange?: (view: 'home' | 'marketplace') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-body selection:bg-[#fa8221]/20 selection:text-[#fa8221]">
      <Navbar currentView={currentView} onViewChange={onViewChange} />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
