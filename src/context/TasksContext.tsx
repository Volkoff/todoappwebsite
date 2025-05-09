import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Task } from '../types';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType>({
  tasks: [],
  loading: true,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  toggleTask: async () => {},
});

export function useTasks() {
  return useContext(TasksContext);
}

interface TasksProviderProps {
  children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
  const { user } = useAuth();
  const { userData, updateUserData } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTask = {
      ...task,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'tasks'), newTask);
  };

  const calculatePoints = (task: Task) => {
    const basePoints = 10;
    const priorityMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2
    };
    return Math.floor(basePoints * priorityMultiplier[task.priority]);
  };

  const updateStreak = async () => {
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    const lastTaskDate = userData.lastTaskDate ? new Date(userData.lastTaskDate).toISOString().split('T')[0] : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = userData.currentStreak;
    let newBestStreak = userData.bestStreak;

    if (!lastTaskDate || lastTaskDate === yesterday) {
      // Continue streak
      newStreak += 1;
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }
    } else if (lastTaskDate !== today) {
      // Break streak
      newStreak = 1;
    }

    await updateUserData({
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastTaskDate: today
    });
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id);
    const currentTask = tasks.find(t => t.id === id);
    
    if (!currentTask) return;

    const isCompleting = task.completed && !currentTask.completed;
    const updates: Partial<Task> = {
      ...task,
      completedAt: isCompleting ? new Date().toISOString() : (task.completedAt || null)
    };

    await updateDoc(taskRef, updates);
    
    // Update local state
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));

    // If the task is being marked as completed, update points and streak
    if (isCompleting && userData) {
      const pointsEarned = calculatePoints(currentTask);
      await updateUserData({
        tasksCompleted: userData.tasksCompleted + 1,
        points: (userData.points || 0) + pointsEarned
      });
      await updateStreak();
    }
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !userData) {
      console.log('No task or userData found:', { task, userData });
      return;
    }

    const isCompleting = !task.completed;
    const updates: Partial<Task> = {
      completed: isCompleting,
      completedAt: isCompleting ? new Date().toISOString() : null
    };

    console.log('Toggling task:', { task, isCompleting, updates });

    try {
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
      
      // Update local state
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));

      // If the task is being marked as completed, update points and streak
      if (isCompleting) {
        const pointsEarned = calculatePoints(task);
        const newPoints = (userData.points || 0) + pointsEarned;
        const newTasksCompleted = (userData.tasksCompleted || 0) + 1;
        
        console.log('Updating user data:', {
          currentPoints: userData.points,
          pointsEarned,
          newPoints,
          currentTasksCompleted: userData.tasksCompleted,
          newTasksCompleted
        });

        // Update points and tasks completed first
        await updateUserData({
          tasksCompleted: newTasksCompleted,
          points: newPoints
        });
        console.log('User data updated successfully');

        // Then update streak
        await updateStreak();
        console.log('Streak updated successfully');
      }
    } catch (error) {
      console.error('Error updating task or user data:', error);
      throw error;
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TasksContext.Provider>
  );
} 