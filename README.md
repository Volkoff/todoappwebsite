# Game Task Manager

A web application for task management with gamification features to boost productivity.

## Features

- Task management (add, edit, delete tasks)
- Priority levels and deadlines
- Dark/Light theme
- Gamification system:
  - Points for completed tasks
  - Daily streaks
  - Achievement badges
- Responsive design
- Local storage for data persistence

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Local Storage for data persistence

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

- `src/components/` - React components
- `src/types/` - TypeScript type definitions
- `src/App.tsx` - Main application component
- `src/index.css` - Global styles and Tailwind imports

## Features in Detail

### Task Management
- Add new tasks with title, priority, and deadline
- Mark tasks as complete
- Delete tasks
- Filter tasks by priority and deadline

### Gamification
- Earn points for completing tasks
- Maintain daily streaks
- Unlock badges for achievements:
  - First Task
  - 3-day Streak
  - 7-day Streak
  - 100 Points

### Theme
- Toggle between light and dark mode
- Theme preference is saved in local storage
