import { Theme } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onCalendarToggle: () => void;
}

export default function Header({ theme, onThemeToggle, onCalendarToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <h1 className={styles.title}>Game Task Manager</h1>
        <div className={styles.headerActions}>
          <button
            onClick={onCalendarToggle}
            className={styles.iconButton}
            title="View Calendar"
          >
            <span className="material-icons">calendar_month</span>
          </button>
          <button
            onClick={onThemeToggle}
            className={styles.themeButton}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
} 