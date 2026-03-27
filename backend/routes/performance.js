const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');

// Review එකක් Save කිරීම
router.post('/add', async (req, res) => {
    try {
        const newReview = new Performance(req.body);
        await newReview.save();
        res.status(201).json({ success: true, message: "Review submitted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;