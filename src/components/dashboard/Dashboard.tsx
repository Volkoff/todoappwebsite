import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTasks } from '../../context/TasksContext';
import { useAchievements } from '../../context/AchievementContext';
import styles from './Dashboard.module.css';
import TaskList from '../tasks/TaskList';
import { Task } from '../../types';

export default function Dashboard() {
  const { user, signOut } = useUser();
  const { tasks } = useTasks();
  const { achievements } = useAchievements();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await user?.delete();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = pendingTasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = pendingTasks.filter(task => task.priority === 'low');

  const completedAchievements = achievements.filter(achievement => achievement.completed);
  const lockedAchievements = achievements.filter(achievement => !achievement.completed);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Welcome, {user?.displayName || 'User'}!</h1>
          <div className={styles.headerButtons}>
            <button className={styles.calendarButton}>
              <span className="material-icons">calendar_today</span>
              Calendar
            </button>
            <button className={styles.addButton} onClick={() => navigate('/tasks')}>
              <span className="material-icons">add</span>
              Add Task
            </button>
          </div>
        </div>
        <div className={styles.accountSection}>
          <div className={styles.accountInfo}>
            <span className="material-icons">account_circle</span>
            <span>{user?.email}</span>
          </div>
          <button className={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <h3>Tasks</h3>
                <button className={styles.infoButton} title="Total number of tasks">
                  <span className="material-icons">info</span>
                </button>
              </div>
              <p>{tasks.length}</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <h3>Completed</h3>
                <button className={styles.infoButton} title="Number of completed tasks">
                  <span className="material-icons">info</span>
                </button>
              </div>
              <p>{completedTasks.length}</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <h3>Achievements</h3>
                <button className={styles.infoButton} title="Number of unlocked achievements">
                  <span className="material-icons">info</span>
                </button>
              </div>
              <p>{completedAchievements.length}</p>
            </div>
          </div>

          <div className={styles.tasksSection}>
            <h2>Recent Tasks</h2>
            <TaskList tasks={tasks.slice(0, 5)} />
          </div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <h2>Task Priority</h2>
            <div className={styles.profileInfo}>
              <p><strong>High Priority:</strong> {highPriorityTasks.length}</p>
              <p><strong>Medium Priority:</strong> {mediumPriorityTasks.length}</p>
              <p><strong>Low Priority:</strong> {lowPriorityTasks.length}</p>
            </div>
          </div>

          <div className={styles.profileCard}>
            <h2>Achievement Progress</h2>
            <div className={styles.profileInfo}>
              <p><strong>Completed:</strong> {completedAchievements.length}</p>
              <p><strong>Locked:</strong> {lockedAchievements.length}</p>
              <p><strong>Total:</strong> {achievements.length}</p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={styles.deleteConfirm}>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className={styles.deleteActions}>
            <button className={styles.confirmDeleteButton} onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button className={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 