import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Employee.css';

const Employee = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState([]);
  const [img, setImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourses(prevCourses =>
      prevCourses.includes(value)
        ? prevCourses.filter(course => course !== value)
        : [...prevCourses, value]
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!mobileNo || !/^\d{10}$/.test(mobileNo)) errors.mobileNo = 'Valid mobile number is required';
    if (!designation) errors.designation = 'Designation is required';
    if (!gender) errors.gender = 'Gender is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobileNo', mobileNo);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('courses', JSON.stringify(courses));
    if (img) {
      formData.append('img', img);
    }

    fetch('http://localhost:5000/employee', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setSuccessMessage('Employee data saved successfully');
      setSubmitError('');
      setName('');
      setEmail('');
      setMobileNo('');
      setDesignation('');
      setGender('');
      setCourses([]);
      setImg(null);
      navigate('/dashboard');
    })
    .catch((error) => {
      console.error('Error:', error.message);
      setSubmitError(`Failed to submit form: ${error.message}`);
    });
  };

  return (
    <div className="employee-form-container">
      <h1>Employee Form</h1>
      {submitError && <p className="error">{submitError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name" 
            />
          </label>
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <br />
        <div>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <br />
        <div>
          <label>
            Mobile No:
            <input 
              type="tel" 
              value={mobileNo} 
              onChange={(e) => setMobileNo(e.target.value)} 
              placeholder="Enter your mobile number" 
            />
          </label>
          {errors.mobileNo && <p className="error">{errors.mobileNo}</p>}
        </div>
        <br />
        <div>
          <label>
            Designation:
            <select 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)} 
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </label>
          {errors.designation && <p className="error">{errors.designation}</p>}
        </div>
        <br />
        <div>
          <label>
            Gender:
            <input 
              type="radio" 
              value="M" 
              checked={gender === 'M'} 
              onChange={(e) => setGender(e.target.value)} 
            /> M
            <input 
              type="radio" 
              value="F" 
              checked={gender === 'F'} 
              onChange={(e) => setGender(e.target.value)} 
            /> F
          </label>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>
        <br />
        <div>
          <label>
            Course:
            <input
              type="checkbox"
              value="MCA"
              checked={courses.includes('MCA')}
              onChange={handleCourseChange}
            /> MCA
            <input
              type="checkbox"
              value="BCA"
              checked={courses.includes('BCA')}
              onChange={handleCourseChange}
            /> BCA
            <input
              type="checkbox"
              value="BSC"
              checked={courses.includes('BSC')}
              onChange={handleCourseChange}
            /> BSC
          </label>
        </div>
        <br />
        <div>
          <label>
            Img Upload:
            <input 
              type="file" 
              onChange={(e) => setImg(e.target.files[0])} 
            />
          </label>
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Employee;
