import React, { useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import "../styles/Register.css";

const Register = () => {
    const handleRegister = async (username, email, password) => {
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            console.log(data); // optional - log the response data
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div>
            <h1>Register</h1>
            <RegisterForm onRegister={handleRegister} />
        </div>
    );
};

export default Register;
