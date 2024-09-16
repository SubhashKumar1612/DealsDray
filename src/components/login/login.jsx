import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to store error messages
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("handleLogin function called");
        try {
            // Send login request to the server
            alert("yes i am")
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials (cookies) in the request
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const result = await response.text(); // Read the response text
                console.log('Login response:', result); // Log the response text

                setIsLoggedIn(true); // Set login status to true
                navigate('/'); // Redirect to dashboard after successful login
            } else {
                const errorData = await response.text();
                console.error('Login error:', errorData); // Log detailed error
                setError('Invalid email or password'); // Set error message if login fails
            }
        } catch (error) {
            console.error('Login error:', error.message); // Log detailed error
            setError('Invalid email or password'); // Set error message if login fails
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
