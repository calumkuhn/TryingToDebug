import React from 'react';
import RegisterForm from '../components/RegisterForm';

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

    return (
        <div>
            <h1>Register</h1>
            <RegisterForm onRegister={handleRegister} />
        </div>
    );
};

export default Register;