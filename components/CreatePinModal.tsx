import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Zap } from 'lucide-react';
import { generateCreativeImage } from '../services/geminiService';
import { Pin } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CreatePinModalProps {
  onClose: () => void;
  onPinCreated: (pin: Pin) => void;
}

export const CreatePinModal: React.FC<CreatePinModalProps> = ({ onClose, onPinCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');

    try {
      const imageResult = await generateCreativeImage(prompt);
      
      if (imageResult) {
        const newPin: Pin = {
          id: Math.random().toString(36).substr(2, 9),
          title: "AI Generated Pixel",
          description: prompt,
          author: "You",
          seed: "generated",
          heightRatio: 1.0, 
          color: "#F97316",
          tags: ["AI", "PixelNow"],
          isGenerated: true,
          imageBase64: imageResult.base64
        };
        onPinCreated(newPin);
        onClose();
      } else {
        setError(t('errorGen'));
      }
    } catch (e) {
      setError(t('error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl overflow-hidden shadow-2xl relative border-4 border-gray-900 dark:border-gray-700 max-h-[90vh] overflow-y-auto transition-colors">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-black dark:hover:border-white transition-all z-10">
          <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500 text-white">
                  <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl pixel-font text-gray-900 dark:text-white uppercase">{t('generatePixel')}</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Preview */}
            <div className="w-full md:w-1/2 aspect-square bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center flex-col text-gray-400 dark:text-gray-500 transition-colors">
               {isGenerating ? (
                 <div className="text-center">
                    <Sparkles className="w-12 h-12 text-orange-500 animate-spin mb-2 mx-auto" />
                    <p className="text-sm font-mono text-orange-500 uppercase">{t('processing')}</p>
                 </div>
               ) : (
                 <>
                   <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                   <p className="text-xs font-mono uppercase">{t('preview')}</p>
                 </>
               )}
            </div>

            {/* Right: Controls */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 dark:text-gray-400 uppercase mb-2">
                    {t('promptLabel')}
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('promptPlaceholder')}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none h-32 resize-none font-mono text-sm transition-colors"
                />
                {error && <p className="text-red-500 text-xs font-mono mt-2">{error}</p>}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`w-full py-4 font-mono font-bold uppercase tracking-widest text-white transition-all mt-4 ${
                  isGenerating || !prompt 
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }`}
              >
                {isGenerating ? t('rendering') : t('execute')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};