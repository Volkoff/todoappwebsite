import { useUser } from '../context/UserContext';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.userHeader}>
          <h2 className={styles.username}>{user.username}</h2>
          <button className={styles.userButton}>
            <span className="material-icons">person</span>
          </button>
        </div>
        <div className={styles.stats}>
          <div className={`${styles.statCard} ${styles.pointsCard}`}>
            <p className={styles.statLabel}>Points</p>
            <p className={styles.statValue}>{user.points}</p>
          </div>
          <div className={`${styles.statCard} ${styles.streakCard}`}>
            <p className={styles.statLabel}>Current Streak</p>
            <p className={styles.statValue}>{user.streak} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}