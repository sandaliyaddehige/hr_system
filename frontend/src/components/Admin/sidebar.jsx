import React from 'react';
import { FaThLarge, FaUsers, FaMoneyCheckAlt, FaCalendarCheck, FaUserPlus, FaFileAlt, FaCog, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import LogoImage from "../../assets/logo.webp";

const Sidebar = () => {
    // --- ලොග් අවුට් ෆන්ක්ෂන් එක ---
    const handleLogout = () => {
        localStorage.clear(); 
        
        window.location.href = '/login'; 
    };

    const menuItems = [
        { name: 'Dashboard', icon: <FaThLarge />, path: '/Admindashboard' },
        { name: 'Employees', icon: <FaUsers />, path: '/Employees' },
        { name: 'Payroll', icon: <FaMoneyCheckAlt />, path: '/payroll' },
        { name: 'Attendance', icon: <FaCalendarCheck />, path: '/attendance' },
        { name: 'Recruitment', icon: <FaUserPlus />, path: '/recruitment' },
        { name: 'Reports', icon: <FaFileAlt />, path: '/reports' },
        { name: 'Settings', icon: <FaCog />, path: '/settings' },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm sticky top-0 overflow-y-auto font-sans">
            {/* --- 1. Top Section (Logo + Text) --- */}
            <div className="px-6 py-8 border-b border-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                    {/* Logo Container  */}
                    <div className="w-11 h-11 bg-slate-50 rounded-2xl p-1.5 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
                        <img 
                            src={LogoImage} 
                            alt="HRM Smart Logo" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                    {/* Text Section (Business Name + Portal) */}
                    <div>
                        <h1 className="text-sm font-black text-slate-900 tracking-tight italic">
                            HRM<span className="text-indigo-600">Smart</span>
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200"></span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">ADMIN PORTAL</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. Navigation Section (Links) --- */}
            <nav className="flex-1 px-5 py-8 space-y-2.5">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                                isActive 
                                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-100' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`
                        }
                    >
                        <div className="flex items-center gap-4">
                            <span className={`text-lg transition-colors group-hover:scale-110 ${false ? 'text-white' : 'text-inherit'}`}>
                                {item.icon}
                            </span>
                            <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                        </div>
                        
                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-white group-hover:block hidden">
                            <FaChevronRight/>
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* --- 3. Bottom Section (Logout Button) --- */}
            <div className="p-6 border-t border-slate-50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3.5 px-5 py-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest cursor-pointer border-2 border-transparent hover:border-red-200"
                >
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout System</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;