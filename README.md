# Game Task Manager

A modern task management application with gamification elements, built with React, TypeScript, and Firebase.

## Features

### Task Management
- Create, edit, and delete tasks
- Set task priority (low, medium, high)
- Add deadlines and descriptions
- Mark tasks as complete
- Calendar view for task deadlines
- Task filtering and organization

### User Features
- User authentication (sign up, sign in, sign out)
- User profiles
- Task completion tracking
- Streak tracking
- Achievement system

### Gamification
- Task completion streaks
- Achievement badges
- Progress tracking
- User statistics

## Project Structure

```
game-task-manager/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and other static files
│   │   ├── achievements/  # Achievement-related components
│   │   ├── calendar/      # Calendar components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── tasks/         # Task-related components
│   │   └── ui/            # General UI components
│   ├── config/            # Configuration files
│   ├── context/           # React context providers
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── package.json           # Project dependencies
└── README.md             # Project documentation
```

## Data Structure

### Firestore Collections

#### Users
```typescript
interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  tasksCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastTaskDate: string | null;
}
```

#### Tasks
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  userId: string;
}
```

#### Achievements
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  userId: string;
  createdAt: string;
  completedAt: string | null;
}
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd game-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and set up Firestore:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Set up security rules

4. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Firebase Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /achievements/{achievementId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- React
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- Material Icons
- React Router
- Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
