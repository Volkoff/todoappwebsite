import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';

interface UserData {
  id: string;
  email: string | null;
  displayName: string | null;
  tasksCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastTaskDate: string | null;
  points: number;
}

const defaultUserData: Omit<UserData, 'id' | 'email' | 'displayName'> = {
  tasksCompleted: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastTaskDate: null,
  points: 0
};

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  updateProfile: (data: { displayName?: string; email?: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
  updateUserData: async () => {},
  updateProfile: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    console.log('Setting up user data listener for:', user.uid);
    const userRef = doc(db, 'users', user.uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(userRef, (doc) => {
      console.log('Raw user data from Firestore:', doc.data());
      if (doc.exists()) {
        const rawData = doc.data();
        // Ensure all required fields are present
        const data: UserData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          tasksCompleted: rawData.tasksCompleted ?? defaultUserData.tasksCompleted,
          currentStreak: rawData.currentStreak ?? defaultUserData.currentStreak,
          bestStreak: rawData.bestStreak ?? defaultUserData.bestStreak,
          lastTaskDate: rawData.lastTaskDate ?? defaultUserData.lastTaskDate,
          points: rawData.points ?? defaultUserData.points
        };
        console.log('Processed user data:', data);
        setUserData(data);
      } else {
        // Create new user data if it doesn't exist
        const newUserData: UserData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...defaultUserData
        };
        console.log('Creating new user data:', newUserData);
        setDoc(userRef, newUserData);
        setUserData(newUserData);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in user data listener:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up user data listener');
      unsubscribe();
    };
  }, [user]);

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) {
      console.log('No user found in updateUserData');
      return;
    }

    try {
      console.log('Updating user data in Firestore:', data);
      const userRef = doc(db, 'users', user.uid);
      
      // Get current data first
      const currentDoc = await getDoc(userRef);
      const currentData = currentDoc.exists() ? currentDoc.data() : {};
      
      // Merge current data with updates
      const updatedData = {
        ...currentData,
        ...data,
        id: user.uid,
        email: user.email,
        displayName: user.displayName
      };
      
      // Update local state first
      setUserData(prev => {
        if (!prev) return null;
        const newData = { ...prev, ...data };
        console.log('Updated local state:', newData);
        return newData;
      });

      // Then update Firestore
      await updateDoc(userRef, data);
      console.log('Firestore update successful');

      // Force a refresh of the data
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const rawData = updatedDoc.data();
        const freshData: UserData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          tasksCompleted: rawData.tasksCompleted ?? defaultUserData.tasksCompleted,
          currentStreak: rawData.currentStreak ?? defaultUserData.currentStreak,
          bestStreak: rawData.bestStreak ?? defaultUserData.bestStreak,
          lastTaskDate: rawData.lastTaskDate ?? defaultUserData.lastTaskDate,
          points: rawData.points ?? defaultUserData.points
        };
        console.log('Fresh data from Firestore:', freshData);
        setUserData(freshData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { displayName?: string; email?: string }) => {
    if (!user) return;

    try {
      // Update Firebase Auth profile
      if (data.displayName) {
        await updateFirebaseProfile(user, { displayName: data.displayName });
      }

      // Update Firestore user data
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, updateUserData, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
} 