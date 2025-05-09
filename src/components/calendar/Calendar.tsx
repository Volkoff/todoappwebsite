import { useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import styles from './Calendar.module.css';

export default function Calendar() {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>
          <span className="material-icons">chevron_left</span>
        </button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className={styles.navButton}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div className={styles.weekdays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.days}>
        {emptyDays.map(day => (
          <div key={`empty-${day}`} className={styles.emptyDay} />
        ))}
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          return (
            <div key={day} className={styles.day}>
              <span className={styles.dayNumber}>{day}</span>
              {dayTasks.length > 0 && (
                <div className={styles.taskCount}>
                  {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 