const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User ID is required to create an employee profile'] 
    },

    
    name: { 
        type: String, 
        required: [true, 'Employee name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        trim: true 
    },

   
    role: { 
        type: String, 
        default: 'employee',
        lowercase: true 
    },
    dept: { 
        type: String, 
        default: 'General',
        trim: true 
    },
    designation: { 
        type: String, 
        default: 'Staff Member' 
    },

    
    phone: { 
        type: String, 
        default: 'Not Provided' 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'On Leave'], 
        default: 'Active' 
    },

   
    joinDate: { 
        type: Date, 
        default: Date.now 
    },
    image: { 
        type: String, 
        default: null 
    } 

}, { 
    timestamps: true 
});


EmployeeSchema.index({ email: 1, userId: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);