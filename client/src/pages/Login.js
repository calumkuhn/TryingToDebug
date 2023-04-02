import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data);
            // Navigate to home page if login is successful
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userId', data._id);
                localStorage.setItem('username', data.username);
                window.location.href = '/';
            }else {
                alert(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default Login;
