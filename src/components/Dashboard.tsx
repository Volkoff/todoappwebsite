import React from 'react';
import styles from './Dashboard.module.css';
import TaskCalendar from './tasks/TaskCalendar';
import FullTaskList from './tasks/FullTaskList';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';

const Dashboard: React.FC = () => {
  const { tasks, toggleTask, deleteTask, updateTask } = useTasks();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateClick = (date: Date | null) => {
    setSelectedDate(date);
  };

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
          <div className={styles.statValue}>7 days</div>
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
          <div className={styles.statValue}>1,250</div>
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
          <div className={styles.statValue}>5</div>
        </div>
      </div>

      <div className={styles.content}>
        <TaskCalendar 
          tasks={tasks}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
        <FullTaskList />
      </div>
    </div>
  );
};

export default Dashboard; 