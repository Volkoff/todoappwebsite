import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useTasks } from '../../context/TasksContext';
import { useAchievements } from '../../context/AchievementContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { userData, updateProfile } = useUser();
  const { resetTasks } = useTasks();
  const { resetAchievements } = useAchievements();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    email: userData?.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleResetStats = async () => {
    if (window.confirm('Are you sure you want to reset all your stats? This cannot be undone.')) {
      try {
        await resetTasks();
        await resetAchievements();
      } catch (error) {
        console.error('Error resetting stats:', error);
      }
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1>Profile Settings</h1>
      </div>

      <div className={styles.stats}>
        <h2>Your Stats</h2>
        <div className={styles.statCards}>
          <div className={styles.statCard}>
            <span className="material-icons">task_alt</span>
            <div className={styles.statInfo}>
              <h3>Tasks Completed</h3>
              <p>{userData?.tasksCompleted || 0}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className="material-icons">local_fire_department</span>
            <div className={styles.statInfo}>
              <h3>Current Streak</h3>
              <p>{userData?.currentStreak || 0} days</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className="material-icons">emoji_events</span>
            <div className={styles.statInfo}>
              <h3>Best Streak</h3>
              <p>{userData?.bestStreak || 0} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.settings}>
        <h2>Account Settings</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className="material-icons">person</span>
              <div>
                <h3>Display Name</h3>
                <p>{userData?.displayName}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className="material-icons">email</span>
              <div>
                <h3>Email</h3>
                <p>{userData?.email}</p>
              </div>
            </div>
            <button 
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <span className="material-icons">edit</span>
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className={styles.dangerZone}>
        <h2>Danger Zone</h2>
        <div className={styles.dangerCard}>
          <div className={styles.dangerInfo}>
            <h3>Reset All Stats</h3>
            <p>This will reset your tasks completed, streaks, and achievements.</p>
          </div>
          <button 
            className={styles.resetButton}
            onClick={handleResetStats}
          >
            <span className="material-icons">restart_alt</span>
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
} 