/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Award,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  BookOpen,
  CreditCard,
  Home,
  BookCopy,
  BellRing,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Role, ErpConfig } from "../types";
import VarniLogo from "./VarniLogo";

interface NavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedFacultyId: string;
  setSelectedFacultyId: (id: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  students: any[];
  faculty: any[];
  notices: any[];
  openAiAssistant: () => void;
  config?: ErpConfig;
  onLogout: () => void;
}

export default function Navigation({
  activeModule,
  setActiveModule,
  activeRole,
  setActiveRole,
  selectedStudentId,
  setSelectedStudentId,
  selectedFacultyId,
  setSelectedFacultyId,
  theme,
  setTheme,
  students,
  faculty,
  notices,
  openAiAssistant,
  config,
  onLogout
}: NavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case Role.ADMIN: return "System Administrator";
      case Role.FACULTY: return "Faculty Member";
      case Role.STUDENT: return "Student Portal";
      case Role.PARENT: return "Parent Portal";
    }
  };

  const getActiveUser = () => {
    if (activeRole === Role.STUDENT) {
      return students.find(s => s.id === selectedStudentId) || students[0];
    }
    if (activeRole === Role.FACULTY) {
      return faculty.find(f => f.id === selectedFacultyId) || faculty[0];
    }
    if (activeRole === Role.PARENT) {
      const child = students.find(s => s.id === selectedStudentId) || students[0];
      return { name: `Parent of ${child?.name}`, email: "parent@example.com" };
    }
    return { name: config?.adminName || "AIT Admin", email: config?.adminEmail || "admin@ait.edu" };
  };

  const currentUser = getActiveUser();

  // Navigation Items with role-based visibility
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT] },
    { id: "students", label: "Student Roster", icon: Users, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT] },
    { id: "faculty", label: "Faculty Roster", icon: Award, roles: [Role.ADMIN, Role.FACULTY] },
    { id: "student-attendance", label: "Student Attendance", icon: CalendarCheck, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT] },
    { id: "faculty-attendance", label: "Faculty Attendance", icon: Clock, roles: [Role.ADMIN, Role.FACULTY] },
    { id: "exams", label: "Exams & Results", icon: FileSpreadsheet, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT] },
    { id: "study-materials", label: "Study Materials", icon: BookOpen, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT] },
    { id: "fees", label: "Fee Management", icon: CreditCard, roles: [Role.ADMIN, Role.STUDENT, Role.PARENT] },
    { id: "hostel", label: "Hostel Management", icon: Home, roles: [Role.ADMIN, Role.STUDENT] },
    { id: "library", label: "Library Books", icon: BookCopy, roles: [Role.ADMIN, Role.STUDENT] },
    { id: "notices", label: "Notice Board", icon: BellRing, roles: [Role.ADMIN, Role.FACULTY, Role.STUDENT, Role.PARENT] },
    { id: "placements", label: "Placements Cell", icon: Briefcase, roles: [Role.ADMIN, Role.STUDENT] },
    { id: "certificates", label: "Certificates", icon: ShieldCheck, roles: [Role.ADMIN, Role.STUDENT] },
    { id: "reports", label: "Reports & Stats", icon: BarChart3, roles: [Role.ADMIN, Role.FACULTY] },
    { id: "settings", label: "ERP Settings", icon: Settings, roles: [Role.ADMIN] },
    { id: "ai-studio", label: "AI Studio Debugger", icon: Sparkles, roles: [Role.ADMIN] }
  ];

  const isDebuggerAllowed = config?.debuggerAllowedRoles?.includes(activeRole) || activeRole === Role.ADMIN;

  const filteredNavItems = navItems.filter(item => {
    if (item.id === "ai-studio") {
      return isDebuggerAllowed;
    }
    return item.roles.includes(activeRole);
  });

  // Change active module safely if it becomes invalid on role change
  useEffect(() => {
    let isAllowed = false;
    const targetItem = navItems.find(item => item.id === activeModule);
    if (targetItem) {
      if (targetItem.id === "ai-studio") {
        isAllowed = isDebuggerAllowed;
      } else {
        isAllowed = targetItem.roles.includes(activeRole);
      }
    }
    if (!isAllowed) {
      setActiveModule("dashboard");
    }
  }, [activeRole, config?.debuggerAllowedRoles]);

  return (
    <>
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 md:block"
            id="toggle_sidebar_btn"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center gap-2">
            <VarniLogo size={36} className="shrink-0" />
            <div>
              <span className="font-bold tracking-tight text-gray-900 dark:text-white md:text-sm block leading-none">
                Varni ERP Portal
              </span>
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono">
                v2.6 Cloud
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Clock Dashboard Accent */}
        <div className="hidden lg:flex flex-col items-center justify-center font-mono text-xs text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 px-4 py-1.5 rounded-full border border-gray-100 dark:border-zinc-800">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {currentTime.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* AI Copilot Launch Badge */}
          <button
            onClick={openAiAssistant}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:opacity-90 active:scale-95 transition-transform"
            id="launch_ai_btn"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300"
            id="theme_toggle_btn"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300"
              id="notifications_bell_btn"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </span>
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-zinc-800">
                    <span className="font-bold text-gray-900 dark:text-white">Announcements</span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer font-medium hover:underline" onClick={() => setActiveModule("notices")}>View Board</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {notices.slice(0, 3).map((notice, i) => (
                      <div key={i} className="rounded-lg p-2 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 transition-colors text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{notice.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{notice.date}</span>
                        </div>
                        <p className="mt-1 text-gray-500 dark:text-zinc-400 line-clamp-2">{notice.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role and User Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
              id="role_dropdown_trigger"
            >
              <div className="hidden md:block">
                <p className="text-xs font-semibold leading-none text-gray-900 dark:text-white">
                  {currentUser?.name || "System User"}
                </p>
                <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  {getRoleLabel(activeRole)}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="p-3 border-b border-gray-100 dark:border-zinc-800 space-y-1 text-left">
                    <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono block">
                      Active Portal Session
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {currentUser?.name || "System User"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono truncate">
                      ID: {activeRole === Role.ADMIN ? "ADMIN" : (activeRole === Role.STUDENT ? selectedStudentId : selectedFacultyId)}
                    </p>
                  </div>

                  {/* Context selector for multi-student/multi-faculty simulation (only shown to Admin for auditing or testing) */}
                  {activeRole === Role.ADMIN && (
                    <div className="p-2 space-y-2 text-left">
                      <div className="border-b pb-2 mb-1 dark:border-zinc-850">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                          Auditor student selector
                        </span>
                        <select
                          value={selectedStudentId}
                          onChange={(e) => {
                            setSelectedStudentId(e.target.value);
                          }}
                          className="w-full rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[11px] p-1 text-gray-800 dark:text-zinc-200 focus:outline-none"
                        >
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                          ))}
                        </select>
                      </div>

                      <div className="pb-1">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                          Auditor faculty selector
                        </span>
                        <select
                          value={selectedFacultyId}
                          onChange={(e) => {
                            setSelectedFacultyId(e.target.value);
                          }}
                          className="w-full rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[11px] p-1 text-gray-800 dark:text-zinc-200 focus:outline-none"
                        >
                          {faculty.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {activeRole === Role.STUDENT && (
                    <div className="p-2 border-b border-gray-100 dark:border-zinc-800 text-left">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                        Active student switcher
                      </span>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => {
                          setSelectedStudentId(e.target.value);
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[11px] p-1 text-gray-800 dark:text-zinc-200 focus:outline-none"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeRole === Role.FACULTY && (
                    <div className="p-2 border-b border-gray-100 dark:border-zinc-800 text-left">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                        Active faculty switcher
                      </span>
                      <select
                        value={selectedFacultyId}
                        onChange={(e) => {
                          setSelectedFacultyId(e.target.value);
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[11px] p-1 text-gray-800 dark:text-zinc-200 focus:outline-none"
                      >
                        {faculty.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left rounded-lg px-2.5 py-2 text-xs flex items-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 font-bold transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out of Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* PERSISTENT SIDE NAVIGATION DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="fixed bottom-0 left-0 top-16 z-30 hidden border-r border-gray-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:flex flex-col overflow-y-auto shrink-0 transition-colors"
          >
            {/* Active User Mini Profile Banner */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <VarniLogo size={40} className="rounded-xl shadow-md ring-2 ring-indigo-100 dark:ring-zinc-800 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {currentUser?.name || "Welcome!"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono truncate">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-gray-100 dark:border-zinc-850">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out of Portal</span>
              </button>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
                <span>Database Synced</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MOBILE COLLAPSIBLE DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-35 md:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed bottom-0 left-0 top-0 z-40 flex w-72 flex-col bg-white p-4 shadow-2xl dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                <span className="font-bold text-gray-950 dark:text-white">ERP Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
