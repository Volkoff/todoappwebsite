import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { user, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <button 
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-icons">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
        {!isCollapsed && <h1 className={styles.title}>Task Manager</h1>}
      </div>

      <nav className={styles.nav}>
        <Link 
          to="/dashboard" 
          className={`${styles.navItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <span className="material-icons">dashboard</span>
          {!isCollapsed && <span>Dashboard</span>}
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
        <div className={styles.userInfo}>
          <Link 
            to="/profile" 
            className={`${styles.profileLink} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            <span className="material-icons">account_circle</span>
            {!isCollapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.displayName}</span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
            )}
          </Link>
        </div>
        <div className={styles.actions}>
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
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <span className="material-icons">logout</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
} 