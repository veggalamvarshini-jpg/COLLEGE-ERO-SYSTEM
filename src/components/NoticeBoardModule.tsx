/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Megaphone,
  Calendar,
  Send,
  Trash2,
  Bookmark,
  Edit
} from "lucide-react";
import { Notice, Role } from "../types";

interface NoticeBoardModuleProps {
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onUpdateNotice: (notice: Notice) => void;
  activeRole: Role;
}

export default function NoticeBoardModule({
  notices,
  onAddNotice,
  onUpdateNotice,
  activeRole
}: NoticeBoardModuleProps) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(notices[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // New notice form states
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    category: "Academic" as "Academic" | "Exam" | "Hostel" | "Fee" | "Placement",
    postedBy: "Registrar Office",
    important: false
  });

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `N-${Date.now().toString().slice(-4)}`;
    onAddNotice({
      id,
      date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
      ...newNotice
    });
    setShowAddModal(false);
    setNewNotice({
      title: "",
      content: "",
      category: "Academic",
      postedBy: "Registrar Office",
      important: false
    });
    alert("New notice circular posted successfully to board.");
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Exam":
        return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400";
      case "Fee":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400";
      case "Placement":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400";
      case "Hostel":
        return "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Notices Board lists */}
      <div className="bento-card p-6 lg:col-span-2 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Institute Notice Board</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Official circulars, news updates, and event schedules</p>
          </div>

          {activeRole === Role.ADMIN && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Megaphone className="h-4 w-4" /> Publish Circular
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notices.map((not) => (
            <div
              key={not.id}
              onClick={() => setSelectedNotice(not)}
              className={`flex items-start justify-between rounded-xl border p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                selectedNotice?.id === not.id
                  ? "border-indigo-500 bg-indigo-50/25 dark:border-indigo-600 dark:bg-indigo-950/20"
                  : "border-gray-100 dark:border-zinc-800 bg-gray-50/20"
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase border ${getCategoryStyles(not.category)}`}>
                    {not.category} Notice
                  </span>
                  {not.important && (
                    <span className="bg-rose-100 border border-rose-200 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase animate-pulse">
                      URGENT ALERT
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{not.title}</h4>
                <p className="text-[10px] text-gray-400 font-mono">Posted by: {not.postedBy} | {not.date}</p>
              </div>

              <Bookmark className={`h-4 w-4 shrink-0 transition-all ${not.important ? "text-rose-500 fill-rose-500" : "text-gray-300"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Notice full display details */}
      <div>
        {selectedNotice ? (
          <div className="bento-card p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-[9px] font-bold border font-mono uppercase ${getCategoryStyles(selectedNotice.category)}`}>
                {selectedNotice.category}
              </span>
              <span className="text-[9px] text-gray-400 font-mono">{selectedNotice.date}</span>
            </div>

            <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">{selectedNotice.title}</h3>
            <p className="text-[10px] text-gray-400 font-mono">By order: {selectedNotice.postedBy}</p>

            <div className="border-t pt-4 text-xs text-gray-600 dark:text-zinc-300 space-y-3 leading-relaxed">
              <p className="whitespace-pre-line">{selectedNotice.content}</p>
            </div>

            <div className="border-t border-dashed pt-4 text-[9px] text-gray-450 font-mono leading-tight">
              Notice Reference: {selectedNotice.id} <br />
              Authorized Electronic Signature Key: AIT-REG-{selectedNotice.id}
            </div>

            {activeRole === Role.ADMIN && (
              <button
                onClick={() => setEditingNotice({ ...selectedNotice })}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white transition-colors"
              >
                <Edit className="h-4 w-4 text-indigo-500" /> Edit Notice Circular
              </button>
            )}
          </div>
        ) : (
          <div className="bento-card text-center text-xs text-gray-400 p-6">
            Select a circular notice to view body content.
          </div>
        )}
      </div>

      {/* PUBLISH NOTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 text-xs">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Publish Official Notice Circular</h3>
            
            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Notice Headline (Title)</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="E.g. Semester Registration Dates Extended"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Notices Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Academic">Academic Office</option>
                    <option value="Exam">Examinations</option>
                    <option value="Hostel">Hostel Accommodation</option>
                    <option value="Fee">Accounts & Fees</option>
                    <option value="Placement">Corporate Placement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Publishing Authority</label>
                  <input
                    type="text"
                    required
                    value={newNotice.postedBy}
                    onChange={(e) => setNewNotice({ ...newNotice, postedBy: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                    placeholder="Registrar Office"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Circular Content</label>
                <textarea
                  required
                  rows={4}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  placeholder="Write the full memo context here..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="not_important"
                  checked={newNotice.important}
                  onChange={(e) => setNewNotice({ ...newNotice, important: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="not_important" className="font-bold text-rose-600 uppercase tracking-wide text-[10px]">
                  Mark as Urgent Alert Bulletin
                </label>
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT NOTICE MODAL */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingNotice(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 text-xs">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Notice Circular</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateNotice(editingNotice);
              setSelectedNotice(editingNotice);
              setEditingNotice(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Notice Headline (Title)</label>
                <input
                  type="text"
                  required
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Notices Category</label>
                  <select
                    value={editingNotice.category}
                    onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="Academic">Academic Office</option>
                    <option value="Exam">Examinations</option>
                    <option value="Hostel">Hostel Accommodation</option>
                    <option value="Fee">Accounts & Fees</option>
                    <option value="Placement">Corporate Placement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Publishing Authority</label>
                  <input
                    type="text"
                    required
                    value={editingNotice.postedBy}
                    onChange={(e) => setEditingNotice({ ...editingNotice, postedBy: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Circular Content</label>
                <textarea
                  required
                  rows={6}
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_not_important"
                  checked={editingNotice.important}
                  onChange={(e) => setEditingNotice({ ...editingNotice, important: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="edit_not_important" className="font-bold text-rose-600 uppercase tracking-wide text-[10px]">
                  Mark as Urgent Alert Bulletin
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
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
