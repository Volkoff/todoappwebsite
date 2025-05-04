import { Achievement } from '../../types';
import styles from './AchievementList.module.css';

interface AchievementListProps {
  achievements: Achievement[];
}

export default function AchievementList({ achievements }: AchievementListProps) {
  return (
    <div className={styles.achievementList}>
      {achievements.map(achievement => (
        <div 
          key={achievement.id} 
          className={`${styles.achievement} ${achievement.completed ? styles.completed : styles.locked}`}
        >
          <div className={styles.icon}>
            <span className="material-icons">
              {achievement.completed ? 'emoji_events' : 'lock'}
            </span>
          </div>
          <div className={styles.details}>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 