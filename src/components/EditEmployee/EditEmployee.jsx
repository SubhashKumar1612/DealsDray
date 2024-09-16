import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEmployee.css'; // Adjust the path as needed

function EditEmployee() {
  const { id } = useParams(); // Get employee ID from URL
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    courses: [],
    img: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetch(`http://localhost:5000/employee/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setEmployee(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
      setError('Failed to load employee data');
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/employee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(employee)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      navigate('/employee-list'); // Redirect to employee list after successful update
    })
    .catch(error => {
      console.error('Error updating employee data:', error);
      setError('Failed to update employee data');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="edit-employee-container">
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobileNo"
            value={employee.mobileNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={employee.designation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={employee.gender}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Courses (comma separated):</label>
          <input
            type="text"
            name="courses"
            value={employee.courses.join(', ')}
            onChange={e => handleChange({
              target: {
                name: 'courses',
                value: e.target.value.split(',').map(course => course.trim())
              }
            })}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="img"
            value={employee.img}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditEmployee;
