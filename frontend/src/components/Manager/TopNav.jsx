import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';

const ManagerTopNav = () => {
  const [userData, setUserData] = useState({
    name: "User",
    role: "Manager"
  });

  useEffect(() => {
    
    const storedName = localStorage.getItem("username") || "Manager User";
    const storedRole = localStorage.getItem("role") || "Operations Manager";
    
    setUserData({
      name: storedName,
      role: storedRole
    });
  }, []);

  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      
      {/* Search Bar Section */}
      <div className="relative w-96">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input 
          type="text" 
          placeholder="Search for team members or reports..." 
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-indigo-600 transition-all p-2.5 hover:bg-slate-50 rounded-xl">
          <FaBell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* User Profile Section */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
           
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1.5">
              {userData.role}
            </p>
          </div>

          {/* Dynamic Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
              {getInitials(userData.name)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <FaChevronDown className="text-[10px] text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default ManagerTopNav;