import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, BadgeCheck, Camera, Settings, RefreshCw, Check, Briefcase, PlusCircle, Building2 } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { currentUser, availableUsers, switchAccount, updateProfile, addAccount } = useUser();
  const { t } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    isBusiness: currentUser.isBusiness
  });

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      name: currentUser.name,
      bio: currentUser.bio,
      isBusiness: currentUser.isBusiness
    });
    setIsEditing(false);
  }, [currentUser]);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleSwitch = (userId: string) => {
    switchAccount(userId);
  };

  const handleCreateBusinessAccount = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    addAccount({
        id: newId,
        name: "New Business",
        handle: `@business_${newId}`,
        bio: "Welcome to your new business account.",
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${newId}`,
        isVerified: false,
        isBusiness: true,
        followers: 0,
        following: 0
    });
    // Automatically enter edit mode for the new account
    setTimeout(() => setIsEditing(true), 100);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative transition-colors duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Cover */}
        <div className={`h-32 relative ${currentUser.isBusiness ? 'bg-gradient-to-r from-slate-700 to-slate-900' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 -mt-16 flex flex-col flex-grow overflow-y-auto no-scrollbar">
          
          {/* Avatar */}
          <div className="flex justify-between items-end mb-4">
            <div className="relative group">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer border-4 border-transparent">
                  <Camera className="text-white w-8 h-8" />
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm font-bold rounded-full transition-colors mb-2"
              >
                {t('editProfile')}
              </button>
            ) : (
              <div className="flex gap-2 mb-2">
                 <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-100 text-red-600 font-mono text-xs font-bold rounded-full"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-100 text-green-600 font-mono text-xs font-bold rounded-full"
                >
                  {t('save')}
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">{t('name')}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-1 text-lg font-bold text-gray-900 dark:text-white outline-none focus:border-orange-500"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">{t('bio')}</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full border rounded p-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-500"
                      rows={3}
                    />
                 </div>
                 
                 {/* Convert Account Type */}
                 <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => setFormData({...formData, isBusiness: !formData.isBusiness})}
                      className="flex items-center gap-2 text-sm font-mono text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                    >
                       <Building2 className="w-4 h-4" />
                       {formData.isBusiness ? t('convertToPersonal') : t('convertToBusiness')}
                    </button>
                 </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white pixel-font">{currentUser.name}</h2>
                  {currentUser.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                  )}
                  {currentUser.isBusiness && (
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border border-slate-200 dark:border-slate-700">
                        <Briefcase className="w-3 h-3" />
                        {t('businessLabel')}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-3">{currentUser.handle}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {currentUser.bio}
                </p>
                
                {/* Stats */}
                <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="text-center">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">{currentUser.followers.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase">{t('followers')}</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">{currentUser.following.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase">{t('following')}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Account Switcher */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                <RefreshCw className="w-3 h-3" />
                {t('switchAccount')}
                </h3>
            </div>
            
            <div className="space-y-2 mb-3">
              {availableUsers.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => handleSwitch(user.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    currentUser.id === user.id 
                      ? 'bg-white dark:bg-gray-700 shadow-sm border border-orange-500/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200" />
                    <div>
                      <p className={`text-sm font-bold flex items-center gap-1 ${currentUser.id === user.id ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {user.name}
                        {user.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{user.handle}</p>
                        {user.isBusiness && <Briefcase className="w-3 h-3 text-slate-400" />}
                      </div>
                    </div>
                  </div>
                  {currentUser.id === user.id && <Check className="w-4 h-4 text-orange-500" />}
                </div>
              ))}
            </div>

            {/* Create Business Account Button */}
            <button 
                onClick={handleCreateBusinessAccount}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-white dark:hover:bg-gray-800 transition-all text-xs font-mono font-bold uppercase"
            >
                <PlusCircle className="w-4 h-4" />
                {t('createBusiness')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};