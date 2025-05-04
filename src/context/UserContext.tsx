import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';
import { useTheme } from './ThemeContext';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; email?: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { forceDarkMode } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userDoc.data()
          } as User);
        } else {
          // Create new user document
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            tasksCompleted: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastTaskDate: null
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(firebaseUser, { displayName });
    
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName,
      tasksCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastTaskDate: null
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateProfile = async (data: { displayName?: string; email?: string }) => {
    if (!user) throw new Error('No user logged in');

    const updates: { [key: string]: any } = {};
    if (data.displayName) {
      await firebaseUpdateProfile(auth.currentUser as FirebaseUser, { displayName: data.displayName });
      updates.displayName = data.displayName;
    }
    if (data.email) {
      await firebaseUpdateEmail(auth.currentUser as FirebaseUser, data.email);
      updates.email = data.email;
    }

    await updateDoc(doc(db, 'users', user.id), updates);
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <UserContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 