/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  UploadCloud,
  Download,
  Calendar,
  Layers,
  CheckCircle,
  FileCode,
  CheckSquare,
  Edit
} from "lucide-react";
import { Student, StudyMaterial, Assignment, Role } from "../types";

interface StudyMaterialsModuleProps {
  students: Student[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  onUploadMaterial: (mat: StudyMaterial) => void;
  onUploadAssignmentSubmission: (assignmentId: string, filePath: string) => void;
  onUpdateMaterial: (mat: StudyMaterial) => void;
  activeRole: Role;
  selectedStudentId: string;
}

export default function StudyMaterialsModule({
  students,
  materials,
  assignments,
  onUploadMaterial,
  onUploadAssignmentSubmission,
  onUpdateMaterial,
  activeRole,
  selectedStudentId
}: StudyMaterialsModuleProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "assignments" | "questionbank">("syllabus");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);

  // File uploading states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>([]);

  // New materials form states
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    subject: "",
    course: "3 Years Diploma in Hotel Management",
    semester: "1st",
    type: "Syllabus" as "Syllabus" | "Textbook" | "Notes" | "Question Bank",
    fileUrl: "/assets/materials/document.pdf"
  });

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `MAT-00${materials.length + 1}`;
    onUploadMaterial({
      id,
      ...newMaterial
    });
    setShowUploadModal(false);
    setNewMaterial({
      title: "",
      subject: "",
      course: "3 Years Diploma in Hotel Management",
      semester: "1st",
      type: "Syllabus",
      fileUrl: "/assets/materials/document.pdf"
    });
    alert("Study material uploaded successfully and indexed in student desks.");
  };

  const handleSimulatedSubmit = (assignmentId: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(interval);
          setSubmittedAssignments([...submittedAssignments, assignmentId]);
          onUploadAssignmentSubmission(assignmentId, `/assets/submissions/${assignmentId}.pdf`);
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return p + 30;
      });
    }, 400);
  };

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Filter study materials
  const syllabusList = materials.filter(m => m.type === "PDF" || m.type === "Paper");
  const textbooksList = materials.filter(m => m.type === "PPT" || m.type === "Notes");
  const questionBanksList = materials.filter(m => m.type === "Video" || m.type === "Paper");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT & CENTER PANEL: Study list and filters */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Course Curriculum & Materials</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Access academic syllabi, assignments, and sample papers</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            {[
              { id: "syllabus", label: "Syllabus & Notes", icon: BookOpen },
              { id: "assignments", label: "Assignments", icon: FileText },
              { id: "questionbank", label: "Question Banks", icon: FileCode }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
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

        {/* TAB 1: SYLLABUS & TEXTBOOKS */}
        {activeTab === "syllabus" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Course Syllabus & Handbooks</h4>
              {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  <UploadCloud className="h-4 w-4" /> Upload material
                </button>
              )}
            </div>

            <div className="space-y-3">
              {syllabusList.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 text-indigo-600 p-2.5">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-tight">{m.title}</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">Syllabus | Subject: {m.subject} | Sem {m.semester || "5th"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                      <button
                        onClick={() => setEditingMaterial({ ...m })}
                        className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                        title="Edit Study Material"
                      >
                        <Edit className="h-4 w-4 text-indigo-500" />
                      </button>
                    )}
                    <button
                      onClick={() => alert("Downloading digital curriculum guide...")}
                      className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                      title="Download Handbook"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-bold text-gray-900 dark:text-white text-sm pt-4 border-t dark:border-zinc-850">Class Textbooks & Notes</h4>
            <div className="space-y-3">
              {textbooksList.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 text-emerald-600 p-2.5">
                      <Layers className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-tight">{m.title}</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">Study Guide | Subject: {m.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                      <button
                        onClick={() => setEditingMaterial({ ...m })}
                        className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                        title="Edit Study Material"
                      >
                        <Edit className="h-4 w-4 text-indigo-500" />
                      </button>
                    )}
                    <button
                      onClick={() => alert("Downloading handbook resources...")}
                      className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                      title="Download Notes"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE ASSIGNMENTS LOG */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Active Lecture Assignments</h4>
            <div className="space-y-3">
              {assignments.map((ass) => {
                const isSubmitted = submittedAssignments.includes(ass.id) || ass.status === "Submitted";
                return (
                  <div key={ass.id} className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 text-xs">
                    <div className="flex justify-between items-start border-b pb-2.5 border-gray-100 dark:border-zinc-850">
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-tight">{ass.title}</h5>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">Subject: {ass.subject} | Max Marks: {ass.maxMarks}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        isSubmitted ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700 animate-pulse"
                      }`}>
                        {isSubmitted ? "Submitted" : "Pending Submission"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px]">
                      <div className="text-gray-450 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Deadline: {ass.dueDate}
                      </div>

                      {activeRole === Role.STUDENT && (
                        <div>
                          {isSubmitted ? (
                            <p className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle className="h-4.5 w-4.5" /> Code submission uploaded
                            </p>
                          ) : (
                            <button
                              onClick={() => handleSimulatedSubmit(ass.id)}
                              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                            >
                              Upload & Submit PDF
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: QUESTION BANK */}
        {activeTab === "questionbank" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Sample Papers & Archive Questions</h4>
            <div className="space-y-3">
              {questionBanksList.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-teal-50 text-teal-600 p-2.5">
                      <FileCode className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-tight">{m.title}</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">Sample Papers | Subject: {m.subject} | Sem {m.semester || "5th"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                      <button
                        onClick={() => setEditingMaterial({ ...m })}
                        className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                        title="Edit Study Material"
                      >
                        <Edit className="h-4 w-4 text-indigo-500" />
                      </button>
                    )}
                    <button
                      onClick={() => alert("Downloading question bank archives...")}
                      className="rounded-lg p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-zinc-800"
                      title="Download Archive"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Assignment Submissions or syllabus goals */}
      <div className="space-y-6">
        <div className="bento-card p-6 space-y-4">
          <div className="border-b border-gray-50 pb-3 dark:border-zinc-850 text-center">
            <Layers className="mx-auto h-8 w-8 text-indigo-500/60" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-2">Curriculum Standing</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-sans">Your academic timeline details</p>
          </div>

          {currentStudent ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Branch Division:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right leading-none max-w-[120px] truncate">{currentStudent.course.split(" ").pop()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Total Classes Met:</span>
                <span className="font-bold text-gray-900 dark:text-white">92% Met</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Pending Tasks:</span>
                <span className="font-bold text-rose-600">2 assignments</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center">No active student profile parsed.</p>
          )}
        </div>

        {uploadProgress !== null && (
          <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/20 p-6 shadow dark:border-indigo-900/30 dark:bg-zinc-900 text-xs text-center space-y-3">
            <p className="font-bold text-indigo-900 dark:text-white">Processing Document Submission...</p>
            <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden dark:bg-zinc-950">
              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{uploadProgress}% uploaded</span>
          </div>
        )}
      </div>

      {/* UPLOAD SYLLABUS / NOTES MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowUploadModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Course Material</h3>
            
            <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Material Resource Title</label>
                <input
                  type="text"
                  required
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="E.g. Computer Graphics Handbook"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Subject Division Name</label>
                <input
                  type="text"
                  required
                  value={newMaterial.subject}
                  onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="E.g. Food Production"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Material Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Syllabus">Curriculum Syllabus</option>
                    <option value="Textbook">Textbook Reference</option>
                    <option value="Notes">Class Notes</option>
                    <option value="Question Bank">Question Bank Archives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Course Semester</label>
                  <select
                    value={newMaterial.semester}
                    onChange={(e) => setNewMaterial({ ...newMaterial, semester: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="1st">1st Sem</option>
                    <option value="3rd">3rd Sem</option>
                    <option value="5th">5th Sem</option>
                    <option value="7th">7th Sem</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDY MATERIAL MODAL */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingMaterial(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 text-xs">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Academic Material</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateMaterial(editingMaterial);
              setEditingMaterial(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Material Document Title</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Subject Division Name</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.subject}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Material Type</label>
                  <select
                    value={editingMaterial.type}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, type: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Syllabus">Curriculum Syllabus</option>
                    <option value="Textbook">Textbook Reference</option>
                    <option value="Notes">Class Notes</option>
                    <option value="Question Bank">Question Bank Archives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Course Semester</label>
                  <select
                    value={editingMaterial.semester}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, semester: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="1st">1st Sem</option>
                    <option value="3rd">3rd Sem</option>
                    <option value="5th">5th Sem</option>
                    <option value="7th">7th Sem</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
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
