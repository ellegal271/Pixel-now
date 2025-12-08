import React from 'react';
import { Pin } from '../types';
import { X, Share2, Download, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DetailModalProps {
  pin: Pin | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ pin, onClose }) => {
  const { t } = useLanguage();
  if (!pin) return null;

  const width = 800;
  const height = 800;
  const imageUrl = pin.isGenerated && pin.imageBase64 
    ? `data:image/png;base64,${pin.imageBase64}` 
    : `https://picsum.photos/seed/${pin.seed}/${width}/${height}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4" onClick={onClose}>
      <button 
        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-orange-500 hover:text-white transition-colors z-50 md:hidden rounded-full shadow-lg"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="bg-white dark:bg-gray-900 w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image (Square or Fit) */}
        <div className="w-full h-1/2 md:h-auto md:w-3/5 bg-black flex items-center justify-center relative">
          <img 
            src={imageUrl} 
            alt={pin.title} 
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 font-mono text-xs backdrop-blur-md">
            {t('seed')}: {pin.seed}
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full h-1/2 md:h-auto md:w-2/5 p-6 md:p-8 flex flex-col md:h-full overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
          
          {/* Header Actions - Added md:mt-8 for separation from Close button */}
          <div className="flex justify-between items-center mb-6 md:mb-8 md:mt-8">
            <div className="flex space-x-2">
               <button className="p-2 md:p-3 border-2 border-gray-100 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200 transition-colors">
                 <Share2 className="w-4 h-4 md:w-5 md:h-5" />
               </button>
               <button className="p-2 md:p-3 border-2 border-gray-100 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200 transition-colors">
                 <Download className="w-4 h-4 md:w-5 md:h-5" />
               </button>
            </div>
            <button className="px-4 md:px-8 py-2 md:py-3 bg-orange-500 text-white font-mono uppercase font-bold text-xs md:text-sm tracking-wider hover:bg-orange-600 transition-colors shadow-sm">
              {t('savePixel')}
            </button>
          </div>

          <div className="flex-grow">
            <h1 className="text-2xl md:text-4xl pixel-font text-gray-900 dark:text-white mb-2 md:mb-4 transition-colors">{pin.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed font-mono text-xs md:text-sm transition-colors">
              {pin.description}
            </p>

            <div className="flex items-center justify-between mb-6 md:mb-8 border-t border-b border-gray-100 dark:border-gray-800 py-3 md:py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center font-bold text-lg md:text-xl pixel-font">
                  {pin.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm font-mono uppercase text-gray-900 dark:text-gray-100">{pin.author}</p>
                  <p className="text-xs text-gray-400 font-mono">{t('verifiedCreator')}</p>
                </div>
              </div>
              <button className="text-orange-500 font-bold hover:underline font-mono text-sm">
                {t('follow')}
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {pin.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-mono uppercase transition-colors">#{tag}</span>
                ))}
            </div>

          </div>
          
           {/* Sticky Input */}
           <div className="mt-auto pt-4 pb-10 md:pb-0">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder={t('commentPlaceholder')} 
                 className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 md:p-4 outline-none focus:border-orange-500 dark:focus:border-orange-500 font-mono text-sm transition-colors"
               />
               <Heart className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
             </div>
           </div>

        </div>
        
        {/* Close Button Desktop */}
        <button 
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white hidden md:block rounded-full"
            onClick={onClose}
        >
            <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};