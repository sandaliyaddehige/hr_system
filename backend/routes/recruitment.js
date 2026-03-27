const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Applicant = require('../models/Applicant'); 
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs", error: err });
    }
});


router.post('/publish', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(500).json({ message: "Error saving job", error: err });
    }
});


router.delete('/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
       
        await Applicant.deleteMany({ jobId: req.params.id });
        res.status(200).json("Job has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find()
            .populate('jobId', 'title') 
            .sort({ appliedDate: -1 });
        res.status(200).json(applicants);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applicants", error: err });
    }
});


router.post('/apply', async (req, res) => {
    try {
        const newApplicant = new Applicant(req.body);
        const savedApplicant = await newApplicant.save();
        res.status(201).json(savedApplicant);
    } catch (err) {
        res.status(500).json({ message: "Error submitting application", error: err });
    }
});


router.put('/applicants/status/:id', async (req, res) => {
    try {
        const updatedApplicant = await Applicant.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );
        res.status(200).json(updatedApplicant);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;