import React, { useState } from 'react';
import { Pin } from '../types';
import { ArrowDownToLine } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PinCardProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useLanguage();

  // Use Picsum with strict square dimensions
  const width = 500;
  const height = 500; // Force Square
  const imageUrl = pin.isGenerated && pin.imageBase64 
    ? `data:image/png;base64,${pin.imageBase64}` 
    : `https://picsum.photos/seed/${pin.seed}/${width}/${height}`;

  return (
    <div 
      className="relative aspect-square group overflow-hidden bg-gray-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(pin)}
    >
      {/* Background Color Placeholder */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{ backgroundColor: pin.color, opacity: imageLoaded ? 0 : 1 }}
      />
      
      <img
        src={imageUrl}
        alt={pin.title}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />

      {/* Hover Overlay - Minimalist & Orange */}
      <div className={`absolute inset-0 bg-black/60 flex flex-col justify-between p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="flex justify-between items-start">
            <span className="text-white/80 text-xs font-mono uppercase tracking-widest border border-white/30 px-2 py-1">
                {pin.isGenerated ? t('aiGen') : t('pixel')}
            </span>
            <button 
                className="bg-orange-500 text-white p-2 hover:bg-orange-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); /* Save */ }}
            >
                <ArrowDownToLine className="w-5 h-5" />
            </button>
        </div>

        <div>
            <h3 className="text-white font-bold pixel-font text-lg leading-none mb-1 shadow-black drop-shadow-md">{pin.title}</h3>
            <p className="text-gray-300 text-xs font-mono truncate">{pin.author}</p>
        </div>
      </div>
    </div>
  );
};