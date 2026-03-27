import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
    FaFilePdf, FaFileExcel, FaChartLine, FaUsers, 
    FaMoneyCheckAlt, FaClock, FaCalendarAlt 
} from 'react-icons/fa';
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
    AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    
    // API දත්ත සඳහා States
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalSalaryExpense: 0,
        departmentDistribution: [],
        attendanceTrend: []
    });

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

     
    const fetchReportData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reports/summary', {
                headers: { 'x-auth-token': token }
            });

             
            setStats({
                totalEmployees: res.data.totalEmployees,
                totalSalaryExpense: res.data.totalSalaryExpense,
                departmentDistribution: res.data.departmentDistribution.map(d => ({
                    name: d._id || 'General',
                    value: d.count
                })),
                attendanceTrend: res.data.attendanceLast30Days.map(a => ({
                    status: a._id,
                    count: a.count
                }))
            });
            setLoading(false);
        } catch (err) {
            console.error("Report Fetch Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    
    const generatePDF = (reportTitle) => {
        const doc = new jsPDF();
        doc.text("HRM SMART - " + reportTitle, 14, 20);
        
        
        const tableColumn = ["Department", "Staff Count"];
        const tableRows = stats.departmentDistribution.map(d => [d.name, d.value]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save(`${reportTitle}.pdf`);
    };

    // 3. Excel Generation
    const generateExcel = (reportTitle) => {
        const worksheet = XLSX.utils.json_to_sheet(stats.departmentDistribution);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DeptData");
        XLSX.writeFile(workbook, `${reportTitle}.xlsx`);
    };

    const reportCards = [
        { title: 'Attendance Report', icon: <FaClock />, desc: 'Logs of daily & monthly presence', color: 'bg-blue-500' },
        { title: 'Payroll Summary', icon: <FaMoneyCheckAlt />, desc: 'Salary, OT & bonus breakdowns', color: 'bg-emerald-500' },
        { title: 'Recruitment Data', icon: <FaUsers />, desc: 'Hiring funnel & applicant stats', color: 'bg-orange-500' },
    ];

    if (loading) return <div className="p-10 font-bold">Loading Reports...</div>;

    return (
        <div className="p-10 bg-[#f8fafc] min-h-screen font-sans">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Analytics & Reports</h1>
                    <p className="text-slate-400 font-medium text-sm">Real-time dynamic data from HRM System.</p>
                </div>

                <div className="bg-white p-3 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 border-r border-slate-100">
                        <FaCalendarAlt className="text-indigo-500" />
                        <div className="flex items-center gap-2">
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="text-xs font-bold text-slate-700 outline-none w-20" />
                            <span className="text-slate-300">-</span>
                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="text-xs font-bold text-slate-700 outline-none w-20" />
                        </div>
                    </div>
                    <button onClick={fetchReportData} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700">
                        Update
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[35px] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Total Staff</p>
                    <h2 className="text-4xl font-black text-indigo-600">{stats.totalEmployees}</h2>
                </div>
                <div className="bg-white p-8 rounded-[35px] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Salary Expense</p>
                    <h2 className="text-4xl font-black text-emerald-500">Rs. {stats.totalSalaryExpense.toLocaleString()}</h2>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[45px] shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Staffing by Dept</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.departmentDistribution} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {stats.departmentDistribution.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-8 rounded-[45px] shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Attendance Overview (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.attendanceTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Export Center */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCards.map((card, i) => (
                    <div key={i} className="bg-white p-7 rounded-[40px] shadow-sm border border-slate-50 group hover:shadow-lg transition-all">
                        <div className={`w-12 h-12 ${card.color} text-white rounded-xl flex items-center justify-center mb-4`}>{card.icon}</div>
                        <h4 className="font-black text-slate-800">{card.title}</h4>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => generatePDF(card.title)} className="flex-1 bg-slate-50 py-2 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600">PDF</button>
                            <button onClick={() => generateExcel(card.title)} className="flex-1 bg-slate-50 py-2 rounded-lg text-[10px] font-bold hover:bg-emerald-50 hover:text-emerald-600">EXCEL</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;