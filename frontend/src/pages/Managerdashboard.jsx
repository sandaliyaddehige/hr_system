import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa';

const ManagerDashboard = () => {
    const [data, setData] = useState({
        totalMembers: 0,
        presentToday: 0,
        pendingLeaves: 0,
        efficiency: "0%",
        members: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                
                const res = await axios.get('http://localhost:5000/api/manager/manager-stats');
                
                if (res.data.success) {
                    setData({
                        totalMembers: res.data.totalMembers,
                        presentToday: res.data.presentToday,
                        pendingLeaves: res.data.pendingLeaves,
                        efficiency: res.data.efficiency,
                        members: res.data.members || []
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse">
            LOADING SYSTEM DATA...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8">
            {/* Header Section */}
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Managerial Insight</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">
                        Real-time Enterprise Monitoring
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-slate-500">System Date</p>
                    <p className="text-sm font-bold text-indigo-600">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<FaUsers/>} label="Total Workforce" value={data.totalMembers} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard icon={<FaCheckCircle/>} label="Present Now" value={data.presentToday} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard icon={<FaClock/>} label="Open Requests" value={data.pendingLeaves} color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={<FaChartLine/>} label="Overall Efficiency" value={data.efficiency} color="text-rose-600" bg="bg-rose-50" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Employee Directory Table */}
                <div className="xl:col-span-2 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Staff Directory</h3>
                        <span className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">LIVE</span>
                    </div>
                    <div className="overflow-x-auto px-4 pb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                                    <th className="p-5">Staff Member</th>
                                    <th className="p-5">Department</th>
                                    <th className="p-5">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.members.length > 0 ? data.members.map((m) => (
                                    <tr key={m._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                        <td className="p-5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[12px] font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {m.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{m.username}</span>
                                        </td>
                                        <td className="p-5 text-xs font-bold text-slate-400 uppercase italic">
                                            {m.department || 'General'}
                                        </td>
                                        <td className="p-5">
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[9px] font-black rounded-xl uppercase tracking-widest border border-slate-100 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-all">
                                                {m.role || 'Employee'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center text-slate-300 font-bold italic text-sm">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar - Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-6 tracking-tight">Management Suite</h3>
                            <div className="space-y-3">
                                <ActionButton label="Review Leave Requests" />
                                <ActionButton label="Download Attendance Report" />
                                <ActionButton label="System Configuration" />
                            </div>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">Efficiency Insight</h4>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full w-[85%] rounded-full"></div>
                        </div>
                        <p className="mt-3 text-[10px] font-bold text-slate-400 tracking-tight leading-relaxed">
                            Your team's average productivity is currently above the monthly target.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className={`w-16 h-16 ${bg} ${color} rounded-[24px] flex items-center justify-center text-2xl shadow-inner`}>
            {icon}
        </div>
        <div>
            <h4 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{value}</h4>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] mt-1">{label}</p>
        </div>
    </div>
);

// Reusable Action Button Component
const ActionButton = ({ label }) => (
    <button className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500 text-left flex justify-between items-center group">
        {label}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </button>
);

export default ManagerDashboard;