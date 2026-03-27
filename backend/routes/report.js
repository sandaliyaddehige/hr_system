const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
const auth = require('../middleware/auth');

// @route   GET api/reports/summary
// @desc    Get summary data for charts and stats
router.get('/summary', auth, async (req, res) => {
    try {
        // 1. Total Employees & Dept Distribution
        const totalEmployees = await Employee.countDocuments();
        const departmentDistribution = await Employee.aggregate([
            {
                $group: {
                    _id: "$dept", 
                    count: { $sum: 1 }
                }
            }
        ]);

       
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const attendanceStats = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$status", 
                    count: { $sum: 1 }
                }
            }
        ]);

        
        const payrollExpense = await Payroll.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$netSalary" } 
                }
            }
        ]);

        res.json({
            totalEmployees,
            departmentDistribution,
            attendanceLast30Days: attendanceStats,
            totalSalaryExpense: payrollExpense.length > 0 ? payrollExpense[0].total : 0
        });

    } catch (err) {
        console.error("Report Backend Error:", err.message);
        res.status(500).json({ error: "Could not fetch report data" });
    }
});

module.exports = router;