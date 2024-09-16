import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Employee from './components/Employee/Employee';
import EmployeeList from './components/EmployeeList/EmployeeList';
import EditEmployee from './components/EditEmployee/EditEmployee'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Get the logged-in state from localStorage, or default to false
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState === 'true';
  });

  // Whenever isLoggedIn changes, update localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        {/* Route to Dashboard */}
        <Route 
          path="/" 
          element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* Route to Login */}
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* Route to Employee List */}
        <Route
          path="/employee-list"
          element={<EmployeeList isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* Route to Employee Form */}
        <Route 
          path="/employees"
          element={<Employee isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
        />
         <Route path="/edit-employee/:id"
          element={<EditEmployee isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
      </Routes>
    </Router>
  );
}

export default App;
