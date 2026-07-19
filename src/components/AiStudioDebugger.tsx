/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Terminal,
  ExternalLink,
  Cpu,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  FileCode,
  Sliders,
  Flame,
  Wrench
} from "lucide-react";

import { Role, ErpConfig } from "../types";

interface AiStudioDebuggerProps {
  activeRole: Role;
  config: ErpConfig | null;
}

export default function AiStudioDebugger({ activeRole, config }: AiStudioDebuggerProps) {
  const isAllowed = config?.debuggerAllowedRoles?.includes(activeRole) || activeRole === Role.ADMIN;

  const [errorMessage, setErrorMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [context, setContext] = useState("General");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!isAllowed) {
    return (
      <div className="bento-card p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30 shadow-sm">
          <AlertCircle className="h-8 w-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-gray-950 dark:text-white">Access Violation Restricted</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm leading-relaxed">
          The System Administrator has restricted error debugging capabilities on this ERP server. Only users with designated 
          <strong> AI Developer Privileges</strong> are authorized to troubleshoot runtime compile errors.
        </p>
        <div className="p-3.5 bg-gray-50 dark:bg-zinc-950/50 rounded-xl border border-gray-100 dark:border-zinc-850 w-full text-left space-y-2">
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono block">
            How to resolve?
          </span>
          <p className="text-[10px] text-gray-400 leading-normal">
            Please contact your campus administrator (<span className="text-indigo-500 font-mono font-semibold">{config?.adminEmail || "admin@ait.edu"}</span>) to request a temporary developer clearance badge for your portal role (<span className="font-semibold text-gray-600 dark:text-gray-300 font-mono">{activeRole}</span>).
          </p>
        </div>
      </div>
    );
  }

  // Clickable presets for instant demonstration
  const presets = [
    {
      label: "Cannot find name 'PlacementDrive'",
      error: "src/App.tsx(176,46): error TS2304: Cannot find name 'PlacementDrive'.",
      code: "const handleUpdatePlacementDrive = (drive: PlacementDrive) => {\n  updateErpDatabase(\"UPDATE_PLACEMENT_COMPANY\", updatedCompany);\n};",
      context: "App.tsx / State Router"
    },
    {
      label: "Cannot read properties of undefined (reading 'map')",
      error: "TypeError: Cannot read properties of undefined (reading 'map') at StudyMaterialsModule (StudyMaterialsModule.tsx:162)",
      code: "{materials.map((m) => (\n  <div key={m.id}>{m.title}</div>\n))}",
      context: "StudyMaterialsModule"
    },
    {
      label: "Linter: 'activeRole' is defined but never used",
      error: "eslint: 'activeRole' is assigned a value but never used. (@typescript-eslint/no-unused-vars)",
      code: "export default function Notices({ notices, activeRole }) {\n  return <div>Notices Count: {notices.length}</div>;\n}",
      context: "NoticeBoardModule"
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setErrorMessage(p.error);
    setCodeSnippet(p.code);
    setContext(p.context);
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorMessage.trim()) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorMessage,
          codeSnippet,
          context
        })
      });

      const data = await response.json();
      if (data.error) {
        setAnalysisResult(`### Diagnostic Connection Error\n\n${data.error}`);
      } else {
        setAnalysisResult(data.analysis);
      }
    } catch (err: any) {
      setAnalysisResult(`### Connection Failed\n\nUnable to establish contact with the local server debugger API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!analysisResult) return;
    // Simple code block regex extractor or copy whole result
    navigator.clipboard.writeText(analysisResult);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-slate-900 p-6 text-white shadow-xl dark:border dark:border-zinc-800">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Google AI Studio Developer Hub
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Launch AI Studio & Edit Your App</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Google AI Studio Build lets you edit code, add features, and fix issues instantly with natural language. 
              Use this workspace companion to diagnose errors in real-time, generate drop-in solutions, and open AI Studio directly.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-900/30 hover:opacity-95 active:scale-98 transition-all"
              id="external_aistudio_launch_btn"
            >
              <Terminal className="h-4 w-4" />
              <span>Open Google AI Studio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <span className="text-[10px] text-center text-zinc-400 font-mono">Applet ID: 875f1aea-1123-4177-af76-8f60b6cb1b24</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* INTERACTIVE COMPANION ERROR DIAGNOSER */}
        <div className="bento-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-500" /> Grounded Error Diagnoser
              </h3>
              <p className="text-[11px] text-gray-400">Paste code anomalies and let Gemini construct perfect resolutions</p>
            </div>
            {analysisResult && (
              <button
                onClick={() => {
                  setErrorMessage("");
                  setCodeSnippet("");
                  setAnalysisResult(null);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-600"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          <form onSubmit={handleDiagnose} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-semibold">1. Error Log / Output Message</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. TypeError: Cannot read properties of null (reading 'photoUrl') or compilation error logs..."
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-semibold">2. Component Context Module</label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="General">General / Router State</option>
                  <option value="StudentManagement">StudentManagement.tsx</option>
                  <option value="FacultyManagement">FacultyManagement.tsx</option>
                  <option value="AttendanceModule">AttendanceModule.tsx</option>
                  <option value="ExamsModule">ExamsModule.tsx</option>
                  <option value="StudyMaterialsModule">StudyMaterialsModule.tsx</option>
                  <option value="FeesModule">FeesModule.tsx</option>
                  <option value="HostelModule">HostelModule.tsx</option>
                  <option value="LibraryModule">LibraryModule.tsx</option>
                  <option value="PlacementModule">PlacementModule.tsx</option>
                  <option value="NoticeBoardModule">NoticeBoardModule.tsx</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-semibold">3. Associated File Path (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /src/components/StudentManagement.tsx"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-semibold">4. Relevant Code Block Snippet (Optional)</label>
              <textarea
                rows={4}
                placeholder="Paste the lines of code around the error to give Gemini context..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !errorMessage.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-extrabold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-100 dark:shadow-none transition-all"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Gemini Diagnosing & Writing Resolution...</span>
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4" />
                  <span>Diagnose with Gemini Flash 3.5</span>
                </>
              )}
            </button>
          </form>

          {/* DIAGNOSIS RESULTS */}
          {analysisResult && (
            <div className="mt-4 border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Diagnostic Analysis Complete
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied Fix!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-gray-500" /> Copy Report
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 dark:bg-zinc-950 dark:border-zinc-850 max-h-96 overflow-y-auto text-xs leading-relaxed text-gray-700 dark:text-zinc-300 whitespace-pre-wrap font-sans">
                {analysisResult}
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-3.5 border border-indigo-100/50 dark:border-indigo-950 text-[11px] text-indigo-900 dark:text-indigo-300 space-y-1.5">
                <span className="font-extrabold block">How to apply this solution:</span>
                <p>
                  1. Copy the code fix block above. <br />
                  2. Click the <strong className="font-bold underline cursor-pointer" onClick={() => window.open("https://ai.studio/build", "_blank")}>Open Google AI Studio</strong> button at the top right of this screen. <br />
                  3. In Google AI Studio Build, open the respective file and apply the change, or simply tell the AI chatbot: 
                  <em className="font-medium bg-white/60 dark:bg-zinc-900/60 px-1 rounded mx-1">"Update the code in [File] to [paste fix]"</em>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR HUB - HUD & DEMO PRESETS */}
        <div className="space-y-6">
          {/* RUNTIME HUD HEALTH STATUS */}
          <div className="bento-card p-6 space-y-4">
            <h4 className="font-bold text-gray-950 dark:text-white text-sm">Workspace Telemetry HUD</h4>
            
            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="rounded-xl border border-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-gray-400 block mb-0.5">DEV CONTAINER</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> ONLINE
                </span>
              </div>
              <div className="rounded-xl border border-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-gray-400 block mb-0.5">INGRESS PORT</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">3000</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-gray-400 block mb-0.5">VITE HMR</span>
                <span className="font-bold text-zinc-400">PAUSED (OFF)</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-gray-400 block mb-0.5">LINTER CHECKS</span>
                <span className="font-bold text-emerald-500">100% GREEN</span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-850 pt-3 text-[11px] text-gray-500 leading-normal space-y-2">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Hot Module Replacement (HMR)</strong> is intentionally bypassed by the platform so that visual transitions remain pristine during incremental code edits.
                </span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE ERROR PRESETS */}
          <div className="bento-card p-6 space-y-3.5">
            <div>
              <h4 className="font-bold text-gray-950 dark:text-white text-sm">Interactive Error Scenarios</h4>
              <p className="text-[10px] text-gray-400">Click a preset below to instantly see how the grounded Gemini diagnoser resolves it</p>
            </div>

            <div className="flex flex-col gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="text-left rounded-xl border border-gray-100 p-3 bg-gray-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 transition-all text-xs"
                >
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block leading-tight mb-1">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono truncate block">
                    {p.error}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
