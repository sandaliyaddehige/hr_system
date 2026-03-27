const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
 
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  leaveType: { 
    type: String, 
    enum: ['Annual', 'Sick', 'Casual', 'Unpaid'], 
    required: true 
  },
  fromDate: { 
    type: String, 
    required: true 
  },
  toDate: { 
    type: String, 
    required: true 
  },
  
  duration: { 
    type: Number, 
    default: 0 
  },
  reason: { 
    type: String 
  },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);