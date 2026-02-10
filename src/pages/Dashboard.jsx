import { useState, useEffect, useMemo } from 'react';
import { Plus, LogOut, Layout, Filter, ArrowUpDown } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

/**
 * Dashboard Component
 * Main interface for the application. Handles task list management, persistence,
 * filtering, sorting, and user session control.
 * 
 * @param {Object} props
 * @param {Object} props.user - Current logged-in user
 * @param {Function} props.onLogout - Handler to clear user session
 */
export default function Dashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    // Filtering & Sorting State
    const [filterType, setFilterType] = useState('all'); // 'all', 'important', 'pending', 'completed'
    const [sortBy, setSortBy] = useState('date'); // 'date', 'alpha', 'color'

    // Load tasks on mount
    useEffect(() => {
        const storeKey = `taskApp_tasks_${user.username}`;
        const stored = localStorage.getItem(storeKey);
        if (stored) {
            setTasks(JSON.parse(stored));
        }
    }, [user.username]);

    /**
     * Persist tasks to LocalStorage and update state
     * @param {Array} updatedTasks - New array of tasks
     */
    const saveTasks = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem(`taskApp_tasks_${user.username}`, JSON.stringify(updatedTasks));
    };

    /**
     * Create a new task with default values.
     * New fields: 'important' (for priority), 'subtasks' (array).
     */
    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            completed: false,
            important: false, // Default: Yellow (Not important)
            createdAt: Date.now(),
            description: '',
            reward: '',
            subtasks: []
        };

        saveTasks([newTask, ...tasks]);
        setNewTaskTitle('');
    };

    /**
     * Toggle task completion status.
     */
    const handleToggleTask = (id) => {
        const updated = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updated);

        // Sync modal if open
        if (selectedTask && selectedTask.id === id) {
            setSelectedTask(prev => ({ ...prev, completed: !prev.completed }));
        }
    };

    /**
     * Delete a task by ID
     */
    const handleDeleteTask = (taskId) => {
        const updated = tasks.filter(t => t.id !== taskId);
        saveTasks(updated);
        if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(null);
        }
    };

    /**
     * Handle updates from the TaskModal (Edits, Subtasks, Rewards)
     */
    const handleUpdateTask = (updatedTask) => {
        const updated = tasks.map(t =>
            t.id === updatedTask.id ? updatedTask : t
        );
        saveTasks(updated);
        setSelectedTask(updatedTask);
    };

    /**
     * Process tasks: Filter -> Sort -> Return
     * Uses useMemo to avoid recalculating on every render.
     */
    const processedTasks = useMemo(() => {
        let result = [...tasks];

        // 1. FILTERING
        if (filterType === 'important') {
            result = result.filter(t => !t.completed && t.important);
        } else if (filterType === 'pending') {
            result = result.filter(t => !t.completed);
        } else if (filterType === 'completed') {
            result = result.filter(t => t.completed);
        }

        // 2. SORTING
        result.sort((a, b) => {
            if (sortBy === 'alpha') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'color') {
                // Logic: Importance (Red) > Normal (Yellow) > Completed (Green)
                // We assign a weight to each state
                const getWeight = (t) => {
                    if (t.completed) return 3;
                    if (t.important) return 1;
                    return 2;
                };
                return getWeight(a) - getWeight(b);
            }
            // Default: Date (Newest first)
            return b.createdAt - a.createdAt;
        });

        return result;
    }, [tasks, filterType, sortBy]);

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div className="container flex-between">
                    <div className="brand flex-center">
                        <Layout className="logo" size={24} />
                        <span>TaskMaster</span>
                    </div>
                    <div className="user-controls flex-center">
                        <span className="welcome">Hello, {user.username}</span>
                        <button onClick={onLogout} className="btn-icon" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container dash-main">
                {/* Input Section */}
                <div className="add-task-section card">
                    <form onSubmit={handleAddTask} className="flex-between">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="task-input"
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={!newTaskTitle.trim()}>
                            <Plus size={20} />
                            <span className="btn-text">Add</span>
                        </button>
                    </form>
                </div>

                {/* Controls Section */}
                <div className="controls-section flex-between">
                    <div className="control-group">
                        <Filter size={16} className="control-icon" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="control-select"
                        >
                            <option value="all">All Tasks</option>
                            <option value="important">Important (Red)</option>
                            <option value="pending">Pending (Yell/Red)</option>
                            <option value="completed">Done (Green)</option>
                        </select>
                    </div>
                    <div className="control-group">
                        <ArrowUpDown size={16} className="control-icon" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="control-select"
                        >
                            <option value="date">Date Created</option>
                            <option value="color">Priority (Red First)</option>
                            <option value="alpha">A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Task List */}
                <div className="task-list-section">
                    {processedTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks match your filter.</p>
                        </div>
                    ) : (
                        <div className="task-list">
                            {processedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggleTask}
                                    onClick={setSelectedTask}
                                    onDelete={handleDeleteTask}
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
        .dashboard-container { min-height: 100vh; background-color: var(--bg-app); padding-bottom: 2rem; }
        .dash-header { background: white; border-bottom: 1px solid var(--border-light); padding: 1rem 0; margin-bottom: 2rem; position: sticky; top: 0; z-index: 10; }
        .brand { gap: 0.75rem; font-weight: 700; font-size: 1.2rem; color: var(--primary); }
        .user-controls { gap: 1.5rem; }
        .welcome { font-weight: 500; color: var(--text-secondary); }
        .btn-icon { background: transparent; color: var(--text-muted); padding: 0.5rem; border-radius: var(--radius-sm); transition: var(--transition-fast); }
        .btn-icon:hover { background: var(--bg-app); color: var(--danger); }
        .dash-main { max-width: 800px; }
        
        /* Controls */
        .controls-section { margin-bottom: 1.5rem; padding: 0 0.5rem; }
        .control-group { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); }
        .control-select {
            padding: 0.5rem 2rem 0.5rem 1rem;
            border: 1px solid var(--border-light);
            border-radius: var(--radius-sm);
            background-color: white;
            font-size: 0.9rem;
            cursor: pointer;
            outline: none;
        }
        .control-select:focus { border-color: var(--primary); }

        /* Add Task */
        .add-task-section { margin-bottom: 2rem; border: none; box-shadow: var(--shadow-md); }
        .add-task-section form { gap: 1rem; }
        .task-input { flex: 1; padding: 0.75rem 1rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 1rem; outline: none; transition: var(--transition-fast); }
        .task-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .btn-text { display: none; }
        @media (min-width: 640px) { .btn-text { display: inline; } }

        .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); background: rgba(255,255,255,0.5); border-radius: var(--radius-md); border: 2px dashed var(--border-light); }
      `}</style>
        </div>
    );
}
