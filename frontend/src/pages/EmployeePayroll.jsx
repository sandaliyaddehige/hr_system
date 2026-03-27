import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoiceDollar, FaDownload, FaMoneyCheckAlt, FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

const EmployeePayroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const employeeId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/payroll/employee/${employeeId}`);
                setPayrolls(res.data);
            } catch (error) {
                console.error("Error fetching payroll:", error);
            }
        };
        if (employeeId) fetchPayroll();
    }, [employeeId]);

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h1 className="text-3xl font-black text-slate-800">My Payroll 💰</h1>
                <p className="text-slate-500 mt-1">View and download your monthly salary statements.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {payrolls.length > 0 ? payrolls.map((pay, index) => (
                    <div key={index} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Month & Total Header */}
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-slate-700">{pay.month} {pay.year}</h3>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Salary Statement</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-emerald-600">Rs. {pay.netSalary.toLocaleString()}</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Net Salary</span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Earnings */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                    <FaPlusCircle className="text-emerald-500" /> Earnings
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Basic Salary</span>
                                        <span className="font-bold text-slate-700">Rs. {pay.basicSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Allowances</span>
                                        <span className="font-bold text-slate-700">Rs. {pay.allowances.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div className="space-y-4 border-l border-slate-50 pl-8">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                    <FaMinusCircle className="text-rose-500" /> Deductions
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Tax / EPF</span>
                                        <span className="font-bold text-rose-500">- Rs. {pay.deductions.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-center items-end border-l border-slate-50 pl-8">
                                <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white text-xs font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">
                                    <FaDownload /> Download PDF
                                </button>
                                <p className="mt-2 text-[10px] text-slate-400 italic">Generated on {new Date(pay.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white p-20 rounded-[2.5rem] text-center border border-slate-100 shadow-sm text-slate-400 font-medium font-sans">
                        No payroll records found yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeePayroll;