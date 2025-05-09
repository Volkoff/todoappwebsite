import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          <span className="material-icons">task_alt</span>
          <h1>Game Task Manager</h1>
        </Link>

        <div className={styles.navLinks}>
          <Link 
            to="/tasks" 
            className={`${styles.navLink} ${location.pathname === '/tasks' ? styles.active : ''}`}
          >
            <span className="material-icons">calendar_today</span>
            Tasks
          </Link>
          <Link 
            to="/profile" 
            className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            <span className="material-icons">person</span>
            Profile
          </Link>
        </div>

        <div className={styles.navActions}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeButton}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-icons">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          {user ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button 
                className={styles.userButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="material-icons">account_circle</span>
                <span className={styles.userName}>{user.displayName || user.email}</span>
              </button>
              <div className={`${styles.dropdown} ${isDropdownOpen ? styles.show : ''}`}>
                <Link 
                  to="/profile" 
                  className={styles.dropdownItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-icons">person</span>
                  Profile
                </Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <span className="material-icons">logout</span>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              <span className="material-icons">login</span>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 