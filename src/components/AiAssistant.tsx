/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  Send,
  X,
  Plus,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AiAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AiAssistant({ isOpen, setIsOpen }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your grounded College ERP AI Assistant. I can check attendance figures, retrieve fee due metrics, or suggest placement-drive qualifiers. What insights do you need?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg: Message = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: "model", text: `Error: ${data.error}` }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "model", text: data.text }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "model", text: `Failed to contact server: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const presetPrompts = [
    "Predict any students at risk of exam block due to unpaid dues?",
    "Which student qualifies for Google's recruitment drive?",
    "Identify student attendance anomalies for today?",
    "Give me an executive summary of current institute standings."
  ];

  return (
    <>
      {/* Floating Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        title="Open AI Studio Companion"
        id="toggle_assistant_btn"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
      </button>

      {/* Slide-out drawer chatbot */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl dark:bg-zinc-900 border-l border-gray-150 dark:border-zinc-800 flex flex-col justify-between animate-slide-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold tracking-wide">AIT Intelligence Desk</h4>
                <p className="text-[9px] text-indigo-300 font-mono">Grounded Gemini Flash 3.5</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40 dark:bg-zinc-950/20"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow"
                      : "bg-white text-gray-800 dark:bg-zinc-900 dark:text-zinc-200 border border-gray-100 dark:border-zinc-850 rounded-tl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3.5 text-xs text-gray-500 flex items-center gap-2 dark:bg-zinc-900 dark:border-zinc-850">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
                  </div>
                  <span className="font-mono text-[10px]">Analyzing ERP data ledger...</span>
                </div>
              </div>
            )}
          </div>

          {/* Preset Prompts & Inputs */}
          <div className="p-4 border-t border-gray-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-3.5 shrink-0">
            {/* Presets Row */}
            {messages.length === 1 && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Lightbulb className="h-3 w-3 text-amber-500" /> Suggested Insights
                </p>
                <div className="flex flex-col gap-1.5">
                  {presetPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetPrompt(p)}
                      className="text-left text-[11px] font-sans p-2 rounded-xl bg-gray-50 border hover:bg-gray-100 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 leading-tight transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything about AIT ERP records..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="rounded-xl bg-indigo-600 px-3.5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
