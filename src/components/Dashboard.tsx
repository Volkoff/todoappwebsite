import React, { useEffect } from 'react';
import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import { useUser } from '../context/UserContext';
import TaskList from './tasks/TaskList';

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const { userData } = useUser();

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (!userData) {
    console.log('No user data available in Dashboard');
    return <div>Loading...</div>;
  }

  console.log('Rendering Dashboard with points:', userData.points, 'streak:', userData.currentStreak);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <Link to="/achievements" className={styles.achievementsButton}>
          <span className="material-icons">emoji_events</span>
          View Achievements
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Current Streak</h3>
            <div className={styles.tooltip}>
              <span className="material-icons">info</span>
              <span className={styles.tooltipText}>
                Your current streak of consecutive days with completed tasks.
                Maintain it to earn achievements and bonus points!
              </span>
            </div>
          </div>
          <div className={styles.statValue}>
            {userData.currentStreak} days
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Points</h3>
            <div className={styles.tooltip}>
              <span className="material-icons">info</span>
              <span className={styles.tooltipText}>
                Earn points by completing tasks and maintaining streaks.
                Points contribute to your level and unlock achievements!
              </span>
            </div>
          </div>
          <div className={styles.statValue}>
            {userData.points}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3>Level</h3>
            <div className={styles.tooltip}>
              <span className="material-icons">info</span>
              <span className={styles.tooltipText}>
                Your current level based on total points earned.
                Level up to unlock new features and achievements!
              </span>
            </div>
          </div>
          <div className={styles.statValue}>
            {Math.floor(userData.points / 100)}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tasksSection}>
          <div className={styles.taskColumn}>
            <h2>Ongoing Tasks</h2>
            <TaskList tasks={pendingTasks} />
          </div>
          <div className={styles.taskColumn}>
            <h2>Completed Tasks</h2>
            <TaskList tasks={completedTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 