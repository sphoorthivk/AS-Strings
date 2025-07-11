import React, { ReactNode } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
      <Header />
      <main className="flex-1 smooth-scroll">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;