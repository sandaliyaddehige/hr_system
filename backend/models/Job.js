const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Job title is required"] 
    },
    company: { 
        type: String, 
        default: 'TechCorp Inc' 
    },
    location: { 
        type: String, 
        default: 'San Francisco, CA' 
    },
    type: { 
        type: String, 
        
        enum: ['Remote', 'On-site', 'Hybrid'], 
        default: 'Remote' 
    },
    match: { 
        type: String, 
        default: '92%' 
    },
    salary: { 
        type: String,
        default: 'Negotiable'
    },
    tags: {
        type: [String],
        default: []
    },
    status: { 
        type: String, 
        enum: ['Published', 'Draft', 'Closed'], 
        default: 'Published' 
    },
    postedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);