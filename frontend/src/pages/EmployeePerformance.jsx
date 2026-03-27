import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaPaperPlane, FaChevronDown } from 'react-icons/fa';

const EmployeePerformance = () => {
    // States
    const [employees, setEmployees] = useState([]); 
    const [selectedEmployee, setSelectedEmployee] = useState(null); 
    const [comments, setComments] = useState("");
    const [rating, setRating] = useState("Meets Expectations");
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employee');
                setEmployees(res.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        fetchEmployees();
    }, []);

    
    const handleEmployeeChange = (e) => {
        const empId = e.target.value;
        const emp = employees.find(item => item._id === empId);
        setSelectedEmployee(emp);
        
    };

    const handleSubmit = async () => {
        if (!selectedEmployee || !comments) {
            alert("Please select an employee and enter feedback.");
            return;
        }

        setLoading(true);
        try {
            const reviewData = {
                employeeId: selectedEmployee._id,
                managerId: localStorage.getItem('userId'),
                kpiScore: 90, 
                taskCompletion: 85,
                attendance: 95,
                collaboration: 4,
                managerComments: comments,
                rating: rating
            };

            const res = await axios.post('http://localhost:5000/api/performance/add', reviewData);
            if (res.data.success) {
                alert("Review submitted successfully!");
                setComments("");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An error occurred while submitting the review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-2 animate-in fade-in duration-700">
            {/* Header with Employee Selector */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Employee Performance Review</h2>
                    <p className="text-slate-400 font-medium mt-1">Select an employee to start the evaluation.</p>
                </div>
                
                {/* 3. Dynamic Employee Dropdown */}
                <div className="w-64 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Employee</label>
                    <div className="relative">
                        <select 
                            onChange={handleEmployeeChange}
                            className="w-full appearance-none bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                        >
                            <option value="">Choose Employee...</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.employeeId} - {emp.name}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                    </div>
                </div>
            </div>

            {selectedEmployee ? (
                <>
                    {/* Profile & Score Section (Visible only when selected) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <div className="lg:col-span-1 bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-300 border border-slate-50 mb-6 uppercase">
                                {selectedEmployee.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-black text-slate-800">{selectedEmployee.name}</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1">{selectedEmployee.designation || 'Staff'}</p>
                            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{selectedEmployee.department || 'General'}</p>
                        </div>

                        
                        <div className="lg:col-span-2 bg-white p-12 rounded-[40px] border border-slate-50 shadow-sm space-y-8">
                             {/* ... KPI Bars ... */}
                             <p className="text-xs text-slate-400 italic italic">Current period metrics for {selectedEmployee.name}</p>
                             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                           
                        </div>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white p-12 rounded-[40px] border border-slate-50 shadow-sm space-y-10">
                        {/* Comments & Submit UI as before */}
                        <textarea 
                             value={comments}
                             onChange={(e) => setComments(e.target.value)}
                             className="..." 
                             placeholder={`What is your feedback for ${selectedEmployee.name}?`}
                        />
                        <button onClick={handleSubmit} className="...">
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </>
            ) : (
                <div className="h-64 flex flex-center items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 font-bold">
                    Please select an employee to view performance metrics.
                </div>
            )}
        </div>
    );
};

export default EmployeePerformance;