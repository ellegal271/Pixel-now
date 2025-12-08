import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";

// TO ENABLE REAL LOGIN:
// 1. Create a project at console.firebase.google.com
// 2. Enable Authentication (Google, Facebook, Microsoft, etc.)
// 3. Copy your config object below
const firebaseConfig = {
  // Replace these with your real keys to make it work with real accounts
  apiKey: "", 
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let auth: any = null;
let googleProvider: any = null;
let facebookProvider: any = null;
let microsoftProvider: any = null;
let appleProvider: any = null;

try {
  // Only initialize if keys are present
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    googleProvider = new GoogleAuthProvider();
    facebookProvider = new FacebookAuthProvider();
    microsoftProvider = new OAuthProvider('microsoft.com');
    appleProvider = new OAuthProvider('apple.com');
  } else {
    console.log("Firebase keys missing. Running in Simulation Mode.");
  }
} catch (error) {
  console.warn("Error initializing Firebase", error);
}

export { 
  auth, 
  googleProvider, 
  facebookProvider, 
  microsoftProvider, 
  appleProvider,
  signInWithPopup, 
  firebaseSignOut 
};