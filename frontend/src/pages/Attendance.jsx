import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaCheck, FaTimes, FaUserCheck } from 'react-icons/fa';

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [empRes, attRes, leaveRes] = await Promise.all([
                axios.get('http://localhost:5000/api/employee'),
                axios.get(`http://localhost:5000/api/attendance/${selectedDate}`),
                axios.get('http://localhost:5000/api/leaves/all')
            ]);
            
            setEmployees(empRes.data || []);
            setAttendanceRecords(attRes.data || []);
            setLeaveRequests(leaveRes.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMarkAttendance = async (empId, status) => {
        try {
            const attendanceData = [{ employeeId: empId, status, date: selectedDate }];
            await axios.post('http://localhost:5000/api/attendance/mark', { 
                attendanceData, 
                date: selectedDate 
            });
            fetchData();
        } catch (err) {
            console.error("Error marking attendance:", err);
            alert("Could not update attendance.");
        }
    };

    const handleLeaveStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/update/${id}`, { status });
            fetchData();
        } catch (err) {
            alert("Error updating leave status");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            <h1 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Attendance & Leave</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Statistics Card */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Present Today</span>
                        <h2 className="text-3xl font-black text-slate-800 mt-1">
                            {attendanceRecords.filter(r => r.status === 'Present').length} / {employees.length}
                        </h2>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        <FaUserCheck />
                    </div>
                </div>

                {/* Date Picker Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <FaCalendarAlt className="text-indigo-500" />
                        </div>
                        <span className="font-bold text-slate-700">Attendance Date</span>
                    </div>
                    <input 
                        type="date" 
                        className="bg-slate-50 border-2 border-slate-100 rounded-2xl font-black px-6 py-3 text-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Employee List Section */}
                <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800">Employee Records</h3>
                        {loading && <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div></div>}
                    </div>
                    
                    <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                        {employees.map(emp => {
                            const record = attendanceRecords.find(r => {
                                const recordEmpId = r.employeeId?._id || r.employeeId;
                                return recordEmpId === emp._id;
                            });

                            return (
                                <div key={emp._id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-[24px] border border-slate-50 bg-white hover:border-indigo-100 hover:shadow-md transition-all group gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-indigo-500 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            {emp.username ? emp.username.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm">{emp.username}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.dept || 'General Staff'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl w-full sm:w-auto">
                                        <button 
                                            onClick={() => handleMarkAttendance(emp._id, 'Present')}
                                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all ${record?.status === 'Present' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                                        >Present</button>
                                        <button 
                                            onClick={() => handleMarkAttendance(emp._id, 'Absent')}
                                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black transition-all ${record?.status === 'Absent' ? 'bg-white text-rose-600 shadow-sm border border-rose-100 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                                        >Absent</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leave Requests Section */}
                <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-8">Pending Leaves</h3>
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                        {leaveRequests.filter(l => l.status === 'Pending').length > 0 ? (
                            leaveRequests.filter(l => l.status === 'Pending').map(leave => (
                                <div key={leave._id} className="p-5 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-500">
                                                
                                                {leave.employeeId?.username ? leave.employeeId.username.charAt(0) : '?'}
                                            </div>
                                            <div>
                                               
                                                <h4 className="font-black text-slate-800 text-sm">{leave.employeeId?.username || 'Unknown Employee'}</h4>
                                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[9px] font-black text-indigo-500 uppercase">{leave.leaveType}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleLeaveStatus(leave._id, 'Approved')} className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all"><FaCheck size={12}/></button>
                                            <button onClick={() => handleLeaveStatus(leave._id, 'Cancelled')} className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"><FaTimes size={12}/></button>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-50">
                                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2">{leave.reason || 'No reason provided.'}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                                        <span className="bg-slate-100 px-2 py-1 rounded-md">From: {leave.fromDate}</span>
                                        <span className="bg-slate-100 px-2 py-1 rounded-md">To: {leave.toDate}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><FaTimes /></div>
                                <p className="font-bold text-xs uppercase tracking-widest italic">No leave requests found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;