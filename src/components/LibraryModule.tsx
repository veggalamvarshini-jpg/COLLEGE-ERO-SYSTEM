/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  BookCopy,
  FolderMinus,
  Calendar,
  AlertCircle,
  FileCheck2,
  ScanLine,
  RefreshCw,
  Plus,
  Edit
} from "lucide-react";
import { Student, LibraryBook, BookIssue, Role } from "../types";

interface LibraryModuleProps {
  students: Student[];
  libraryBooks: LibraryBook[];
  bookIssues: BookIssue[];
  onIssueBook: (payload: { bookId: string; studentId: string; dueDate: string }) => void;
  onReturnBook: (payload: { issueId: string; fineAmount: number }) => void;
  onUpdateLibraryBook: (book: LibraryBook) => void;
  activeRole: Role;
  selectedStudentId: string;
}

export default function LibraryModule({
  students,
  libraryBooks,
  bookIssues,
  onIssueBook,
  onReturnBook,
  onUpdateLibraryBook,
  activeRole,
  selectedStudentId
}: LibraryModuleProps) {
  const [activeTab, setActiveTab] = useState<"search" | "issued">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(libraryBooks[0] || null);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);

  // Barcode / Issue simulator drawer states
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || "");
  const [dueDateStr, setDueDateStr] = useState("2026-08-01");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  const filteredBooks = libraryBooks.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.barcode.includes(searchQuery) ||
           b.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSimulatedBarcodeCheckout = () => {
    if (!selectedBook) return;
    setIsScanning(true);
    setScanMessage("Spinning up visual camera hardware...");
    
    setTimeout(() => {
      setScanMessage(`Decoding barcode sequence: ${selectedBook.barcode}...`);
    }, 800);

    setTimeout(() => {
      onIssueBook({
        bookId: selectedBook.id,
        studentId: activeRole === Role.STUDENT ? selectedStudentId : targetStudentId,
        dueDate: dueDateStr
      });
      setScanMessage(`SUCCESS: Checked out "${selectedBook.title}".`);
      setIsScanning(false);
    }, 2000);
  };

  const handleReturnBookAction = (issueId: string, fine: number) => {
    onReturnBook({
      issueId,
      fineAmount: fine
    });
    alert("Book returned successfully. Inventory stock incremented.");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT & CENTER PANEL: Main Catalog search or Active Issues */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Digital Library Desk</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Search academic titles, monitor borrowing limits, and resolve fines</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            <button
              onClick={() => setActiveTab("search")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "search"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <BookCopy className="h-3.5 w-3.5" /> Book Catalog
            </button>
            <button
              onClick={() => setActiveTab("issued")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "issued"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <FolderMinus className="h-3.5 w-3.5" /> Active Issues
            </button>
          </div>
        </div>

        {/* TAB 1: BOOK CATALOG SEARCH */}
        {activeTab === "search" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search catalog by title, author, barcode, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                    selectedBook?.id === book.id
                      ? "border-indigo-500 bg-indigo-50/20 dark:border-indigo-600 dark:bg-indigo-950/20"
                      : "border-gray-100 dark:border-zinc-800 bg-gray-50/20"
                  }`}
                >
                  <div>
                    <span className="inline-block rounded px-2 py-0.5 text-[8px] font-bold font-mono uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 mb-2">
                      {book.category}
                    </span>
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-xs leading-tight">{book.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      Author: {book.author} | Shelf: {book.locationShelf}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white text-xs font-mono">{book.availableCopies} / {book.totalCopies}</p>
                    <span className="text-[9px] text-gray-450 mt-1 block">Copies Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE ISSUED LIST */}
        {activeTab === "issued" && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Active Issue Registers</h4>
            
            {bookIssues.map((issue) => {
              const bookObj = libraryBooks.find(b => b.id === issue.bookId);
              const studentObj = students.find(s => s.id === issue.studentId);
              
              let badgeColor = "bg-emerald-50 text-emerald-700";
              if (issue.status === "Overdue") badgeColor = "bg-red-50 text-red-700";
              if (issue.status === "Returned") badgeColor = "bg-gray-100 text-gray-600";

              return (
                <div key={issue.id} className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 text-xs">
                  <div className="flex justify-between items-start border-b pb-2.5 border-gray-100 dark:border-zinc-850">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs leading-tight">{bookObj?.title}</h5>
                      <p className="text-[10px] text-gray-400 mt-1">Borrowed by: {studentObj?.name} ({studentObj?.rollNo})</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${badgeColor}`}>
                      {issue.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-[11px] font-mono">
                    <div>
                      <span className="text-gray-400 text-[9px]">ISSUE DATE:</span>
                      <p className="font-semibold text-gray-800 dark:text-zinc-300 mt-0.5">{issue.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[9px]">DUE DATE:</span>
                      <p className="font-semibold text-gray-800 dark:text-zinc-300 mt-0.5">{issue.dueDate}</p>
                    </div>
                  </div>

                  {issue.fineAmount > 0 && (
                    <div className="mt-2 text-[10px] font-mono font-bold text-red-600">
                      Accumulated Fine: ${issue.fineAmount}
                    </div>
                  )}

                  {issue.status !== "Returned" && (activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
                    <button
                      onClick={() => handleReturnBookAction(issue.id, issue.status === "Overdue" ? 80 : 0)}
                      className="mt-3 rounded-lg border border-indigo-200 text-indigo-700 px-3 py-1.5 text-[10px] font-bold hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400"
                    >
                      Process Return Checkout
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Book details, simulated Barcode scan checkout */}
      <div>
        {selectedBook ? (
          <div className="bento-card space-y-5 text-xs p-6">
            <div className="text-center pb-3 border-b">
              <ScanLine className="mx-auto h-8 w-8 text-indigo-500/60" />
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm mt-2">{selectedBook.title}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Barcode: {selectedBook.barcode}</p>
            </div>

            {/* Fake printed barcode simulation for details card */}
            <div className="flex flex-col items-center justify-center p-2.5 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-900">
              <div className="flex items-center gap-[1px] bg-white p-2 rounded">
                {[1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 1, 2, 1, 3, 1, 4, 2].map((w, i) => (
                  <div key={i} className="bg-black h-6" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="text-[8px] font-mono mt-1 text-gray-400">ISBN: {selectedBook.isbn}</span>
            </div>

            <div className="space-y-2 text-[11px] font-mono text-gray-500">
              <div className="flex justify-between">
                <span>Author:</span>
                <span className="font-bold text-gray-900 dark:text-zinc-300">{selectedBook.author}</span>
              </div>
              <div className="flex justify-between">
                <span>Location Shelf:</span>
                <span className="font-bold text-gray-900 dark:text-zinc-300">{selectedBook.locationShelf}</span>
              </div>
              <div className="flex justify-between">
                <span>Stock Count:</span>
                <span className="font-bold text-indigo-600">{selectedBook.availableCopies} available</span>
              </div>
            </div>

            {(activeRole === Role.ADMIN || activeRole === Role.FACULTY) && (
              <button
                onClick={() => setEditingBook({ ...selectedBook })}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white transition-colors"
              >
                <Edit className="h-3.5 w-3.5 text-indigo-500" /> Edit Book Record
              </button>
            )}

            {/* Checkout Form (Only for Admins or Faculty checkout on behalf of students) */}
            {selectedBook.availableCopies > 0 && (
              <div className="border-t border-gray-100 pt-4 space-y-4 dark:border-zinc-800">
                <h4 className="font-bold text-gray-900 dark:text-white text-xs">Issue Library Book</h4>
                
                {activeRole === Role.STUDENT ? (
                  <div>
                    <label className="block text-gray-500 mb-1">Issue to (Self):</label>
                    <input type="text" readOnly value={`Self - (${selectedStudentId})`} className="w-full bg-gray-50 p-2 rounded focus:outline-none font-mono" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-500 mb-1">Select Student Member</label>
                    <select
                      value={targetStudentId}
                      onChange={(e) => setTargetStudentId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-500 mb-1">Due Return Deadline</label>
                  <input
                    type="date"
                    value={dueDateStr}
                    onChange={(e) => setDueDateStr(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs font-mono dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleSimulatedBarcodeCheckout}
                  disabled={isScanning}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  <ScanLine className="h-4 w-4" /> Scan Book barcode to Issue
                </button>

                {scanMessage && (
                  <div className={`text-[10px] font-mono leading-relaxed p-2.5 rounded-lg border w-full text-left ${
                    scanMessage.includes("SUCCESS")
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-gray-100 border-gray-200 text-gray-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                  }`}>
                    {scanMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bento-card text-center text-xs text-gray-400 p-6">
            Select a textbook from catalog to review barcodes, locations, or borrow.
          </div>
        )}
      </div>

      {/* EDIT BOOK RECORD MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingBook(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Textbook details</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateLibraryBook(editingBook);
              setSelectedBook(editingBook);
              setEditingBook(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Book Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Category / Genre</label>
                  <input
                    type="text"
                    required
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">ISBN Number</label>
                  <input
                    type="text"
                    required
                    value={editingBook.isbn}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    value={editingBook.totalCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, totalCopies: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Available Copies</label>
                  <input
                    type="number"
                    required
                    value={editingBook.availableCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, availableCopies: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Shelving Location</label>
                  <input
                    type="text"
                    required
                    value={editingBook.locationShelf}
                    onChange={(e) => setEditingBook({ ...editingBook, locationShelf: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
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
