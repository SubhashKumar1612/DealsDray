const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Register = require('./model/register'); // Adjust path as needed
const auth = require('./middleware/auth'); // Adjust path as needed
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const Employee = require("./model/employee"); // Adjust path as needed
require('dotenv').config(); // Load environment variables
require("./db/conn");

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // Allow sending cookies with requests
}));

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage });

// Registration Route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log("yes i am here");

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new Register({ name, email, password: hashedPassword });
        
        // Generate the token
        const token = await newUser.generateAuthToken();
        
        // Set the token in the cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === "production", // Ensures secure cookie in production
            maxAge: 24 * 60 * 60 * 1000 // Token valid for 1 day
        });
        
        // Save the user
        await newUser.save();
        console.log(newUser);
        
        // Send a success response
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).send('Error registering user');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    console.log("yes i am here in the backend");
    try {
        const user = await Register.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).send("Invalid login credentials");
        }

        //const isMatch = await bcrypt.compare(password, user.password);
        if (password!==user.password) {
            return res.status(400).send("Invalid login credentials");
        }

        const token = await user.generateAuthToken();
        console.log(token);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
        });

        res.status(200).send("Logged in successfully");
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send("Server error");
    }
});

// Check Authentication Route
app.get('/login', auth, (req, res) => {
    res.status(200).send({ message: "User is authenticated", user: req.user });
});

// Logout Route
app.post('/logout', auth, (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).send("Logged out successfully");
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send("Logout error");
    }
});

// Get User Info Route
app.get('/me', auth, (req, res) => {
    res.status(200).send(req.user);
});

// Employee Route
app.post('/employee', upload.single('img'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, courses } = req.body;
    const img = req.file ? req.file.path : null;

    if (!name || !email || !mobileNo || !designation || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email is already present.' });
        }

        const parsedCourses = Array.isArray(courses) ? courses : JSON.parse(courses || '[]');
        const newEmployee = new Employee({
            name,
            email,
            mobileNo,
            designation,
            gender,
            courses: parsedCourses,
            img
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee data saved successfully' });
    } catch (error) {
        console.error('Error saving employee data:', error);
        res.status(500).json({ message: 'Error saving employee data' });
    }
});

// Get all employees
app.get('/employee-list', auth, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Error fetching employees');
    }
});


// Update Employee Route
//Get specific employee by ID
app.get('/employee/:id', auth, async (req, res) => {
    const { id } = req.params;
    console.log("yes i am in edit")
    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).send('Error fetching employee data');
    }
});
app.put('/employee/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, email, mobileNo, designation, gender, courses, img } = req.body;
    try {
        // Find employee by ID and update fields
        const updatedEmployee = await Employee.findByIdAndUpdate(id, {
            name,
            email,
            mobileNo,
            designation,
            gender,
            courses,
            img
        }, { new: true }); // `new: true` returns the updated document

        if (!updatedEmployee) {
            return res.status(404).send('Employee not found');
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee data:', error);
        res.status(500).send('Error updating employee data');
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
