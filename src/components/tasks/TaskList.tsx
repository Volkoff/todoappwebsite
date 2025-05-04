import { useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { Task } from '../../types';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { ...task, completed: !task.completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const isPastDue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className="material-icons">task_alt</span>
        <h3>No tasks yet</h3>
        <p>Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {tasks.map(task => (
        <div key={task.id} className={styles.taskItem}>
          <div className={styles.taskContent}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.taskInfo}>
              <h3 className={task.completed ? styles.completed : ''}>{task.title}</h3>
              {task.description && <p className={styles.description}>{task.description}</p>}
              <div className={styles.taskMeta}>
                <span className={`${styles.priority} ${styles[task.priority]}`}>
                  {task.priority}
                </span>
                {task.deadline && (
                  <span className={`${styles.deadline} ${isPastDue(task.deadline) ? styles.pastDue : ''}`}>
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.taskActions}>
              <button
                onClick={() => setEditingTask(task)}
                className={styles.editButton}
                title="Edit task"
              >
                <span className="material-icons">edit</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(task.id)}
                className={styles.deleteButton}
                title="Delete task"
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {showDeleteConfirm && (
        <div className={styles.deleteConfirm}>
          <p>Are you sure you want to delete this task?</p>
          <div className={styles.deleteActions}>
            <button
              onClick={() => handleDelete(showDeleteConfirm)}
              className={styles.confirmDeleteButton}
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className={styles.cancelDeleteButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 