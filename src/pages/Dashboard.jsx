import { useState, useEffect } from 'react';
import { Plus, LogOut, Layout } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

export default function Dashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        // Load tasks for this user (simple keying by user name for mock)
        const storeKey = `taskApp_tasks_${user.name}`;
        const stored = localStorage.getItem(storeKey);
        if (stored) {
            setTasks(JSON.parse(stored));
        }
    }, [user.name]);

    const saveTasks = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem(`taskApp_tasks_${user.name}`, JSON.stringify(updatedTasks));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            completed: false,
            createdAt: Date.now(),
            description: '',
            reward: ''
        };

        // Add to beginning of list (or end, but sorting usually handles it)
        const updated = [newTask, ...tasks];
        saveTasks(updated);
        setNewTaskTitle('');
    };

    const handleToggleTask = (id) => {
        const updated = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updated);

        // Also update selected task if it's open
        if (selectedTask && selectedTask.id === id) {
            setSelectedTask({ ...selectedTask, completed: !selectedTask.completed });
        }
    };

    const handleUpdateTask = (updatedTask) => {
        const updated = tasks.map(t =>
            t.id === updatedTask.id ? updatedTask : t
        );
        saveTasks(updated);
        setSelectedTask(updatedTask);
    };

    // Sort: Pending first, then by creation (newest first)
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
            return b.createdAt - a.createdAt;
        }
        return a.completed ? 1 : -1;
    });

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div className="container flex-between">
                    <div className="brand flex-center">
                        <Layout className="logo" size={24} />
                        <span>TaskMaster</span>
                    </div>
                    <div className="user-controls flex-center">
                        <span className="welcome">Hello, {user.name}</span>
                        <button onClick={onLogout} className="btn-icon" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container dash-main">
                <div className="add-task-section card">
                    <form onSubmit={handleAddTask} className="flex-between">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="task-input"
                        />
                        <button type="submit" className="btn btn-primary">
                            <Plus size={20} />
                            <span className="btn-text">Add</span>
                        </button>
                    </form>
                </div>

                <div className="task-list-section">
                    <h3>Your Tasks</h3>
                    {sortedTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks yet. Add one above!</p>
                        </div>
                    ) : (
                        <div className="task-list">
                            {sortedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggleTask}
                                    onClick={setSelectedTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={handleUpdateTask}
                />
            )}

            <style>{`
        .dashboard-container {
            min-height: 100vh;
            background-color: var(--bg-app);
            padding-bottom: 2rem;
        }
        .dash-header {
            background: white;
            border-bottom: 1px solid var(--border-light);
            padding: 1rem 0;
            margin-bottom: 2rem;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .brand {
            gap: 0.75rem;
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--primary);
        }
        .user-controls {
            gap: 1.5rem;
        }
        .welcome {
            font-weight: 500;
            color: var(--text-secondary);
        }
        .btn-icon {
            background: transparent;
            color: var(--text-muted);
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            transition: var(--transition-fast);
        }
        .btn-icon:hover {
            background: var(--bg-app);
            color: var(--danger);
        }

        .dash-main {
            max-width: 800px;
        }

        .add-task-section {
            margin-bottom: 2rem;
            border: none;
            box-shadow: var(--shadow-md);
        }
        .add-task-section form {
            gap: 1rem;
        }
        .task-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            font-size: 1rem;
            outline: none;
            transition: var(--transition-fast);
        }
        .task-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
        }
        .btn-text {
            display: none;
        }
        @media (min-width: 640px) {
            .btn-text { display: inline; }
        }

        .task-list-section h3 {
            margin-bottom: 1rem;
            color: var(--text-secondary);
            font-size: 1.1rem;
        }
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
            background: rgba(255,255,255,0.5);
            border-radius: var(--radius-md);
            border: 2px dashed var(--border-light);
        }
      `}</style>
        </div>
    );
}
