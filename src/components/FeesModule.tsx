/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  History,
  FileCheck,
  Send,
  Bell,
  CheckCircle,
  Download,
  Printer,
  ChevronRight,
  ShieldAlert,
  Edit
} from "lucide-react";
import { Student, FeeDue, FeePayment, Role } from "../types";

interface FeesModuleProps {
  students: Student[];
  feeDues: FeeDue[];
  feePayments: FeePayment[];
  onRecordPayment: (payload: {
    studentId: string;
    amountPaid: number;
    installment: string;
    paymentMethod: string;
    remarks: string;
  }) => void;
  onUpdateFeeDue: (due: FeeDue) => void;
  activeRole: Role;
  selectedStudentId: string;
}

export default function FeesModule({
  students,
  feeDues,
  feePayments,
  onRecordPayment,
  onUpdateFeeDue,
  activeRole,
  selectedStudentId
}: FeesModuleProps) {
  const [activeTab, setActiveTab] = useState<"dues" | "history">("dues");
  const [selectedDue, setSelectedDue] = useState<FeeDue | null>(null);
  const [editingFeeDue, setEditingFeeDue] = useState<FeeDue | null>(null);
  
  // Payment drawer states
  const [paymentInstallment, setPaymentInstallment] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI Scan");
  const [showPayDrawer, setShowPayDrawer] = useState(false);
  const [payingState, setPayingState] = useState(""); // "", "paying", "done"

  // Receipt modal states
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Target student for Admin view
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState(students[0]?.id || "");

  const getTargetStudent = () => {
    if (activeRole === Role.STUDENT || activeRole === Role.PARENT) {
      return students.find(s => s.id === selectedStudentId) || students[0];
    }
    return students.find(s => s.id === adminSelectedStudentId) || students[0];
  };

  const targetStudent = getTargetStudent();
  const targetDue = feeDues.find(f => f.studentId === targetStudent?.id);
  const targetPayments = feePayments.filter(f => f.studentId === targetStudent?.id);

  const handleOpenPayment = (installmentName: string, amount: number) => {
    setPaymentInstallment(installmentName);
    setPaymentAmount(amount);
    setPayingState("");
    setShowPayDrawer(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPayingState("paying");

    setTimeout(() => {
      onRecordPayment({
        studentId: targetStudent.id,
        amountPaid: paymentAmount,
        installment: paymentInstallment,
        paymentMethod,
        remarks: "Online payment settlement"
      });
      setPayingState("done");
    }, 2000);
  };

  const triggerDueReminder = () => {
    alert(`Success: Sent automatic due notification alerts to ${targetStudent.name} (${targetStudent.email}) & parents successfully.`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT & CENTER PANEL: Main Fee Status Ledger */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Fee Management Accounts</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Track installments, balances, and print fiscal records</p>
          </div>
          
          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            <button
              onClick={() => setActiveTab("dues")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "dues"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" /> Installments Dues
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "history"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400"
              }`}
            >
              <History className="h-3.5 w-3.5" /> Payment History
            </button>
          </div>
        </div>

        {/* Admin context student filter */}
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

        {/* Current Balance Summary Cards */}
        {targetDue && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 dark:bg-indigo-950/10 dark:border-indigo-950/30">
              <span className="text-[10px] text-indigo-600/70 dark:text-indigo-400 font-bold tracking-wider uppercase">Total course Tuition</span>
              <p className="mt-1 font-extrabold text-gray-900 dark:text-white text-lg font-mono">
                ${targetDue.totalFee.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4 dark:bg-emerald-950/10 dark:border-emerald-950/30">
              <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400 font-bold tracking-wider uppercase">Paid Balance</span>
              <p className="mt-1 font-extrabold text-gray-900 dark:text-white text-lg font-mono text-emerald-600 dark:text-emerald-400">
                ${targetDue.paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-4 dark:bg-rose-950/10 dark:border-rose-950/30">
              <span className="text-[10px] text-rose-600/70 dark:text-rose-400 font-bold tracking-wider uppercase">Net Due Overdue</span>
              <p className="mt-1 font-extrabold text-gray-900 dark:text-white text-lg font-mono text-rose-600 dark:text-rose-400">
                ${targetDue.dueAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: DUES REGISTER */}
        {activeTab === "dues" && targetDue && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Installments Breakup</h4>
              <div className="flex items-center gap-2">
                {activeRole === Role.ADMIN && (
                  <button
                    onClick={() => setEditingFeeDue({ ...targetDue })}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Account Dues
                  </button>
                )}
                {activeRole === Role.ADMIN && targetDue.dueAmount > 0 && (
                  <button
                    onClick={triggerDueReminder}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/40 text-rose-700 px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 transition-colors"
                  >
                    <Bell className="h-3.5 w-3.5" /> Send Due Reminder
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {targetDue.installments.map((inst, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2.5 ${inst.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs">{inst.name}</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Due: {inst.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-xs font-mono">${inst.amount.toLocaleString()}</p>
                      <span className={`inline-block text-[9px] font-bold mt-1 ${inst.status === "Paid" ? "text-emerald-600" : "text-rose-600 animate-pulse"}`}>
                        ● {inst.status}
                      </span>
                    </div>

                    {inst.status === "Pending" && (activeRole === Role.STUDENT || activeRole === Role.PARENT) && (
                      <button
                        onClick={() => handleOpenPayment(inst.name, inst.amount)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                      >
                        Settle Fee
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORIC TRANSACTIONS LIST */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Completed Transactions</h4>
            {targetPayments.length === 0 ? (
              <p className="text-xs text-gray-400 py-10 text-center">No payment history found.</p>
            ) : (
              targetPayments.map((pay) => (
                <div key={pay.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-zinc-800 hover:bg-gray-50/40">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-50 text-emerald-600 p-2">
                      <FileCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs">{pay.installment} Payment</h5>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Receipt: {pay.receiptNumber} | {pay.paymentDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono">+${pay.amountPaid.toLocaleString()}</p>
                      <span className="text-[9px] text-gray-400 font-mono">{pay.paymentMethod}</span>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400"
                      title="View Receipt"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: PAYMENT DRAWER OR BANK SIMULATOR */}
      <div>
        <AnimatePresence>
          {showPayDrawer ? (
            <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/20 p-6 shadow-sm dark:border-indigo-900/30 dark:bg-zinc-900 space-y-5">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3 dark:border-zinc-850">
                <h3 className="font-bold text-indigo-900 dark:text-white text-sm">Secure Payment Gateway</h3>
                <button onClick={() => setShowPayDrawer(false)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
              </div>

              {payingState === "" ? (
                <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-indigo-900/70 dark:text-zinc-400 mb-1">Paying Installment</label>
                    <input type="text" readOnly value={paymentInstallment} className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-lg border focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-indigo-900/70 dark:text-zinc-400 mb-1">Amount ($)</label>
                    <input type="number" readOnly value={paymentAmount} className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-lg border font-mono font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-indigo-900/70 dark:text-zinc-400 mb-1">Select Payment Channel</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 p-2.5 rounded-lg border focus:outline-none"
                    >
                      <option value="UPI Scan">Instant UPI (Paytm/GooglePay)</option>
                      <option value="Credit Card">AIT Bank Card (Visa/Mastercard)</option>
                      <option value="NetBanking">Secure NetBanking Direct</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 shadow shadow-indigo-100 dark:shadow-none"
                  >
                    Authorize Payment
                  </button>
                </form>
              ) : payingState === "paying" ? (
                <div className="py-10 text-center space-y-4 flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-600 border-t-transparent" />
                  <div>
                    <p className="font-bold text-indigo-900 dark:text-white text-xs">Securing payment clearance...</p>
                    <p className="text-[10px] text-gray-400 mt-1">Do not reload. Processing cryptographic ledgers.</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4 flex flex-col items-center text-xs">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full dark:bg-emerald-950/20">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-400">Transaction Settled!</p>
                    <p className="text-[10px] text-gray-400 mt-1">The installment is marked cleared. Official invoice logged.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPayDrawer(false);
                      setActiveTab("history");
                    }}
                    className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                  >
                    View Historic Logs
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bento-card text-center text-xs text-gray-400 py-12 flex flex-col items-center gap-3 p-6">
              <ShieldAlert className="h-8 w-8 text-indigo-500/40" />
              <span>Select an active installment from the ledger and trigger settlement to pay online securely.</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* RECEIPT / INVOICE GENERATOR POPUP */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedReceipt(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 text-xs">
            {/* Invoice Design */}
            <div className="border border-gray-150 p-5 rounded-xl bg-gray-50/50 dark:bg-zinc-950 dark:border-zinc-850 space-y-5">
              <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">A</div>
                  <span className="font-bold uppercase tracking-wider text-[10px]">AIT Official Invoice</span>
                </div>
                <span className="text-emerald-600 font-bold font-mono">PAID</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-mono">
                <div>
                  <p className="font-semibold text-gray-400">STUDENT NAME:</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{targetStudent?.name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-400">ROLL NUMBER:</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{targetStudent?.rollNo}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-400">RECEIPT NO:</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReceipt.receiptNumber}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-400">PAYMENT DATE:</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedReceipt.paymentDate}</p>
                </div>
              </div>

              <div className="border-t border-b py-3 border-gray-200 dark:border-zinc-800 text-xs flex justify-between font-bold">
                <span className="text-gray-500">SETTLED: {selectedReceipt.installment}</span>
                <span className="text-gray-900 dark:text-white font-mono">${selectedReceipt.amountPaid.toLocaleString()}</span>
              </div>

              <div className="text-[9px] text-gray-400 leading-relaxed font-mono">
                <p>METHOD: {selectedReceipt.paymentMethod}</p>
                <p className="mt-1">REMARKS: {selectedReceipt.remarks || "No supplementary remarks."}</p>
                <p className="mt-2 text-center text-indigo-600">*** Thank you for clearing the dues ***</p>
              </div>
            </div>

            {/* Print and Save Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => alert("Printing invoice stream...")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FEE DUE MODAL */}
      {editingFeeDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingFeeDue(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Fee Due Statement</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateFeeDue(editingFeeDue);
              setEditingFeeDue(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Total Academic Tuition Fee ($)</label>
                <input
                  type="number"
                  required
                  value={editingFeeDue.totalFee}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    setEditingFeeDue({ ...editingFeeDue, totalFee: total, dueAmount: Math.max(0, total - editingFeeDue.paidAmount) });
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Total Paid Balance ($)</label>
                  <input
                    type="number"
                    required
                    value={editingFeeDue.paidAmount}
                    onChange={(e) => {
                      const paid = parseInt(e.target.value) || 0;
                      setEditingFeeDue({ ...editingFeeDue, paidAmount: paid, dueAmount: Math.max(0, editingFeeDue.totalFee - paid) });
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Net Due Balance ($)</label>
                  <input
                    type="number"
                    readOnly
                    value={editingFeeDue.dueAmount}
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 dark:text-zinc-300 mb-2">Installment Statuses</h4>
                <div className="space-y-2 border rounded-xl p-3 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950">
                  {editingFeeDue.installments.map((inst, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-2 last:pb-0 dark:border-zinc-850">
                      <div>
                        <p className="font-semibold">{inst.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">Amount: ${inst.amount} | Due: {inst.dueDate}</p>
                      </div>
                      <select
                        value={inst.status}
                        onChange={(e) => {
                          const updatedInst = [...editingFeeDue.installments];
                          updatedInst[idx] = { ...inst, status: e.target.value as any };
                          setEditingFeeDue({ ...editingFeeDue, installments: updatedInst });
                        }}
                        className="rounded border border-gray-200 bg-white p-1 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white text-[11px]"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFeeDue(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Save Fee Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
