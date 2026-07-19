/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Building,
  BellRing,
  Database,
  Save,
  CheckCircle,
  ToggleLeft
} from "lucide-react";
import { Role, ErpConfig } from "../types";

interface SettingsModuleProps {
  activeRole: Role;
  onChangeRole: (role: Role) => void;
  config: ErpConfig;
  onUpdateConfig: (payload: Partial<ErpConfig>) => void;
}

export default function SettingsModule({
  activeRole,
  onChangeRole,
  config,
  onUpdateConfig
}: SettingsModuleProps) {
  const [instName, setInstName] = useState(config.instituteName);
  const [academicYear, setAcademicYear] = useState(config.academicYear);
  const [adminName, setAdminName] = useState(config.adminName || "AIT Admin");
  const [adminEmail, setAdminEmail] = useState(config.adminEmail || "admin@ait.edu");
  const [gradingScale, setGradingScale] = useState("10-Point CGPA");
  const [notifTrigger, setNotifTrigger] = useState(config.notificationsEnabled);
  const [allowFacultyDebugger, setAllowFacultyDebugger] = useState(
    config.debuggerAllowedRoles?.includes(Role.FACULTY) || false
  );
  const [allowStudentDebugger, setAllowStudentDebugger] = useState(
    config.debuggerAllowedRoles?.includes(Role.STUDENT) || false
  );

  React.useEffect(() => {
    setInstName(config.instituteName);
    setAcademicYear(config.academicYear);
    setAdminName(config.adminName || "AIT Admin");
    setAdminEmail(config.adminEmail || "admin@ait.edu");
    setNotifTrigger(config.notificationsEnabled);
    setAllowFacultyDebugger(config.debuggerAllowedRoles?.includes(Role.FACULTY) || false);
    setAllowStudentDebugger(config.debuggerAllowedRoles?.includes(Role.STUDENT) || false);
  }, [config]);

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    const allowed = [Role.ADMIN];
    if (allowFacultyDebugger) allowed.push(Role.FACULTY);
    if (allowStudentDebugger) allowed.push(Role.STUDENT);

    onUpdateConfig({
      instituteName: instName,
      academicYear: academicYear,
      adminName,
      adminEmail,
      notificationsEnabled: notifTrigger,
      debuggerAllowedRoles: allowed
    });
    alert("System configurations updated and synchronized across all portals successfully!");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Primary Configuration Form */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">ERP System Configurations</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Control core operational settings and database states</p>
        </div>

        <form onSubmit={handleSaveConfigs} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-gray-500 mb-1">Campus/Institute Branding Name</label>
              <input
                type="text"
                required
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Active Academic Term Session</label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">System Administrator Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">System Administrator Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Grading System Scale</label>
              <select
                value={gradingScale}
                onChange={(e) => setGradingScale(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <option value="10-Point CGPA">10-Point CGPA Letter Grade</option>
                <option value="Percentage">Percentage System (0-100%)</option>
                <option value="4-Point GPA">4-Point GPA US Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Biometric Attendance Sync</label>
              <select
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <option>Real-Time Sync Threshold (1s)</option>
                <option>Cron Check Batching (5m)</option>
                <option>Manual Sync Mode Only</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="notif_toggle"
              checked={notifTrigger}
              onChange={(e) => setNotifTrigger(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="notif_toggle" className="text-[11px] text-gray-500 font-semibold dark:text-zinc-400">
              Auto-notify parents on student check-in absent anomalies
            </label>
          </div>

          {/* AI Developer Portal & Error Permissions Gate */}
          <div className="border-t pt-4 dark:border-zinc-850 space-y-3">
            <h4 className="font-extrabold text-gray-900 dark:text-white text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Shield className="h-4 w-4 text-indigo-500" /> AI Studio & Error Debugging Permissions
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
              Define which roles have developer access rights to invoke the Google AI Studio Debugger engine and troubleshoot ERP site errors.
            </p>
            
            <div className="space-y-2 mt-2 rounded-lg bg-indigo-50/20 dark:bg-zinc-900/50 p-3 border border-indigo-100/30 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allow_faculty_dbg"
                  checked={allowFacultyDebugger}
                  onChange={(e) => setAllowFacultyDebugger(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allow_faculty_dbg" className="text-[11px] text-gray-700 dark:text-zinc-300 font-medium">
                  Allow <strong>Faculty Members (Staff)</strong> to access AI Studio Debugger and resolve site errors
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allow_student_dbg"
                  checked={allowStudentDebugger}
                  onChange={(e) => setAllowStudentDebugger(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allow_student_dbg" className="text-[11px] text-gray-700 dark:text-zinc-300 font-medium">
                  Allow <strong>Students</strong> to access AI Studio Debugger and resolve site errors
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 dark:border-zinc-850">
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-4 w-4" /> Save System Settings
            </button>
          </div>
        </form>
      </div>

      {/* Role Manager side panel */}
      <div className="bento-card p-6 space-y-4 text-xs">
        <div className="border-b pb-3 text-center">
          <Shield className="mx-auto h-8 w-8 text-indigo-500/60" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-2">Access Control</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Simulate role-based ERP workflows</p>
        </div>

        <div className="space-y-2.5">
          {[
            { role: Role.ADMIN, desc: "Total control over rosters, settings, fees, & notices" },
            { role: Role.FACULTY, desc: "Mark attendance rosters, view schedules, upload materials" },
            { role: Role.STUDENT, desc: "Review grades transcript, settle fee installments, download ID" },
            { role: Role.PARENT, desc: "Audit student check-in records, pay dues, view reports" }
          ].map(r => (
            <button
              key={r.role}
              onClick={() => onChangeRole(r.role)}
              className={`w-full rounded-xl border p-3 text-left transition-all flex flex-col gap-1 ${
                activeRole === r.role
                  ? "border-indigo-500 bg-indigo-50/25 dark:border-indigo-600 dark:bg-indigo-950/20"
                  : "border-gray-100 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
              }`}
            >
              <span className="font-extrabold text-gray-900 dark:text-white capitalize">
                {r.role} Workspace {activeRole === r.role && "✓"}
              </span>
              <span className="text-[10px] text-gray-400 font-sans leading-snug">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
