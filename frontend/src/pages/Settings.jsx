import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaUser, FaLock, FaCheckCircle, FaSpinner, FaShieldAlt, FaIdCard, FaEnvelope, FaCircle } from 'react-icons/fa';
import axios from 'axios';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    id: '', username: '', email: '', phone: '', profilePic: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?.id || storedUser?._id;
        const token = localStorage.getItem('token');
        if (!userId) return setLoading(false);

        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setUserData({
          id: res.data._id,
          username: res.data.username || res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          profilePic: res.data.profileImage || ''
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Profile Update Function
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/update-profile/${userData.id}`, userData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSaveLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setSaveLoading(false);
      alert("Update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fe] text-slate-800 font-sans">
      
      {/* Top Header */}
      <div className="w-full px-8 py-8 flex justify-between items-center bg-white border-b border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Account Settings</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-center md:text-left">Management Dashboard / Settings</p>
        </div>
        
        {/* GREEN ONLINE BULB SECTION */}
        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-100/50">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* LEFT CARD: PROFILE INFO */}
          <div className="bg-white rounded-[32px] border border-white shadow-xl shadow-slate-200/50 p-8 md:p-10 transition-all">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm"><FaUser size={20}/></div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Profile Details</h2>
              </div>
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 border border-emerald-100">
                <FaCheckCircle className="text-emerald-500" /> Verified
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start mb-12">
              {/* Profile Pic Upload */}
              <div className="relative group">
                <div className="w-36 h-36 rounded-[44px] overflow-hidden ring-8 ring-slate-50 shadow-2xl relative border-4 border-white">
                  <img 
                    src={userData.profilePic ? `http://localhost:5000${userData.profilePic}` : `https://ui-avatars.com/api/?name=${userData.username}&background=4f46e5&color=fff&size=150`} 
                    alt="User" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]" 
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCamera className="text-white text-3xl transform scale-75 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
              </div>

              {/* User Meta */}
              <div className="text-center sm:text-left pt-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{userData.username}</h3>
                <p className="text-slate-400 font-bold flex items-center gap-2 justify-center sm:justify-start mt-1">
                  <FaEnvelope className="text-indigo-400" /> {userData.email}
                </p>
                <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                   <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Employee</span>
                   <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">Admin Panel</span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6 pt-6 border-t border-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Public Display Name</label>
                  <div className="relative group">
                    <FaIdCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="text" 
                      value={userData.username}
                      onChange={(e) => setUserData({...userData, username: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Primary Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="email" 
                      value={userData.email}
                      disabled
                      className="w-full bg-slate-100/50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-6 font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
                >
                  {saveLoading ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT CARD: SECURITY */}
          <div className="bg-white rounded-[32px] border border-white shadow-xl shadow-slate-200/50 p-8 md:p-10 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3.5 bg-rose-50 rounded-2xl text-rose-500 shadow-sm"><FaShieldAlt size={20}/></div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Security & Key</h2>
              </div>

              <div className="p-6 mb-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                 <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80 text-emerald-400">Security Active</h4>
                 <p className="text-xs font-medium leading-relaxed opacity-60">To protect your account, your password should be unique. Use symbols and capital letters.</p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Current Security Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">New Password</label>
                    <input 
                      type="password" 
                      placeholder="New Key"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirm Key</label>
                    <input 
                      type="password" 
                      placeholder="Repeat New Key"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 px-6 font-bold focus:bg-white focus:border-rose-400 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end mt-12">
              <button 
                type="submit" 
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-300 hover:bg-black active:scale-95 transition-all flex items-center gap-3"
              >
                Update Security
              </button>
            </div>
          </div>
        </div>

        {/* System Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em]">Smart HRM Infrastructure v2.6.4</p>
        </div>

      </div>
    </div>
  );
};

export default Settings;