/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  Award,
  BookOpen,
  Calendar,
  Send,
  Building,
  DollarSign,
  TrendingUp,
  MapPin,
  Edit
} from "lucide-react";
import { Student, PlacementDrive, PlacementStudent, Role } from "../types";

interface PlacementModuleProps {
  students: Student[];
  placementDrives: PlacementDrive[];
  placedStudents: PlacementStudent[];
  onApplyDrive: (driveId: string) => void;
  onUpdatePlacementDrive: (drive: PlacementDrive) => void;
  activeRole: Role;
}

export default function PlacementModule({
  students,
  placementDrives,
  placedStudents,
  onApplyDrive,
  onUpdatePlacementDrive,
  activeRole
}: PlacementModuleProps) {
  const [activeTab, setActiveTab] = useState<"drives" | "selections">("drives");
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);

  const handleApply = (driveId: string) => {
    setAppliedDrives([...appliedDrives, driveId]);
    onApplyDrive(driveId);
    alert("Application submitted! Placement Coordinator will review your GPA and resume file.");
  };

  // Compute Statistics
  const totalStudentsCount = students.length;
  const placedStudentsCount = placedStudents.length;
  const placementRate = totalStudentsCount > 0 ? Math.round((placedStudentsCount / totalStudentsCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT & CENTER PANEL: Drives and selections */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Corporate Placement Cell</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Track company drives, view package distributions, and file applications</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            <button
              onClick={() => setActiveTab("drives")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "drives"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Company Drives
            </button>
            <button
              onClick={() => setActiveTab("selections")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "selections"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <Award className="h-3.5 w-3.5" /> Selection Roster
            </button>
          </div>
        </div>

        {/* TAB 1: COMPANY RECRUITMENT DRIVES */}
        {activeTab === "drives" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Active Recruitment Drives</h4>
            <div className="space-y-3">
              {placementDrives.map((drive) => {
                const isApplied = appliedDrives.includes(drive.id);

                return (
                  <div key={drive.id} className="rounded-xl border border-gray-100 p-5 dark:border-zinc-800 bg-gray-50/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-zinc-950 text-indigo-600 font-bold border dark:border-zinc-800">
                          <Building className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-gray-900 dark:text-white text-sm">{drive.companyName}</h5>
                          <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {drive.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pl-1">
                        <p className="font-bold text-gray-800 dark:text-zinc-300">Role: {drive.role}</p>
                        <p className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-0.5">
                          <DollarSign className="h-3.5 w-3.5" /> Package Offered: {drive.packageCtc}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                          Eligibility: CGPA &ge; {drive.eligibilityCgpa} | {drive.targetBatches}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3 shrink-0">
                      <div>
                        <p className="text-[10px] text-gray-400 font-mono">Drive Date: {drive.driveDate}</p>
                        <span className="inline-block rounded px-2 py-0.5 text-[8px] font-bold font-mono uppercase bg-indigo-50 text-indigo-700 mt-1 dark:bg-indigo-950/20 dark:text-indigo-400">
                          Active Drive
                        </span>
                      </div>

                      {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                        <button
                          onClick={() => setEditingDrive({ ...drive })}
                          className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:text-white transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5 text-indigo-500" /> Edit Drive
                        </button>
                      )}

                      {activeRole === Role.STUDENT && (
                        <button
                          onClick={() => handleApply(drive.id)}
                          disabled={isApplied}
                          className={`rounded-xl px-4 py-2 font-bold text-xs transition-colors ${
                            isApplied
                              ? "bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-100"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {isApplied ? "Applied" : "Apply Drive"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SELECTIONS ROSTER */}
        {activeTab === "selections" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Placed Student Profiles</h4>
            <div className="space-y-3">
              {placedStudents.map((placed) => {
                const stud = students.find(s => s.id === placed.studentId);
                return (
                  <div key={placed.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-emerald-50/10 hover:bg-emerald-50/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={stud?.photoUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover ring-2 ring-emerald-50 dark:ring-emerald-950/20"
                      />
                      <div>
                        <h5 className="font-extrabold text-gray-900 dark:text-white text-xs">{placed.studentName}</h5>
                        <p className="text-[10px] text-gray-400 font-mono">
                          Selected in: <span className="font-bold text-emerald-600">{placed.companyName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <p className="font-bold text-gray-900 dark:text-white">{placed.packageCtc}</p>
                      <span className="text-[9px] text-gray-400">{placed.selectionDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Placement Cell Stats */}
      <div className="space-y-6">
        <div className="bento-card p-6 space-y-4">
          <div className="border-b border-gray-50 pb-3 dark:border-zinc-850 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-indigo-500/60" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-2">Placement Analytics</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Current batch selection figures</p>
          </div>

          <div className="flex flex-col items-center py-4 bg-gray-50/50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-900">
            <p className="text-[10px] text-gray-400 font-mono font-bold tracking-wider uppercase">SELECTION RATE</p>
            <h2 className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {placementRate}%
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold font-mono mt-2">
              Batch record high
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400">Placed Count:</span>
              <span className="font-bold text-gray-900 dark:text-white">{placedStudentsCount}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400">Unplaced Count:</span>
              <span className="font-bold text-gray-900 dark:text-white">{totalStudentsCount - placedStudentsCount}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-400">Average Package:</span>
              <span className="font-bold text-indigo-600">$12,000 CTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PLACEMENT DRIVE MODAL */}
      {editingDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingDrive(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Recruitment Drive</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdatePlacementDrive(editingDrive);
              setEditingDrive(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingDrive.companyName}
                  onChange={(e) => setEditingDrive({ ...editingDrive, companyName: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.role}
                    onChange={(e) => setEditingDrive({ ...editingDrive, role: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Package offered ($ CTC)</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.packageCtc}
                    onChange={(e) => setEditingDrive({ ...editingDrive, packageCtc: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Min. Eligible GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingDrive.eligibilityCgpa}
                    onChange={(e) => setEditingDrive({ ...editingDrive, eligibilityCgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Eligible Batches</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.targetBatches}
                    onChange={(e) => setEditingDrive({ ...editingDrive, targetBatches: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Drive Date</label>
                  <input
                    type="date"
                    required
                    value={editingDrive.driveDate}
                    onChange={(e) => setEditingDrive({ ...editingDrive, driveDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Location / Mode</label>
                  <input
                    type="text"
                    required
                    value={editingDrive.location}
                    onChange={(e) => setEditingDrive({ ...editingDrive, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDrive(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
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
