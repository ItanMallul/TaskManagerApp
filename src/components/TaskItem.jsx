import { Check, Circle } from 'lucide-react';

export default function TaskItem({ task, onToggle, onClick }) {
    return (
        <div
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onClick={() => onClick(task)}
        >
            <button
                className={`checkbox ${task.completed ? 'checked' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(task.id);
                }}
            >
                {task.completed ? <Check size={14} /> : null}
            </button>

            <span className="task-title">{task.title}</span>

            <style>{`
        .task-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          margin-bottom: 0.75rem;
          transition: var(--transition-fast);
          cursor: pointer;
        }
        
        .task-item:hover {
          border-color: var(--primary);
          transform: translateX(4px);
          box-shadow: var(--shadow-sm);
        }
        
        .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid var(--border-light);
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: transparent;
          transition: var(--transition-fast);
          padding: 0;
        }
        
        .checkbox.checked {
          background-color: var(--success);
          border-color: var(--success);
        }
        
        .checkbox:hover {
          border-color: var(--primary);
        }
        
        .task-title {
          font-size: 0.95rem;
          flex: 1;
        }
        
        .task-item.completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
