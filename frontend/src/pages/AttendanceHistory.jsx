import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaHistory } from 'react-icons/fa';

const AttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const employeeId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/attendance/history/${employeeId}`);
                console.log("Fetched History Data:", res.data); 
                setHistory(res.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchHistory();
    }, [employeeId]);

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Attendance Logs 📅</h1>
                    <p className="text-slate-500 mt-1 font-medium">Review your daily clock-in and clock-out times.</p>
                </div>
                <div className="hidden md:block bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">History Tracking</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-indigo-600 font-bold animate-pulse">Loading records...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Punch In</th>
                                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Punch Out</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.length > 0 ? (
                                    history.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                        <FaCalendarAlt />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-700 block">{row.date}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Working Day</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                                    row.status === 'Present' 
                                                    ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                                                    : 'bg-amber-100 text-amber-600 border border-amber-200'
                                                }`}>
                                                    {row.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center font-bold text-slate-600 tabular-nums italic">
                                                    <FaClock className="mr-2 text-indigo-400" />
                                                    
                                                    {row.punchIn || row.time || '--:--'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center font-bold text-slate-600 tabular-nums italic">
                                                    <FaHistory className="mr-2 text-rose-400" />
                                                    {row.punchOut || '--:--'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <FaExclamationTriangle className="text-slate-200 text-3xl" />
                                                </div>
                                                <p className="text-slate-400 font-bold">No attendance records found yet.</p>
                                                <p className="text-slate-300 text-xs mt-1">Your daily logs will appear here once you punch in.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;