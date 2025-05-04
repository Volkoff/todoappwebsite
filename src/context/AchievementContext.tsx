import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useUser } from './UserContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  userId: string;
  createdAt: string;
  completedAt: string | null;
}

interface AchievementContextType {
  achievements: Achievement[];
  loading: boolean;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'userId' | 'createdAt' | 'completedAt'>) => Promise<void>;
  updateAchievement: (id: string, updates: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  resetAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        const q = query(collection(db, 'achievements'), where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        const fetchedAchievements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Achievement[];
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'userId' | 'createdAt' | 'completedAt'>) => {
    if (!user) throw new Error('No user logged in');

    const newAchievement = {
      ...achievement,
      userId: user.id,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    const docRef = await addDoc(collection(db, 'achievements'), newAchievement);
    setAchievements(prev => [...prev, { ...newAchievement, id: docRef.id }]);
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    if (!user) throw new Error('No user logged in');

    await updateDoc(doc(db, 'achievements', id), updates);
    setAchievements(prev => prev.map(achievement => 
      achievement.id === id ? { ...achievement, ...updates } : achievement
    ));
  };

  const deleteAchievement = async (id: string) => {
    if (!user) throw new Error('No user logged in');

    await deleteDoc(doc(db, 'achievements', id));
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  const resetAchievements = async () => {
    if (!user) throw new Error('No user logged in');

    try {
      const q = query(collection(db, 'achievements'), where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      // Delete all achievements
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      
      setAchievements([]);
    } catch (error) {
      console.error('Error resetting achievements:', error);
      throw error;
    }
  };

  return (
    <AchievementContext.Provider value={{ achievements, loading, addAchievement, updateAchievement, deleteAchievement, resetAchievements }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
} 