export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  tasksCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastTaskDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  icon?: string;
}

export type Theme = 'light' | 'dark'; 