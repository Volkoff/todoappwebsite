import { useTasks } from '../../context/TasksContext';
import { useAchievements } from '../../context/AchievementContext';
import TaskList from '../tasks/TaskList';
import AchievementList from '../achievements/AchievementList';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { tasks } = useTasks();
  const { achievements } = useAchievements();

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const recentAchievements = achievements.slice(0, 3);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
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

      <div className={styles.grid}>
        <div className={styles.column}>
          <h2>Pending Tasks</h2>
          <TaskList tasks={pendingTasks} />
        </div>

        <div className={styles.column}>
          <h2>Completed Tasks</h2>
          <TaskList tasks={completedTasks} />
        </div>

        <div className={styles.column}>
          <h2>Recent Achievements</h2>
          <AchievementList achievements={recentAchievements} />
        </div>
      </div>
    </div>
  );
} 