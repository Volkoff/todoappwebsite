import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        {!isCollapsed && <h1>Task Manager</h1>}
        <button 
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-icons">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      <nav className={styles.nav}>
        <Link 
          to="/" 
          className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}
        >
          <span className="material-icons">home</span>
          {!isCollapsed && <span>Home</span>}
        </Link>

        <Link 
          to="/tasks" 
          className={`${styles.navItem} ${location.pathname === '/tasks' ? styles.active : ''}`}
        >
          <span className="material-icons">task</span>
          {!isCollapsed && <span>Tasks</span>}
        </Link>

        <Link 
          to="/achievements" 
          className={`${styles.navItem} ${location.pathname === '/achievements' ? styles.active : ''}`}
        >
          <span className="material-icons">emoji_events</span>
          {!isCollapsed && <span>Achievements</span>}
        </Link>
      </nav>

      <div className={styles.footer}>
        <button 
          className={styles.themeButton}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="material-icons">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
          {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        {user && (
          <Link 
            to="/profile" 
            className={`${styles.profileButton} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            <span className="material-icons">person</span>
            {!isCollapsed && <span>{user.displayName || 'Profile'}</span>}
          </Link>
        )}
      </div>
    </div>
  );
} 