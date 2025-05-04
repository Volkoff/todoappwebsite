import React from 'react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <div className={styles.settingsContent}>
        <div className={styles.settingGroup}>
          <h2>Appearance</h2>
          <div className={styles.settingItem}>
            <label>Dark Mode</label>
            <button className={styles.toggleButton}>
              <span className="material-icons">toggle_on</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 