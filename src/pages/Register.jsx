import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
        return re.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate username length
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 4) {
            setError('Password is too short (minimum 4 characters)');
            return;
        }

        // Validate password complexity
        if (!validatePassword(formData.password)) {
            const hasUppercase = /[A-Z]/.test(formData.password);
            const hasLowercase = /[a-z]/.test(formData.password);

            if (!hasUppercase && !hasLowercase) {
                setError('Password must contain both uppercase and lowercase letters');
            } else if (!hasUppercase) {
                setError('Password must contain at least one uppercase letter');
            } else if (!hasLowercase) {
                setError('Password must contain at least one lowercase letter');
            }
            return;
        }

        setLoading(true);
        try {
            await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg"></div>

            <div className="auth-card register-card">
                <div className="auth-header">
                    <div className="logo-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <path d="M9 16l2 2 4-4"></path>
                        </svg>
                    </div>
                    <h1>Create Account</h1>
                    <p>Join TaskMaster and start organizing your life</p>
                </div>

                {error && (
                    <div className="error-alert">
                        <span className="error-icon">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <p className="input-hint">
                            At least 4 characters, 1 uppercase, 1 lowercase
                        </p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <CheckCircle2 size={18} className="input-icon" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/" className="auth-link">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .auth-bg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3), transparent 50%),
                        radial-gradient(circle at 40% 20%, rgba(72, 61, 139, 0.3), transparent 50%);
                    animation: bg-shift 15s ease-in-out infinite;
                }

                @keyframes bg-shift {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(5deg); }
                }

                .auth-card {
                    position: relative;
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 3rem;
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
                    animation: card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .register-card {
                    max-width: 480px;
                }

                @keyframes card-entrance {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .logo-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
                    animation: icon-float 3s ease-in-out infinite;
                }

                @keyframes icon-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                .auth-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 0.5rem;
                }

                .auth-header p {
                    color: #718096;
                    font-size: 0.95rem;
                }

                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, #fee 0%, #fdd 100%);
                    border: 1px solid #fcc;
                    border-radius: 12px;
                    color: #c53030;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                    animation: shake 0.4s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }

                .error-icon {
                    font-size: 1.25rem;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #2d3748;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a0aec0;
                    pointer-events: none;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.2s ease;
                    background: white;
                }

                .input-wrapper input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .input-wrapper input::placeholder {
                    color: #cbd5e0;
                }

                .input-hint {
                    font-size: 0.8rem;
                    color: #718096;
                    margin-top: 0.25rem;
                }

                .auth-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 0.5rem;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .auth-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }

                .auth-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .auth-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .auth-footer {
                    margin-top: 2rem;
                    text-align: center;
                    padding-top: 2rem;
                    border-top: 1px solid #e2e8f0;
                }

                .auth-footer p {
                    color: #718096;
                    font-size: 0.9rem;
                }

                .auth-link {
                    color: #667eea;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .auth-link:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                @media (max-width: 640px) {
                    .auth-card {
                        margin: 1rem;
                        padding: 2rem;
                    }

                    .auth-header h1 {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
