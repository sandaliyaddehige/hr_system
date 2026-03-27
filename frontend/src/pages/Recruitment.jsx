import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBriefcase, FaUsers, FaCalendarCheck, FaUserPlus, FaTimes, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';

const Recruitment = () => {
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);  
    const [selectedJobApplicants, setSelectedJobApplicants] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
    const [currentJobTitle, setCurrentJobTitle] = useState("");

    const [formData, setFormData] = useState({ 
        title: '', 
        salary: '', 
        type: 'Remote', 
        tags: '', 
        location: 'San Francisco, CA' 
    });

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/recruitment/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const fetchApplicants = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/recruitment/applicants');
            setApplicants(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchJobs();
        fetchApplicants();
    }, []);

    
    const handleDeleteJob = async (id, e) => {
        e.stopPropagation();  
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            try {
                await axios.delete(`http://localhost:5000/api/recruitment/jobs/${id}`);
                fetchJobs();  
            } catch (err) {
                alert("Error deleting job");
            }
        }
    };

     
    const handleStatusChange = async (appId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/recruitment/applicants/status/${appId}`, { status: newStatus });
            fetchApplicants(); 
             
            setSelectedJobApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleViewApplicants = (job) => {
        const filtered = applicants.filter(app => (app.jobId?._id || app.jobId) === job._id);
        setSelectedJobApplicants(filtered);
        setCurrentJobTitle(job.title);
        setIsApplicantsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
            const finalData = { ...formData, tags: tagsArray };
            await axios.post('http://localhost:5000/api/recruitment/publish', finalData);
            setIsPublishModalOpen(false);
            setFormData({ title: '', salary: '', type: 'Remote', tags: '', location: 'San Francisco, CA' });
            fetchJobs();
        } catch (err) { alert("Error adding job"); }
    };

    const stats = [
        { label: 'Total Openings', value: jobs.length, color: 'text-blue-500', bg: 'bg-blue-50', icon: <FaBriefcase /> },
        { label: 'Total Applicants', value: applicants.length, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: <FaUsers /> },
        { label: 'Interviews Today', value: '12', color: 'text-purple-500', bg: 'bg-purple-50', icon: <FaCalendarCheck /> },
        { label: 'Hired this Month', value: '08', color: 'text-orange-500', bg: 'bg-orange-50', icon: <FaUserPlus /> },
    ];

    return (
        <div className="p-10 bg-[#f8fafc] min-h-screen relative font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Recruitment</h1>
                    <p className="text-slate-400 font-medium text-sm">Streamlining Your Hiring Journey.</p>
                </div>
                <button onClick={() => setIsPublishModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">+ Create New Post</button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-5`}>{stat.icon}</div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        <h2 className="text-3xl font-black text-slate-800">{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 mb-4 px-2">Active Job Postings</h3>
                {loading ? <p className="text-center py-10 italic">Loading Jobs...</p> : jobs.map((job) => (
                    <div key={job._id} onClick={() => handleViewApplicants(job)} className="bg-white p-8 rounded-[40px] border border-slate-50 flex justify-between items-center shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group">
                        <div className="flex-1">
                            <h3 className="font-black text-xl text-slate-800 group-hover:text-indigo-600 mb-1">{job.title}</h3>
                            <p className="text-sm text-slate-400 font-bold mb-4">{job.type} • {job.location}</p>
                            <div className="flex gap-2">
                                {job.tags.map(tag => <span key={tag} className="bg-slate-50 text-slate-500 text-[10px] font-black px-4 py-2 rounded-xl border border-slate-100">{tag}</span>)}
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                            <div>
                                <p className="text-lg font-black text-slate-800">{job.salary}</p>
                                <p className="text-[10px] text-indigo-500 font-bold uppercase">View Applicants</p>
                            </div>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => handleDeleteJob(job._id, e)}
                                className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm group/del"
                                title="Delete Posting"
                            >
                                <FaTrash size={14} className="group-hover/del:scale-110 transition-transform" />
                            </button>

                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all">
                                Publish
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL: PUBLISH JOB */}
            {isPublishModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[40px] p-10 relative">
                        <button onClick={() => setIsPublishModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500"><FaTimes size={20} /></button>
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Publish New Job</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="Salary" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                                <select className="bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-100" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option>Remote</option><option>On-site</option><option>Hybrid</option>
                                </select>
                            </div>
                            <input className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="Tags (React, Node.js)" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                            <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-[22px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700">Publish Job Posting</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: VIEW APPLICANTS */}
            {isApplicantsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 relative max-h-[85vh] overflow-y-auto">
                        <button onClick={() => setIsApplicantsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-all"><FaTimes size={24} /></button>
                        
                        <div className="mb-8">
                            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Applications for</span>
                            <h2 className="text-3xl font-black text-slate-800">{currentJobTitle}</h2>
                        </div>

                        {selectedJobApplicants.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="pb-4">Applicant</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Applied Date</th>
                                        <th className="pb-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {selectedJobApplicants.map((app) => (
                                        <tr key={app._id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="py-5">
                                                <p className="font-black text-slate-700">{app.fullName}</p>
                                                <p className="text-xs text-slate-400 font-bold">{app.email}</p>
                                            </td>
                                            <td className="py-5">
                                                <select 
                                                    value={app.status} 
                                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                    className={`text-[10px] font-black px-3 py-1 rounded-full outline-none border-none cursor-pointer uppercase ${
                                                        app.status === 'Hired' ? 'bg-emerald-50 text-emerald-600' :
                                                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                                        app.status === 'Interview' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-amber-50 text-amber-600'
                                                    }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="Interview">Interview</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Hired">Hired</option>
                                                </select>
                                            </td>
                                            <td className="py-5 text-sm text-slate-500 font-bold">{new Date(app.appliedDate).toLocaleDateString()}</td>
                                            <td className="py-5 text-right">
                                                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-sm">
                                                    <FaExternalLinkAlt size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold italic text-lg">No applicants found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitment;