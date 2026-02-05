import { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function LandingPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        // Simulate network delay for effect
        setTimeout(() => {
            onLogin(username);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="landing-container">
            <div className="landing-bg"></div>

            <div className="login-card card">
                <div className="card-header">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <path d="M9 16l2 2 4-4"></path>
                        </svg>
                    </div>
                    <h1>TaskMaster</h1>
                    <p>Organize your life, achieve your goals.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-field">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-field">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Signing In...' : (
                            <>
                                Get Started <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style>{`
        .landing-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .landing-bg {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 50%, var(--primary-light), var(--bg-app));
          z-index: -1;
          animation: bg-pulse 10s ease-in-out infinite alternate;
        }

        @keyframes bg-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: var(--shadow-lg);
          padding: 2.5rem;
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .card-header h1 {
          font-size: 1.75rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .card-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }

        .input-field {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-field input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition-fast);
          background: #fff;
        }

        .input-field input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .btn-full {
          width: 100%;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
      `}</style>
        </div>
    );
}
