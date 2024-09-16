// MongoDB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/formDB', {
    // useNewUrlParser: true, // Use new URL parser for MongoDB
    // useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));
