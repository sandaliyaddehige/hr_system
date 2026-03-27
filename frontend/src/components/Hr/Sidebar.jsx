import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaThLarge, FaUsers, FaMoneyCheckAlt, FaCalendarCheck, 
    FaUserPlus, FaCog, FaSignOutAlt, FaChevronRight 
} from 'react-icons/fa';

import LogoImage from '../../assets/logo.webp'; 

const HrSidebar = () => {
    // --- Logout Function ---
    const handleLogout = () => {
        localStorage.clear(); 
        window.location.href = '/login'; 
    };

    const menuItems = [
        { name: 'Dashboard', icon: <FaThLarge />, path: '/HRDashboard' },
        { name: 'Employees', icon: <FaUsers />, path: '/Employees' },
        { name: 'Payroll', icon: <FaMoneyCheckAlt />, path: '/payroll' },
        { name: 'Attendance', icon: <FaCalendarCheck />, path: '/attendance' },
        { name: 'Recruitment', icon: <FaUserPlus />, path: '/recruitment' },
        { name: 'Settings', icon: <FaCog />, path: '/settings' },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm fixed left-0 top-0 font-sans z-50">
            
            {/* --- Logo Section --- */}
            <div className="px-6 py-8 border-b border-slate-50 flex items-center gap-3.5">
                
                <div className="w-11 h-11 bg-slate-50 rounded-2xl p-1.5 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
                    <img 
                        src={LogoImage} 
                        alt="HRM Smart Logo" 
                        className="w-full h-full object-contain" 
                    />
                </div>
                {/* Brand Text */}
                <div>
                    <h1 className="text-sm font-black text-slate-900 tracking-tight italic leading-none">
                        HRM<span className="text-indigo-600">Smart</span>
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-sm shadow-violet-200"></span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">HR STAFF</p>
                    </div>
                </div>
            </div>

            {/* --- Navigation Links (Fixed isActive logic) --- */}
            <nav className="flex-1 px-5 py-8 space-y-2.5 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                isActive 
                                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-100' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg transition-transform group-hover:scale-110">
                                        {item.icon}
                                    </span>
                                    <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                                </div>
                                <FaChevronRight className={`text-[10px] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* --- Logout Section --- */}
            <div className="p-6 border-t border-slate-50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3.5 px-5 py-4 text-red-600 bg-red-50/50 hover:bg-red-50 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest cursor-pointer border border-transparent hover:border-red-100 shadow-sm"
                >
                    <FaSignOutAlt className="text-base" />
                    <span>Logout System</span>
                </button>
            </div>
        </div>
    );
};

export default HrSidebar;