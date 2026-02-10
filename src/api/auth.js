const TOKEN_KEY = 'taskmaster_token';
const USER_KEY = 'taskmaster_user';

export const registerUser = async (userData) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
};

export const loginUser = async (userData) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Store token and user data in localStorage
    if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const isAuthenticated = () => {
    return !!getAuthToken() && !!getCurrentUser();
};
