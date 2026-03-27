import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';

const TopNav = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem('username') || "User", // මුලින්ම localStorage එකේ නම පෙන්වන්න
    role: localStorage.getItem('role') || "Employee",
    profilePic: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId'); 
        const token = localStorage.getItem('token');
        
        if (userId && token) {
          const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data) {
            setUser({
              name: res.data.username, 
              role: res.data.role,
              profilePic: res.data.profileImage
            });
            // අලුත් දත්ත localStorage එකෙත් update කරමු
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', res.data.role);
          }
        }
      } catch (error) {
        console.error("TopNav: Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Search Bar */}
      <div className="relative w-96">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input 
          type="text" 
          placeholder="Search for anything..."
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <FaBell />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right">
            {/* නම Capitalize කරලා පෙන්වන්න */}
            <h4 className="text-sm font-bold text-slate-800 leading-none capitalize">
              {user.name}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">
              {user.role}
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={user.profilePic ? `http://localhost:5000${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <FaChevronDown className="text-[10px] text-slate-400 ml-1" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;