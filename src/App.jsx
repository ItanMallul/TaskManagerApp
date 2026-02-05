import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('taskApp_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (username) => {
        const newUser = { id: Date.now(), name: username };
        setUser(newUser);
        localStorage.setItem('taskApp_user', JSON.stringify(newUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('taskApp_user');
    };

    if (loading) return null; // Or a loading spinner

    return (
        <div className="app-container">
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <LandingPage onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
