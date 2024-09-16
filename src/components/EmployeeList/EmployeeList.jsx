import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/employee-list', {
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
      setEmployees(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching employees:', error);
      setError('Failed to load employee data');
      setLoading(false);
    });
  }, []);

  const parseCourses = (courses) => {
    return Array.isArray(courses) ? courses : JSON.parse(courses || '[]');
  };

  const handleEdit = (employeeId) => {
    // Navigate to the EditEmployee page with the employeeId
    navigate(`/edit-employee/${employeeId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => {
            const imageUrl = `http://localhost:5000/${employee.img}`;
            const parsedCourses = parseCourses(employee.courses);

            return (
              <tr key={employee._id}>
                <td><img src={imageUrl} alt={employee.name} className="employee-image" /></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobileNo}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>
                  <ul>
                    {parsedCourses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleEdit(employee._id)} className="edit-button">Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
