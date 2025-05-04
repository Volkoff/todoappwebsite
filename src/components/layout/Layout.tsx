import { ReactNode } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, signOut } = useUser();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`${styles.layout} ${isDarkMode ? styles.dark : ''}`}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
} 