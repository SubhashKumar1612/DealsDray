//import Form from './components/Form/Form'; // This will automatically resolve to Form.jsx

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/formDB', {
    // useNewUrlParser: true, // Use new URL parser for MongoDB
    // useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Schema for storing form data
const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const Form = mongoose.model('Form', formSchema);

// API route to handle form submission
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.post('/submit-form', async (req, res) => {
    const { name, email, password } = req.body;

    // Create a new form document
    const newForm = new Form({ name, email, password });
    
    try {
        await newForm.save(); // Save to the database
        res.status(201).send('Form data saved'); // Success response
    } catch (error) {
        console.error('Error saving form data:', error); // Log error
        res.status(400).send('Error saving form data'); // Error response
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
