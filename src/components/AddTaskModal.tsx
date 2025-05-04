import { useState } from 'react';
import { Task } from '../types';
import styles from './AddTaskModal.module.css';

type TaskPriority = 'low' | 'medium' | 'high';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    deadline: '',
  });

  const [errors, setErrors] = useState<{
    title?: string;
    priority?: string;
    deadline?: string;
  }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!taskData.title.trim()) {
      newErrors.title = 'Task name is required';
    }
    if (!taskData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!taskData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddTask(taskData);
      setTaskData({ title: '', description: '', priority: 'medium', deadline: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Task</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <input
              type="text"
              value={taskData.title}
              onChange={e => {
                setTaskData(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="Task name"
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
            />
            {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
          </div>
          <div>
            <textarea
              value={taskData.description}
              onChange={e => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task description (optional)"
              className={styles.textarea}
              rows={3}
            />
          </div>
          <div>
            <select
              value={taskData.priority}
              onChange={e => {
                setTaskData(prev => ({ ...prev, priority: e.target.value as TaskPriority }));
                if (errors.priority) {
                  setErrors(prev => ({ ...prev, priority: undefined }));
                }
              }}
              className={`${styles.input} ${errors.priority ? styles.error : ''}`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            {errors.priority && <p className={styles.errorMessage}>{errors.priority}</p>}
          </div>
          <div>
            <input
              type="date"
              value={taskData.deadline}
              onChange={e => {
                setTaskData(prev => ({ ...prev, deadline: e.target.value }));
                if (errors.deadline) {
                  setErrors(prev => ({ ...prev, deadline: undefined }));
                }
              }}
              className={`${styles.input} ${errors.deadline ? styles.error : ''}`}
            />
            {errors.deadline && <p className={styles.errorMessage}>{errors.deadline}</p>}
          </div>
          <button type="submit" className={styles.submitButton}>
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
} 