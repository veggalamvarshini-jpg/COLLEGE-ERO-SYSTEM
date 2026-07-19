/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Shield,
  BookOpen,
  DollarSign,
  Heart,
  Briefcase,
  Home,
  Edit
} from "lucide-react";
import { Student, Role } from "../types";

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  activeRole: Role;
}

export default function StudentManagement({
  students,
  onAddStudent,
  onUpdateStudent,
  activeRole
}: StudentManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);

  // Add student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    admissionNumber: "",
    rollNo: "",
    fatherName: "",
    motherName: "",
    aadhaarNumber: "",
    dob: "",
    gender: "Male",
    bloodGroup: "O+",
    address: "",
    course: "3 Years Diploma in Hotel Management",
    semester: "1st",
    section: "A",
    hostelStatus: "Day Scholar" as "Day Scholar" | "Hosteler",
    transportStatus: "Self" as any,
    feeStatus: "Pending" as any,
    placementStatus: "Unplaced" as any,
    academicGpa: 8.0,
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
  });

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "All" || student.course.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `S00${students.length + 1}`;
    const qrCode = `AIT-${id}`;
    onAddStudent({
      id,
      qrCode,
      ...newStudent
    });
    setShowAddModal(false);
    // Reset form
    setNewStudent({
      name: "",
      email: "",
      password: "",
      mobileNumber: "",
      admissionNumber: "",
      rollNo: "",
      fatherName: "",
      motherName: "",
      aadhaarNumber: "",
      dob: "",
      gender: "Male",
      bloodGroup: "O+",
      address: "",
    course: "3 Years Diploma in Hotel Management",
      semester: "1st",
      section: "A",
      hostelStatus: "Day Scholar",
      transportStatus: "Self",
      feeStatus: "Pending",
      placementStatus: "Unplaced",
      academicGpa: 8.0,
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
    });
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert("Synthesizing vector digital PDF and barcode... Certificate downloaded successfully as PDF!");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT COLUMN: Student list & Filters */}
      <div className="bento-card p-6 lg:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Active Student Directory</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Manage and browse undergraduate profiles</p>
          </div>
          {activeRole === Role.ADMIN && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
              id="add_student_btn"
            >
              <UserPlus className="h-4 w-4" /> Add Student
            </button>
          )}
        </div>

        {/* Search and filter row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, adm no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option value="All">All Programs</option>
              <option value="1 Year Diploma">1 Year Diploma</option>
              <option value="2 Years Diploma">2 Years Diploma</option>
              <option value="3 Years Diploma">3 Years Diploma</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* Student Directory Grid */}
        <div className="mt-6 space-y-3">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">No student matching search found.</div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  setShowIdCard(false);
                }}
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-zinc-850/30 transition-all ${
                  selectedStudent?.id === student.id
                    ? "border-indigo-500 bg-indigo-50/30 dark:border-indigo-600 dark:bg-indigo-950/20"
                    : "border-gray-100 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</h4>
                    <p className="text-[11px] font-mono text-gray-500 dark:text-zinc-400">
                      {student.rollNo} | {student.course}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Sem {student.semester}
                    </span>
                    <p className="mt-1 text-[10px] font-mono text-gray-400">GPA: {student.academicGpa.toFixed(1)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Student Details & Digital ID Card */}
      <div className="space-y-6">
        {selectedStudent ? (
          <div className="bento-card p-6">
            {/* View switcher */}
            <div className="flex gap-2 border-b border-gray-100 pb-4 dark:border-zinc-800">
              <button
                onClick={() => setShowIdCard(false)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                  !showIdCard
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                Detailed Profile
              </button>
              <button
                onClick={() => setShowIdCard(true)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  showIdCard
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                <QrCode className="h-3.5 w-3.5" /> Digital ID Card
              </button>
            </div>

            {/* Render view: Detail vs ID Card */}
            {!showIdCard ? (
              <div className="mt-5 space-y-5">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedStudent.photoUrl}
                    alt={selectedStudent.name}
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-zinc-800"
                  />
                  <h3 className="mt-3 font-extrabold text-gray-900 dark:text-white text-base">{selectedStudent.name}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{selectedStudent.rollNo}</p>
                  {activeRole === Role.ADMIN && (
                    <button
                      onClick={() => setEditingStudent({ ...selectedStudent })}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-zinc-800 dark:text-indigo-300 dark:hover:bg-zinc-750 px-3 py-1.5 text-xs font-semibold"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Academic Records</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                      <p className="text-gray-400 text-[10px]">Course Program</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1 leading-tight">{selectedStudent.course}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                      <p className="text-gray-400 text-[10px]">Semester / Section</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1">{selectedStudent.semester} (Sec {selectedStudent.section})</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                      <p className="text-gray-400 text-[10px]">Cumulative GPA</p>
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono text-sm">{selectedStudent.academicGpa.toFixed(2)} / 10</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-zinc-950">
                      <p className="text-gray-400 text-[10px]">Admission No</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1 font-mono">{selectedStudent.admissionNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Personal & Contact Info</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedStudent.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span>Aadhaar: <span className="font-mono">{selectedStudent.aadhaarNumber}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-zinc-300">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="leading-tight">{selectedStudent.address}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">AIT Auxiliaries</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-gray-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-gray-400" />
                      <span>{selectedStudent.hostelStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-red-400" />
                      <span>Blood: {selectedStudent.bloodGroup}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      <span>Placement: {selectedStudent.placementStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Fees: {selectedStudent.feeStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* DIGITAL STUDENT ID BADGE */
              <div className="mt-5 space-y-5">
                {/* Visual Badge Card */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-indigo-900 via-indigo-950 to-zinc-950 p-6 text-white shadow-xl">
                  {/* Badge Glow Accents */}
                  <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-xl" />
                  
                  {/* Institute Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold text-sm">A</div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider leading-none">Antigravity</h4>
                        <span className="text-[8px] tracking-widest text-indigo-300 font-semibold font-mono">INSTITUTE OF TECH</span>
                      </div>
                    </div>
                    <span className="text-[8px] border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 rounded px-1.5 font-mono">
                      VALID ID
                    </span>
                  </div>

                  {/* Badge Content */}
                  <div className="mt-5 flex gap-4">
                    <img
                      src={selectedStudent.photoUrl}
                      alt={selectedStudent.name}
                      referrerPolicy="no-referrer"
                      className="h-28 w-24 rounded-lg object-cover border border-white/20 shadow-lg shrink-0"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-extrabold text-base leading-none">{selectedStudent.name}</h3>
                        <p className="text-[10px] text-indigo-300 font-mono mt-1">{selectedStudent.rollNo}</p>
                      </div>
                      
                      <div className="space-y-1 text-[10px] text-zinc-300 mt-2">
                        <p><span className="text-zinc-500 font-mono">COURSE:</span> {selectedStudent.course.split(" ").pop()}</p>
                        <p><span className="text-zinc-500 font-mono">DOB:</span> {selectedStudent.dob}</p>
                        <p><span className="text-zinc-500 font-mono">BLOOD:</span> {selectedStudent.bloodGroup}</p>
                      </div>
                    </div>
                  </div>

                  {/* Barcode & QR code Row */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      {/* Fake barcode simulation using small divs */}
                      <div className="flex items-center gap-[1.5px] bg-white/95 p-1.5 rounded">
                        {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2].map((w, i) => (
                          <div key={i} className="bg-black h-5" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[8px] font-mono mt-1 block text-zinc-400 text-center uppercase">
                        {selectedStudent.admissionNumber}
                      </span>
                    </div>

                    <div className="bg-white p-1 rounded-lg">
                      <div className="bg-zinc-100 h-11 w-11 flex items-center justify-center">
                        <QrCode className="h-9 w-9 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Footer Emergency info */}
                  <div className="mt-4 text-[8px] text-zinc-500 flex justify-between">
                    <span>EMERGENCY: +1 (555) 911-0001</span>
                    <span>EXP: JUNE 2028</span>
                  </div>
                </div>

                {/* Print and Save Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button
                    onClick={handlePrintCard}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
                  >
                    <Printer className="h-4 w-4" /> Print Badge
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center text-xs text-gray-400 dark:border-zinc-800 dark:bg-zinc-900">
            No student selected. Select from list to view detailed profile or ID card.
          </div>
        )}
      </div>

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Enroll New Student Record</h3>
            
            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-gray-500 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="E.g. James Peterson"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Academic Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="username@ait.edu"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Password Credentials</label>
                  <input
                    type="text"
                    required
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="Set custom password"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={newStudent.mobileNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, mobileNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Aadhaar National ID No</label>
                  <input
                    type="text"
                    required
                    value={newStudent.aadhaarNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, aadhaarNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="0000-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Admission Index No</label>
                  <input
                    type="text"
                    required
                    value={newStudent.admissionNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, admissionNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="ADM-2026-X"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Roll / Section No</label>
                  <input
                    type="text"
                    required
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="CSE-26-XX"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Degree Course Department</label>
                  <select
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="1 Year Diploma in Hotel Management">1 Year Diploma in Hotel Management</option>
                    <option value="2 Years Diploma in Hotel Management">2 Years Diploma in Hotel Management</option>
                    <option value="3 Years Diploma in Hotel Management">3 Years Diploma in Hotel Management</option>
                    <option value="Others">Others</option>
                  </select>
                  <p className="mt-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    ⚡ Auto-creates a separate fee structure and installments for this program length upon confirmation.
                  </p>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.motherName}
                    onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Blood Group</label>
                  <select
                    value={newStudent.bloodGroup}
                    onChange={(e) => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Hostel Choice</label>
                  <select
                    value={newStudent.hostelStatus}
                    onChange={(e) => setNewStudent({ ...newStudent, hostelStatus: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Day Scholar">Day Scholar</option>
                    <option value="Hosteler">Hosteler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Residential Address</label>
                <textarea
                  required
                  rows={2}
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="Street details..."
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
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingStudent(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Student Profile</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateStudent(editingStudent);
              setSelectedStudent(editingStudent);
              setEditingStudent(null);
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-gray-500 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Academic Email</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Password Credentials</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.password || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="student123"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.mobileNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, mobileNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Aadhaar National ID No</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.aadhaarNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, aadhaarNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Admission Index No</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.admissionNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, admissionNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Roll / Section No</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.rollNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Degree Course Department</label>
                  <select
                    value={editingStudent.course}
                    onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="1 Year Diploma in Hotel Management">1 Year Diploma in Hotel Management</option>
                    <option value="2 Years Diploma in Hotel Management">2 Years Diploma in Hotel Management</option>
                    <option value="3 Years Diploma in Hotel Management">3 Years Diploma in Hotel Management</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Semester</label>
                  <select
                    value={editingStudent.semester}
                    onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Academic GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={editingStudent.academicGpa}
                    onChange={(e) => setEditingStudent({ ...editingStudent, academicGpa: parseFloat(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fatherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.motherName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editingStudent.dob}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Blood Group</label>
                  <select
                    value={editingStudent.bloodGroup}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Hostel Choice</label>
                  <select
                    value={editingStudent.hostelStatus}
                    onChange={(e) => setEditingStudent({ ...editingStudent, hostelStatus: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Day Scholar">Day Scholar</option>
                    <option value="Hosteler">Hosteler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Fee Payment Status</label>
                  <select
                    value={editingStudent.feeStatus}
                    onChange={(e) => setEditingStudent({ ...editingStudent, feeStatus: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Placement Status</label>
                  <select
                    value={editingStudent.placementStatus}
                    onChange={(e) => setEditingStudent({ ...editingStudent, placementStatus: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Unplaced">Unplaced</option>
                    <option value="In-Process">In-Process</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Residential Address</label>
                <textarea
                  required
                  rows={2}
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
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
