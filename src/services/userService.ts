import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';

export const userService = {
  async createUser(userId: string, userData: User) {
    try {
      await setDoc(doc(db, 'users', userId), userData);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getUser(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      await updateDoc(doc(db, 'users', userId), userData);
      return true;
    } catch (error) {
      return false;
    }
  },

  async updateUserProgress(userId: string, points: number, streak: number) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points,
        streak,
        lastCompletedDate: new Date().toISOString()
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}; 