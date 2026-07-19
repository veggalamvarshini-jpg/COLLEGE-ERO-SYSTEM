/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Mail,
  Key
} from "lucide-react";
import { Role, Student, Faculty } from "../types";
import VarniLogo from "./VarniLogo";

interface PortalLoginProps {
  students: Student[];
  faculty: Faculty[];
  onLogin: (role: Role, id: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onUpdateFaculty?: (fac: Faculty) => void;
}

export default function PortalLogin({
  students,
  faculty,
  onLogin,
  onUpdateStudent,
  onUpdateFaculty
}: PortalLoginProps) {
  const [activeTab, setActiveTab] = useState<Role>(Role.STUDENT);
  
  // Login form fields
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("student123");
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  
  const [facultyId, setFacultyId] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("faculty123");
  const [showFacultyPassword, setShowFacultyPassword] = useState(false);
  
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryRole, setRecoveryRole] = useState<Role>(Role.STUDENT);
  const [recoveryStep, setRecoveryStep] = useState(0); // 0: enter email, 1: OTP check, 2: set password, 3: success
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [matchedUser, setMatchedUser] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === Role.STUDENT) {
      // Find matching student by Email, ID, or Roll Number
      const match = students.find(s => 
        s.email.toLowerCase() === studentId.trim().toLowerCase() ||
        s.id.toLowerCase() === studentId.trim().toLowerCase() ||
        s.rollNo.toLowerCase() === studentId.trim().toLowerCase()
      );
      if (match) {
        if (match.password === studentPassword) {
          onLogin(Role.STUDENT, match.id);
        } else {
          setErrorMsg("Access Denied. Incorrect Password. (Default is student123)");
        }
      } else {
        setErrorMsg("Student record not found. Try student email (e.g. john.doe@ait.edu), ID S001, or Roll Code.");
      }
    } else if (activeTab === Role.FACULTY) {
      // Find matching faculty by Email, ID, or Employee ID
      const match = faculty.find(f => 
        f.email.toLowerCase() === facultyId.trim().toLowerCase() ||
        f.id.toLowerCase() === facultyId.trim().toLowerCase() ||
        f.employeeId.toLowerCase() === facultyId.trim().toLowerCase()
      );
      if (match) {
        if (match.password === facultyPassword) {
          onLogin(Role.FACULTY, match.id);
        } else {
          setErrorMsg("Access Denied. Incorrect Password. (Default is faculty123)");
        }
      } else {
        setErrorMsg("Faculty record not found. Use a valid email or Employee ID (e.g. F001).");
      }
    } else if (activeTab === Role.ADMIN) {
      if (adminPasscode === "admin123") {
        onLogin(Role.ADMIN, "ADMIN");
      } else {
        setErrorMsg("Security Code Denied. Please input 'admin123' for verification.");
      }
    }
  };

  const selectPresetStudent = (student: Student) => {
    setStudentId(student.email);
    setStudentPassword(student.password || "student123");
    setErrorMsg(null);
  };

  const selectPresetFaculty = (fac: Faculty) => {
    setFacultyId(fac.email);
    setFacultyPassword(fac.password || "faculty123");
    setErrorMsg(null);
  };

  // Recovery - Request Code
  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const studentMatch = students.find(s => s.email.toLowerCase() === recoveryEmail.trim().toLowerCase());
    const facultyMatch = faculty.find(f => f.email.toLowerCase() === recoveryEmail.trim().toLowerCase());

    if (studentMatch) {
      setMatchedUser(studentMatch);
      setRecoveryRole(Role.STUDENT);
    } else if (facultyMatch) {
      setMatchedUser(facultyMatch);
      setRecoveryRole(Role.FACULTY);
    } else {
      setErrorMsg("No active account with this email address exists in the campus register.");
      return;
    }

    // Generate simulated 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(code);
    setRecoveryStep(1);
  };

  // Recovery - Verify Code
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOTP.trim() === generatedOTP) {
      setRecoveryStep(2);
      setErrorMsg(null);
    } else {
      setErrorMsg("Incorrect verification pin. Check the simulated system email below.");
    }
  };

  // Recovery - Set Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      setErrorMsg("Security constraint: Password must contain at least 4 characters.");
      return;
    }

    if (recoveryRole === Role.STUDENT && onUpdateStudent && matchedUser) {
      onUpdateStudent({
        ...matchedUser,
        password: newPassword.trim()
      });
    } else if (recoveryRole === Role.FACULTY && onUpdateFaculty && matchedUser) {
      onUpdateFaculty({
        ...matchedUser,
        password: newPassword.trim()
      });
    }

    setRecoveryStep(3);
    setErrorMsg(null);
  };

  // Reset state to go back
  const handleExitRecovery = () => {
    setForgotPasswordMode(false);
    setRecoveryEmail("");
    setRecoveryStep(0);
    setEnteredOTP("");
    setNewPassword("");
    setMatchedUser(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Portal Branding Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <VarniLogo size={100} className="shadow-lg rounded-full" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Varni International Institute of Hotel Management
          </h1>
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-mono">
            Campus Enterprise ERP Portal
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Sign in to access your digital ID card, mark attendance logs, or manage campus accounts
          </p>
        </div>

        {/* FORGOT PASSWORD RECOVERY MODE */}
        {forgotPasswordMode ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-850 space-y-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExitRecovery}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="font-bold text-gray-950 dark:text-white text-sm">
                🔑 Password recovery service
              </h2>
            </div>

            {recoveryStep === 0 && (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your registered institutional academic email below. We'll send a simulated security verification pin code to your mailbox instantly.
                </p>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-gray-600 dark:text-zinc-300">Registered Academic Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="username@ait.edu"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 p-3 border border-red-100/50 dark:border-red-950/40 text-[11px] text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white hover:bg-indigo-700 shadow-md transition-all active:scale-98"
                >
                  <span>Request Verification Code</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {recoveryStep === 1 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  We've simulated an email delivery to <strong className="text-gray-700 dark:text-zinc-200">{recoveryEmail}</strong>. Enter the 4-digit verification code below:
                </p>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-gray-600 dark:text-zinc-300">4-Digit Security PIN</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="Enter 4-digit code"
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-center tracking-widest font-mono text-lg font-bold dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 p-3 border border-red-100/50 dark:border-red-950/40 text-[11px] text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white hover:bg-indigo-700 shadow-md transition-all active:scale-98"
                >
                  <span>Verify Security PIN</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* SIMULATED SYSTEM ENVELOPE (Invaluable for Sandbox environment!) */}
                <div className="rounded-xl border border-dashed border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-3 space-y-1 text-[11px]">
                  <span className="font-mono text-[9px] uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    📬 Simulated SMTP Outbox (Test Environment helper)
                  </span>
                  <p className="text-gray-500 dark:text-zinc-400">
                    Subject: <span className="font-semibold">Security Credential Reset</span>
                  </p>
                  <p className="text-gray-600 dark:text-zinc-300 leading-normal">
                    To reset the password for <strong className="text-gray-900 dark:text-white font-semibold">{matchedUser?.name}</strong>, use the following sandbox code: 
                    <span className="font-mono ml-2 font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs select-all">{generatedOTP}</span>
                  </p>
                </div>
              </form>
            )}

            {recoveryStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Identity verification successful for <strong className="text-indigo-600 dark:text-indigo-400">{matchedUser?.name}</strong>. Set your new access credentials:
                </p>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-gray-600 dark:text-zinc-300">New Password Credentials</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="At least 4 characters long"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pl-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 p-3 border border-red-100/50 dark:border-red-950/40 text-[11px] text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-xs font-extrabold text-white hover:bg-green-700 shadow-md transition-all active:scale-98"
                >
                  <span>Apply and Reset Password</span>
                  <CheckCircle className="h-4 w-4" />
                </button>
              </form>
            )}

            {recoveryStep === 3 && (
              <div className="space-y-5 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 flex items-center justify-center text-green-500 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Credentials Modified!</h3>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Password credentials for student/faculty record <strong className="text-gray-700 dark:text-zinc-200">{matchedUser?.email}</strong> updated. You can now log in securely using your new credentials.
                  </p>
                </div>
                <button
                  onClick={handleExitRecovery}
                  className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                >
                  Return to Portal Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD PORTAL LOGIN SCREEN */
          <>
            {/* Portal Mode Tabs Selection */}
            <div className="rounded-xl bg-gray-100 p-1.5 dark:bg-zinc-900 grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  setActiveTab(Role.STUDENT);
                  setErrorMsg(null);
                }}
                className={`rounded-lg py-2.5 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === Role.STUDENT
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Student</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab(Role.FACULTY);
                  setErrorMsg(null);
                }}
                className={`rounded-lg py-2.5 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === Role.FACULTY
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Staff</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab(Role.ADMIN);
                  setErrorMsg(null);
                }}
                className={`rounded-lg py-2.5 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === Role.ADMIN
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* Card wrapper */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-850 space-y-5">
              <div className="space-y-1">
                <h2 className="font-bold text-gray-950 dark:text-white text-sm">
                  {activeTab === Role.STUDENT && "🎓 Student Portal Entrance"}
                  {activeTab === Role.FACULTY && "💼 Faculty & Staff Terminal"}
                  {activeTab === Role.ADMIN && "🛡️ Administrative Security Gate"}
                </h2>
                <p className="text-[11px] text-gray-400 leading-normal">
                  {activeTab === Role.STUDENT && "Sign in using your institutional email (or Student ID S001-S005) and access password to view classes, grades, and fee reports."}
                  {activeTab === Role.FACULTY && "Access staff workspace, biometric roster, and student grading sheets using your email and password."}
                  {activeTab === Role.ADMIN && "Enter secure campus credential keys to configure the ERP platform settings or grant role debugging capabilities."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Student Fields */}
                {activeTab === Role.STUDENT && (
                  <>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-gray-600 dark:text-zinc-300">Admission ID or Academic Email</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. S001 or john.doe@ait.edu"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-gray-600 dark:text-zinc-300">Access Password</label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showStudentPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pr-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPassword(!showStudentPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showStudentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Faculty Fields */}
                {activeTab === Role.FACULTY && (
                  <>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-gray-600 dark:text-zinc-300">Employee ID or Faculty Email</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. F001 or alan.turing@ait.edu"
                        value={facultyId}
                        onChange={(e) => setFacultyId(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-gray-600 dark:text-zinc-300">Access Password</label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showFacultyPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={facultyPassword}
                          onChange={(e) => setFacultyPassword(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pr-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFacultyPassword(!showFacultyPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showFacultyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Admin Challenge Field */}
                {activeTab === Role.ADMIN && (
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-gray-600 dark:text-zinc-300">Administrative Passcode</label>
                    <div className="relative">
                      <input
                        type={showPasscode ? "text" : "password"}
                        required
                        placeholder="Enter security key..."
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pr-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(!showPasscode)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 p-3 border border-red-100/50 dark:border-red-950/40 text-[11px] text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none transition-all active:scale-98"
                >
                  <span>Authenticate and Proceed</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Quick Demo Assist Preset Buttons */}
              <div className="border-t border-gray-100 dark:border-zinc-850 pt-4 space-y-2.5 text-xs">
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-pulse" /> Sandbox Quick-Launch Assistants
                </span>
                <p className="text-[10px] text-gray-400">Select any preloaded profile credentials to login instantly for testing purposes:</p>
                
                <div className="flex flex-wrap gap-1.5">
                  {activeTab === Role.STUDENT && students.slice(0, 3).map((st) => (
                    <button
                      key={st.id}
                      onClick={() => selectPresetStudent(st)}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        studentId === st.email
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                      }`}
                    >
                      {st.name} ({st.id})
                    </button>
                  ))}

                  {activeTab === Role.FACULTY && faculty.slice(0, 3).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => selectPresetFaculty(f)}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        facultyId === f.email
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                      }`}
                    >
                      {f.name} ({f.id})
                    </button>
                  ))}

                  {activeTab === Role.ADMIN && (
                    <button
                      onClick={() => {
                        setAdminPasscode("admin123");
                        setErrorMsg(null);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        adminPasscode === "admin123"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                      }`}
                    >
                      Unlock Admin Code (admin123)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer info banner */}
        <div className="text-center">
          <span className="text-[10px] text-gray-400 font-mono">
            Secure connection • Antigravity Enterprise Ingress
          </span>
        </div>
      </div>
    </div>
  );
}
