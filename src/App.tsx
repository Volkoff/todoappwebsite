import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { TasksProvider } from './context/TasksContext';
import { AchievementProvider } from './context/AchievementContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FullTaskList from './components/tasks/FullTaskList';
import Achievements from './components/achievements/Achievements';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <TasksProvider>
            <AchievementProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="tasks" element={<FullTaskList />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AchievementProvider>
          </TasksProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}
