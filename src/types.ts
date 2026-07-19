/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  ADMIN = "ADMIN",
  FACULTY = "FACULTY",
  STUDENT = "STUDENT",
  PARENT = "PARENT"
}

export interface Student {
  id: string;
  photoUrl: string;
  qrCode: string;
  admissionNumber: string;
  name: string;
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  email: string;
  aadhaarNumber: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  course: string;
  semester: string;
  section: string;
  hostelStatus: "Day Scholar" | "Hosteler";
  transportStatus: "Self" | "Bus Route A" | "Bus Route B" | "Bus Route C";
  feeStatus: "Paid" | "Pending" | "Partially Paid";
  placementStatus: "Placed" | "Unplaced" | "Not Interested" | "In Process";
  rollNo: string;
  academicGpa: number;
  password?: string;
}

export interface Faculty {
  id: string;
  photoUrl: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  mobile: string;
  workingHours: number;
  overtimeHours: number;
  leaveBalance: {
    casual: number;
    sick: number;
    earned: number;
  };
  checkInTime?: string;
  checkOutTime?: string;
  isPresentToday: boolean;
  password?: string;
}

export interface StudentAttendance {
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  markedBy: string;
  method: "Manual" | "QR Scanner" | "NFC" | "Fingerprint" | "GPS";
}

export interface FacultyAttendanceLog {
  id: string;
  facultyId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workingHours?: number;
  status: "Present" | "Absent" | "On Leave";
}

export interface FeePayment {
  id: string;
  studentId: string;
  amountPaid: number;
  paymentDate: string;
  receiptNumber: string;
  installment: string;
  paymentMethod: string;
  remarks: string;
}

export interface FeeDue {
  id: string;
  studentId: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  installments: {
    name: string;
    amount: number;
    status: "Paid" | "Pending";
    dueDate: string;
  }[];
}

export interface ExamTimetable {
  id: string;
  course: string;
  semester: string;
  subject: string;
  examDate: string;
  examTime: string;
  room: string;
}

export interface StudentResult {
  studentId: string;
  subject: string;
  internalMarks: number;
  practicalMarks: number;
  semesterMarks: number;
  maxMarks: number;
  grade: string;
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  block: string;
  roomType: "Single AC" | "Double AC" | "Single Non-AC" | "Double Non-AC";
  capacity: number;
  occupants: string[]; // Student IDs
  monthlyRent: number;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  relation: string;
  studentId: string;
  checkIn: string;
  checkOut?: string;
  purpose: string;
}

export interface LibraryBook {
  id: string;
  barcode: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
  locationShelf: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: "Issued" | "Returned" | "Overdue";
}

export interface PlacementCompany {
  id: string;
  name: string;
  interviewDate: string;
  jobRole: string;
  packageLpa: number;
  status: "Upcoming" | "Completed";
  selectedStudentIds: string[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: "PDF" | "PPT" | "Notes" | "Video" | "Assignment" | "Paper";
  subject: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadUrl: string;
  description: string;
  semester?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  postedBy: string;
  important?: boolean;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  maxMarks: number;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  packageCtc: string;
  eligibilityCgpa: number;
  targetBatches: string;
  driveDate: string;
  location: string;
}

export interface PlacementStudent {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  packageCtc: string;
  selectionDate: string;
}

export interface ErpConfig {
  instituteName: string;
  academicYear: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  adminName?: string;
  adminEmail?: string;
  debuggerAllowedRoles?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
