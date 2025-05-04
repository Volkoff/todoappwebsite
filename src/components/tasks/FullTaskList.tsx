import { useState } from 'react';
import { useTasks } from '../../context/TasksContext';
import { useUser } from '../../context/UserContext';
import { Task } from '../../types';
import AddTaskModal from './AddTaskModal';
import TaskCalendar from './TaskCalendar';
import styles from './FullTaskList.module.css';

export default function FullTaskList() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'userId'>) => {
    addTask(task);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'userId'>) => {
    if (!editingTask) return;
    updateTask(editingTask.id, task);
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
  };

  const handleDateClick = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.fullTaskList}>
      <div className={styles.header}>
        <h1>Task Calendar</h1>
        <div className={styles.headerButtons}>
          <button 
            className={styles.addButton}
            onClick={() => {
              setEditingTask({
                id: '',
                title: '',
                description: '',
                priority: 'medium',
                deadline: selectedDate ? selectedDate.toISOString() : '',
                completed: false,
                createdAt: new Date().toISOString(),
                userId: user?.id || '',
              });
              setIsModalOpen(true);
            }}
          >
            <span className="material-icons">add</span>
            Add New Task
          </button>
        </div>
      </div>

      <TaskCalendar 
        tasks={tasks}
        onDateClick={handleDateClick}
        selectedDate={selectedDate}
        onToggleTask={handleToggleTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onAdd={handleAddTask}
          onUpdate={handleUpdateTask}
          editingTask={editingTask}
        />
      )}
    </div>
  );
} 