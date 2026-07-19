/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Role } from "./types";

// Import modules
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import StudentManagement from "./components/StudentManagement";
import FacultyManagement from "./components/FacultyManagement";
import AttendanceModule from "./components/AttendanceModule";
import FeesModule from "./components/FeesModule";
import ExamsModule from "./components/ExamsModule";
import StudyMaterialsModule from "./components/StudyMaterialsModule";
import HostelModule from "./components/HostelModule";
import LibraryModule from "./components/LibraryModule";
import PlacementModule from "./components/PlacementModule";
import NoticeBoardModule from "./components/NoticeBoardModule";
import CertificatesModule from "./components/CertificatesModule";
import ReportsModule from "./components/ReportsModule";
import SettingsModule from "./components/SettingsModule";
import AiStudioDebugger from "./components/AiStudioDebugger";
import PortalLogin from "./components/PortalLogin";
import AiAssistant from "./components/AiAssistant";

import {
  Student,
  Faculty,
  StudentAttendance,
  FeeDue,
  FeePayment,
  ExamTimetable,
  StudentResult,
  HostelRoom,
  VisitorLog,
  LibraryBook,
  BookIssue,
  PlacementCompany,
  PlacementDrive,
  StudyMaterial,
  Notice,
  ErpConfig
} from "./types";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [activeRole, setActiveRole] = useState<Role>(Role.ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  // Real-time states fetched from server
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<{
    students: Student[];
    faculty: Faculty[];
    studentAttendance: StudentAttendance[];
    feeDues: FeeDue[];
    feePayments: FeePayment[];
    exams: ExamTimetable[];
    results: StudentResult[];
    hostelRooms: HostelRoom[];
    visitorLogs: VisitorLog[];
    libraryBooks: LibraryBook[];
    bookIssues: BookIssue[];
    placementCompanies: PlacementCompany[];
    studyMaterials: StudyMaterial[];
    notices: Notice[];
    config: ErpConfig;
  } | null>(null);

  // Default active target contexts for Students / Faculty logins
  const [selectedStudentId, setSelectedStudentId] = useState("S001");
  const [selectedFacultyId, setSelectedFacultyId] = useState("F001");

  const handlePortalLogin = (role: Role, id: string) => {
    setActiveRole(role);
    if (role === Role.STUDENT) {
      setSelectedStudentId(id);
    } else if (role === Role.FACULTY) {
      setSelectedFacultyId(id);
    }
    setIsAuthenticated(true);
  };

  const handlePortalLogout = () => {
    setIsAuthenticated(false);
    setActiveMenu("dashboard");
  };

  // Fetch full data on mount
  const fetchErpData = async () => {
    try {
      const response = await fetch("/api/erp/data");
      const data = await response.json();
      if (data && data.students) {
        data.students = data.students.map((s: any) => ({
          ...s,
          password: s.password || "student123"
        }));
      }
      if (data && data.faculty) {
        data.faculty = data.faculty.map((f: any) => ({
          ...f,
          password: f.password || "faculty123"
        }));
      }
      setDbData(data);
      setLoading(false);
    } catch (e) {
      console.error("Failed to load ERP server databases", e);
    }
  };

  useEffect(() => {
    fetchErpData();
  }, []);

  // Post updates to server
  const updateErpDatabase = async (type: string, payload: any) => {
    try {
      const response = await fetch("/api/erp/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload })
      });
      const resData = await response.json();
      if (resData.success) {
        const db = resData.db;
        if (db && db.students) {
          db.students = db.students.map((s: any) => ({
            ...s,
            password: s.password || "student123"
          }));
        }
        if (db && db.faculty) {
          db.faculty = db.faculty.map((f: any) => ({
            ...f,
            password: f.password || "faculty123"
          }));
        }
        setDbData(db);
      }
    } catch (e) {
      console.error("Failed to write update transaction", e);
    }
  };

  // Synchronizers
  const handleAddStudent = (student: Student) => {
    updateErpDatabase("ADD_STUDENT", student);
  };

  const handleAddFaculty = (fac: Faculty) => {
    updateErpDatabase("ADD_FACULTY", fac);
  };

  const handleUpdateStudent = (student: Student) => {
    updateErpDatabase("UPDATE_STUDENT", student);
  };

  const handleUpdateFaculty = (fac: Faculty) => {
    updateErpDatabase("UPDATE_FACULTY", fac);
  };

  const handleUpdateExam = (exam: ExamTimetable) => {
    updateErpDatabase("UPDATE_EXAM", exam);
  };

  const handleUpdateResult = (result: StudentResult) => {
    updateErpDatabase("UPDATE_RESULT", result);
  };

  const handleAddStudentAttendance = (log: StudentAttendance) => {
    updateErpDatabase("ADD_STUDENT_ATTENDANCE", log);
  };

  const handleFacultyCheckIn = (payload: { facultyId: string; time: string }) => {
    updateErpDatabase("FACULTY_CHECK_IN", payload);
  };

  const handleFacultyCheckOut = (payload: { facultyId: string; time: string; hours: number }) => {
    updateErpDatabase("FACULTY_CHECK_OUT", payload);
  };

  const handleRecordPayment = (payload: {
    studentId: string;
    amountPaid: number;
    installment: string;
    paymentMethod: string;
    remarks: string;
  }) => {
    updateErpDatabase("RECORD_PAYMENT", payload);
  };

  const handleIssueBook = (payload: { bookId: string; studentId: string; dueDate: string }) => {
    updateErpDatabase("ISSUE_BOOK", payload);
  };

  const handleReturnBook = (payload: { issueId: string; fineAmount: number }) => {
    updateErpDatabase("RETURN_BOOK", payload);
  };

  const handleAddNotice = (notice: Notice) => {
    updateErpDatabase("POST_NOTICE", notice);
  };

  const handleUpdateNotice = (notice: Notice) => {
    updateErpDatabase("UPDATE_NOTICE", notice);
  };

  const handleApplyPlacementDrive = (driveId: string) => {
    alert(`Placement office successfully recorded student application for company drive ID ${driveId}.`);
  };

  const handleUpdatePlacementDrive = (drive: PlacementDrive) => {
    const lpaNumber = parseInt(drive.packageCtc.replace(/[^0-9]/g, '')) || 0;
    const packageLpa = lpaNumber > 1000 ? Math.round(lpaNumber / 1000) : lpaNumber;
    
    const existingCompany = dbData?.placementCompanies.find(c => c.id === drive.id);
    const updatedCompany = {
      id: drive.id,
      name: drive.companyName,
      interviewDate: drive.driveDate,
      jobRole: drive.role,
      packageLpa: packageLpa,
      status: existingCompany ? existingCompany.status : "Upcoming",
      selectedStudentIds: existingCompany ? existingCompany.selectedStudentIds : []
    };
    updateErpDatabase("UPDATE_PLACEMENT_COMPANY", updatedCompany);
  };

  const handleUploadMaterial = (material: StudyMaterial) => {
    updateErpDatabase("UPLOAD_MATERIAL", material);
  };

  const handleUpdateMaterial = (material: StudyMaterial) => {
    updateErpDatabase("UPDATE_STUDY_MATERIAL", material);
  };

  const handleUploadAssignmentSubmission = (assignmentId: string, path: string) => {
    alert(`Document registered: ${path}`);
  };

  const handleUpdateFeeDue = (due: FeeDue) => {
    updateErpDatabase("UPDATE_FEE_DUE", due);
  };

  const handleUpdateHostelRoom = (room: HostelRoom) => {
    updateErpDatabase("UPDATE_HOSTEL_ROOM", room);
  };

  const handleUpdateLibraryBook = (book: LibraryBook) => {
    updateErpDatabase("UPDATE_LIBRARY_BOOK", book);
  };

  // Apply dark class to body element when theme updates
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  if (loading || !dbData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 text-xs text-gray-500 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span>Synchronizing with Antigravity ERP Cloud database...</span>
        </div>
      </div>
    );
  }

  // Map placement stats dynamically
  const placementDrivesParsed = dbData.placementCompanies.map(c => ({
    id: c.id,
    companyName: c.name,
    role: c.jobRole,
    packageCtc: `${c.packageLpa},000 USD`,
    eligibilityCgpa: 7.5,
    targetBatches: "CSE & ECE Seniors",
    driveDate: c.interviewDate,
    location: "Campus block #4"
  }));

  const placedStudentsParsed = dbData.placementCompanies
    .filter(c => c.status === "Completed")
    .flatMap(c => c.selectedStudentIds.map(sid => {
      const stud = dbData.students.find(s => s.id === sid);
      return {
        id: `PS-${sid}`,
        studentId: sid,
        studentName: stud ? stud.name : "Student",
        companyName: c.name,
        packageCtc: `${c.packageLpa},000 USD`,
        selectionDate: "July 2026"
      };
    }));

  if (!isAuthenticated) {
    return (
      <div className={theme === "dark" ? "dark" : ""}>
        <PortalLogin
          students={dbData.students}
          faculty={dbData.faculty}
          onLogin={handlePortalLogin}
          onUpdateStudent={handleAddStudent}
          onUpdateFaculty={handleAddFaculty}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Side Navigation panel */}
      <Navigation
        activeModule={activeMenu}
        setActiveModule={setActiveMenu}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        selectedFacultyId={selectedFacultyId}
        setSelectedFacultyId={setSelectedFacultyId}
        theme={theme}
        setTheme={setTheme}
        students={dbData.students}
        faculty={dbData.faculty}
        notices={dbData.notices}
        openAiAssistant={() => setAiAssistantOpen(true)}
        config={dbData.config}
        onLogout={handlePortalLogout}
      />

      {/* Main viewport content section - with top spacing for absolute navbar height and left spacing for sidebar */}
      <div className="pt-16 md:pl-[260px] min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {activeMenu === "dashboard" && (
                <Dashboard
                  data={dbData}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                  selectedFacultyId={selectedFacultyId}
                  setActiveModule={setActiveMenu}
                />
              )}

              {activeMenu === "students" && (
                <StudentManagement
                  students={dbData.students}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "faculty" && (
                <FacultyManagement
                  faculty={dbData.faculty}
                  onAddFaculty={handleAddFaculty}
                  onUpdateFaculty={handleUpdateFaculty}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "student-attendance" && (
                <AttendanceModule
                  students={dbData.students}
                  faculty={dbData.faculty}
                  studentAttendance={dbData.studentAttendance}
                  onAddStudentAttendance={handleAddStudentAttendance}
                  onFacultyCheckIn={handleFacultyCheckIn}
                  onFacultyCheckOut={handleFacultyCheckOut}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                  selectedFacultyId={selectedFacultyId}
                />
              )}

              {activeMenu === "faculty-attendance" && (
                <AttendanceModule
                  students={dbData.students}
                  faculty={dbData.faculty}
                  studentAttendance={dbData.studentAttendance}
                  onAddStudentAttendance={handleAddStudentAttendance}
                  onFacultyCheckIn={handleFacultyCheckIn}
                  onFacultyCheckOut={handleFacultyCheckOut}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                  selectedFacultyId={selectedFacultyId}
                />
              )}

              {activeMenu === "exams" && (
                <ExamsModule
                  students={dbData.students}
                  exams={dbData.exams}
                  results={dbData.results}
                  onUpdateExam={handleUpdateExam}
                  onUpdateResult={handleUpdateResult}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                />
              )}

              {activeMenu === "study-materials" && (
                <StudyMaterialsModule
                  students={dbData.students}
                  materials={dbData.studyMaterials}
                  assignments={[
                    { id: "ASS-01", subject: "Design & Analysis of Algorithms", title: "Assignment 1: Dynamic Programming Knapsack", dueDate: "2026-07-25", status: "Pending", maxMarks: 100 },
                    { id: "ASS-02", subject: "Database Management Systems", title: "Assignment 2: Schema normalization Normal Forms", dueDate: "2026-07-27", status: "Submitted", maxMarks: 100 }
                  ]}
                  onUploadMaterial={handleUploadMaterial}
                  onUploadAssignmentSubmission={handleUploadAssignmentSubmission}
                  onUpdateMaterial={handleUpdateMaterial}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                />
              )}

              {activeMenu === "fees" && (
                <FeesModule
                  students={dbData.students}
                  feeDues={dbData.feeDues}
                  feePayments={dbData.feePayments}
                  onRecordPayment={handleRecordPayment}
                  onUpdateFeeDue={handleUpdateFeeDue}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                />
              )}

              {activeMenu === "hostel" && (
                <HostelModule
                  students={dbData.students}
                  hostelRooms={dbData.hostelRooms}
                  visitorLogs={dbData.visitorLogs}
                  onUpdateHostelRoom={handleUpdateHostelRoom}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "library" && (
                <LibraryModule
                  students={dbData.students}
                  libraryBooks={dbData.libraryBooks}
                  bookIssues={dbData.bookIssues}
                  onIssueBook={handleIssueBook}
                  onReturnBook={handleReturnBook}
                  onUpdateLibraryBook={handleUpdateLibraryBook}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                />
              )}

              {activeMenu === "placements" && (
                <PlacementModule
                  students={dbData.students}
                  placementDrives={placementDrivesParsed}
                  placedStudents={placedStudentsParsed}
                  onApplyDrive={handleApplyPlacementDrive}
                  onUpdatePlacementDrive={handleUpdatePlacementDrive}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "notices" && (
                <NoticeBoardModule
                  notices={dbData.notices}
                  onAddNotice={handleAddNotice}
                  onUpdateNotice={handleUpdateNotice}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "certificates" && (
                <CertificatesModule
                  students={dbData.students}
                  activeRole={activeRole}
                  selectedStudentId={selectedStudentId}
                />
              )}

              {activeMenu === "reports" && (
                <ReportsModule
                  students={dbData.students}
                  faculty={dbData.faculty}
                  studentAttendance={dbData.studentAttendance}
                  feeDues={dbData.feeDues}
                  activeRole={activeRole}
                />
              )}

              {activeMenu === "settings" && (
                <SettingsModule
                  activeRole={activeRole}
                  onChangeRole={setActiveRole}
                  config={dbData.config}
                  onUpdateConfig={(payload) => updateErpDatabase("UPDATE_CONFIG", payload)}
                />
              )}

              {activeMenu === "ai-studio" && (
                <AiStudioDebugger activeRole={activeRole} config={dbData.config} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Grounded AI Chatbot drawer */}
      <AiAssistant isOpen={aiAssistantOpen} setIsOpen={setAiAssistantOpen} />
    </div>
  );
}
