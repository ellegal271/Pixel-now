import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { User } from '../types';
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  microsoftProvider, 
  appleProvider,
  signInWithPopup,
  firebaseSignOut
} from '../services/firebase';

interface UserContextType {
  currentUser: User | null; // Null if guest
  availableUsers: User[];
  isLoggedIn: boolean;
  login: (providerName: string) => Promise<void>;
  logout: () => void;
  switchAccount: (userId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  addAccount: (user: User) => void;
}

// Mock Data for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Creative Soul',
    handle: '@creative_soul',
    bio: 'Digital artist exploring the boundaries of AI and pixels.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    isVerified: false,
    isBusiness: false,
    followers: 1204,
    following: 450
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string>(MOCK_USERS[0].id);
  const [availableUsers, setAvailableUsers] = useState<User[]>(MOCK_USERS);

  // Monitor Firebase Auth State (Real Accounts)
  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser: any) => {
        if (firebaseUser) {
          // Convert Firebase user to App User
          const realUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            handle: `@${firebaseUser.email?.split('@')[0] || 'user'}`,
            bio: "Verified Account via " + (firebaseUser.providerData[0]?.providerId || "Email"),
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.uid}`,
            isVerified: true,
            isBusiness: false,
            followers: 0,
            following: 0
          };
          
          addAccount(realUser);
          setIsLoggedIn(true);
        } else {
          // If we want to force logout on firebase logout
          // setIsLoggedIn(false); 
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const currentUser = isLoggedIn 
    ? availableUsers.find(u => u.id === activeUserId) || availableUsers[0]
    : null;

  const login = async (providerName: string) => {
    // 1. TRY REAL FIREBASE LOGIN
    if (auth) {
      try {
        let provider = null;
        switch (providerName) {
          case 'google': provider = googleProvider; break;
          case 'facebook': provider = facebookProvider; break;
          case 'microsoft': provider = microsoftProvider; break;
          case 'apple': provider = appleProvider; break;
        }

        if (provider) {
          await signInWithPopup(auth, provider);
          return; // Auth state listener will handle the rest
        }
      } catch (error) {
        console.error("Real Auth Failed (likely no keys), falling back to simulation", error);
      }
    }

    // 2. FALLBACK: HIGH FIDELITY SIMULATION
    // This runs if Firebase keys are missing, simulating the provider experience
    
    let simulatedUser: User;
    const randomId = Math.random().toString(36).substr(2, 9);

    switch (providerName) {
      case 'google':
        simulatedUser = {
          id: `google_${randomId}`,
          name: "Google User",
          handle: "@gmail_user",
          bio: "Logged in via Google Account.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser&backgroundColor=b6e3f4",
          isVerified: true,
          isBusiness: false,
          followers: 12,
          following: 5
        };
        break;
      case 'facebook':
        simulatedUser = {
          id: `fb_${randomId}`,
          name: "Facebook User",
          handle: "@fb_friend",
          bio: "Connected via Facebook.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FacebookUser&backgroundColor=c0ca33",
          isVerified: true,
          isBusiness: false,
          followers: 85,
          following: 120
        };
        break;
      case 'microsoft':
        simulatedUser = {
          id: `ms_${randomId}`,
          name: "Microsoft User",
          handle: "@live_id",
          bio: "Work account connected.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Microsoft&backgroundColor=ffdfbf",
          isVerified: true,
          isBusiness: true, // Simulate business account for Microsoft
          followers: 500,
          following: 10
        };
        break;
       case 'apple':
        simulatedUser = {
          id: `apple_${randomId}`,
          name: "Apple User",
          handle: "@icloud_id",
          bio: "Sign in with Apple.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Apple&grayscale=true",
          isVerified: true,
          isBusiness: false,
          followers: 0,
          following: 0
        };
        break;
      default: // Email
         simulatedUser = {
          id: `mail_${randomId}`,
          name: "New Member",
          handle: "@member",
          bio: "Just joined Pixel Now.",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${randomId}`,
          isVerified: false,
          isBusiness: false,
          followers: 0,
          following: 0
        };
    }

    addAccount(simulatedUser);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoggedIn(false);
  };

  const switchAccount = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setActiveUserId(user.id);
      setIsLoggedIn(true); // Switch implies logging in to that account
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    
    setAvailableUsers(users => 
      users.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u)
    );
  };

  const addAccount = (user: User) => {
    // Check if user already exists to avoid duplicates
    const exists = availableUsers.some(u => u.id === user.id);
    if (!exists) {
      setAvailableUsers(prev => [...prev, user]);
    }
    setActiveUserId(user.id);
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      availableUsers, 
      isLoggedIn, 
      login, 
      logout, 
      switchAccount, 
      updateProfile, 
      addAccount 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};