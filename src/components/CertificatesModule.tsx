/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  FileBadge
} from "lucide-react";
import { Student, Role } from "../types";

interface CertificatesModuleProps {
  students: Student[];
  activeRole: Role;
  selectedStudentId: string;
}

export default function CertificatesModule({
  students,
  activeRole,
  selectedStudentId
}: CertificatesModuleProps) {
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || "");
  const [certType, setCertType] = useState<"Degree" | "Academic Excellence" | "Sports Merit">("Academic Excellence");
  const [customDescription, setCustomDescription] = useState("for outstanding performance and securing CGPA honors in computer science.");
  const [generated, setGenerated] = useState(false);

  const currentStudent = students.find(s => s.id === (activeRole === Role.STUDENT ? selectedStudentId : targetStudentId)) || students[0];

  const handleGenerate = () => {
    setGenerated(true);
  };

  const securityHash = `AIT-CERT-${currentStudent?.id || "00"}-${certType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT COLUMN: Setup form */}
      <div className="bento-card p-6 space-y-5">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">Credentials Generator</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Generate, certify, and stamp student degree achievements</p>
        </div>

        <div className="space-y-4 text-xs">
          {activeRole !== Role.STUDENT ? (
            <div>
              <label className="block text-gray-500 mb-1">Select Student Recipient</label>
              <select
                value={targetStudentId}
                onChange={(e) => {
                  setTargetStudentId(e.target.value);
                  setGenerated(false);
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-gray-500 mb-1">Student Recipient (Self)</label>
              <input type="text" readOnly value={`${currentStudent?.name} (${currentStudent?.rollNo})`} className="w-full bg-gray-50 p-2.5 rounded-lg focus:outline-none font-mono" />
            </div>
          )}

          <div>
            <label className="block text-gray-500 mb-1">Certificate Template</label>
            <select
              value={certType}
              onChange={(e) => {
                setCertType(e.target.value as any);
                setGenerated(false);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              <option value="Degree">Official Degree Graduation Certificate</option>
              <option value="Academic Excellence">Certificate of Academic Excellence</option>
              <option value="Sports Merit">Sports Merit Honor Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Supplementary citation text</label>
            <textarea
              rows={3}
              value={customDescription}
              onChange={(e) => {
                setCustomDescription(e.target.value);
                setGenerated(false);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              placeholder="e.g. for securing GPA records and honors in department modules..."
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <FileBadge className="h-4.5 w-4.5" /> Synthesize Digital Credential
          </button>
        </div>
      </div>

      {/* CENTER & RIGHT COLUMN: Immersive Certificate viewer */}
      <div className="lg:col-span-2 space-y-6">
        {generated && currentStudent ? (
          <div className="space-y-6 animate-fade-in">
            {/* Visual Classical Certificate */}
            <div className="relative border-[16px] border-double border-amber-500/80 bg-white p-10 text-center text-gray-900 shadow-2xl dark:bg-zinc-950 dark:text-zinc-100 dark:border-amber-600/40 min-h-[480px] flex flex-col justify-between overflow-hidden rounded-2xl">
              {/* Background watermark overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Award className="h-96 w-96 text-indigo-900" />
              </div>

              {/* Certificate header */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="h-14 w-14 rounded-full border-4 border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center shadow dark:bg-zinc-900 dark:border-amber-600/60">
                    <Award className="h-8 w-8" />
                  </div>
                </div>
                <h4 className="font-serif text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold">
                  Antigravity Institute of Technology
                </h4>
                <p className="text-[9px] font-mono tracking-widest text-gray-400">OFFICE OF THE ACADEMIC DEAN</p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-4 my-6">
                <h2 className="font-serif text-2xl font-bold tracking-wide text-gray-800 dark:text-zinc-200">
                  {certType === "Degree"
                    ? "DEGREE GRADUATION DEGREE"
                    : certType === "Academic Excellence"
                    ? "CERTIFICATE OF SCHOLASTIC EXCELLENCE"
                    : "SPORTS MERIT HONOR CARD"}
                </h2>
                
                <p className="text-xs font-serif italic text-gray-500">This is to officially declare that</p>
                
                <div>
                  <h1 className="text-xl font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-serif border-b-2 border-dashed border-gray-200 dark:border-zinc-800 pb-1.5 max-w-xs mx-auto">
                    {currentStudent.name}
                  </h1>
                  <span className="text-[10px] font-mono text-gray-400 block mt-1">Roll No: {currentStudent.rollNo}</span>
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed font-serif max-w-md mx-auto dark:text-zinc-300">
                  has been awarded this honor {customDescription} during the undergraduate session at the institute campus.
                </p>
              </div>

              {/* Signatures & Security Verification codes */}
              <div className="flex justify-between items-end border-t border-gray-100 pt-6 dark:border-zinc-900 text-left font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] italic font-serif text-gray-500 block">Dr. Robert Oppenheimer</span>
                  <div className="border-t w-28 border-gray-200 dark:border-zinc-800" />
                  <span className="text-[8px] text-gray-400 block uppercase">ACADEMIC DEAN</span>
                </div>

                {/* Simulated Seal */}
                <div className="flex flex-col items-center">
                  <ShieldCheck className="h-10 w-10 text-amber-600/80" />
                  <span className="text-[7px] text-amber-600 mt-1 uppercase font-bold">SECURE CREDENTIAL</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[7px] text-gray-450 block uppercase">VERIFICATION CHECKSUM</span>
                  <span className="text-[8px] text-gray-900 dark:text-zinc-300 block font-mono font-bold select-all leading-none">
                    {securityHash}
                  </span>
                  <span className="text-[7px] text-emerald-500 block">✓ REGISTERED LEDGER</span>
                </div>
              </div>
            </div>

            {/* Print and Save actions */}
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Saving high-fidelity vector PDF format of credential: ${securityHash}`)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
              >
                <Download className="h-4.5 w-4.5" /> Download PDF Certificate
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white"
              >
                <Printer className="h-4.5 w-4.5" /> Print Diploma
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center text-xs text-gray-400 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col items-center justify-center gap-3">
            <Award className="h-12 w-12 text-gray-300" />
            <div>
              <h4 className="font-bold text-gray-700 dark:text-zinc-300">Scholastic Stamp Pending</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                Choose template parameters and trigger synthesize to build security-registered graduation certificates.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
