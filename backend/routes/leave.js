const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave'); 
const User = require('../models/User');   


router.post('/request', async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = new Leave({
      employeeId,
      leaveType,
      fromDate,
      toDate,
      duration: diffDays, 
      reason,
      status: 'Pending'
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    console.error("Error saving leave:", err);
    res.status(500).json({ message: "Failed to save leave request", error: err.message });
  }
});


// GET /api/leaves/stats/:id
router.get('/stats/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;

    // 1. (Total Approved Days)
    const approvedLeaves = await Leave.find({ 
      employeeId: employeeId, 
      status: 'Approved' 
    });

    let usedDays = 0;
    approvedLeaves.forEach(leave => {
      usedDays += (leave.duration || 0);
    });

    
    const totalAllowed = 6; 
    const balance = totalAllowed - usedDays;

    
    const today = new Date();
    let payday = new Date(today.getFullYear(), today.getMonth(), 30);
    
    
    if (today > payday) {
      payday.setMonth(payday.getMonth() + 1);
    }
    
    const timeDiff = payday - today;
    const daysToPayday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    res.status(200).json({
      leaveBalance: balance > 0 ? balance : 0,
      nextPayday: daysToPayday.toString().padStart(2, '0') + " Days"
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

// --- (Get History) ---
router.get('/employee/:id', async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
});

// --- 4. (Admin Only) ---
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: 'employeeId', 
        select: 'username email' 
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all leaves", error: err.message });
  }
});

// --- (Approve/Reject) ---
router.put('/update/:id', async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updatedLeave);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

module.exports = router;