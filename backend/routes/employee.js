const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


router.get('/', async (req, res) => {
    try {
        
        const employees = await User.find({ role: 'employee' }).sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: "Error fetching employees: " + err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, ...otherDetails } = req.body;
        
        
        const newEmployee = new User({
            name,
            email,
            password, 
            role: 'employee',
            ...otherDetails
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: "Error saving employee: " + err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedEmployee = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: "Error updating employee: " + err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error deleting employee: " + err.message });
    }
});

module.exports = router;