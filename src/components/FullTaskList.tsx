import { useState } from 'react';
import { useTasks } from '../context/TasksContext';
import { Task } from '../types';
import styles from './FullTaskList.module.css';

export default function FullTaskList() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <div className={styles.taskList}>
      {tasks.map(task => (
        <div
          key={task.id}
          className={`${styles.taskItem} ${styles[`taskItem${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]} ${task.completed ? styles.completed : ''}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            className={styles.checkbox}
          />
          <div className={styles.taskContent}>
            <div className={styles.taskHeader}>
              <span className={styles.taskTitle}>{task.title}</span>
              <div className={styles.taskMeta}>
                <span className={`${styles.priority} ${styles[`priority${task.priority}`]}`}>
                  {task.priority}
                </span>
                <span className={styles.taskDate}>
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            {task.description && (
              <p className={styles.taskDescription}>{task.description}</p>
            )}
          </div>
          <div className={styles.taskActions}>
            <button
              onClick={() => handleEditTask(task)}
              className={styles.editButton}
            >
              <span className="material-icons">edit</span>
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className={styles.deleteButton}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 