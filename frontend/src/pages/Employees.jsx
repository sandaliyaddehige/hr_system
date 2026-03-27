import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaSearch, FaPhone, FaEnvelope, FaTimes, 
  FaEdit, FaTrash, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

const Employees = () => {
  // States
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 6;

  const [newEmp, setNewEmp] = useState({
    name: '', role: '', email: '', phone: '', dept: '', joinDate: '', status: 'Active', image: null
  });

  // --- 1. Fetch Data from Backend ---
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employee');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // --- 2. Submit Logic (Add/Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/employee/${currentEmpId}`, newEmp);
      } else {
        await axios.post('http://localhost:5000/api/employee', newEmp);
      }
      fetchEmployees();
      closeModal();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Check if backend is running.");
    }
  };

  // --- 3. Delete Logic ---
  const deleteEmployee = async (id) => {
    if(window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employee/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    setNewEmp({ ...newEmp, [e.target.name]: e.target.value });
  };

  const openEditModal = (emp) => {
    
    const formattedDate = emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : "";
    
    setNewEmp({ ...emp, joinDate: formattedDate });
    setCurrentEmpId(emp._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewEmp({ name: '', role: '', email: '', phone: '', dept: '', joinDate: '', status: 'Active', image: null });
  };

  // --- 4. Search Logic (SAFE Version) ---
  const filteredEmployees = employees.filter(emp => {
    const name = emp.name ? emp.name.toLowerCase() : "";
    const role = emp.role ? emp.role.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || role.includes(search);
  });

  // Pagination Logic
  const indexOfLastEmp = currentPage * employeesPerPage;
  const indexOfFirstEmp = indexOfLastEmp - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmp, indexOfLastEmp);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="p-2 md:p-6 min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Employee Management</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your workforce of {employees.length} members</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name or role..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none shadow-sm transition-all font-medium text-slate-700"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEmployees.map((emp) => (
          <div key={emp._id} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {emp.status}
            </div>

            <div className="flex items-center gap-5 mb-6">
              <img 
                src={`https://ui-avatars.com/api/?name=${emp.name}&background=4f46e5&color=fff`} 
                alt={emp.name} 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{emp.name}</h3>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-wide">{emp.role}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <FaEnvelope className="text-slate-400" /> <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <FaPhone className="text-slate-400" /> {emp.phone || "No phone"}
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(emp)} className="flex-1 bg-slate-50 hover:bg-indigo-50 text-indigo-600 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold text-xs"><FaEdit /> Edit</button>
              <button onClick={() => deleteEmployee(emp._id)} className="flex-1 bg-slate-50 hover:bg-rose-50 text-rose-600 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold text-xs"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <span className="font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">{isEditing ? "Update Profile" : "Add New Employee"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><FaTimes className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input name="name" value={newEmp.name} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Role</label>
                <input name="role" value={newEmp.role} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Department</label>
                <input name="dept" value={newEmp.dept} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                <input name="email" type="email" value={newEmp.email} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                <input name="phone" value={newEmp.phone} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Join Date</label>
                <input name="joinDate" type="date" value={newEmp.joinDate} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
              
              <button type="submit" className="col-span-2 mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
                {isEditing ? "Save Changes" : "Confirm & Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;