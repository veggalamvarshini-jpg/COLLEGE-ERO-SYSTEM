/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Award,
  Clock,
  Coffee,
  CheckCircle,
  XCircle,
  Edit
} from "lucide-react";
import { Faculty, Role } from "../types";

interface FacultyManagementProps {
  faculty: Faculty[];
  onAddFaculty: (fac: Faculty) => void;
  onUpdateFaculty: (fac: Faculty) => void;
  activeRole: Role;
}

export default function FacultyManagement({
  faculty,
  onAddFaculty,
  onUpdateFaculty,
  activeRole
}: FacultyManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(faculty[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    employeeId: "",
    department: "Culinary Arts & Food Production",
    designation: "Assistant Professor",
    email: "",
    password: "",
    mobile: "",
    workingHours: 40,
    overtimeHours: 0,
    leaveBalance: {
      casual: 12,
      sick: 10,
      earned: 15
    },
    isPresentToday: false,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  });

  const filteredFaculty = faculty.filter(f => {
    return f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.department.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `F00${faculty.length + 1}`;
    onAddFaculty({
      id,
      ...newFaculty
    });
    setShowAddModal(false);
    // Reset form
    setNewFaculty({
      name: "",
      employeeId: "",
      department: "Culinary Arts & Food Production",
      designation: "Assistant Professor",
      email: "",
      password: "",
      mobile: "",
      workingHours: 40,
      overtimeHours: 0,
      leaveBalance: { casual: 12, sick: 10, earned: 15 },
      isPresentToday: false,
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Faculty Directory List */}
      <div className="bento-card p-6 lg:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Academic Faculty Directory</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Manage and browse university staff & lecturers</p>
          </div>
          {activeRole === Role.ADMIN && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
              id="add_faculty_btn"
            >
              <UserPlus className="h-4 w-4" /> Add Faculty
            </button>
          )}
        </div>

        <div className="relative mt-6">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, designation, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        {/* Directory cards */}
        <div className="mt-6 space-y-3">
          {filteredFaculty.map((fac) => (
            <div
              key={fac.id}
              onClick={() => setSelectedFaculty(fac)}
              className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-zinc-850/30 transition-all ${
                selectedFaculty?.id === fac.id
                  ? "border-indigo-500 bg-indigo-50/30 dark:border-indigo-600 dark:bg-indigo-950/20"
                  : "border-gray-100 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={fac.photoUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{fac.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono">
                    {fac.designation} | {fac.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  fac.isPresentToday
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                }`}>
                  {fac.isPresentToday ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {fac.isPresentToday ? "Checked In" : "Absent"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty details side column */}
      <div>
        {selectedFaculty ? (
          <div className="bento-card p-6 space-y-5">
            <div className="flex flex-col items-center text-center">
              <img
                src={selectedFaculty.photoUrl}
                alt={selectedFaculty.name}
                referrerPolicy="no-referrer"
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-zinc-800"
              />
              <h3 className="mt-3 font-extrabold text-gray-900 dark:text-white text-base">{selectedFaculty.name}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{selectedFaculty.employeeId}</p>
              {activeRole === Role.ADMIN && (
                <button
                  onClick={() => setEditingFaculty({ ...selectedFaculty })}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-zinc-800 dark:text-indigo-300 dark:hover:bg-zinc-750 px-3 py-1.5 text-xs font-semibold"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Staff details
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Role Description</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span>{selectedFaculty.designation}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{selectedFaculty.department}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedFaculty.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedFaculty.mobile}</span>
                </div>
              </div>
            </div>

            {/* Attendance metrics */}
            <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">This Month working stats</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                  <p className="text-gray-400 text-[10px]">Logged Hours</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm font-mono flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" /> {selectedFaculty.workingHours} Hrs
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                  <p className="text-gray-400 text-[10px]">Overtime hours</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm font-mono flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-emerald-500" /> {selectedFaculty.overtimeHours} Hrs
                  </p>
                </div>
              </div>
            </div>

            {/* Leaves block */}
            <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Accrued Leave Balances</h4>
              <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div className="rounded-xl bg-teal-50/50 p-2 border border-teal-100 dark:bg-teal-950/20 dark:border-teal-900">
                  <p className="text-teal-600 dark:text-teal-400 font-extrabold text-base leading-none">
                    {selectedFaculty.leaveBalance.casual}
                  </p>
                  <span className="text-[9px] text-teal-700/70 dark:text-teal-400 mt-1 block">Casual</span>
                </div>
                <div className="rounded-xl bg-rose-50/50 p-2 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900">
                  <p className="text-rose-600 dark:text-rose-400 font-extrabold text-base leading-none">
                    {selectedFaculty.leaveBalance.sick}
                  </p>
                  <span className="text-[9px] text-rose-700/70 dark:text-rose-400 mt-1 block">Sick</span>
                </div>
                <div className="rounded-xl bg-indigo-50/50 p-2 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900">
                  <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-base leading-none">
                    {selectedFaculty.leaveBalance.earned}
                  </p>
                  <span className="text-[9px] text-indigo-700/70 dark:text-indigo-400 mt-1 block">Earned</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center text-xs text-gray-400 dark:border-zinc-800 dark:bg-zinc-900">
            No faculty selected.
          </div>
        )}
      </div>

      {/* ADD FACULTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Register New Academic Faculty</h3>
            
            <form onSubmit={handleCreateFaculty} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="Dr. Richard Feynman"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Employee Registration Code (ID)</label>
                <input
                  type="text"
                  required
                  value={newFaculty.employeeId}
                  onChange={(e) => setNewFaculty({ ...newFaculty, employeeId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="EMP-AIT-XXX"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Department</label>
                  <select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Culinary Arts & Food Production">Culinary Arts & Food Production</option>
                    <option value="Front Office Management">Front Office Management</option>
                    <option value="Housekeeping & Accommodations">Housekeeping & Accommodations</option>
                    <option value="Food & Beverage Service">Food & Beverage Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Designation</label>
                  <select
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Professor & Head">Professor & Head</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Email Contact</label>
                  <input
                    type="email"
                    required
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="name@ait.edu"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={newFaculty.mobile}
                    onChange={(e) => setNewFaculty({ ...newFaculty, mobile: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Password Credentials</label>
                <input
                  type="text"
                  required
                  value={newFaculty.password}
                  onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="Set custom password"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FACULTY MODAL */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingFaculty(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Academic Faculty Profile</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateFaculty(editingFaculty);
              setSelectedFaculty(editingFaculty);
              setEditingFaculty(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.name}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Employee Registration Code (ID)</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.employeeId}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, employeeId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Department</label>
                  <select
                    value={editingFaculty.department}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Culinary Arts & Food Production">Culinary Arts & Food Production</option>
                    <option value="Front Office Management">Front Office Management</option>
                    <option value="Housekeeping & Accommodations">Housekeeping & Accommodations</option>
                    <option value="Food & Beverage Service">Food & Beverage Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Designation</label>
                  <select
                    value={editingFaculty.designation}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Professor & Head">Professor & Head</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Email Contact</label>
                  <input
                    type="email"
                    required
                    value={editingFaculty.email}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.mobile}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, mobile: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Password Credentials</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.password || ""}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none font-mono"
                  placeholder="faculty123"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Working Hours</label>
                  <input
                    type="number"
                    required
                    value={editingFaculty.workingHours}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, workingHours: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    required
                    value={editingFaculty.overtimeHours}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, overtimeHours: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
