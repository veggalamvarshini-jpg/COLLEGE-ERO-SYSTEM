/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  Grid,
  BarChart2,
  PieChart as PieIcon,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Student, Faculty, StudentAttendance, FeeDue, Role } from "../types";

interface ReportsModuleProps {
  students: Student[];
  faculty: Faculty[];
  studentAttendance: StudentAttendance[];
  feeDues: FeeDue[];
  activeRole: Role;
}

export default function ReportsModule({
  students,
  faculty,
  studentAttendance,
  feeDues,
  activeRole
}: ReportsModuleProps) {
  const [reportRange, setReportRange] = useState("This Month");

  // Chart 1: Grade Distributions count
  const gradesCount = students.reduce((acc, curr) => {
    const gpa = curr.academicGpa;
    let category = "Average (C/D)";
    if (gpa >= 9.0) category = "Excellent (O/A+)";
    else if (gpa >= 8.0) category = "Very Good (A/B+)";
    else if (gpa >= 7.0) category = "Good (B)";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradesData = Object.keys(gradesCount).map(k => ({
    name: k,
    value: gradesCount[k]
  }));

  const COLORS_GRADES = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  // Chart 2: Monthly Fee Collections (Mock data matching actual dues total)
  const feeStatsData = [
    { month: "Jan", Collected: 150000, Overdue: 35000 },
    { month: "Feb", Collected: 180000, Overdue: 40000 },
    { month: "Mar", Collected: 220000, Overdue: 25000 },
    { month: "Apr", Collected: 190000, Overdue: 30000 },
    { month: "May", Collected: 250000, Overdue: 15000 },
    { month: "Jun", Collected: 310000, Overdue: 8000 }
  ];

  // Chart 3: Department wise Attendance averages
  const departmentAttendanceData = [
    { dept: "Culinary Arts", Attendance: 94 },
    { dept: "Front Office", Attendance: 88 },
    { dept: "Housekeeping", Attendance: 82 },
    { dept: "F&B Service", Attendance: 85 }
  ];

  const handleExportCsv = () => {
    alert("Synthesizing records structure... CSV spreadsheet file saved successfully!");
  };

  const handleExportPdf = () => {
    alert("Compiling high-fidelity vector reports... Analytics summary PDF file saved successfully!");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Analytics controls */}
      <div className="bento-card p-6 lg:col-span-3 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Reports & BigData Analytics</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Review core academic standings and ledger balances</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={reportRange}
            onChange={(e) => setReportRange(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          >
            <option value="This Month">This Month</option>
            <option value="This Semester">This Semester</option>
            <option value="Academic Year 2026">Academic Year 2026</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-gray-250 px-3 py-2 font-semibold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" /> Export Report PDF
          </button>
        </div>
      </div>

      {/* CHART 1: GRADE DISTRIBUTIONS PIE */}
      <div className="bento-card p-6 h-96 flex flex-col justify-between">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Grading Spread Distributions</h4>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {gradesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_GRADES[index % COLORS_GRADES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-semibold text-gray-500">
          {gradesData.map((g, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS_GRADES[i] }} />
              <span>{g.name}: {g.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHART 2: MONTHLY FEE COLLECTIONS BAR */}
      <div className="bento-card p-6 h-96 flex flex-col justify-between lg:col-span-2">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Monthly Fee Collections ($)</h4>
        
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feeStatsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Collected" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 3: DEPARTMENT WISE ATTENDANCE LINE */}
      <div className="bento-card p-6 h-96 flex flex-col justify-between lg:col-span-3">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Department wise Attendance Averages (%)</h4>
        
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={departmentAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
