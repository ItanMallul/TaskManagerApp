import { useState, useEffect } from 'react';
import { X, Gift, Calendar, CheckCircle, Circle, Trophy, Star, Edit2, Save, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

/**
 * TaskModal Component
 * Modal for viewing and editing full task details.
 * 
 * Features:
 * - Layout: Header (Top) -> Body (Middle/Scroll) -> Tabs (Bottom)
 * - Details Tab: Edit Title/Desc, Toggle Importance, Manage Subtasks.
 * - Reward Tab: View/Edit optional reward.
 * 
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onUpdate - Save handler (passes updated task up)
 */
export default function TaskModal({ task, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState('details');

    // Local state for immediate edits
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);
    const [editImportant, setEditImportant] = useState(task.important || false);
    const [titleError, setTitleError] = useState(false);

    // Subtask state
    const [newSubtask, setNewSubtask] = useState('');

    // Update local state when task prop changes
    useEffect(() => {
        setEditTitle(task.title);
        setEditDesc(task.description || '');
        setEditImportant(task.important || false);
        setTitleError(false);
    }, [task]);

    if (!task) return null;

    // --- SAVE HANDLERS ---

    const handleSaveDetails = () => {
        if (!editTitle.trim()) {
            setTitleError(true);
            return;
        }

        onUpdate({
            ...task,
            title: editTitle,
            description: editDesc,
            important: editImportant
        });
        setIsEditing(false);
        setTitleError(false);
    };

    const handleSaveReward = (text) => {
        onUpdate({ ...task, reward: text });
    };

    const handleToggleRewardTaken = () => {
        onUpdate({ ...task, rewardTaken: !task.rewardTaken });
    };

    // --- SUBTASK HANDLERS ---

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;

        const subtask = {
            id: Date.now(),
            title: newSubtask,
            completed: false
        };

        const updatedSubtasks = [...(task.subtasks || []), subtask];
        onUpdate({ ...task, subtasks: updatedSubtasks });
        setNewSubtask('');
    };

    const handleToggleSubtask = (subId) => {
        const updatedSubtasks = (task.subtasks || []).map(s =>
            s.id === subId ? { ...s, completed: !s.completed } : s
        );
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const handleDeleteSubtask = (subId) => {
        const updatedSubtasks = (task.subtasks || []).filter(s => s.id !== subId);
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* 1. HEADER (Top) */}
                <div className="modal-header">
                    {isEditing ? (
                        <div className="edit-header">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => {
                                    setEditTitle(e.target.value);
                                    if (e.target.value.trim()) setTitleError(false);
                                }}
                                className={`edit-input title-input ${titleError ? 'error' : ''}`}
                                autoFocus
                                placeholder="Task title cannot be empty"
                            />
                            <div className="importance-toggle" onClick={() => setEditImportant(!editImportant)}>
                                <Star
                                    size={20}
                                    fill={editImportant ? "var(--danger)" : "none"}
                                    color={editImportant ? "var(--danger)" : "var(--text-muted)"}
                                />
                                <span>{editImportant ? "Important" : "Normal Priority"}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="view-header">
                            <h2 className={task.completed ? 'completed-title' : ''}>{task.title}</h2>
                            <div className="header-actions">
                                {task.important && !task.completed && (
                                    <div className="badge-important">
                                        <Star size={12} fill="white" /> Important
                                    </div>
                                )}
                                <button className="btn-icon-sm" onClick={() => setIsEditing(true)} title="Edit Task">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. BODY (Middle - Scrollable) */}
                <div className="modal-body">
                    {activeTab === 'details' ? (
                        <div className="details-view">
                            {/* Description Section */}
                            <div className="section">
                                <label className="section-label">Description</label>
                                {isEditing ? (
                                    <textarea
                                        className="edit-textarea"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="Add a description..."
                                        rows={4}
                                    />
                                ) : (
                                    <div className="description">
                                        {task.description ? (
                                            <p>{task.description}</p>
                                        ) : (
                                            <p className="placeholder-text">No description provided.</p>
                                        )}
                                    </div>
                                )}

                                {isEditing && (
                                    <button className="btn btn-primary btn-sm save-btn" onClick={handleSaveDetails}>
                                        <Save size={16} /> Save Changes
                                    </button>
                                )}
                            </div>

                            <div className="divider"></div>

                            {/* Subtasks Section */}
                            <div className="section">
                                <label className="section-label">Subtasks</label>
                                <div className="subtask-list">
                                    {(task.subtasks || []).map(sub => (
                                        <div key={sub.id} className="subtask-item">
                                            <button
                                                className={`checkbox-sm ${sub.completed ? 'checked' : ''}`}
                                                onClick={() => handleToggleSubtask(sub.id)}
                                            >
                                                {sub.completed && <CheckCircle size={14} />}
                                            </button>
                                            <span className={sub.completed ? 'completed-text' : ''}>
                                                {sub.title}
                                            </span>
                                            <button className="delete-sub-btn" onClick={() => handleDeleteSubtask(sub.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddSubtask} className="add-subtask-form">
                                    <button type="submit" className="icon-btn-plain">
                                        <Plus size={18} className="add-icon" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Add a subtask..."
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                    />
                                </form>
                            </div>

                            <p className="meta-info bottom">
                                <Calendar size={14} /> Created: {new Date(task.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ) : (
                        <RewardTab task={task} onSave={handleSaveReward} onToggleTaken={handleToggleRewardTaken} />
                    )}
                </div>

                {/* 3. TABS (Bottom) */}
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <div>Details</div>
                        <div className="tab-indicator"></div>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reward' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reward')}
                    >
                        <div className="flex-center gap-xs"><Gift size={16} /> Reward</div>
                        <div className="tab-indicator"></div>
                    </button>
                </div>

            </div>
            <style>{`
        /* 1. Modal Container & Overlay */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); animation: fadeIn 0.2s ease; }
        
        .modal-content { 
            width: 95%; max-width: 800px; height: 60vh; 
            display: flex; flex-direction: column; position: relative; 
            padding: 0; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            background: white;
            box-shadow: var(--shadow-lg);
        }

        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.05); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 20; border: none; cursor: pointer; transition: 0.2s; }
        .close-btn:hover { background: var(--danger); color: white; }
        
        /* 2. Header (Top) */
        .modal-header { padding: 2rem 5rem 1.5rem 2rem; border-bottom: 1px solid var(--border-light); background: white; flex-shrink: 0; }
        .view-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .view-header h2 { font-size: 1.75rem; line-height: 1.2; color: var(--text-main); margin: 0; }
        
        .header-actions { display: flex; align-items: center; gap: 1rem; }
        .badge-important { background: var(--danger); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .btn-icon-sm { background: transparent; border: 1px solid var(--border-light); padding: 8px; border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
        .btn-icon-sm:hover { color: var(--primary); border-color: var(--primary); background: var(--primary-light); }
        
        /* Edit Mode Styles */
        .edit-header { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
        .edit-input { padding: 0.75rem; border: 2px solid var(--primary-light); border-radius: var(--radius-sm); font-size: 1.5rem; font-weight: 700; width: 100%; outline: none; transition: 0.2s; }
        .edit-input:focus { border-color: var(--primary); }
        .edit-input.error { border-color: var(--danger); }
        .importance-toggle { display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 1rem; color: var(--text-secondary); padding: 0.5rem; border-radius: var(--radius-sm); transition: 0.2s; align-self: flex-start; }
        .importance-toggle:hover { background: var(--bg-app); }
        
        /* 3. Body (Middle - Scrollable) */
        .modal-body { padding: 2rem; overflow-y: auto; flex: 1; background: #fafafa; }
        .details-view { max-width: 90%; margin: 0 auto; }
        
        .section { margin-bottom: 2.5rem; }
        .section-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        
        .description p { font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); white-space: pre-wrap; }
        .edit-textarea { width: 100%; padding: 1rem; border: 2px solid var(--primary-light); border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; resize: vertical; margin-bottom: 1rem; outline: none; min-height: 120px; }
        .edit-textarea:focus { border-color: var(--primary); }
        .save-btn { width: auto; align-self: flex-start; }
        .divider { height: 2px; background: var(--border-light); margin: 0 0 2.5rem 0; opacity: 0.5; }
        
        /* Subtasks */
        .subtask-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .subtask-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid transparent; transition: 0.2s; }
        .subtask-item:hover { border-color: var(--border-light); transform: translateY(-1px); }
        
        .subtask-item span { flex: 1; font-size: 1rem; font-weight: 500; color: var(--text-main); }
        .checkbox-sm { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--border-light); display: flex; align-items: center; justify-content: center; background: white; cursor: pointer; padding: 0; color: white; transition: 0.2s; }
        .checkbox-sm.checked { background: var(--success); border-color: var(--success); }
        
        .delete-sub-btn { background: transparent; color: var(--text-muted); opacity: 0; transition: 0.2s; cursor: pointer; border: none; padding: 6px; border-radius: 4px; }
        .subtask-item:hover .delete-sub-btn { opacity: 1; }
        .delete-sub-btn:hover { background: var(--task-bg-red); color: var(--danger); }
        
        .add-subtask-form { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: rgba(0,0,0,0.03); border-radius: var(--radius-md); transition: 0.2s; }
        .add-subtask-form:focus-within { background: white; box-shadow: 0 0 0 2px var(--primary-light); }
        .add-icon { color: var(--primary); }
        .icon-btn-plain { background: transparent; border: none; padding: 0; color: var(--primary); cursor: pointer; display: flex; align-items: center; justify-content: center;}
        .add-subtask-form input { flex: 1; border: none; outline: none; font-size: 1rem; background: transparent; font-weight: 500; }
        
        /* 4. Tabs (Bottom) */
        .modal-tabs { display: flex; border-top: 1px solid var(--border-light); background: white; flex-shrink: 0; }
        .tab-btn { flex: 1; padding: 1.5rem; background: transparent; border: none; color: var(--text-muted); font-weight: 600; font-size: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; position: relative; transition: 0.3s; }
        .tab-btn:hover { background: var(--bg-app); color: var(--text-main); }
        .tab-btn.active { color: var(--primary); background: #f5f3ff; }
        
        .tab-indicator { height: 4px; width: 0%; background: var(--primary); border-radius: 4px; transition: 0.3s; position: absolute; bottom: 0; }
        .tab-btn.active .tab-indicator { width: 40%; }
        
        .gap-xs { gap: 0.5rem; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
}

/**
 * RewardTab Component
 */
function RewardTab({ task, onSave, onToggleTaken }) {
    const [text, setText] = useState(task.reward || '');

    // Sync state if reward updates externally
    useEffect(() => {
        setText(task.reward || '');
    }, [task.reward]);

    if (!task.completed) {
        return (
            <div className="reward-view" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'
            }}>
                <div className="reward-edit" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                    <Gift size={48} className="text-secondary" style={{ marginBottom: '1rem', color: 'var(--primary)', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Reward Yourself</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Set a reward to motivate yourself. It will be hidden until you complete this task.
                    </p>
                    <textarea
                        style={{ width: '100%', padding: '1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', resize: 'none', fontFamily: 'inherit', fontSize: '1.1rem', outline: 'none', minHeight: '120px' }}
                        placeholder="e.g., Watch an episode, Eat a cookie..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', width: '100%' }} onClick={() => onSave(text)}>
                        <Save size={18} style={{ marginRight: '8px' }} /> Save Reward
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reward-view" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'
        }}>
            <div className="reward-unlocked" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
                padding: '3rem', background: '#fffbeb', borderRadius: 'var(--radius-lg)', border: '2px solid #fcd34d',
                maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.4)'
            }}>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Trophy size={64} color="#f59e0b" fill="#fcd34d" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#92400e' }}>Reward Unlocked!</h3>
                    <p style={{ margin: 0, color: '#b45309', opacity: 0.8 }}>You've earned it.</p>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b45309', textAlign: 'center', padding: '1rem', borderTop: '2px dashed #fcd34d', width: '100%' }}>
                    {task.reward || "Well done! Take a break."}
                </div>

                {/* Reward Taken Checkbox */}
                <div
                    onClick={onToggleTaken}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        cursor: 'pointer', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.6)',
                        borderRadius: 'var(--radius-md)', border: '1px solid #fcd34d',
                        transition: 'background 0.2s'
                    }}
                >
                    {task.rewardTaken ? (
                        <CheckSquare size={24} color="#059669" />
                    ) : (
                        <Square size={24} color="#b45309" />
                    )}
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: task.rewardTaken ? '#059669' : '#b45309' }}>
                        {task.rewardTaken ? "Reward Taken!" : "Mark as Taken"}
                    </span>
                </div>
            </div>
        </div>
    )
}
