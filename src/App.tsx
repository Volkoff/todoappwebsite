import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { TasksProvider } from './context/TasksContext';
import { AchievementProvider } from './context/AchievementContext';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import EmailVerification from './components/auth/EmailVerification';
import Dashboard from './components/Dashboard';
import FullTaskList from './components/tasks/FullTaskList';
import Calendar from './components/calendar/Calendar';
import Achievements from './components/achievements/Achievements';
import Profile from './components/profile/Profile';
import Layout from './components/layout/Layout';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <TasksProvider>
              <AchievementProvider>
                <Routes>
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route
                    path="/verify-email"
                    element={
                      <PrivateRoute>
                        <EmailVerification />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="tasks" element={<FullTaskList />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Routes>
              </AchievementProvider>
            </TasksProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
