/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileSpreadsheet,
  DollarSign,
  Home,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Award
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { Role } from "../types";

interface DashboardProps {
  data: any;
  activeRole: Role;
  selectedStudentId: string;
  selectedFacultyId: string;
  setActiveModule: (module: string) => void;
}

export default function Dashboard({
  data,
  activeRole,
  selectedStudentId,
  selectedFacultyId,
  setActiveModule
}: DashboardProps) {
  const { students, faculty, studentAttendance, feeDues, notices, exams, hostelRooms, placementCompanies } = data;

  // 1. CALCULATE STATS DYNAMICALLY
  const totalStudents = students.length;
  
  // Student Attendance Today (2026-07-18)
  const todayDate = "2026-07-18";
  const todayLogs = studentAttendance.filter((a: any) => a.date === todayDate);
  const presentStudentsCount = todayLogs.filter((a: any) => a.status === "Present" || a.status === "Late").length;
  const absentStudentsCount = totalStudents - presentStudentsCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudentsCount / totalStudents) * 100) : 0;

  // Faculty Present Today
  const facultyPresentCount = faculty.filter((f: any) => f.isPresentToday).length;

  // Upcoming Exams
  const upcomingExamsCount = exams.length;

  // Fee Due Students
  const feeDueStudents = feeDues.filter((f: any) => f.dueAmount > 0).length;

  // Hostel Occupancy
  const totalHostelBeds = hostelRooms.reduce((acc: number, room: any) => acc + room.capacity, 0);
  const totalOccupants = hostelRooms.reduce((acc: number, room: any) => acc + room.occupants.length, 0);
  const hostelOccupancyRate = totalHostelBeds > 0 ? Math.round((totalOccupants / totalHostelBeds) * 100) : 0;

  // --- CHART DATA GENERATION ---
  
  // Chart A: Attendance Rate Over Recent semesters/months
  const attendanceTrends = [
    { month: "Jan", attendance: 92 },
    { month: "Feb", attendance: 94 },
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 95 },
    { month: "May", attendance: 91 },
    { month: "Jun", attendance: 93 },
    { month: "Jul", attendance: attendanceRate || 90 }
  ];

  // Chart B: Fee Payments (Paid vs Pending)
  const totalFeeExpected = feeDues.reduce((acc: number, f: any) => acc + f.totalFee, 0);
  const totalFeeCollected = feeDues.reduce((acc: number, f: any) => acc + f.paidAmount, 0);
  const totalFeePending = feeDues.reduce((acc: number, f: any) => acc + f.dueAmount, 0);

  const feeAllocation = [
    { name: "Collected Fees", value: totalFeeCollected, color: "#10B981" },
    { name: "Overdue Pending", value: totalFeePending, color: "#EF4444" }
  ];

  // Chart C: Grade Distribution
  const gpaRanges = [
    { range: "9.0 - 10.0 (O)", count: students.filter((s: any) => s.academicGpa >= 9.0).length },
    { range: "8.0 - 8.9 (A+)", count: students.filter((s: any) => s.academicGpa >= 8.0 && s.academicGpa < 9.0).length },
    { range: "7.0 - 7.9 (A)", count: students.filter((s: any) => s.academicGpa >= 7.0 && s.academicGpa < 8.0).length },
    { range: "Below 7.0 (B/C)", count: students.filter((s: any) => s.academicGpa < 7.0).length }
  ];

  // Colors for Recharts
  const PIE_COLORS = ["#10B981", "#EF4444"];

  // Custom Greetings based on role
  const getGreeting = () => {
    switch (activeRole) {
      case Role.ADMIN:
        return { title: "Welcome back, Administrator", subtitle: "System performance & live operational health logs are clear today." };
      case Role.FACULTY: {
        const fac = faculty.find((f: any) => f.id === selectedFacultyId) || faculty[0];
        return { title: `Hello, Dr. ${fac?.name?.split(" ").pop()}`, subtitle: `Department of ${fac?.department}. You have classes today.` };
      }
      case Role.STUDENT: {
        const stud = students.find((s: any) => s.id === selectedStudentId) || students[0];
        return { title: `Welcome, ${stud?.name}`, subtitle: `Roll No: ${stud?.rollNo} | Semester: ${stud?.semester}. Check your timetable below.` };
      }
      case Role.PARENT: {
        const stud = students.find((s: any) => s.id === selectedStudentId) || students[0];
        return { title: `Parent Dashboard: ${stud?.name}`, subtitle: `Tracking academic health, fee dues, and daily logs for ${stud?.name}.` };
      }
    }
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* 1. VIBRANT BENTO GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-600/20 to-amber-600/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <TrendingUp className="h-3 w-3 text-indigo-400 animate-pulse" /> Live Campus Snapshot • EduPulse ERP
          </span>
          <h1 className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent">
            {greeting.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300/90 font-medium">
            {greeting.subtitle}
          </p>
        </div>
      </div>

      {/* 2. STATS BENTO GRID (EXTREMELY COLORFUL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Students - Violet/Indigo Theme */}
        <div className="rounded-3xl border-2 border-indigo-100 dark:border-indigo-950/40 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white dark:to-zinc-900 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-500/25 shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-emerald-500 text-xs font-bold font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">+12%</span>
          </div>
          <div className="mt-6">
            <h3 className="text-indigo-600/80 dark:text-indigo-400/80 text-[11px] font-bold uppercase tracking-widest font-mono">Total Students</h3>
            <p className="text-4xl font-black tracking-tight text-gray-950 dark:text-white mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{totalStudents}</p>
            <p className="mt-2.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold font-mono flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setActiveModule("students")}>
              View Roster <ArrowUpRight className="h-3 w-3 animate-bounce" />
            </p>
          </div>
        </div>

        {/* Metric 2: Attendance - Emerald/Teal Theme */}
        <div className="rounded-3xl border-2 border-emerald-100 dark:border-emerald-950/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-zinc-900 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className={`rounded-2xl p-3 transition-colors bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/25 shadow-sm`}>
              <CheckCircle className="h-6 w-6" />
            </div>
            <span className="text-teal-600 dark:text-teal-400 text-xs font-bold font-mono bg-teal-500/10 px-2.5 py-0.5 rounded-full">Target: 95%</span>
          </div>
          <div className="mt-6">
            <h3 className="text-emerald-600/80 dark:text-emerald-400/80 text-[11px] font-bold uppercase tracking-widest font-mono">Today's Attendance</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{attendanceRate}%</p>
              <span className="text-[10px] text-rose-500 dark:text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">{absentStudentsCount} Absent</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {presentStudentsCount} of {totalStudents} present today
            </p>
          </div>
        </div>

        {/* Metric 3: Faculty - Amber/Orange Theme */}
        <div className="rounded-3xl border-2 border-amber-100 dark:border-amber-950/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-zinc-900 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-600 dark:text-amber-400 transition-colors group-hover:bg-amber-500/25 shadow-sm">
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="flex -space-x-1.5">
              <div className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-amber-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">A</div>
              <div className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-orange-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">B</div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-amber-600/80 dark:text-amber-400/80 text-[11px] font-bold uppercase tracking-widest font-mono">Faculty Present</h3>
            <p className="text-4xl font-black tracking-tight text-gray-950 dark:text-white mt-1 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {facultyPresentCount}<span className="text-lg font-normal text-slate-400 dark:text-zinc-600">/{faculty.length}</span>
            </p>
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-bold font-mono">
              ★ All schedules synced
            </p>
          </div>
        </div>

        {/* Metric 4: Fee Dues - Rose/Pink Theme */}
        <div className="rounded-3xl border-2 border-rose-100 dark:border-rose-950/40 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-white dark:to-zinc-900 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(244,63,94,0.15)] hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-600 dark:text-rose-400 transition-colors group-hover:bg-rose-500/25 shadow-sm">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">Urgent Alert</span>
          </div>
          <div className="mt-6">
            <h3 className="text-rose-600/80 dark:text-rose-400/80 text-[11px] font-bold uppercase tracking-widest font-mono">Pending Fees</h3>
            <p className="text-4xl font-black tracking-tight text-rose-600 dark:text-rose-400 mt-1">
              {feeDueStudents}<span className="text-sm font-bold text-slate-400 ml-1">Students</span>
            </p>
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-bold font-mono flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setActiveModule("fees")}>
              Overdue: ${(totalFeePending / 1000).toFixed(0)}k <ArrowUpRight className="h-3 w-3" />
            </p>
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTIONS - BENTO ROW (HIGH CONTRST & GRADIENTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Attendance Trends (Col span 2) */}
        <div className="rounded-3xl border-2 border-indigo-100 dark:border-indigo-950/40 bg-white dark:bg-zinc-900 p-6 shadow-sm lg:col-span-2 flex flex-col hover:border-indigo-200 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 dark:border-zinc-800/60 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-950 dark:text-white text-lg">Attendance Analytics</h4>
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping"></span>
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Weekly trends across Hotel Management & Culinary Programs</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Weekly Session Stream
              </div>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="attendanceGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" className="hidden dark:block" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[70, 100]} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid #E2E8F0', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold'
                  }} 
                />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={5} dot={{ r: 6, strokeWidth: 3, stroke: '#6366f1', fill: '#ffffff' }} activeDot={{ r: 9, strokeWidth: 1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Fee Balance Breakdown - Colored Pie */}
        <div className="rounded-3xl border-2 border-pink-100 dark:border-pink-950/40 bg-gradient-to-b from-pink-500/5 to-transparent dark:from-pink-950/10 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between hover:border-pink-200 transition-all duration-300">
          <div className="border-b border-slate-50 dark:border-zinc-800/60 pb-4">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-gray-950 dark:text-white text-lg">Fee Balance Breakdown</h4>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">Sync Active</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Visualizing cleared vs overdue balances</p>
          </div>
          <div className="mt-6 flex-1 flex flex-col justify-center items-center">
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {feeAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Collected</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round((totalFeeCollected / (totalFeeExpected || 1)) * 100)}%
                </span>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="mt-4 w-full space-y-2">
              {feeAllocation.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.15)]" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-500 dark:text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white font-black">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BROADCASTS & HISTOGRAM & HOSTEL BENTO ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Notice Board Broadcasts (Col span 2) */}
        <div className="rounded-3xl border-2 border-indigo-100 dark:border-zinc-850/60 bg-white dark:bg-zinc-900 p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800/60 pb-4">
              <div>
                <h4 className="font-bold text-gray-950 dark:text-white text-lg">Notice Board</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Live campus bulletins and alerts</p>
              </div>
              <button
                onClick={() => setActiveModule("notices")}
                className="text-xs font-black text-indigo-600 hover:underline dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-500/25"
              >
                See All
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {notices.slice(0, 2).map((notice: any) => {
                let borderTheme = "border-slate-200 dark:border-zinc-800";
                if (notice.category === "Exam") borderTheme = "border-l-4 border-l-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.05)]";
                if (notice.category === "Placement") borderTheme = "border-l-4 border-l-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.05)]";
                if (notice.category === "Event") borderTheme = "border-l-4 border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
                if (notice.category === "Fee Due") borderTheme = "border-l-4 border-l-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]";

                return (
                  <div key={notice.id} className={`rounded-2xl border border-slate-100 dark:border-zinc-800/80 p-4 bg-slate-50/40 dark:bg-zinc-900/40 hover:bg-slate-50 dark:hover:bg-zinc-850/30 transition-colors ${borderTheme}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                          {notice.category}
                        </span>
                        <h5 className="mt-1 font-bold text-gray-900 dark:text-white text-xs leading-snug">
                          {notice.title}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono whitespace-nowrap">{notice.date}</span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                      {notice.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/40 flex justify-between items-center text-[10px] font-bold font-mono text-slate-400 uppercase">
            <span>Powered by Digital Board</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* GPA Range Distribution - Colorful bar chart */}
        <div className="rounded-3xl border-2 border-purple-100 dark:border-purple-950/40 bg-gradient-to-b from-purple-500/5 to-transparent bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all duration-300">
          <div>
            <div className="border-b border-slate-50 dark:border-zinc-800/60 pb-4">
              <h4 className="font-bold text-gray-950 dark:text-white text-lg">Academics Info</h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">CGPA distribution ranges</p>
            </div>
            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gpaRanges}>
                  <XAxis dataKey="range" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                    {gpaRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : index === 1 ? "#6366f1" : index === 2 ? "#3b82f6" : "#f43f5e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 text-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 p-3 rounded-2xl border border-emerald-500/20 shadow-[0_4px_15px_rgba(16,185,129,0.05)]">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-black tracking-widest block font-mono">Excellent rate (GPA &gt; 8.0)</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {Math.round(((students.filter((s: any) => s.academicGpa >= 8.0).length) / (students.length || 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Hostel Quick Stats (Col span 1) - Dark/Vibrant Blue Gradient */}
        <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl flex flex-col justify-between text-white border border-indigo-500/30 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-indigo-500/20 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono">Hostel & Mess</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h4 className="text-xl font-black leading-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Campus Living</h4>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Beds Occupancy</span>
                  <span className="font-extrabold text-indigo-400">{hostelOccupancyRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${hostelOccupancyRate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 pt-1">
                <span>Total beds: {totalHostelBeds}</span>
                <span className="text-emerald-400">{totalHostelBeds - totalOccupants} free</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-black font-mono">Manage Housing</span>
            <button
              onClick={() => setActiveModule("hostel")}
              className="h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center text-white font-black"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
