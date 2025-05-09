import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Achievement } from '../types';

interface AchievementContextType {
  achievements: Achievement[];
  loading: boolean;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType>({
  achievements: [],
  loading: true,
  addAchievement: async () => {},
  updateAchievement: async () => {},
});

export function useAchievements() {
  return useContext(AchievementContext);
}

interface AchievementProviderProps {
  children: ReactNode;
}

export function AchievementProvider({ children }: AchievementProviderProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'achievements'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const achievementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Achievement[];
      setAchievements(achievementsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addAchievement = async (achievement: Omit<Achievement, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newAchievement = {
      ...achievement,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'achievements'), newAchievement);
  };

  const updateAchievement = async (id: string, achievement: Partial<Achievement>) => {
    const achievementRef = doc(db, 'achievements', id);
    await updateDoc(achievementRef, achievement);
  };

  return (
    <AchievementContext.Provider value={{ achievements, loading, addAchievement, updateAchievement }}>
      {children}
    </AchievementContext.Provider>
  );
} 