import { useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import styles from './Calendar.module.css';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Calendar({ isOpen, onClose }: CalendarProps) {
  const { tasks, addTask, deleteTask, updateTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddingTask(false);
    setEditingTask(null);
  };

  const handleAddTask = () => {
    if (!selectedDate || !newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      deadline: selectedDate.toISOString(),
      description: '',
      completed: false,
    });

    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setIsAddingTask(false);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNewTaskTitle(task.title);
      setNewTaskPriority(task.priority);
    }
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTaskTitle.trim()) return;

    updateTask(editingTask, {
      title: newTaskTitle,
      priority: newTaskPriority,
    });

    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setEditingTask(null);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tasksForDay = getTasksForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div 
          key={day} 
          className={`${styles.day} ${isToday ? styles.today : ''} ${tasksForDay.length > 0 ? styles.hasTasks : ''} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {tasksForDay.length > 0 && (
            <div className={styles.taskList}>
              {tasksForDay.map(task => (
                <div 
                  key={task.id} 
                  className={`${styles.taskItem} ${styles[`taskItem${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]} ${task.completed ? styles.completed : ''}`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.calendar} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <button onClick={previousMonth} className={styles.navButton}>
            <span className="material-icons">chevron_left</span>
          </button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className={styles.navButton}>
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
        <div className={styles.weekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>
        <div className={styles.days}>
          {renderCalendarDays()}
        </div>
        {selectedDate && (
          <div className={styles.dateDetails}>
            <h3>
              {selectedDate.toLocaleDateString('default', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className={styles.existingTasks}>
              <h4>Existing Tasks</h4>
              <div className={styles.tasksList}>
                {getTasksForDate(selectedDate).map(task => (
                  <div key={task.id} className={styles.taskItem}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={`${styles.priority} ${styles[`priority${task.priority}`]}`}>
                      {task.priority}
                    </span>
                    <div className={styles.taskActions}>
                      <button 
                        onClick={() => handleEditTask(task.id)}
                        className={styles.editButton}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className={styles.deleteButton}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.taskManagement}>
              {!isAddingTask && !editingTask ? (
                <button 
                  className={styles.addTaskButton}
                  onClick={() => setIsAddingTask(true)}
                >
                  <span className="material-icons">add</span>
                  Add New Task
                </button>
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
          </div>
        )}
      </div>
    </div>
  );
} 