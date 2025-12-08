import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Plus, RotateCcw, Globe, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface NavbarProps {
  onSearch: (term: string) => void;
  onCreateClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  isSearching: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onCreateClick, onHomeClick, onProfileClick, isSearching }) => {
  const [term, setTerm] = useState('');
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isLoggedIn } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 flex items-center px-4 md:px-6 border-b-2 border-gray-100 dark:border-gray-800 transition-all duration-300">
      {/* Pixelated Logo */}
      <div className="flex-shrink-0 mr-4 md:mr-6 cursor-pointer group" onClick={onHomeClick}>
        <div className="flex items-center space-x-2">
            <svg 
            width="28" 
            height="28" 
            viewBox="0 0 10 10" 
            shapeRendering="crispEdges" 
            className="block group-hover:scale-110 transition-transform duration-200 md:w-8 md:h-8"
            >
            <rect width="10" height="10" fill="#F97316" /> {/* Orange-500 */}
            <path d="M3 2h4v1h-4z M3 3h1v1h-1z M6 3h1v1h-1z M3 4h4v1h-4z M3 5h1v3h-1z" className="fill-gray-900 dark:fill-white transition-colors" />
            </svg>
            <span className="pixel-font text-xl md:text-2xl font-bold text-gray-900 dark:text-white hidden lg:block tracking-widest transition-colors">
                PIXEL<span className="text-orange-500">NOW</span>
            </span>
        </div>
      </div>

      {/* Home / Create Links (Desktop) */}
      <div className="hidden md:flex space-x-2 mr-6">
        <button 
          onClick={onHomeClick}
          className="px-4 lg:px-6 py-2 bg-gray-900 dark:bg-gray-800 text-white font-mono text-xs lg:text-sm uppercase tracking-wider hover:bg-orange-500 dark:hover:bg-orange-600 transition-colors"
        >
          {t('home')}
        </button>
        <button 
          onClick={onCreateClick}
          className="px-4 lg:px-6 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 font-mono text-xs lg:text-sm uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {t('create')}
        </button>
      </div>

      {/* Search Bar - Responsive */}
      <form onSubmit={handleSubmit} className="flex-grow max-w-3xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white text-sm md:text-base py-2 md:py-3 pl-9 md:pl-10 pr-4 outline-none border-2 border-transparent focus:border-orange-500 transition-all placeholder-gray-500 dark:placeholder-gray-400 font-mono"
          />
          {isSearching && (
             <div className="absolute inset-y-0 right-3 flex items-center">
               <div className="animate-spin h-3 w-3 md:h-4 md:w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div>
             </div>
          )}
        </div>
      </form>

      {/* Icons */}
      <div className="flex-shrink-0 flex items-center space-x-2 md:space-x-3 ml-2 md:ml-4 text-gray-600 dark:text-gray-300">
        
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center font-mono font-bold text-xs md:text-sm transition-colors"
          title="Switch Language"
        >
           <Globe className="w-5 h-5" />
           <span className="hidden md:inline ml-1">{language.toUpperCase()}</span>
        </button>

         {/* Theme Switcher */}
         <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"
          title="Toggle Theme"
        >
           {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {/* Profile Avatar / Login Trigger */}
        <button 
          onClick={onProfileClick}
          className="p-1 rounded-full border-2 border-transparent hover:border-orange-500 transition-all ml-1 relative"
          title={isLoggedIn ? t('profile') : t('login')}
        >
          {isLoggedIn && currentUser ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 object-cover"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </button>
        
        {/* Mobile Create Button */}
        <button onClick={onCreateClick} className="md:hidden p-2 hover:bg-orange-100 text-orange-500">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};