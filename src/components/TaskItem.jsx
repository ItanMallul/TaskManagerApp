import { Check, Star, Trash2 } from 'lucide-react';

/**
 * TaskItem Component
 * Renders a single task in the list with color coding and interaction handlers.
 * 
 * Logic for Colors:
 * - Green (Completed): Task is done.
 * - Red (Important): Task is pending and marked as important.
 * - Yellow (Normal): Task is pending and not important (Default).
 * 
 * @param {Object} props
 * @param {Object} props.task - The task data object
 * @param {Function} props.onToggle - Handler to toggle completion status
 * @param {Function} props.onClick - Handler to open task details
 * @param {Function} props.onDelete - Handler to delete the task
 */
export default function TaskItem({ task, onToggle, onClick, onDelete }) {

  /**
   * Helper to determine the CSS class based on task state.
   * @returns {string} CSS class name for styling
   */
  const getStatusClass = () => {
    if (task.completed) return 'status-green';
    if (task.important) return 'status-red';
    return 'status-yellow';
  };

  /**
   * Handle delete click with stopPropagation to prevent opening modal
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`task-item ${getStatusClass()}`}
      onClick={() => onClick(task)}
    >
      <button
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        title={task.completed ? "Mark as undo" : "Mark as done"}
      >
        {task.completed ? <Check size={14} /> : null}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="subtask-count">
            {task.subtasks.filter(t => t.completed).length}/{task.subtasks.length}
          </span>
        )}
      </div>

      <div className="task-actions">
        {/* Show Star icon if important and not completed */}
        {!task.completed && task.important && (
          <Star size={16} className="vital-icon" fill="var(--danger)" stroke="var(--danger)" />
        )}

        <button className="btn-delete" onClick={handleDelete} title="Delete Task">
          <Trash2 size={18} />
        </button>
      </div>

      <style>{`
        .task-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border-left: 6px solid transparent; /* Status indicator */
          border-radius: var(--radius-md);
          margin-bottom: 0.75rem;
          transition: var(--transition-fast);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }
        
        /* Status Color Logic */
        .status-green {
            background-color: var(--task-bg-green);
            border-left-color: var(--task-border-green);
        }
        .status-red {
            background-color: var(--task-bg-red);
            border-left-color: var(--task-border-red);
        }
        .status-yellow {
            background-color: var(--task-bg-yellow);
            border-left-color: var(--task-border-yellow);
        }
        
        .task-item:hover {
          transform: translateX(4px);
          box-shadow: var(--shadow-md);
        }
        
        .checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid rgba(0,0,0,0.2);
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: white;
          transition: var(--transition-fast);
          padding: 0;
          flex-shrink: 0;
        }
        
        .checkbox.checked {
          background-color: var(--task-border-green);
          border-color: var(--task-border-green);
        }
        
        .task-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            overflow: hidden;
        }

        .task-title {
          font-size: 0.95rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtask-count {
            font-size: 0.75rem;
            background: rgba(0,0,0,0.1);
            padding: 2px 6px;
            border-radius: 12px;
            color: var(--text-secondary);
        }
        
        .status-green .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-delete {
            background: transparent;
            color: var(--text-muted);
            border: none;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: 0.2s;
            display: flex;
            align-items: center; justify-content: center;
        }

        .task-item:hover .btn-delete {
            opacity: 1;
        }

        .btn-delete:hover {
            color: var(--danger);
            background: rgba(239, 68, 68, 0.1);
        }

        .vital-icon {
            margin-right: 0.25rem;
        }
      `}</style>
    </div>
  );
}
