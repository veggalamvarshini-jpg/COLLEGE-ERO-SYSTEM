/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  AlertCircle,
  FilePlus,
  Compass,
  CheckCircle,
  CheckSquare,
  Edit
} from "lucide-react";
import { Student, HostelRoom, VisitorLog, Role } from "../types";

interface HostelModuleProps {
  students: Student[];
  hostelRooms: HostelRoom[];
  visitorLogs: VisitorLog[];
  onUpdateHostelRoom: (room: HostelRoom) => void;
  activeRole: Role;
}

export default function HostelModule({
  students,
  hostelRooms,
  visitorLogs,
  onUpdateHostelRoom,
  activeRole
}: HostelModuleProps) {
  const [activeTab, setActiveTab] = useState<"rooms" | "visitors" | "complaints">("rooms");
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(hostelRooms[0] || null);
  const [editingRoom, setEditingRoom] = useState<HostelRoom | null>(null);

  // Complaints form simulator
  const [complaints, setComplaints] = useState([
    { id: "C01", category: "Plumbing", room: "A-102", description: "Low hot water pressure in common showers", date: "2026-07-16", status: "In Process" },
    { id: "C02", category: "Electrical", room: "B-204", description: "AC fan making heavy noise during night hours", date: "2026-07-17", status: "Resolved" }
  ]);

  const [newComplaint, setNewComplaint] = useState({
    category: "Plumbing",
    room: "",
    description: ""
  });

  const handleRegisterComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setComplaints([
      {
        id: `C0${complaints.length + 1}`,
        room: newComplaint.room,
        category: newComplaint.category,
        description: newComplaint.description,
        date: new Date().toISOString().split('T')[0],
        status: "In Process"
      },
      ...complaints
    ]);
    setNewComplaint({ category: "Plumbing", room: "", description: "" });
    alert("Complaint logged successfully! Hostel Warden notified.");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT & CENTER PANEL: Main Hostel Manager */}
      <div className="bento-card p-6 lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Hostel Management Office</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Allocate rooms, track visitors, and manage ward complaints</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-zinc-950">
            {[
              { id: "rooms", label: "Rooms Map", icon: Home },
              { id: "visitors", label: "Visitors Register", icon: Users },
              { id: "complaints", label: "Complaint Box", icon: AlertCircle }
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

        {/* TAB 1: ROOMS GRID MAP */}
        {activeTab === "rooms" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Residential Rooms Inventory</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hostelRooms.map((room) => {
                const occupancyRate = Math.round((room.occupants.length / room.capacity) * 100);
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all ${
                      selectedRoom?.id === room.id
                        ? "border-indigo-500 bg-indigo-50/20 dark:border-indigo-600 dark:bg-indigo-950/20"
                        : "border-gray-100 dark:border-zinc-800 bg-gray-50/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-600 font-mono tracking-wider block uppercase">{room.block}</span>
                        <h5 className="font-extrabold text-gray-900 dark:text-white text-sm mt-1">Room {room.roomNumber}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">{room.roomType}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        occupancyRate === 100 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {room.occupants.length} / {room.capacity} Beds filled
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-100 dark:bg-zinc-850 h-[4px] rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${occupancyRate}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VISITORS REGISTER LIST */}
        {activeTab === "visitors" && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm font-sans">Active Gate Entry Logs</h4>
            {visitorLogs.map((log) => {
              const stud = students.find(s => s.id === log.studentId);
              return (
                <div key={log.id} className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2.5 border-gray-50">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">{log.visitorName} ({log.relation})</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">Visiting Student: {stud ? stud.name : log.studentId} ({stud ? stud.rollNo : ""})</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Gate #{log.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-[11px] font-mono">
                    <div>
                      <span className="text-gray-400 text-[10px]">CHECK-IN PUNCH:</span>
                      <p className="font-semibold text-gray-800 dark:text-zinc-300 mt-0.5">{log.checkIn}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">CHECK-OUT PUNCH:</span>
                      <p className="font-semibold text-gray-800 dark:text-zinc-300 mt-0.5">{log.checkOut || "STILL INSIDE"}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-gray-500 dark:text-zinc-400 font-sans italic leading-relaxed">
                    Purpose: "{log.purpose}"
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: COMPLAINTS BOX */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm font-sans">Hostel Warden Maintenance Ledger</h4>
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800 bg-gray-50/20 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-bold font-mono tracking-wider text-indigo-600 block uppercase">ROOM {c.room} - {c.category}</span>
                      <h5 className="font-bold text-gray-900 dark:text-white text-xs mt-1">{c.description}</h5>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {c.status}
                      </span>
                      <p className="text-[9px] text-gray-400 font-mono mt-1">{c.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Specific Room details or Register Complaint */}
      <div>
        {activeTab === "complaints" ? (
          <div className="bento-card space-y-4 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
              <FilePlus className="h-4 w-4 text-indigo-500" /> Log Maintenance Ticket
            </h3>
            
            <form onSubmit={handleRegisterComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Select Category</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="Plumbing">Plumbing & Pipelines</option>
                  <option value="Electrical">Electrical Appliance</option>
                  <option value="Carpentry">Carpentry & Furniture</option>
                  <option value="Internet">Wi-Fi & LAN Connectivity</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Room Code</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. A-102"
                  value={newComplaint.room}
                  onChange={(e) => setNewComplaint({ ...newComplaint, room: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Elaborate Issue</label>
                <textarea
                  required
                  rows={3}
                  placeholder="E.g. Shower tap leaking heavily..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
              >
                File Warden Ticket
              </button>
            </form>
          </div>
        ) : selectedRoom ? (
          <div className="bento-card space-y-4 text-xs p-6">
            <div className="text-center pb-3 border-b">
              <Compass className="mx-auto h-8 w-8 text-indigo-500/60" />
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base mt-2">Room {selectedRoom.roomNumber} Status</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono mt-0.5">{selectedRoom.block}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Current Occupants</h4>
              {selectedRoom.occupants.length === 0 ? (
                <p className="text-gray-450 italic">Room is currently empty and available for allocation.</p>
              ) : (
                <div className="space-y-2">
                  {selectedRoom.occupants.map((occId) => {
                    const occObj = students.find(s => s.id === occId);
                    return (
                      <div key={occId} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
                        <img src={occObj?.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{occObj?.name}</p>
                          <p className="text-[10px] text-indigo-600 font-mono">{occObj?.rollNo}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2 font-mono text-[11px] text-gray-500">
              <div className="flex justify-between">
                <span>Room Class:</span>
                <span className="font-bold text-gray-950 dark:text-zinc-300">{selectedRoom.roomType}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Rent Period Rate:</span>
                <span className="font-bold text-emerald-600">${selectedRoom.monthlyRent.toLocaleString()} / Month</span>
              </div>
            </div>

            {activeRole === Role.ADMIN && (
              <button
                onClick={() => setEditingRoom({ ...selectedRoom })}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-950 dark:text-white transition-colors"
              >
                <Edit className="h-4 w-4 text-indigo-500" /> Edit Room Details
              </button>
            )}
          </div>
        ) : (
          <div className="bento-card text-center text-xs text-gray-400 p-6">
            Select a hostel room from map to review occupants & details.
          </div>
        )}
      </div>

      {/* EDIT HOSTEL ROOM MODAL */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingRoom(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Edit Room details</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateHostelRoom(editingRoom);
              setSelectedRoom(editingRoom);
              setEditingRoom(null);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={editingRoom.roomNumber}
                  onChange={(e) => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Block Name</label>
                  <input
                    type="text"
                    required
                    value={editingRoom.block}
                    onChange={(e) => setEditingRoom({ ...editingRoom, block: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Rent Cost ($ / Mo)</label>
                  <input
                    type="number"
                    required
                    value={editingRoom.monthlyRent}
                    onChange={(e) => setEditingRoom({ ...editingRoom, monthlyRent: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Room Class Category</label>
                <select
                  value={editingRoom.roomType}
                  onChange={(e) => setEditingRoom({ ...editingRoom, roomType: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="Single AC Suite">Single AC Suite</option>
                  <option value="Double Sharing Standard">Double Sharing Standard</option>
                  <option value="Triple Sharing Economical">Triple Sharing Economical</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
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
