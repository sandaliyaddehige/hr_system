const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); 
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');


router.get('/manager-stats', async (req, res) => {
    try {
        
        const totalEmployees = await Employee.countDocuments();

        
        const today = new Date().toISOString().split('T')[0];

        
        const presentCount = await Attendance.countDocuments({
            date: today,
            status: 'Present'
        });

        
        const pendingLeaves = await Leave.countDocuments({
            status: 'Pending'
        });

       
        const allEmployees = await Employee.find().select('username designation department status');

        
        const efficiencyScore = "85%";

        
        res.status(200).json({
            success: true,
            totalMembers: totalEmployees,
            presentToday: presentCount,
            pendingLeaves: pendingLeaves,
            efficiency: efficiencyScore,
            members: allEmployees 
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;