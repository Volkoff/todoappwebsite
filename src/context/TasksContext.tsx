import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { Task } from '../types';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  resetTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const userDoc = doc(db, 'users', user.id);
        const tasksRef = collection(userDoc, 'tasks');
        const q = query(tasksRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('No user logged in');

    const newTask = {
      ...task,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const userDoc = doc(db, 'users', user.id);
    const tasksRef = collection(userDoc, 'tasks');
    const docRef = await addDoc(tasksRef, newTask);
    setTasks(prev => [...prev, { ...newTask, id: docRef.id }]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) throw new Error('No user logged in');

    const userDoc = doc(db, 'users', user.id);
    const taskDoc = doc(userDoc, 'tasks', id);
    await updateDoc(taskDoc, updates);
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('No user logged in');

    const userDoc = doc(db, 'users', user.id);
    const taskDoc = doc(userDoc, 'tasks', id);
    await deleteDoc(taskDoc);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = async (id: string) => {
    if (!user) throw new Error('No user logged in');

    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');

    const updates = {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };

    const userDoc = doc(db, 'users', user.id);
    const taskDoc = doc(userDoc, 'tasks', id);
    await updateDoc(taskDoc, updates);
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const resetTasks = async () => {
    if (!user) throw new Error('No user logged in');

    try {
      const userDoc = doc(db, 'users', user.id);
      const tasksRef = collection(userDoc, 'tasks');
      const q = query(tasksRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      // Delete all tasks
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      
      setTasks([]);
    } catch (error) {
      console.error('Error resetting tasks:', error);
      throw error;
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleTask, resetTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
} 