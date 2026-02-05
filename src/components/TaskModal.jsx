import { useState, useEffect } from 'react';
import { X, Gift, Calendar, CheckCircle, Circle, Trophy } from 'lucide-react';

export default function TaskModal({ task, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState('details');
    const [rewardText, setRewardText] = useState(task.reward || '');

    if (!task) return null;

    const handleSaveReward = () => {
        onUpdate({ ...task, reward: rewardText });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <h2 className={task.completed ? 'completed-title' : ''}>{task.title}</h2>
                    <div className="status-badge" style={{
                        backgroundColor: task.completed ? 'var(--success)' : 'var(--text-muted)',
                        color: 'white'
                    }}>
                        {task.completed ? 'Completed' : 'Pending'}
                    </div>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reward' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reward')}
                    >
                        <Gift size={16} /> Reward
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'details' ? (
                        <div className="details-view">
                            <p className="meta-info">
                                <Calendar size={16} /> Created: {new Date(task.createdAt).toLocaleString()}
                            </p>
                            <p className="description">
                                {task.description || "No specific details provided for this task."}
                            </p>
                        </div>
                    ) : (
                        <div className="reward-view">
                            {task.completed ? (
                                <div className="reward-unlocked">
                                    <Trophy size={48} color="gold" />
                                    <h3>Reward Unlocked!</h3>
                                    <p className="reward-content">
                                        {task.reward || "Well done! Take a break."}
                                    </p>
                                </div>
                            ) : (
                                <div className="reward-edit">
                                    <p>Set a reward for yourself when you finish this task:</p>
                                    <textarea
                                        placeholder="e.g., Watch an episode, Eat a cookie..."
                                        value={rewardText}
                                        onChange={(e) => setRewardText(e.target.value)}
                                        rows={3}
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={handleSaveReward}>
                                        Save Reward
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <style>{`
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
        }
        .modal-content {
            width: 90%;
            max-width: 500px;
            position: relative;
            padding: 0;
            overflow: hidden;
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0,0,0,0.05);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close-btn:hover {
            background: rgba(0,0,0,0.1);
        }
        .modal-header {
            padding: 1.5rem 1.5rem 1rem;
            border-bottom: 1px solid var(--border-light);
        }
        .completed-title {
            text-decoration: line-through;
            color: var(--text-muted);
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 0.5rem;
        }
        .modal-tabs {
            display: flex;
            border-bottom: 1px solid var(--border-light);
            background: var(--bg-app);
            padding: 0 1.5rem;
        }
        .tab-btn {
            padding: 1rem;
            background: transparent;
            border-bottom: 2px solid transparent;
            color: var(--text-secondary);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        .modal-body {
            padding: 1.5rem;
            min-height: 200px;
        }
        
        .meta-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-bottom: 1rem;
        }
        .description {
            line-height: 1.6;
        }
        
        .reward-view {
            text-align: center;
        }
        .reward-unlocked {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #fffbeb;
            border-radius: var(--radius-md);
            border: 1px solid #fcd34d;
        }
        .reward-content {
            font-size: 1.1rem;
            font-weight: 600;
            color: #b45309;
        }
        .reward-edit textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            margin: 1rem 0;
            resize: none; 
            font-family: inherit;
        }
        .btn-sm {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
}
