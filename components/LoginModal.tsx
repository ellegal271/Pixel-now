import React, { useState } from 'react';
import { X, Mail, Command, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { login } = useUser();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoadingProvider(provider);
    
    // Minimum visual delay for better UX even if simulation is instant
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await login(provider);
    
    setLoadingProvider(null);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border-2 border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>

        <div className="p-8 text-center">
           {/* Logo Icon */}
           <div className="w-16 h-16 bg-orange-500 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 transform rotate-3">
             <div className="grid grid-cols-2 gap-1">
               <div className="w-3 h-3 bg-white"></div>
               <div className="w-3 h-3 bg-white/80"></div>
               <div className="w-3 h-3 bg-white/80"></div>
               <div className="w-3 h-3 bg-white"></div>
             </div>
           </div>

           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 pixel-font tracking-wide">{t('loginTitle')}</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-mono">{t('loginDesc')}</p>

           <div className="space-y-3">
             {/* Facebook */}
             <button 
                onClick={() => handleLogin('facebook')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loadingProvider === 'facebook' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.957h3.696l-.533 3.667h-3.163v7.98h-5.02z"/></svg>
                )}
                {loadingProvider === 'facebook' ? 'Connecting...' : `${t('continueWith')} Facebook`}
             </button>

             {/* Google */}
             <button 
                onClick={() => handleLogin('google')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                 {loadingProvider === 'google' ? 'Connecting...' : `${t('continueWith')} Google`}
             </button>
             
             {/* Microsoft */}
             <button 
                onClick={() => handleLogin('microsoft')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#2F2F2F] hover:bg-black text-white rounded-lg font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loadingProvider === 'microsoft' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="grid grid-cols-2 gap-0.5">
                     <div className="w-2 h-2 bg-[#F25022]"></div>
                     <div className="w-2 h-2 bg-[#7FBA00]"></div>
                     <div className="w-2 h-2 bg-[#00A4EF]"></div>
                     <div className="w-2 h-2 bg-[#FFB900]"></div>
                  </div>
                )}
                 {loadingProvider === 'microsoft' ? 'Connecting...' : `${t('continueWith')} Microsoft`}
             </button>

             {/* Apple */}
             <button 
                onClick={() => handleLogin('apple')}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black hover:bg-gray-800 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loadingProvider === 'apple' ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.14-1.64 2.88-.04 4.54 2.1 4.54 2.1a4.37 4.37 0 0 1-2.58 4.25c.51 1.5 1.7 3.92-1.18 7.52zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                )}
                 {loadingProvider === 'apple' ? 'Connecting...' : `${t('continueWith')} Apple ID`}
             </button>
           </div>

           <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 font-mono text-xs">{t('or')}</span>
             </div>
           </div>

           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleLogin('email'); }}>
             <div className="relative">
               <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
               <input 
                 type="email" 
                 placeholder={t('emailPlaceholder')} 
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-orange-500 transition-colors dark:text-white font-mono"
               />
             </div>
             <div className="relative">
               <Command className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
               <input 
                 type="password" 
                 placeholder={t('passwordPlaceholder')} 
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-orange-500 transition-colors dark:text-white font-mono"
               />
             </div>
             <button 
               type="submit"
               disabled={loadingProvider !== null}
               className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors uppercase tracking-wider font-mono text-sm disabled:opacity-70"
             >
               {loadingProvider === 'email' ? t('processing') : t('login')}
             </button>
           </form>

        </div>
      </div>
    </div>
  );
};