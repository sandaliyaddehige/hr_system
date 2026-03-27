import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPaperPlane, FaCalendarAlt, FaHistory, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const LeaveRequest = () => {
    const [formData, setFormData] = useState({
        leaveType: 'Annual', 
        fromDate: '',        
        toDate: '',          
        reason: ''
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const employeeId = localStorage.getItem("userId");

    
    const fetchLeaveHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/leaves/employee/${employeeId}`);
            setHistory(res.data);
        } catch (error) {
            console.error("Error fetching leave history:", error);
        }
    };

    useEffect(() => {
        if (employeeId) fetchLeaveHistory();
    }, [employeeId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            await axios.post('http://localhost:5000/api/leaves/request', {
                employeeId,
                leaveType: formData.leaveType,
                fromDate: formData.fromDate,
                toDate: formData.toDate,
                reason: formData.reason
            });
            
            toast.success("Leave Request Sent Successfully!");
            setFormData({ leaveType: 'Annual', fromDate: '', toDate: '', reason: '' });
            fetchLeaveHistory(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Action Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h1 className="text-3xl font-black text-slate-800">Leave Management </h1>
                <p className="text-slate-500 mt-1">Apply for leaves and track your application status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 sticky top-28">
                        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <FaPaperPlane className="text-indigo-500 text-sm" /> New Request
                        </h3>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Leave Type</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-slate-600 cursor-pointer"
                                value={formData.leaveType}
                                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                            >
                                <option value="Annual">Annual Leave</option>
                                <option value="Sick">Sick Leave</option>
                                <option value="Casual">Casual Leave</option>
                                <option value="Unpaid">Unpaid Leave</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">From Date</label>
                                <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-600"
                                    onChange={(e) => setFormData({...formData, fromDate: e.target.value})} value={formData.fromDate} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">To Date</label>
                                <input type="date" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-600"
                                    onChange={(e) => setFormData({...formData, toDate: e.target.value})} value={formData.toDate} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason</label>
                            <textarea 
                                rows="3" required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-slate-600"
                                placeholder="Brief explanation..."
                                onChange={(e) => setFormData({...formData, reason: e.target.value})} value={formData.reason}
                            ></textarea>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                            {loading ? "Processing..." : "Submit Request"}
                        </button>
                    </form>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <FaHistory className="text-indigo-500 text-sm" /> My Leave History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {history.length > 0 ? history.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 text-sm">
                                                        {row.fromDate} - {row.toDate}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        Requested on {new Date(row.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{row.leaveType}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {row.status === 'Pending' && (
                                                        <><FaClock className="text-amber-400" /><span className="text-amber-600 font-bold text-xs uppercase">Pending</span></>
                                                    )}
                                                    {row.status === 'Approved' && (
                                                        <><FaCheckCircle className="text-emerald-400" /><span className="text-emerald-600 font-bold text-xs uppercase">Approved</span></>
                                                    )}
                                                    {row.status === 'Cancelled' && (
                                                        <><FaTimesCircle className="text-rose-400" /><span className="text-rose-600 font-bold text-xs uppercase">Cancelled</span></>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="p-20 text-center text-slate-400 font-medium font-sans">No leave requests found yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;