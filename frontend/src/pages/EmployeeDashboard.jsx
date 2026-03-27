import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; 
import { 
  FaClock, 
  FaCalendarCheck, 
  FaPlaneDeparture, 
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaHistory
} from 'react-icons/fa';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastPunchIn, setLastPunchIn] = useState("--:--");
  const [lastPunchOut, setLastPunchOut] = useState("--:--");
  
  // New state for dynamic stats from backend
  const [statsData, setStatsData] = useState({
    leaveBalance: "00 Days",
    nextPayday: "00 Days"
  });

  const userName = localStorage.getItem("username") || "Employee";
  const employeeId = localStorage.getItem("userId");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (employeeId) {
      checkAttendanceStatus(); 
      fetchLeaveAndPaydayStats(); // Fetch stats when dashboard loads
    }
    return () => clearInterval(timer);
  }, [employeeId]);

  // 1. Fetch Leave Balance and Payday from Backend
  const fetchLeaveAndPaydayStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/stats/${employeeId}`);
      setStatsData({
        leaveBalance: `${res.data.leaveBalance} Days`,
        nextPayday: res.data.nextPayday
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const checkAttendanceStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`http://localhost:5000/api/attendance/status/${employeeId}/${today}`);
      
      if (res.data.isPunchedIn) {
        setIsPunchedIn(true);
        setLastPunchIn(res.data.data.punchIn || "--:--");
        
        if (res.data.isPunchedOut) {
          setIsPunchedOut(true);
          setLastPunchOut(res.data.data.punchOut || "--:--");
        }
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    }
  };

  const handleAttendanceAction = async () => {
    if (!employeeId) {
      toast.error("User ID not found. Please re-login.");
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      if (!isPunchedIn) {
        await axios.post('http://localhost:5000/api/attendance/punch-in', {
          employeeId, date: today, time: nowTime
        });
        setIsPunchedIn(true);
        setLastPunchIn(nowTime);
        toast.success("Good Morning! Punched In.");
      } else {
        await axios.put('http://localhost:5000/api/attendance/punch-out', {
          employeeId, date: today, time: nowTime
        });
        setIsPunchedOut(true);
        setLastPunchOut(nowTime);
        toast.success("Shift Ended. Punched Out.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action Failed");
    } finally {
      setLoading(false);
    }
  };

  // Stats array using dynamic data from backend
  const stats = [
    { title: 'In Time', value: lastPunchIn, icon: <FaClock />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Out Time', value: lastPunchOut, icon: <FaHistory />, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Leave Balance', value: statsData.leaveBalance, icon: <FaPlaneDeparture />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Next Payday', value: statsData.nextPayday, icon: <FaFileInvoiceDollar />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-0">
      <Toaster position="top-right" />
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Hello, {userName.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-2 font-medium italic opacity-80">"Success is the sum of small efforts repeated daily."</p>
        </div>
        <div className="text-right bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100 shadow-inner min-w-[200px]">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Current Time</p>
          <p className="text-3xl font-black text-slate-800 tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:rotate-12 transition-transform shadow-sm`}>
              {item.icon}
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.title}</p>
            <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Punch Card */}
        <div className={`lg:col-span-1 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isPunchedIn && isPunchedOut ? 'bg-slate-700' : isPunchedIn ? 'bg-rose-500' : 'bg-indigo-600'
        }`}>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Daily Attendance</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed mb-8">
                {isPunchedIn && isPunchedOut ? "Fantastic! Your shift for today has ended. Have a great evening!" : 
                 isPunchedIn ? "You are currently on shift. Remember to punch out before you head home." : 
                 "Ready to kick off your day? Please mark your attendance to start."}
              </p>
            </div>
            
            <button 
              onClick={handleAttendanceAction}
              disabled={(isPunchedIn && isPunchedOut) || loading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isPunchedIn && isPunchedOut 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-800 hover:shadow-2xl hover:scale-[1.02]'
              }`}
            >
              {loading ? 'SYNCING...' : 
               (isPunchedIn && isPunchedOut) ? 'SHIFT COMPLETED' : 
               isPunchedIn ? 'PUNCH OUT NOW' : 'PUNCH IN NOW'}
            </button>

            <div className="mt-8 flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-white/50">
              <span className="flex items-center gap-2"><FaClock className="text-white/80" /> IN: {lastPunchIn}</span>
              <span className="flex items-center gap-2"><FaHistory className="text-white/80" /> OUT: {lastPunchOut}</span>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Tasks List Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Focus Tasks</h3>
            <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { task: 'Update Recruitment Dashboard', deadline: 'Today', status: 'Priority', color: 'text-rose-500' },
              { task: 'Finalize Payroll Sheet', deadline: 'Tomorrow', status: 'Pending', color: 'text-amber-500' },
              { task: 'Client Meeting', deadline: '2:00 PM', status: 'Scheduled', color: 'text-indigo-500' }
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className={`${t.color} opacity-40 group-hover:opacity-100 transition-opacity`}><FaCheckCircle size={22} /></div>
                  <div>
                    <p className="text-sm font-black text-slate-700 tracking-tight">{t.task}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{t.deadline}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-white px-4 py-2 rounded-xl text-slate-500 shadow-sm border border-slate-100 uppercase tracking-tighter">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;