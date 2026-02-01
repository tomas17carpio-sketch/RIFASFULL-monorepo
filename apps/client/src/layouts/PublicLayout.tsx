
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIAssistant from '../components/AIAssistant';

interface PublicLayoutProps {
  children: React.ReactNode;
  user: { name: string; email: string; avatar: string } | null;
  onLogin: (user: { name: string; email: string; avatar: string }) => void;
  onLogout: () => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, user, onLogin, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark transition-colors duration-300">
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default PublicLayout;
