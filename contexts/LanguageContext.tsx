import React, { createContext, useState, useContext, ReactNode, PropsWithChildren } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    searchPlaceholder: "Search pixels...",
    home: "Feed",
    create: "Create",
    loading: "Loading Pixels...",
    noPixelsTitle: "NO PIXELS FOUND",
    noPixelsDesc: "Try searching for something else.",
    loadMore: "Load More",
    savePixel: "Save Pixel",
    follow: "Follow",
    verifiedCreator: "Verified Creator",
    commentPlaceholder: "Leave a comment...",
    generatePixel: "Generate Pixel",
    preview: "Preview",
    processing: "Processing...",
    promptLabel: "Prompt Command",
    promptPlaceholder: "Describe your pixel...",
    execute: "Execute",
    rendering: "Rendering...",
    aiGen: "AI_GEN",
    pixel: "PIXEL",
    errorGen: "Failed to generate image. Please try again.",
    error: "An error occurred.",
    seed: "SEED",
    renderCmd: "RENDER_CMD",
    profile: "Profile",
    editProfile: "Edit Profile",
    switchAccount: "Switch Account",
    name: "Name",
    bio: "Bio",
    cancel: "Cancel",
    save: "Save",
    followers: "Followers",
    following: "Following",
    verifiedAccount: "Official Verified Account",
    accounts: "Accounts",
    businessAccount: "Business Account",
    personalAccount: "Personal Account",
    convertToBusiness: "Convert to Business Account",
    convertToPersonal: "Switch to Personal Account",
    createBusiness: "Create Business Account",
    businessLabel: "Business",
    loginTitle: "Login to Pixel Now",
    loginDesc: "Join the community to create and collect pixels.",
    continueWith: "Continue with",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    login: "Log In",
    signup: "Sign Up",
    or: "OR",
    guest: "Guest",
    loginRequired: "Login Required"
  },
  es: {
    searchPlaceholder: "Buscar píxeles...",
    home: "Inicio",
    create: "Crear",
    loading: "Cargando Píxeles...",
    noPixelsTitle: "NO SE ENCONTRARON PÍXELES",
    noPixelsDesc: "Intenta buscar algo diferente.",
    loadMore: "Cargar Más",
    savePixel: "Guardar Píxel",
    follow: "Seguir",
    verifiedCreator: "Creador Verificado",
    commentPlaceholder: "Deja un comentario...",
    generatePixel: "Generar Píxel",
    preview: "Vista Previa",
    processing: "Procesando...",
    promptLabel: "Comando Prompt",
    promptPlaceholder: "Describe tu píxel...",
    execute: "Ejecutar",
    rendering: "Renderizando...",
    aiGen: "IA_GEN",
    pixel: "PÍXEL",
    errorGen: "Error al generar imagen. Inténtalo de nuevo.",
    error: "Ocurrió un error.",
    seed: "SEMILLA",
    renderCmd: "RENDER_CMD",
    profile: "Perfil",
    editProfile: "Editar Perfil",
    switchAccount: "Cambiar Cuenta",
    name: "Nombre",
    bio: "Biografía",
    cancel: "Cancelar",
    save: "Guardar",
    followers: "Seguidores",
    following: "Siguiendo",
    verifiedAccount: "Cuenta Oficial Verificada",
    accounts: "Cuentas",
    businessAccount: "Cuenta de Empresa",
    personalAccount: "Cuenta Personal",
    convertToBusiness: "Convertir a Cuenta de Empresa",
    convertToPersonal: "Cambiar a Cuenta Personal",
    createBusiness: "Crear Cuenta de Empresa",
    businessLabel: "Empresa",
    loginTitle: "Inicia sesión en Pixel Now",
    loginDesc: "Únete a la comunidad para crear y coleccionar píxeles.",
    continueWith: "Continuar con",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    or: "O",
    guest: "Invitado",
    loginRequired: "Inicio de sesión requerido"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish as requested

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};