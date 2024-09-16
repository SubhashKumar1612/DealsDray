const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    courses: [String],
    img: { type: String } // Store the image path or URL
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
