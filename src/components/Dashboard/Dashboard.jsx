import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard({ isLoggedIn, setIsLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate();

  // Fetch user details when the user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Function to fetch user details
  const fetchUserData = () => {
    fetch('http://localhost:5000/me', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        setUserName(data.name);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false); // Stop loading in case of an error
      });
  };

  // Handle logout functionality
  const handleLogout = () => {
    setIsLoggedIn(false); // Clear the login status
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="header">
        <div className="nav-left">
          <div className="logo">Logo</div>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/employees">Create Employee</Link>
            <Link to="/employee-list">Employee List</Link> {/* Fixed route */}
          </nav>
        </div>

        <div className="user-info">
          {/* Display the user's name if logged in */}
          {isLoggedIn && <span>{userName}</span>}

          {/* Show "Login" or "Logout" based on login status */}
          <button onClick={isLoggedIn ? handleLogout : () => navigate('/login')}>
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        {/* Show loading spinner while fetching user data */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <h1>Welcome to the Admin Panel</h1>
            
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
