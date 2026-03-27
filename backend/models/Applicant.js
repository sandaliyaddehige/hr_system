const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String }, 
    status: { 
        type: String, 
        enum: ['Pending', 'Shortlisted', 'Interview', 'Rejected', 'Hired'], 
        default: 'Pending' 
    },
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', ApplicantSchema);