const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kpiScore: { type: Number, default: 0 },
    taskCompletion: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    collaboration: { type: Number, default: 0 },
    managerComments: { type: String },
    rating: { type: String, enum: ['Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'] },
    reviewPeriod: { type: String, default: "Q1 2026" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Performance', performanceSchema);