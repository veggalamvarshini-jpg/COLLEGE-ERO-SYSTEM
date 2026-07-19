/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

import {
  Role,
  Student,
  Faculty,
  StudentAttendance,
  FacultyAttendanceLog,
  FeeDue,
  FeePayment,
  ExamTimetable,
  StudentResult,
  HostelRoom,
  VisitorLog,
  LibraryBook,
  BookIssue,
  PlacementCompany,
  StudyMaterial,
  Notice,
  ErpConfig
} from "./src/types.js"; // Importing type definitions

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- In-Memory ERP Database ---
const db = {
  config: {
    instituteName: "Varni International Institute of Hotel Management",
    academicYear: "2026-2027",
    theme: "light",
    notificationsEnabled: true,
    adminName: "Varni Registrar Office",
    adminEmail: "registrar@varni.edu",
    debuggerAllowedRoles: ["ADMIN"]
  } as ErpConfig,

  students: [
    {
      id: "S001",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      qrCode: "VARNI-S001",
      admissionNumber: "ADM-2026-001",
      name: "Varshini Veggalam",
      fatherName: "Venkat Veggalam",
      motherName: "Radhika Veggalam",
      mobileNumber: "+91 98480 22334",
      email: "varshini.v@varni.edu",
      aadhaarNumber: "8472-1928-3012",
      dob: "2006-05-14",
      gender: "Female",
      bloodGroup: "O+",
      address: "Miyapur Metro Station Lane, Plot 42, Hyderabad, Telangana",
      course: "3 Years Diploma in Hotel Management",
      semester: "1st",
      section: "A",
      hostelStatus: "Day Scholar",
      transportStatus: "Bus Route A",
      feeStatus: "Partially Paid",
      placementStatus: "In Process",
      rollNo: "HM-26-001",
      academicGpa: 9.30
    },
    {
      id: "S002",
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
      qrCode: "VARNI-S002",
      admissionNumber: "ADM-2026-002",
      name: "Siddharth Mehta",
      fatherName: "Rajendra Mehta",
      motherName: "Sunita Mehta",
      mobileNumber: "+91 91234 56789",
      email: "siddharth.m@varni.edu",
      aadhaarNumber: "7219-4820-9182",
      dob: "2005-09-22",
      gender: "Male",
      bloodGroup: "B+",
      address: "Bandra West, Sea View Apartments, Block C, Mumbai, MH",
      course: "2 Years Diploma in Hotel Management",
      semester: "3rd",
      section: "B",
      hostelStatus: "Hosteler",
      transportStatus: "Self",
      feeStatus: "Paid",
      placementStatus: "Placed",
      rollNo: "HM-26-002",
      academicGpa: 8.50
    },
    {
      id: "S003",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      qrCode: "VARNI-S003",
      admissionNumber: "ADM-2026-003",
      name: "Aditi Rao",
      fatherName: "Madhav Rao",
      motherName: "Lakshmi Rao",
      mobileNumber: "+91 98765 43210",
      email: "aditi.rao@varni.edu",
      aadhaarNumber: "9102-3847-1920",
      dob: "2007-01-05",
      gender: "Female",
      bloodGroup: "A+",
      address: "Indiranagar, 12th Main Road, No. 512, Bangalore, Karnataka",
      course: "1 Year Diploma in Hotel Management",
      semester: "1st",
      section: "A",
      hostelStatus: "Day Scholar",
      transportStatus: "Self",
      feeStatus: "Pending",
      placementStatus: "Unplaced",
      rollNo: "HM-26-003",
      academicGpa: 7.80
    },
    {
      id: "S004",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      qrCode: "VARNI-S004",
      admissionNumber: "ADM-2026-004",
      name: "Karan Johar",
      fatherName: "Yash Johar",
      motherName: "Hiroo Johar",
      mobileNumber: "+91 99887 76655",
      email: "karan.johar@varni.edu",
      aadhaarNumber: "1029-3847-5620",
      dob: "2004-11-18",
      gender: "Male",
      bloodGroup: "AB+",
      address: "Juhu Tara Road, Royal Palms, Mansion 7, Mumbai, MH",
      course: "3 Years Diploma in Hotel Management",
      semester: "5th",
      section: "A",
      hostelStatus: "Hosteler",
      transportStatus: "Self",
      feeStatus: "Paid",
      placementStatus: "Placed",
      rollNo: "HM-26-004",
      academicGpa: 8.90
    },
    {
      id: "S005",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      qrCode: "VARNI-S005",
      admissionNumber: "ADM-2026-005",
      name: "Priya Sharma",
      fatherName: "Anil Sharma",
      motherName: "Rekha Sharma",
      mobileNumber: "+91 94401 23456",
      email: "priya.sharma@varni.edu",
      aadhaarNumber: "5182-3910-4820",
      dob: "2006-12-08",
      gender: "Female",
      bloodGroup: "O-",
      address: "Gachibowli DLF Road, Cyber Towers Vista, Hyderabad, Telangana",
      course: "Others",
      semester: "1st",
      section: "C",
      hostelStatus: "Day Scholar",
      transportStatus: "Bus Route B",
      feeStatus: "Pending",
      placementStatus: "Unplaced",
      rollNo: "HM-26-005",
      academicGpa: 8.00
    }
  ] as Student[],

  faculty: [
    {
      id: "F001",
      photoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
      name: "Chef Ranveer Brar",
      employeeId: "EMP-26-101",
      department: "Culinary Arts & Food Production",
      designation: "Professor & Executive Chef",
      email: "ranveer.brar@varni.edu",
      mobile: "+91 99112 23344",
      workingHours: 42,
      overtimeHours: 6,
      leaveBalance: { casual: 12, sick: 8, earned: 15 },
      isPresentToday: true,
      checkInTime: "08:15 AM"
    },
    {
      id: "F002",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      name: "Ms. Anjali Sen",
      employeeId: "EMP-26-102",
      department: "Front Office Management",
      designation: "Associate Professor",
      email: "anjali.sen@varni.edu",
      mobile: "+91 98888 77777",
      workingHours: 35,
      overtimeHours: 2,
      leaveBalance: { casual: 10, sick: 10, earned: 18 },
      isPresentToday: true,
      checkInTime: "08:45 AM"
    },
    {
      id: "F003",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      name: "Mr. Robert D'Souza",
      employeeId: "EMP-26-103",
      department: "Housekeeping & Accommodations",
      designation: "Assistant Professor",
      email: "robert.dsouza@varni.edu",
      mobile: "+91 97777 66666",
      workingHours: 38,
      overtimeHours: 0,
      leaveBalance: { casual: 8, sick: 12, earned: 14 },
      isPresentToday: false
    },
    {
      id: "F004",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      name: "Chef Sanjeev Kapoor",
      employeeId: "EMP-26-104",
      department: "Food & Beverage Service",
      designation: "Dean of Hotel Administration",
      email: "sanjeev.kapoor@varni.edu",
      mobile: "+91 96666 55555",
      workingHours: 40,
      overtimeHours: 10,
      leaveBalance: { casual: 15, sick: 10, earned: 20 },
      isPresentToday: true,
      checkInTime: "08:00 AM"
    }
  ] as Faculty[],

  studentAttendance: [
    { studentId: "S001", date: "2026-07-18", status: "Present", markedBy: "Chef Ranveer Brar", method: "QR Scanner" },
    { studentId: "S002", date: "2026-07-18", status: "Present", markedBy: "Chef Ranveer Brar", method: "QR Scanner" },
    { studentId: "S003", date: "2026-07-18", status: "Late", markedBy: "Ms. Anjali Sen", method: "Manual" },
    { studentId: "S004", date: "2026-07-18", status: "Present", markedBy: "Chef Ranveer Brar", method: "QR Scanner" },
    { studentId: "S005", date: "2026-07-18", status: "Absent", markedBy: "Ms. Anjali Sen", method: "Manual" }
  ] as StudentAttendance[],

  facultyAttendance: [] as FacultyAttendanceLog[],

  feeDues: [
    {
      id: "FD001",
      studentId: "S001",
      totalFee: 150000,
      paidAmount: 50000,
      dueAmount: 100000,
      dueDate: "2026-10-15",
      installments: [
        { name: "1st Semester Installment", amount: 50000, status: "Paid", dueDate: "2026-07-10" },
        { name: "2nd Semester Installment", amount: 50000, status: "Pending", dueDate: "2026-11-15" },
        { name: "3rd Semester Installment", amount: 50000, status: "Pending", dueDate: "2027-03-15" }
      ]
    },
    {
      id: "FD002",
      studentId: "S002",
      totalFee: 220000,
      paidAmount: 220000,
      dueAmount: 0,
      dueDate: "2026-08-01",
      installments: [
        { name: "Year 1 Term Fee", amount: 110000, status: "Paid", dueDate: "2026-07-01" },
        { name: "Year 2 Term Fee", amount: 110000, status: "Paid", dueDate: "2026-07-15" }
      ]
    },
    {
      id: "FD003",
      studentId: "S003",
      totalFee: 95000,
      paidAmount: 0,
      dueAmount: 95000,
      dueDate: "2026-07-31",
      installments: [
        { name: "Admission Booking Installment", amount: 45000, status: "Pending", dueDate: "2026-07-31" },
        { name: "Practical Cookery Kit Charges", amount: 50000, status: "Pending", dueDate: "2026-08-15" }
      ]
    },
    {
      id: "FD004",
      studentId: "S004",
      totalFee: 150000,
      paidAmount: 150000,
      dueAmount: 0,
      dueDate: "2026-07-30",
      installments: [
        { name: "1st Term Tuition fee", amount: 75000, status: "Paid", dueDate: "2026-07-02" },
        { name: "2nd Term Tuition fee", amount: 75000, status: "Paid", dueDate: "2026-07-14" }
      ]
    },
    {
      id: "FD005",
      studentId: "S005",
      totalFee: 180000,
      paidAmount: 0,
      dueAmount: 180000,
      dueDate: "2026-07-25",
      installments: [
        { name: "Culinary Booking Fee", amount: 60000, status: "Pending", dueDate: "2026-07-25" },
        { name: "Commercial Cooking Lab Tuitions", amount: 120000, status: "Pending", dueDate: "2026-09-30" }
      ]
    }
  ] as FeeDue[],

  feePayments: [
    { id: "FP_001", studentId: "S001", amountPaid: 50000, paymentDate: "2026-07-10", receiptNumber: "REC-29182", installment: "1st Semester Installment", paymentMethod: "UPI Scan", remarks: "First-term online enrollment fee cleared" },
    { id: "FP_002", studentId: "S002", amountPaid: 110000, paymentDate: "2026-07-01", receiptNumber: "REC-10294", installment: "Year 1 Term Fee", paymentMethod: "Net Banking", remarks: "Year 1 primary fees paid" },
    { id: "FP_003", studentId: "S002", amountPaid: 110000, paymentDate: "2026-07-15", receiptNumber: "REC-93821", installment: "Year 2 Term Fee", paymentMethod: "Credit Card", remarks: "Advance clearance Year 2" },
    { id: "FP_004", studentId: "S004", amountPaid: 75000, paymentDate: "2026-07-02", receiptNumber: "REC-38491", installment: "1st Term Tuition fee", paymentMethod: "UPI Scan", remarks: "Term 1 Tuition" },
    { id: "FP_005", studentId: "S004", amountPaid: 75000, paymentDate: "2026-07-14", receiptNumber: "REC-82910", installment: "2nd Term Tuition fee", paymentMethod: "Bank Draft", remarks: "Clearing final term" }
  ] as FeePayment[],

  exams: [
    { id: "EX001", course: "3 Years Diploma in Hotel Management", semester: "1st", subject: "Food Production & Culinary Arts I", examDate: "2026-07-28", examTime: "10:00 AM - 01:00 PM", room: "Culinary Studio Lab 1" },
    { id: "EX002", course: "3 Years Diploma in Hotel Management", semester: "1st", subject: "Front Office Operations & Lobby Management", examDate: "2026-07-30", examTime: "10:00 AM - 01:00 PM", room: "Mock Lobby Front Office" },
    { id: "EX003", course: "2 Years Diploma in Hotel Management", semester: "3rd", subject: "Food & Beverage Service & Mixology Standards", examDate: "2026-07-29", examTime: "10:00 AM - 01:00 PM", room: "Fine Dining Training lounge" },
    { id: "EX004", course: "1 Year Diploma in Hotel Management", semester: "1st", subject: "Housekeeping Operations & Laundry Management", examDate: "2026-07-31", examTime: "10:00 AM - 01:00 PM", room: "Mock Suite Room B" },
    { id: "EX005", course: "Others", semester: "1st", subject: "Principles of Hospitality & Tourism", examDate: "2026-08-01", examTime: "10:00 AM - 01:00 PM", room: "Auditorium Annex" }
  ] as ExamTimetable[],

  results: [
    { studentId: "S001", subject: "Food Production & Culinary Arts I", internalMarks: 23, practicalMarks: 48, semesterMarks: 24, maxMarks: 100, grade: "A" },
    { studentId: "S001", subject: "Front Office Operations & Lobby Management", internalMarks: 24, practicalMarks: 46, semesterMarks: 25, maxMarks: 100, grade: "A+" },
    { studentId: "S002", subject: "Food & Beverage Service & Mixology Standards", internalMarks: 22, practicalMarks: 41, semesterMarks: 21, maxMarks: 100, grade: "B+" },
    { studentId: "S003", subject: "Housekeeping Operations & Laundry Management", internalMarks: 19, practicalMarks: 34, semesterMarks: 18, maxMarks: 100, grade: "B" }
  ] as StudentResult[],

  hostelRooms: [
    { id: "HR001", roomNumber: "HM-101", block: "Block A (Boys)", roomType: "Double AC", capacity: 2, occupants: ["S002", "S004"], monthlyRent: 12000 },
    { id: "HR002", roomNumber: "HM-202", block: "Block B (Girls)", roomType: "Single AC", capacity: 1, occupants: [], monthlyRent: 18000 },
    { id: "HR003", roomNumber: "HM-103", block: "Block A (Boys)", roomType: "Single AC", capacity: 1, occupants: [], monthlyRent: 18000 },
    { id: "HR004", roomNumber: "HM-204", block: "Block B (Girls)", roomType: "Double Non-AC", capacity: 2, occupants: [], monthlyRent: 8000 }
  ] as HostelRoom[],

  visitorLogs: [] as VisitorLog[],

  libraryBooks: [
    { id: "BK001", barcode: "9780132350884", title: "Practical Cookery (14th Edition)", author: "John Campbell", category: "Culinary Arts", isbn: "0132350882", availableCopies: 5, totalCopies: 5, locationShelf: "Rack C-3" },
    { id: "BK002", barcode: "9780262033848", title: "Hotel Housekeeping: Operations and Management", author: "G. Raghubalan", category: "Housekeeping", isbn: "0262033844", availableCopies: 3, totalCopies: 3, locationShelf: "Rack H-1" },
    { id: "BK003", barcode: "9780133594140", title: "Front Office Operations Manual", author: "Sudhir Andrews", category: "Front Office Operations", isbn: "0133594140", availableCopies: 2, totalCopies: 2, locationShelf: "Rack F-2" },
    { id: "BK004", barcode: "9780201633610", title: "Food and Beverage Service (9th Edition)", author: "Dennis Lillicrap", category: "Food & Beverage", isbn: "0201633612", availableCopies: 3, totalCopies: 3, locationShelf: "Rack FB-1" },
    { id: "BK005", barcode: "9780136042594", title: "Marketing for Hospitality and Tourism", author: "Philip Kotler", category: "Hospitality Management", isbn: "0136042597", availableCopies: 2, totalCopies: 2, locationShelf: "Rack M-1" }
  ] as LibraryBook[],

  bookIssues: [] as BookIssue[],

  placementCompanies: [
    { id: "C001", name: "Taj Group of Hotels", interviewDate: "2026-08-15", jobRole: "Management Trainee - Culinary", packageLpa: 8.5, status: "Upcoming", selectedStudentIds: [] },
    { id: "C002", name: "Marriott International", interviewDate: "2026-07-10", jobRole: "Guest Relations Associate", packageLpa: 6.0, status: "Completed", selectedStudentIds: ["S002"] },
    { id: "C003", name: "The Oberoi Group", interviewDate: "2026-07-15", jobRole: "F&B Executive Trainee", packageLpa: 9.0, status: "Completed", selectedStudentIds: ["S004"] },
    { id: "C004", name: "Hyatt Regency", interviewDate: "2026-09-02", jobRole: "Housekeeping Supervisor Trainee", packageLpa: 5.5, status: "Upcoming", selectedStudentIds: [] }
  ] as PlacementCompany[],

  studyMaterials: [
    { id: "M001", title: "Culinary Arts & Basic Knife Skills Guide", type: "PDF", subject: "Food Production & Culinary Arts I", uploadedBy: "Chef Ranveer Brar", uploadedDate: "2026-07-10", downloadUrl: "#", description: "Standard instructional handbook covering culinary knife grips and safety." },
    { id: "M002", title: "Front Office Lobby Reception Desk Flowcharts", type: "PPT", subject: "Front Office Operations & Lobby Management", uploadedBy: "Ms. Anjali Sen", uploadedDate: "2026-07-14", downloadUrl: "#", description: "Step-by-step guest check-in, check-out, and telephone etiquette guidelines." },
    { id: "M003", title: "Silver Service Layouts & Table Etiquette Manual", type: "Notes", subject: "Food & Beverage Service & Mixology Standards", uploadedBy: "Chef Sanjeev Kapoor", uploadedDate: "2026-07-12", downloadUrl: "#", description: "Complete manual on classical silver services, glassware types, and wine pairings." },
    { id: "M004", title: "Varni Practical Cooking Mid-Term Specimen Paper", type: "Paper", subject: "Food Production & Culinary Arts I", uploadedBy: "Chef Ranveer Brar", uploadedDate: "2026-07-15", downloadUrl: "#", description: "Previous year kitchen practical blueprints with grading matrices." }
  ] as StudyMaterial[],

  notices: [
    { id: "N001", title: "Mid-Term Kitchen Practical Examination Schedule", category: "Exam", content: "Mid-Term kitchen practical exams for all Hotel Management diplomas will commence from July 28, 2026. Hall tickets can be generated from the ERP starting tomorrow. White Chef uniforms are mandatory.", date: "2026-07-17", postedBy: "Office of Controller of Exams" },
    { id: "N002", title: "Taj & Marriott Hotels Campus Recruitment Drive", category: "Placement", content: "Taj Group of Hotels and Marriott International will be hosting on-campus interview drives for final and second-year diplomas starting August 15, 2026. Submit profiles via the Placements tab.", date: "2026-07-16", postedBy: "Head of Placements" },
    { id: "N003", title: "Mandatory Kitchen Grooming & Hygiene Audits", category: "Notice", content: "From tomorrow, all Culinary department students are subject to random grooming checks before entry to Kitchen Lab 1. Hair nets, trim nails, and closed safety shoes are compulsory.", date: "2026-07-15", postedBy: "Dean Sanjeev Kapoor" },
    { id: "N004", title: "Independence Day Celebrations & Gala Lunch", category: "Event", content: "Flag hoisting ceremony will be held on the central lawn on August 15 at 08:30 AM, followed by a special Indian Culinary Gala Buffet prepared by our 3rd-year culinary cohort.", date: "2026-07-14", postedBy: "Administrative Office" }
  ] as Notice[]
};

// --- API Endpoints ---

// Get all ERP data
app.get("/api/erp/data", (req, res) => {
  res.json(db);
});

// Update data endpoint (state sync)
app.post("/api/erp/update", (req, res) => {
  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: "Missing type or payload" });
  }

  try {
    switch (type) {
      case "ADD_STUDENT_ATTENDANCE": {
        // payload should be a StudentAttendance
        db.studentAttendance.push(payload);
        break;
      }
      case "FACULTY_CHECK_IN": {
        const { facultyId, time } = payload;
        const fac = db.faculty.find(f => f.id === facultyId);
        if (fac) {
          fac.isPresentToday = true;
          fac.checkInTime = time;
          // Log in attendance history
          db.facultyAttendance.push({
            id: `FA_${Date.now()}`,
            facultyId,
            date: new Date().toISOString().split('T')[0],
            checkIn: time,
            status: "Present"
          });
        }
        break;
      }
      case "FACULTY_CHECK_OUT": {
        const { facultyId, time, hours } = payload;
        const fac = db.faculty.find(f => f.id === facultyId);
        if (fac) {
          fac.checkOutTime = time;
          const log = db.facultyAttendance.find(a => a.facultyId === facultyId && a.date === new Date().toISOString().split('T')[0]);
          if (log) {
            log.checkOut = time;
            log.workingHours = hours;
          }
          fac.workingHours = (fac.workingHours || 0) + hours;
        }
        break;
      }
      case "RECORD_PAYMENT": {
        const { studentId, amountPaid, installment, paymentMethod, remarks } = payload;
        const student = db.students.find(s => s.id === studentId);
        const fee = db.feeDues.find(f => f.studentId === studentId);
        if (fee && student) {
          fee.paidAmount += amountPaid;
          fee.dueAmount = Math.max(0, fee.totalFee - fee.paidAmount);
          
          if (fee.dueAmount === 0) {
            student.feeStatus = "Paid";
          } else {
            student.feeStatus = "Partially Paid";
          }

          // Update installment status
          const inst = fee.installments.find(i => i.name === installment);
          if (inst) inst.status = "Paid";

          // Add transaction
          db.feePayments.push({
            id: `FP_${Date.now()}`,
            studentId,
            amountPaid,
            paymentDate: new Date().toISOString().split('T')[0],
            receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
            installment,
            paymentMethod,
            remarks
          });
        }
        break;
      }
      case "POST_NOTICE": {
        db.notices.unshift({
          id: `N_${Date.now()}`,
          ...payload,
          date: new Date().toISOString().split('T')[0]
        });
        break;
      }
      case "ISSUE_BOOK": {
        const { bookId, studentId, dueDate } = payload;
        const book = db.libraryBooks.find(b => b.id === bookId);
        if (book && book.availableCopies > 0) {
          book.availableCopies--;
          db.bookIssues.push({
            id: `BI_${Date.now()}`,
            bookId,
            studentId,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate,
            fineAmount: 0,
            status: "Issued"
          });
        }
        break;
      }
      case "RETURN_BOOK": {
        const { issueId, fineAmount } = payload;
        const issue = db.bookIssues.find(i => i.id === issueId);
        if (issue) {
          issue.status = "Returned";
          issue.returnDate = new Date().toISOString().split('T')[0];
          issue.fineAmount = fineAmount;
          const book = db.libraryBooks.find(b => b.id === issue.bookId);
          if (book) {
            book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
          }
        }
        break;
      }
      case "ADD_STUDENT": {
        db.students.push(payload);
        
        // Auto-generate separate fee structure based on course duration/program
        const studentId = payload.id;
        const course = payload.course || "Others";
        
        let totalFee = 180000;
        let installments: { name: string; amount: number; status: "Paid" | "Pending"; dueDate: string }[] = [];
        
        const getFutureDate = (daysAhead: number) => {
          const d = new Date();
          d.setDate(d.getDate() + daysAhead);
          return d.toISOString().split('T')[0];
        };

        if (course.includes("1 Year")) {
          totalFee = 95000;
          installments = [
            { name: "Admission Booking Installment", amount: 45000, status: "Pending", dueDate: getFutureDate(15) },
            { name: "Practical Cookery Kit Charges", amount: 50000, status: "Pending", dueDate: getFutureDate(45) }
          ];
        } else if (course.includes("2 Years")) {
          totalFee = 220000;
          installments = [
            { name: "Year 1 Term Fee", amount: 110000, status: "Pending", dueDate: getFutureDate(15) },
            { name: "Year 2 Term Fee", amount: 110000, status: "Pending", dueDate: getFutureDate(180) }
          ];
        } else if (course.includes("3 Years")) {
          totalFee = 150000;
          installments = [
            { name: "1st Semester Installment", amount: 50000, status: "Pending", dueDate: getFutureDate(15) },
            { name: "2nd Semester Installment", amount: 50000, status: "Pending", dueDate: getFutureDate(120) },
            { name: "3rd Semester Installment", amount: 50000, status: "Pending", dueDate: getFutureDate(240) }
          ];
        } else {
          // Others
          totalFee = 180000;
          installments = [
            { name: "Culinary Booking Fee", amount: 60000, status: "Pending", dueDate: getFutureDate(15) },
            { name: "Commercial Cooking Lab Tuitions", amount: 120000, status: "Pending", dueDate: getFutureDate(90) }
          ];
        }

        const newFeeDue = {
          id: `FD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          studentId,
          totalFee,
          paidAmount: 0,
          dueAmount: totalFee,
          dueDate: installments[0]?.dueDate || getFutureDate(15),
          installments
        };

        db.feeDues.push(newFeeDue);
        break;
      }
      case "ADD_FACULTY": {
        db.faculty.push(payload);
        break;
      }
      case "UPDATE_STUDENT": {
        const index = db.students.findIndex(s => s.id === payload.id);
        if (index !== -1) {
          db.students[index] = { ...db.students[index], ...payload };
        }
        break;
      }
      case "UPDATE_FACULTY": {
        const index = db.faculty.findIndex(f => f.id === payload.id);
        if (index !== -1) {
          db.faculty[index] = { ...db.faculty[index], ...payload };
        }
        break;
      }
      case "UPDATE_EXAM": {
        const index = db.exams.findIndex(e => e.id === payload.id);
        if (index !== -1) {
          db.exams[index] = { ...db.exams[index], ...payload };
        }
        break;
      }
      case "UPDATE_RESULT": {
        const index = db.results.findIndex(r => r.studentId === payload.studentId && r.subject === payload.subject);
        if (index !== -1) {
          db.results[index] = { ...db.results[index], ...payload };
        } else {
          db.results.push(payload);
        }
        break;
      }
      case "UPDATE_FEE_DUE": {
        const index = db.feeDues.findIndex(f => f.id === payload.id);
        if (index !== -1) {
          db.feeDues[index] = { ...db.feeDues[index], ...payload };
        }
        break;
      }
      case "UPDATE_HOSTEL_ROOM": {
        const index = db.hostelRooms.findIndex(r => r.id === payload.id);
        if (index !== -1) {
          db.hostelRooms[index] = { ...db.hostelRooms[index], ...payload };
        }
        break;
      }
      case "UPDATE_LIBRARY_BOOK": {
        const index = db.libraryBooks.findIndex(b => b.id === payload.id);
        if (index !== -1) {
          db.libraryBooks[index] = { ...db.libraryBooks[index], ...payload };
        }
        break;
      }
      case "UPDATE_PLACEMENT_COMPANY": {
        const index = db.placementCompanies.findIndex(c => c.id === payload.id);
        if (index !== -1) {
          db.placementCompanies[index] = { ...db.placementCompanies[index], ...payload };
        }
        break;
      }
      case "UPDATE_NOTICE": {
        const index = db.notices.findIndex(n => n.id === payload.id);
        if (index !== -1) {
          db.notices[index] = { ...db.notices[index], ...payload };
        }
        break;
      }
      case "UPLOAD_MATERIAL": {
        db.studyMaterials.unshift({
          id: payload.id || `MAT-${Date.now().toString().slice(-4)}`,
          uploadedDate: new Date().toISOString().split('T')[0],
          downloadUrl: "/assets/materials/document.pdf",
          description: "Course handbook circular resource",
          uploadedBy: "Academic Office",
          ...payload
        });
        break;
      }
      case "UPDATE_STUDY_MATERIAL": {
        const index = db.studyMaterials.findIndex(m => m.id === payload.id);
        if (index !== -1) {
          db.studyMaterials[index] = { ...db.studyMaterials[index], ...payload };
        }
        break;
      }
      case "UPDATE_CONFIG": {
        db.config = { ...db.config, ...payload };
        break;
      }
      default:
        return res.status(400).json({ error: "Unknown update type: " + type });
    }

    res.json({ success: true, db });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// AI Chatbot with Grounded ERP Context
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    // We construct a localized summary of current state to ground Gemini's answers
    const erpSummary = {
      institute: db.config.instituteName,
      stats: {
        totalStudents: db.students.length,
        totalFaculty: db.faculty.length,
        facultyPresentCount: db.faculty.filter(f => f.isPresentToday).length,
        todayAttendanceRate: db.students.length > 0 ? `${Math.round((db.studentAttendance.filter(a => a.date === "2026-07-18" && a.status === "Present").length / db.students.length) * 100)}%` : "0%",
        hostelOccupants: db.hostelRooms.reduce((acc, room) => acc + room.occupants.length, 0),
        activeNoticesCount: db.notices.length,
        pendingFeesCount: db.feeDues.filter(f => f.dueAmount > 0).length
      },
      students: db.students.map(s => ({
        id: s.id,
        name: s.name,
        rollNo: s.rollNo,
        course: s.course,
        semester: s.semester,
        gpa: s.academicGpa,
        feeStatus: s.feeStatus,
        placementStatus: s.placementStatus,
        hostelStatus: s.hostelStatus
      })),
      defaulters: db.feeDues.filter(f => f.dueAmount > 0).map(f => {
        const stud = db.students.find(s => s.id === f.studentId);
        return {
          studentName: stud ? stud.name : f.studentId,
          dueAmount: f.dueAmount,
          dueDate: f.dueDate
        };
      }),
      notices: db.notices.slice(0, 3).map(n => ({ title: n.title, content: n.content, date: n.date, category: n.category })),
      placements: db.placementCompanies.map(c => ({ name: c.name, role: c.jobRole, package: `${c.packageLpa} LPA`, status: c.status, selectedCount: c.selectedStudentIds.length })),
      libraryOverdue: db.bookIssues.filter(i => i.status === "Overdue").map(i => {
        const book = db.libraryBooks.find(b => b.id === i.bookId);
        const stud = db.students.find(s => s.id === i.studentId);
        return {
          bookTitle: book ? book.title : "Unknown Book",
          studentName: stud ? stud.name : "Unknown Student",
          dueDate: i.dueDate,
          fine: i.fineAmount
        };
      })
    };

    const systemInstruction = `
You are the highly capable AI Assistant for the ${db.config.instituteName} ERP System.
You have direct, read-only access to the real-time operational database.
Here is the current snapshot of the college ERP data:
${JSON.stringify(erpSummary, null, 2)}

Provide clear, professional, concise, and deeply informative responses.
When asked for insights (like fee defaulter predictions or attendance improvements):
- Mention specific student names if applicable.
- Predict potential issues (e.g., student S003 Bob Johnson is at risk of exam block due to pending fees of $80,000 overdue since June 15).
- Suggest proactive, friendly remedies.
Always sound supportive, smart, and fully integrated with the ERP.
Keep your response size compact and directly helpful.
`;

    // Format historical messages for Gemini
    // Using simple prompt concatenation or chat initialization
    const chatContents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Generate content using modern @google/genai SDK
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const aiResponseText = response.text || "I am currently unable to fetch insights. Please check your network or try again.";
    res.json({ text: aiResponseText });
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    res.status(500).json({ error: "Gemini AI system is setting up or has an error. Check if the GEMINI_API_KEY is correct. Details: " + e.message });
  }
});

// --- AI Studio Debugger API Endpoint ---
app.post("/api/debug", express.json(), async (req, res) => {
  try {
    const { errorMessage, codeSnippet, context } = req.body;
    
    const systemInstruction = `
You are the elite "Google AI Studio Debugger Core", an automated expert software engineer built on Gemini.
Your job is to diagnose compile-time, build, lint, or runtime errors in a React + Vite + TypeScript web application, and provide clear, professional, drop-in solutions.

The user will provide an error message and optionally a relevant code snippet.
Analyze this error and respond with a structured diagnosis in markdown:
1. **Root Cause Analysis**: Explain exactly why the error occurs in plain, developer-friendly terms.
2. **Step-by-Step Resolution**: Give clear instructions on what needs to be changed.
3. **Corrected Code Block**: Provide the fully corrected TypeScript/React code block that the user can copy.
4. **AI Studio Action Guide**: Remind the user they can copy this code and paste it inside their Google AI Studio Build file editor at https://ai.studio/build, or ask the AI Coding Assistant to perform the edit for them automatically.

Keep your response extremely professional, elegant, and action-oriented. Do not write generic or high-level filler.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `ERROR RECEIVED:
${errorMessage}

CODE SNIPPET PROVIDED:
${codeSnippet || "No snippet provided."}

CONTEXT/MODULE INVOLVED:
${context || "General Application"}`
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    res.json({ analysis: response.text });
  } catch (e: any) {
    console.error("Gemini Debug Error:", e);
    res.status(500).json({ error: "Debugger is setting up or has an error. Details: " + e.message });
  }
});

// --- Vite Dev Server Middleware or Production Dist Handler ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
