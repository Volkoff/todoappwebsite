import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import styles from './UserProfile.module.css';

const UserProfile: React.FC = () => {
  const { user, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
      setNewEmail(user.email);
    }
  }, [user]);

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.error}>Please sign in to view your profile</div>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>Profile</h2>
        <button 
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileSection}>
          <h3>Account Information</h3>
          {isEditing ? (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <button 
                className={styles.saveButton}
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className={styles.infoGroup}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>{user.username}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.profileSection}>
          <h3>Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{user.points}</span>
              <span className={styles.statLabel}>Total Points</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{user.streak}</span>
              <span className={styles.statLabel}>Current Streak</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{user.level}</span>
              <span className={styles.statLabel}>Level</span>
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3>Achievements</h3>
          <div className={styles.achievementsList}>
            {user.badges.map((badge) => (
              <div key={badge.id} className={styles.achievementItem}>
                <div className={styles.achievementIcon}>
                  {badge.icon}
                </div>
                <div className={styles.achievementInfo}>
                  <span className={styles.achievementName}>{badge.name}</span>
                  <span className={styles.achievementDescription}>
                    {badge.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 