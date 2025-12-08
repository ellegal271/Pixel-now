import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PinCard } from './components/PinCard';
import { DetailModal } from './components/DetailModal';
import { CreatePinModal } from './components/CreatePinModal';
import { ProfileModal } from './components/ProfileModal';
import { LoginModal } from './components/LoginModal';
import { fetchPinFeed } from './services/geminiService';
import { Pin } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { useUser } from './contexts/UserContext';

function App() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'profile' | null>(null);
  
  const [currentQuery, setCurrentQuery] = useState('');
  
  // Get language from context
  const { language, t } = useLanguage();
  const { isLoggedIn } = useUser();

  // Load feed when language or initial mount changes
  useEffect(() => {
    // When language changes, reload the feed to show content in new language
    loadFeed(currentQuery);
  }, [language]); 

  const loadFeed = useCallback(async (query: string) => {
    setLoading(true);
    setCurrentQuery(query);
    setPins([]); 
    
    // Pass the current language to the service
    const newPins = await fetchPinFeed(query, language);
    setPins(newPins);
    setLoading(false);
  }, [language]);

  const handleSearch = (term: string) => {
    loadFeed(term);
  };

  const handleHome = () => {
    loadFeed('');
  };

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handleCreatePin = (newPin: Pin) => {
    setPins(prev => [newPin, ...prev]);
  };

  // Protected Action Handlers
  const handleCreateClick = () => {
    if (isLoggedIn) {
      setShowCreateModal(true);
    } else {
      setPendingAction('create');
      setShowLoginModal(true);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowProfileModal(true);
    } else {
      setPendingAction('profile');
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Resume pending action
    if (pendingAction === 'create') {
      setShowCreateModal(true);
    } else if (pendingAction === 'profile') {
      setShowProfileModal(true);
    }
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar 
        onSearch={handleSearch} 
        onCreateClick={handleCreateClick}
        onHomeClick={handleHome}
        onProfileClick={handleProfileClick}
        isSearching={loading}
      />

      <main className="pt-20 md:pt-24 px-1 pb-10 max-w-[2000px] mx-auto">
        
        {/* Loading State */}
        {loading && pins.length === 0 && (
          <div className="flex justify-center items-center h-64">
             <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm uppercase">{t('loading')}</p>
             </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && pins.length === 0 && (
           <div className="text-center mt-20">
             <h2 className="text-3xl md:text-4xl pixel-font text-gray-900 dark:text-white">{t('noPixelsTitle')}</h2>
             <p className="text-gray-500 dark:text-gray-400 mt-2 font-mono">{t('noPixelsDesc')}</p>
           </div>
        )}

        {/* 
            Strict Grid Implementation
            Responsive grid: 2 cols on mobile, up to 5 on large screens
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={pin} onClick={handlePinClick} />
          ))}
        </div>

        {/* Load More Trigger */}
        {pins.length > 0 && !loading && (
          <div className="flex justify-center mt-12">
             <button 
               onClick={() => loadFeed(currentQuery ? currentQuery + " more" : "random")}
               className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 text-gray-900 dark:text-white font-mono uppercase font-bold py-3 md:py-4 px-8 md:px-10 tracking-widest transition-all hover:text-orange-500 dark:hover:text-orange-500 text-sm md:text-base"
             >
               {t('loadMore')}
             </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedPin && (
        <DetailModal 
          pin={selectedPin} 
          onClose={() => setSelectedPin(null)} 
        />
      )}

      {showCreateModal && (
        <CreatePinModal 
          onClose={() => setShowCreateModal(false)}
          onPinCreated={handleCreatePin}
        />
      )}

      {showProfileModal && (
        <ProfileModal 
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onClose={() => { setShowLoginModal(false); setPendingAction(null); }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;