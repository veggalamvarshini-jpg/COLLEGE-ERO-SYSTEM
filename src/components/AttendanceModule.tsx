/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  X,
  QrCode,
  Fingerprint,
  Radio,
  Clock,
  Play,
  Square,
  RefreshCw,
  Users,
  CheckSquare,
  TrendingUp,
  Award
} from "lucide-react";
import { Student, Faculty, StudentAttendance, Role } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface AttendanceModuleProps {
  students: Student[];
  faculty: Faculty[];
  studentAttendance: StudentAttendance[];
  onAddStudentAttendance: (log: StudentAttendance) => void;
  onFacultyCheckIn: (payload: { facultyId: string; time: string }) => void;
  onFacultyCheckOut: (payload: { facultyId: string; time: string; hours: number }) => void;
  activeRole: Role;
  selectedStudentId: string;
  selectedFacultyId: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
        <p className="font-mono text-[10px] font-bold text-gray-400 dark:text-zinc-500">{label}</p>
        <p className="mt-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
          Attendance: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function AttendanceModule({
  students,
  faculty,
  studentAttendance,
  onAddStudentAttendance,
  onFacultyCheckIn,
  onFacultyCheckOut,
  activeRole,
  selectedStudentId,
  selectedFacultyId
}: AttendanceModuleProps) {
  const [selectedDate, setSelectedDate] = useState("2026-07-18");
  const [activeTab, setActiveTab] = useState<"student" | "faculty">("student");

  // Hardware scanner simulations
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerType, setScannerType] = useState<"QR" | "NFC" | "Fingerprint">("QR");
  const [scannedMessage, setScannedMessage] = useState("");
  const [targetStudentForScan, setTargetStudentForScan] = useState(students[0]?.id || "");

  // Chart-related selection and sync
  const [chartStudentId, setChartStudentId] = useState(selectedStudentId || students[0]?.id || "");

  useEffect(() => {
    if (selectedStudentId) {
      setChartStudentId(selectedStudentId);
    }
  }, [selectedStudentId]);

  // Helper to get historical monthly attendance for a student
  const getStudentMonthlyData = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];

    // Seed value based on student academic performance to make it deterministic but unique
    const baseRate = student.academicGpa ? (student.academicGpa * 8) + 20 : 85; 
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    
    // Calculate actual July logs
    const julyLogs = studentAttendance.filter(a => a.studentId === studentId && a.date.startsWith("2026-07"));
    let julyRate = baseRate;
    if (julyLogs.length > 0) {
      const presentCount = julyLogs.filter(l => l.status === "Present" || l.status === "Late").length;
      julyRate = (presentCount / julyLogs.length) * 100;
    }

    return months.map((month, idx) => {
      let rate = baseRate;
      if (month === "Jul") {
        rate = julyRate;
      } else {
        const seed = (studentId.charCodeAt(2) || 1) + idx;
        rate = baseRate + (seed % 7) - 3;
      }
      rate = Math.max(50, Math.min(100, Math.round(rate)));
      return {
        month,
        percentage: rate,
      };
    });
  };

  // Faculty punch states
  const currentFaculty = faculty.find(f => f.id === selectedFacultyId) || faculty[0];

  const handleManualMark = (studentId: string, status: "Present" | "Absent" | "Late") => {
    onAddStudentAttendance({
      studentId,
      date: selectedDate,
      status,
      markedBy: activeRole === Role.FACULTY ? `Dr. ${currentFaculty?.name.split(" ").pop()}` : "Admin Terminal",
      method: "Manual"
    });
  };

  const handleSimulateScan = () => {
    if (!targetStudentForScan) return;
    setScannerActive(true);
    setScannedMessage("Initializing local terminal hardware...");
    
    setTimeout(() => {
      setScannedMessage("Establishing secure handshakes with device...");
    }, 800);

    setTimeout(() => {
      const studentObj = students.find(s => s.id === targetStudentForScan);
      if (studentObj) {
        onAddStudentAttendance({
          studentId: targetStudentForScan,
          date: selectedDate,
          status: "Present",
          markedBy: "Biometric Hardware Gate 4",
          method: scannerType === "QR" ? "QR Scanner" : scannerType === "NFC" ? "NFC" : "Fingerprint"
        });
        setScannedMessage(`SUCCESS! Marked ${studentObj.name} (${studentObj.rollNo}) as present via ${scannerType}.`);
      }
    }, 2000);
  };

  const handleFacultyPunchIn = () => {
    if (!currentFaculty) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onFacultyCheckIn({
      facultyId: currentFaculty.id,
      time: timeStr
    });
  };

  const handleFacultyPunchOut = () => {
    if (!currentFaculty) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Simulate working 8 hours today
    onFacultyCheckOut({
      facultyId: currentFaculty.id,
      time: timeStr,
      hours: 8
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Switchers */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("student")}
          className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "student"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" /> Student Attendance Register
        </button>
        {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
          <button
            onClick={() => setActiveTab("faculty")}
            className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "faculty"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Clock className="h-4 w-4" /> Faculty Punch Terminal
          </button>
        )}
      </div>

      {activeTab === "student" ? (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Register */}
          <div className="bento-card p-6 lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Attendance Roster</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Record and review daily lecture attendance</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-mono dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>

            {/* List of students with instant marks */}
            <div className="mt-5 space-y-3">
              {students.map((student) => {
                const logs = studentAttendance.filter(a => a.studentId === student.id && a.date === selectedDate);
                const currentStatus = logs[logs.length - 1]?.status || null;
                const currentMethod = logs[logs.length - 1]?.method || null;

                return (
                  <div key={student.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xs">{student.name}</h4>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {student.rollNo} | {student.course.split(" ").pop()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentStatus ? (
                        <div className="flex flex-col items-end">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            currentStatus === "Present"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : currentStatus === "Absent"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          }`}>
                            {currentStatus}
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono mt-0.5">{currentMethod || "Manual"}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Not Marked</span>
                      )}

                      {/* Manual Action buttons (Only for Faculty and Admin) */}
                      {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                        <div className="flex items-center gap-1 border-l border-gray-100 pl-3 ml-2 dark:border-zinc-800">
                          <button
                            onClick={() => handleManualMark(student.id, "Present")}
                            className="rounded-lg p-1 hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/20"
                            title="Mark Present"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleManualMark(student.id, "Absent")}
                            className="rounded-lg p-1 hover:bg-red-50 text-red-600 dark:hover:bg-red-950/20"
                            title="Mark Absent"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Device Simulation Hub */}
          <div className="bento-card p-6 space-y-5">
            <div className="border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Smart Hardware Gate</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Simulate Biometric/NFC campus hardware</p>
            </div>

            {/* Hardware selector buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "QR", label: "QR Code", icon: QrCode },
                { id: "NFC", label: "NFC Tag", icon: Radio },
                { id: "Fingerprint", label: "Fingerprint", icon: Fingerprint }
              ].map(dev => {
                const Icon = dev.icon;
                return (
                  <button
                    key={dev.id}
                    onClick={() => {
                      setScannerType(dev.id as any);
                      setScannerActive(false);
                      setScannedMessage("");
                    }}
                    className={`rounded-xl p-2.5 flex flex-col items-center justify-center border text-[10px] font-bold gap-1.5 transition-all ${
                      scannerType === dev.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400"
                        : "border-gray-100 text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-950"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{dev.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulator Interactive Area */}
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col items-center justify-center text-center space-y-4">
              <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border shadow ${
                scannerActive ? "border-indigo-500 animate-pulse" : "border-gray-100"
              }`}>
                {scannerType === "QR" && <QrCode className={`h-11 w-11 ${scannerActive ? "text-indigo-600" : "text-gray-400"}`} />}
                {scannerType === "NFC" && <Radio className={`h-11 w-11 ${scannerActive ? "text-indigo-600" : "text-gray-400"}`} />}
                {scannerType === "Fingerprint" && <Fingerprint className={`h-11 w-11 ${scannerActive ? "text-indigo-600 animate-pulse" : "text-gray-400"}`} />}
                
                {/* Simulated Laser bar */}
                {scannerActive && (
                  <div className="absolute left-0 right-0 h-[2px] bg-indigo-600 shadow shadow-indigo-400 animate-[bounce_1.5s_infinite]" />
                )}
              </div>

              <div className="w-full text-xs">
                <label className="block text-gray-500 text-[10px] mb-1 font-semibold uppercase tracking-wider font-mono">
                  Select Student's Card/Finger
                </label>
                <select
                  value={targetStudentForScan}
                  onChange={(e) => {
                    setTargetStudentForScan(e.target.value);
                    setScannerActive(false);
                    setScannedMessage("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSimulateScan}
                className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Scan Credentials
              </button>

              {scannedMessage && (
                <div className={`text-[10px] font-mono leading-relaxed p-2.5 rounded-lg border w-full text-left ${
                  scannedMessage.includes("SUCCESS")
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400"
                    : "bg-gray-100 border-gray-200 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                }`}>
                  {scannedMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Data Visualization & Analytics */}
        {(() => {
          const chartStudent = students.find(s => s.id === chartStudentId);
          const studentLogs = studentAttendance.filter(a => a.studentId === chartStudentId);
          const julyLogs = studentLogs.filter(a => a.date.startsWith("2026-07") || a.date === "2026-07-18");
          const presentCount = julyLogs.filter(l => l.status === "Present").length;
          const lateCount = julyLogs.filter(l => l.status === "Late").length;
          const absentCount = julyLogs.filter(l => l.status === "Absent").length;

          const monthlyData = getStudentMonthlyData(chartStudentId);
          const cumulativeRate = monthlyData.length > 0 
            ? Math.round(monthlyData.reduce((acc, curr) => acc + curr.percentage, 0) / monthlyData.length)
            : 0;

          return (
            <div className="bento-card p-6 mt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Attendance Trends & Analytics</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Monthly attendance percentage tracking for individual student portfolios</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide font-mono">Select Student:</label>
                  <select
                    value={chartStudentId}
                    onChange={(e) => setChartStudentId(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                  </select>
                </div>
              </div>

              {chartStudent && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                  <div className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Cumulative Attendance</span>
                      <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{cumulativeRate}%</p>
                    </div>
                    <div className="mt-2.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        cumulativeRate >= 90
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : cumulativeRate >= 80
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                      }`}>
                        {cumulativeRate >= 90 ? "Excellent (On-Track)" : cumulativeRate >= 80 ? "Satisfactory" : "At Risk (Exam Warning)"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">July Roster Stats</span>
                      <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                        {julyLogs.length} <span className="text-xs text-gray-400 font-normal">days logged</span>
                      </p>
                    </div>
                    <div className="mt-2.5 flex gap-1.5 text-[9px] font-bold font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400">{presentCount} Present</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-amber-600 dark:text-amber-400">{lateCount} Late</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-red-600 dark:text-red-400">{absentCount} Absent</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Minimum Required</span>
                      <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">75%</p>
                    </div>
                    <div className="mt-2.5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                        cumulativeRate >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        <Award className="h-3 w-3" />
                        {cumulativeRate >= 75 ? "Compliant for Exams" : "Restricted from Exams"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Primary Scan Method</span>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-2 truncate">
                        {julyLogs.length > 0 
                          ? [...new Set(julyLogs.map(l => l.method))].join(", ")
                          : "Manual (Base Portfolio)"}
                      </p>
                    </div>
                    <div className="mt-1">
                      <span className="text-[8px] text-gray-400 font-mono font-medium">Synced via Smart Gate API</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 15, right: 25, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-800/60" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickCount={6}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ strokeWidth: 2, r: 4, stroke: "#4f46e5", fill: "#ffffff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })()}
        </>
      ) : (
        /* FACULTY ATTENDANCE TERMINAL */
        <div className="mx-auto max-w-lg bento-card p-6 space-y-6">
          <div className="text-center">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Biometric Punch Terminal</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Faculty attendance check-in and out logger</p>
          </div>

          {currentFaculty ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
                <img
                  src={currentFaculty.photoUrl}
                  alt={currentFaculty.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{currentFaculty.name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono">{currentFaculty.employeeId}</p>
                </div>
              </div>

              {/* Status display */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-gray-100 p-3.5 dark:border-zinc-800 text-center">
                  <p className="text-gray-400 text-[10px] font-semibold font-mono uppercase tracking-wide">Check-In Punch</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1 text-base">
                    {currentFaculty.checkInTime || "--:--"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3.5 dark:border-zinc-800 text-center">
                  <p className="text-gray-400 text-[10px] font-semibold font-mono uppercase tracking-wide">Check-Out Punch</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1 text-base">
                    {currentFaculty.checkOutTime || "--:--"}
                  </p>
                </div>
              </div>

              {/* Active actions */}
              <div className="flex gap-3">
                {!currentFaculty.checkInTime ? (
                  <button
                    onClick={handleFacultyPunchIn}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 shadow shadow-indigo-100 dark:shadow-none"
                  >
                    <Play className="h-4 w-4" /> Clock In Biometrics
                  </button>
                ) : !currentFaculty.checkOutTime ? (
                  <button
                    onClick={handleFacultyPunchOut}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-semibold text-white hover:bg-rose-700 shadow shadow-rose-100 dark:shadow-none"
                  >
                    <Square className="h-4 w-4" /> Clock Out Biometrics
                  </button>
                ) : (
                  <div className="w-full text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold font-mono dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400">
                    Shift Log Completed (8 Hours Logged Today)
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Duty Guidelines</h4>
                <ul className="text-[11px] text-gray-500 space-y-1 list-disc pl-4 dark:text-zinc-400 leading-relaxed">
                  <li>Daily shifts must exceed 8 hours to complete regular pay logs.</li>
                  <li>In/Out logs are cryptographically hashed and synced immediately.</li>
                  <li>Overtime of up to 4 hours is automatically credited.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400">Select faculty profile in header to punch card.</div>
          )}
        </div>
      )}
    </div>
  );
}
