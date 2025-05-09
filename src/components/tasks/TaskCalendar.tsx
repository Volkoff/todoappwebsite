import { useState } from 'react';
import { Task } from '../../types';
import styles from './TaskCalendar.module.css';

interface TaskCalendarProps {
  tasks: Task[];
  onDateClick: (date: Date | null) => void;
  selectedDate: Date | null;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  showEditButton?: boolean;
}

export default function TaskCalendar({ 
  tasks, 
  onDateClick, 
  selectedDate,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onUpdateTask,
  showEditButton = true
}: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTask, setEditingTask] = useState<string | null>(null);

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

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentDate.getMonth();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear();
    });
  };

  const handleDateClick = (date: Date) => {
    onDateClick(date);
    setIsAddingTask(false);
    setEditingTask(null);
  };

  const handleAddTask = () => {
    if (!selectedDate || !newTaskTitle.trim()) return;

    const newTask: Partial<Task> = {
      title: newTaskTitle,
      priority: newTaskPriority,
      deadline: selectedDate.toISOString(),
      description: '',
      completed: false,
    };

    onEditTask(newTask as Task);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setIsAddingTask(false);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onEditTask(task);
      onDateClick(null);
    }
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTaskTitle.trim()) return;

    const task = tasks.find(t => t.id === editingTask);
    if (task) {
      onEditTask({
        ...task,
        title: newTaskTitle,
        priority: newTaskPriority,
      });
    }

    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setEditingTask(null);
  };

  const renderDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
      const dayTasks = getTasksForDate(prevMonthDate);
      days.unshift(
        <div
          key={`empty-${i}`}
          className={`${styles.day} ${styles.otherMonth}`}
          onClick={() => handleDateClick(prevMonthDate)}
        >
          <span className={styles.dayNumber}>{prevMonthDate.getDate()}</span>
          {dayTasks.length > 0 && (
            <div className={styles.taskList}>
              {dayTasks.slice(0, 4).map(task => (
                <div 
                  key={task.id} 
                  className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 4 && (
                <div className={styles.taskItem}>
                  +{dayTasks.length - 4} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isTodayDate = isToday(date);
      const isSelectedDate = isSelected(date);

      days.push(
        <div
          key={day}
          className={`${styles.day} ${isTodayDate ? styles.today : ''} ${isSelectedDate ? styles.selected : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {dayTasks.length > 0 && (
            <div className={styles.taskList}>
              {dayTasks.slice(0, 4).map(task => (
                <div 
                  key={task.id} 
                  className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 4 && (
                <div className={styles.taskItem}>
                  +{dayTasks.length - 4} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navButton}>
          <span className="material-icons">chevron_left</span>
        </button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className={styles.navButton}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div className={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>
      <div className={styles.days}>
        {renderDays()}
      </div>
      {selectedDate && (
        <div className={styles.taskPopup}>
          <div className={styles.taskPopupHeader}>
            <h3>
              {selectedDate.toLocaleDateString('default', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button onClick={() => onDateClick(null)} className={styles.closeButton}>
              <span className="material-icons">close</span>
            </button>
          </div>
          {!isAddingTask && !editingTask ? (
            <>
              <div className={styles.tasksList}>
                {getTasksForDate(selectedDate).map(task => (
                  <div key={task.id} className={styles.taskItem}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={`${styles.priority} ${styles[`priority${task.priority}`]}`}>
                      {task.priority}
                    </span>
                    <div className={styles.taskActions}>
                      {showEditButton && (
                        <button 
                          onClick={() => handleEditTask(task.id)}
                          className={styles.editButton}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className={styles.deleteButton}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className={styles.addTaskButton}
                onClick={() => setIsAddingTask(true)}
              >
                <span className="material-icons">add</span>
                Add New Task
              </button>
            </>
          ) : (
            <div className={styles.addTaskForm}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className={styles.taskInput}
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className={styles.prioritySelect}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className={styles.formActions}>
                <button 
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className={styles.submitButton}
                  disabled={!newTaskTitle.trim()}
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button 
                  onClick={() => {
                    setIsAddingTask(false);
                    setEditingTask(null);
                    setNewTaskTitle('');
                    setNewTaskPriority('medium');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 