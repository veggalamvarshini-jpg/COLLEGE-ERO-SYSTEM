/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Calendar,
  FileCheck,
  Award,
  Download,
  Printer,
  Compass,
  CheckCircle,
  FileText,
  Edit
} from "lucide-react";
import { Student, ExamTimetable, StudentResult, Role } from "../types";

interface ExamsModuleProps {
  students: Student[];
  exams: ExamTimetable[];
  results: StudentResult[];
  onUpdateExam: (exam: ExamTimetable) => void;
  onUpdateResult: (result: StudentResult) => void;
  activeRole: Role;
  selectedStudentId: string;
}

export default function ExamsModule({
  students,
  exams,
  results,
  onUpdateExam,
  onUpdateResult,
  activeRole,
  selectedStudentId
}: ExamsModuleProps) {
  const [activeTab, setActiveTab] = useState<"timetable" | "results" | "hallticket">("timetable");
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState(students[0]?.id || "");
  const [editingExam, setEditingExam] = useState<ExamTimetable | null>(null);
  const [editingResult, setEditingResult] = useState<StudentResult | null>(null);

  const getTargetStudent = () => {
    if (activeRole === Role.STUDENT || activeRole === Role.PARENT) {
      return students.find(s => s.id === selectedStudentId) || students[0];
    }
    return students.find(s => s.id === adminSelectedStudentId) || students[0];
  };

  const targetStudent = getTargetStudent();
  const targetResults = results.filter(r => r.studentId === targetStudent?.id);

  // Filter exams by course
  const targetExams = exams.filter(ex => {
    if (!targetStudent) return true;
    return ex.course === targetStudent.course && ex.semester === targetStudent.semester;
  });

  const getStatusColor = (grade: string) => {
    if (["O", "A+", "A"].includes(grade)) return "text-emerald-600 dark:text-emerald-400 font-bold";
    if (["B+", "B"].includes(grade)) return "text-indigo-600 dark:text-indigo-400 font-bold";
    return "text-amber-600 dark:text-amber-400 font-bold";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT COLUMN: Timetable, Results Ledger */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Academic Examination Panel</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">View schedules, academic grading, and transcript printouts</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            {[
              { id: "timetable", label: "Timetable", icon: Calendar },
              { id: "results", label: "Results Ledger", icon: Award },
              { id: "hallticket", label: "Hall Ticket", icon: Compass }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Student Selector Filter for Admins */}
        {activeRole === Role.ADMIN && (
          <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-3 border border-gray-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-gray-600 dark:text-zinc-400">Select Student Account</span>
            <select
              value={adminSelectedStudentId}
              onChange={(e) => setAdminSelectedStudentId(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white p-2 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white text-xs min-w-[200px]"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
              ))}
            </select>
          </div>
        )}

        {/* TAB 1: EXAM TIMETABLE LIST */}
        {activeTab === "timetable" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Upcoming Schedules for {targetStudent?.course} ({targetStudent?.semester} Sem)</h4>
            
            {targetExams.length === 0 ? (
              <p className="text-xs text-gray-450 py-12 text-center italic">No exam schedules logged for this course program yet.</p>
            ) : (
              <div className="space-y-3">
                {targetExams.map((ex) => (
                  <div key={ex.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 gap-3">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider block uppercase">CODE: {ex.id}</span>
                      <h5 className="font-extrabold text-gray-900 dark:text-white text-xs mt-1 leading-tight">{ex.subject}</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">Room: {ex.room}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right font-mono">
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{ex.examDate}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{ex.examTime}</p>
                      </div>
                      {activeRole === Role.ADMIN && (
                        <button
                          onClick={() => setEditingExam({ ...ex })}
                          className="rounded-lg p-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                          title="Edit Schedule"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GRADING & RESULTS LEDGER */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Official Cumulative Grade Card</h4>
            
            {targetResults.length === 0 ? (
              <p className="text-xs text-gray-450 py-12 text-center italic">Results are under evaluation. Wait for warden release notice.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-150 dark:border-zinc-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-950 text-gray-500 font-semibold font-mono uppercase tracking-wider text-[10px] border-b border-gray-100 dark:border-zinc-850">
                      <th className="p-3">Course Subject</th>
                      <th className="p-3 text-center">Internals (30)</th>
                      <th className="p-3 text-center">Practicals (30)</th>
                      <th className="p-3 text-center">Sem Exam (40)</th>
                      <th className="p-3 text-center">Total (100)</th>
                      <th className="p-3 text-center">Grade</th>
                      {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && <th className="p-3 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-850">
                    {targetResults.map((res, idx) => {
                      const totalSum = res.internalMarks + res.practicalMarks + res.semesterMarks;
                      return (
                        <tr key={idx} className="hover:bg-gray-50/20">
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{res.subject}</td>
                          <td className="p-3 text-center font-mono text-gray-500">{res.internalMarks}</td>
                          <td className="p-3 text-center font-mono text-gray-500">{res.practicalMarks}</td>
                          <td className="p-3 text-center font-mono text-gray-500">{res.semesterMarks}</td>
                          <td className="p-3 text-center font-bold font-mono text-indigo-600 dark:text-indigo-400">{totalSum}</td>
                          <td className={`p-3 text-center font-mono ${getStatusColor(res.grade)}`}>{res.grade}</td>
                          {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                            <td className="p-3 text-center">
                              <button
                                onClick={() => setEditingResult({ ...res })}
                                className="rounded-lg p-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-indigo-600 dark:text-indigo-400"
                                title="Edit Grades"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL HALL TICKET */}
        {activeTab === "hallticket" && targetStudent && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Generated Examination Hall Ticket</h4>
            
            {/* Visual Hall Ticket Badge */}
            <div className="rounded-2xl border-2 border-indigo-200 p-6 space-y-6 relative overflow-hidden bg-gray-50/50 dark:bg-zinc-950 dark:border-indigo-950">
              {/* Logo Header */}
              <div className="flex justify-between items-center border-b pb-4 border-indigo-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">A</div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase leading-none tracking-tight">Antigravity Institute</h4>
                    <span className="text-[8px] font-mono tracking-widest text-indigo-600 uppercase">OFFICE OF THE REGISTRAR</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded px-2 py-0.5 text-[8px] font-bold font-mono uppercase bg-indigo-50 border border-indigo-200 text-indigo-700">
                    SEMESTER HALL TICKET
                  </span>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <img
                    src={targetStudent.photoUrl}
                    alt={targetStudent.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-14 rounded object-cover border border-indigo-100 shadow"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{targetStudent.name}</p>
                    <p className="text-[10px] text-indigo-600">ROLL: {targetStudent.rollNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] leading-tight text-gray-500">
                  <div>
                    <span className="font-bold text-gray-400">PROGRAM:</span>
                    <p className="font-bold text-gray-800 dark:text-zinc-300 mt-0.5">{targetStudent.course.split(" ").pop()}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400">SEMESTER:</span>
                    <p className="font-bold text-gray-800 dark:text-zinc-300 mt-0.5">{targetStudent.semester} Sem</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400">ADMISSION:</span>
                    <p className="font-bold text-gray-800 dark:text-zinc-300 mt-0.5">{targetStudent.admissionNumber}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400">GATE PASS:</span>
                    <p className="font-bold text-emerald-600 mt-0.5">APPROVED</p>
                  </div>
                </div>
              </div>

              {/* Subject codes layout */}
              <div className="border-t border-indigo-100 dark:border-zinc-800 pt-4 text-xs">
                <p className="font-bold mb-3">AUTHORIZED EXAMINATION SUBJECTS:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                  {targetExams.map((ex, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border p-2.5 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white leading-none truncate max-w-[120px]">{ex.subject}</p>
                        <span className="text-[8px] text-gray-400">{ex.examDate}</span>
                      </div>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px]">{ex.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning lines */}
              <div className="text-[8px] leading-relaxed text-gray-400 font-mono">
                * Note: Verification of digital barcode matches actual biometrics at block entrances. No electronic equipment allowed.
              </div>
            </div>

            {/* Hall Ticket actions */}
            <div className="flex gap-2">
              <button
                onClick={() => alert("Downloading secure vectors of exam ticket...")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
              >
                <Download className="h-4 w-4" /> Save PDF Hall Ticket
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
              >
                <Printer className="h-4 w-4" /> Print Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: GPAs Transcript Summary */}
      <div>
        {targetStudent ? (
          <div className="bento-card p-6 space-y-5">
            <div className="border-b border-gray-50 pb-3 dark:border-zinc-800 text-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Transcript Card</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Official academic standing summary</p>
            </div>

            <div className="flex flex-col items-center py-4 bg-gray-50/50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-900">
              <p className="text-[10px] text-gray-400 font-mono font-bold tracking-wider uppercase">CUMULATIVE GPA</p>
              <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {targetStudent.academicGpa.toFixed(2)}
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold font-mono mt-2 dark:bg-emerald-950/20 dark:text-emerald-400">
                Excellent (First Class)
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-400">Total Credits Earned:</span>
                <span className="font-bold text-gray-900 dark:text-white">64 / 120</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-400">Academic Standing:</span>
                <span className="font-bold text-emerald-600">Active Good Standing</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-400">Exam Hall Clearance:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Passed Ledger Check</span>
              </div>
            </div>

            <button
              onClick={() => alert("Transcript is being compiled with legal institute stamp. Generated PDF and started saving...")}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
            >
              <FileText className="h-4 w-4" /> Download Grade Card PDF
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-400">No student account selected.</div>
        )}
      </div>

      {/* EDIT EXAM MODAL */}
      {editingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingExam(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Exam Schedule</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateExam(editingExam);
              setEditingExam(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  value={editingExam.subject}
                  onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Exam Date</label>
                  <input
                    type="text"
                    required
                    value={editingExam.examDate}
                    onChange={(e) => setEditingExam({ ...editingExam, examDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Exam Time</label>
                  <input
                    type="text"
                    required
                    value={editingExam.examTime}
                    onChange={(e) => setEditingExam({ ...editingExam, examTime: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="HH:MM AM/PM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Assigned Examination Room / Hall</label>
                <input
                  type="text"
                  required
                  value={editingExam.room}
                  onChange={(e) => setEditingExam({ ...editingExam, room: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RESULT MODAL */}
      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingResult(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Student Grade Sheet</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateResult(editingResult);
              setEditingResult(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Subject / Course Module</label>
                <input
                  type="text"
                  disabled
                  value={editingResult.subject}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-400 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">Internals (30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    required
                    value={editingResult.internalMarks}
                    onChange={(e) => setEditingResult({ ...editingResult, internalMarks: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Practicals (30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    required
                    value={editingResult.practicalMarks}
                    onChange={(e) => setEditingResult({ ...editingResult, practicalMarks: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Sem Exam (40)</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    required
                    value={editingResult.semesterMarks}
                    onChange={(e) => setEditingResult({ ...editingResult, semesterMarks: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Grade Letter Assigned</label>
                <select
                  value={editingResult.grade}
                  onChange={(e) => setEditingResult({ ...editingResult, grade: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                >
                  {["A+", "A", "B+", "B", "C", "D", "E", "F"].map(gr => (
                    <option key={gr} value={gr}>{gr}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Save Marks & Grades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
