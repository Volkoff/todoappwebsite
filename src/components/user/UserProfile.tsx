import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import styles from './UserProfile.module.css';

const BADGES = [
  {
    id: 'first_task',
    name: 'First Task',
    description: 'Complete your first task',
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
  },
  {
    id: 'streak_7',
    name: 'Unstoppable',
    description: 'Maintain a 7-day streak',
  },
  {
    id: 'streak_30',
    name: 'Machine',
    description: 'Maintain a 30-day streak',
  },
  {
    id: 'streak_90',
    name: 'Dedicated',
    description: 'Maintain a 90-day streak',
  },
  {
    id: 'streak_180',
    name: 'Legend',
    description: 'Maintain a 180-day streak',
  },
  {
    id: 'streak_365',
    name: 'Immortal',
    description: 'Maintain a 365-day streak',
  },
  {
    id: 'points_100',
    name: 'Century Club',
    description: 'Earn 100 points',
  },
  {
    id: 'points_200',
    name: 'Double Century',
    description: 'Earn 200 points',
  },
  {
    id: 'points_300',
    name: 'Triple Century',
    description: 'Earn 300 points',
  },
  {
    id: 'points_400',
    name: 'Quad Century',
    description: 'Earn 400 points',
  },
  {
    id: 'points_500',
    name: 'Half Millennium',
    description: 'Earn 500 points',
  },
  {
    id: 'points_600',
    name: 'Six Hundred',
    description: 'Earn 600 points',
  },
  {
    id: 'points_700',
    name: 'Seven Hundred',
    description: 'Earn 700 points',
  },
  {
    id: 'points_800',
    name: 'Eight Hundred',
    description: 'Earn 800 points',
  },
  {
    id: 'points_900',
    name: 'Nine Hundred',
    description: 'Earn 900 points',
  },
  {
    id: 'points_1000',
    name: 'Millennium',
    description: 'Earn 1000 points',
  },
];

export default function UserProfile() {
  const { user, loading } = useUser();
  const [showAllBadges, setShowAllBadges] = useState(false);

  if (loading) {
    return (
      <div className={styles.profile}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profile}>
        <div className={styles.error}>Please sign in to view your profile</div>
      </div>
    );
  }

  const displayedBadges = showAllBadges ? BADGES : BADGES.slice(0, 4);

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

      <div className={styles.badges}>
        <div className={styles.badgesHeader}>
          <h3 className={styles.badgesTitle}>Badges</h3>
          <button
            onClick={() => setShowAllBadges(!showAllBadges)}
            className={styles.viewAllButton}
          >
            {showAllBadges ? 'Show Less' : 'View All Achievements'}
          </button>
        </div>
        <div className={styles.badgesGrid}>
          {displayedBadges.map(badge => {
            const unlockedBadge = user.badges.find(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`${styles.badge} ${unlockedBadge ? styles.unlocked : ''}`}
              >
                <div className={styles.badgeIcon}>
                  <span className="material-icons">
                    {unlockedBadge ? 'stars' : 'star_border'}
                  </span>
                </div>
                <div className={styles.badgeInfo}>
                  <h4 className={styles.badgeName}>{badge.name}</h4>
                  <p className={styles.badgeDescription}>{badge.description}</p>
                  {unlockedBadge?.unlockedAt && (
                    <p className={styles.badgeDate}>
                      Unlocked: {new Date(unlockedBadge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 