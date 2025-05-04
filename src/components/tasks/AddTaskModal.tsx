import { useState, useEffect } from 'react';
import { Task } from '../../types';
import styles from './AddTaskModal.module.css';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  onUpdate: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  editingTask: Task | null;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      if (editingTask.deadline) {
        const deadline = new Date(editingTask.deadline);
        setDate(deadline.toISOString().split('T')[0]);
        setTime(deadline.toTimeString().slice(0, 5));
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDate('');
      setTime('12:00');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deadline = date && time ? new Date(`${date}T${time}`).toISOString() : '';

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
      completed: editingTask?.completed || false,
      completedAt: editingTask?.completed ? editingTask.completedAt : null
    };

    if (editingTask) {
      onUpdate(taskData);
    } else {
      onAdd(taskData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 