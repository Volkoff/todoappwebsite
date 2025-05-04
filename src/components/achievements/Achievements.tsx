import React from 'react';
import styles from './Achievements.module.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  streakRequired?: number;
  tasksRequired?: number;
  completed: boolean;
  category: 'streak' | 'tasks' | 'special';
}

const achievements: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day task completion streak',
    icon: '🔥',
    points: 100,
    streakRequired: 7,
    completed: false,
    category: 'streak'
  },
  {
    id: 'streak-14',
    title: 'Fortnight Fighter',
    description: 'Maintain a 14-day task completion streak',
    icon: '⚔️',
    points: 250,
    streakRequired: 14,
    completed: false,
    category: 'streak'
  },
  {
    id: 'streak-30',
    title: 'Month Master',
    description: 'Maintain a 30-day task completion streak',
    icon: '👑',
    points: 500,
    streakRequired: 30,
    completed: false,
    category: 'streak'
  },
  {
    id: 'streak-90',
    title: 'Quarter Champion',
    description: 'Maintain a 90-day task completion streak',
    icon: '🏆',
    points: 1000,
    streakRequired: 90,
    completed: false,
    category: 'streak'
  },
  {
    id: 'streak-365',
    title: 'Made of Steel',
    description: 'Maintain a 365-day task completion streak',
    icon: '💪',
    points: 5000,
    streakRequired: 365,
    completed: false,
    category: 'streak'
  },
  // Task Count Achievements
  {
    id: 'tasks-10',
    title: 'Task Tamer',
    description: 'Complete 10 tasks',
    icon: '✅',
    points: 50,
    tasksRequired: 10,
    completed: false,
    category: 'tasks'
  },
  {
    id: 'tasks-50',
    title: 'Task Titan',
    description: 'Complete 50 tasks',
    icon: '💪',
    points: 200,
    tasksRequired: 50,
    completed: false,
    category: 'tasks'
  },
  {
    id: 'tasks-100',
    title: 'Task Terminator',
    description: 'Complete 100 tasks',
    icon: '🎯',
    points: 500,
    tasksRequired: 100,
    completed: false,
    category: 'tasks'
  },
  {
    id: 'tasks-500',
    title: 'Task Legend',
    description: 'Complete 500 tasks',
    icon: '🌟',
    points: 2000,
    tasksRequired: 500,
    completed: false,
    category: 'tasks'
  },
  {
    id: 'tasks-1000',
    title: 'Task God',
    description: 'Complete 1000 tasks',
    icon: '👑',
    points: 5000,
    tasksRequired: 1000,
    completed: false,
    category: 'tasks'
  },
  // Special Achievements
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all tasks for 7 days straight',
    icon: '⭐',
    points: 300,
    streakRequired: 7,
    completed: false,
    category: 'special'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete 5 tasks before 9 AM',
    icon: '🌅',
    points: 150,
    tasksRequired: 5,
    completed: false,
    category: 'special'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete 5 tasks after 9 PM',
    icon: '🌙',
    points: 150,
    tasksRequired: 5,
    completed: false,
    category: 'special'
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Complete 10 tasks on weekends',
    icon: '🎉',
    points: 200,
    tasksRequired: 10,
    completed: false,
    category: 'special'
  },
  {
    id: 'priority-master',
    title: 'Priority Master',
    description: 'Complete 20 high-priority tasks',
    icon: '⚡',
    points: 300,
    tasksRequired: 20,
    completed: false,
    category: 'special'
  }
];

const Achievements: React.FC = () => {
  const completedAchievements = achievements.filter(a => a.completed);
  const incompleteAchievements = achievements.filter(a => !a.completed);

  return (
    <div className={styles.achievementsContainer}>
      <h1 className={styles.title}>Achievements</h1>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedAchievements.length}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{achievements.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {completedAchievements.reduce((sum, a) => sum + a.points, 0)}
          </span>
          <span className={styles.statLabel}>Points</span>
        </div>
      </div>

      <div className={styles.achievementsList}>
        <h2 className={styles.sectionTitle}>Completed Achievements</h2>
        <div className={styles.achievementsGrid}>
          {completedAchievements.map(achievement => (
            <div key={achievement.id} className={`${styles.achievement} ${styles.completed}`}>
              <span className={styles.icon}>{achievement.icon}</span>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p className={styles.achievementDescription}>{achievement.description}</p>
              <div className={styles.achievementPoints}>{achievement.points} points</div>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Incomplete Achievements</h2>
        <div className={styles.achievementsGrid}>
          {incompleteAchievements.map(achievement => (
            <div key={achievement.id} className={styles.achievement}>
              <span className={styles.icon}>{achievement.icon}</span>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p className={styles.achievementDescription}>{achievement.description}</p>
              <div className={styles.achievementPoints}>{achievement.points} points</div>
              {achievement.streakRequired && (
                <div className={styles.requirement}>
                  Streak Required: {achievement.streakRequired} days
                </div>
              )}
              {achievement.tasksRequired && (
                <div className={styles.requirement}>
                  Tasks Required: {achievement.tasksRequired}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements; 