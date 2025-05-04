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