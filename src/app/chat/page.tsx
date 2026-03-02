"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send, User, Loader2, AlertTriangle, CheckCircle2,
  Terminal, Shield, Sparkles, Zap
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  tools_used?: string[];
  status?: "investigating" | "complete" | "error";
}

const suggestions = [
  "Investigate high latency on checkout-api",
  "Why is the payment service throwing 500s?",
  "Check Redis connection pool status",
  "What changed in the last deploy?",
  "Show me error logs for the auth service",
];

const tools = [
  { name: "Datadog Logs & Metrics", active: true },
  { name: "New Relic APM", active: true },
  { name: "Dynatrace Problems", active: true },
  { name: "GitHub Commits", active: true },
  { name: "Kubernetes Pods", active: true },
  { name: "Runbook Search", active: true },
  { name: "Vector KB Search", active: true },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I'm your AI SRE agent. I can investigate incidents, query your observability stack (Datadog, New Relic, Dynatrace), check Kubernetes pods, search runbooks, and analyze recent deploys.\n\nDescribe an incident or ask me to investigate a service.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const thinkingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        status: "investigating",
      },
    ]);

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? {
              ...m,
              content: data.content || data.error || "No response received.",
              tools_used: data.tools_used,
              status: data.error ? "error" : "complete",
            }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? {
              ...m,
              content:
                "Unable to reach the API server. Make sure the Python backend is running on " +
                API_BASE,
              status: "error",
            }
            : m
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="dark flex h-screen flex-col bg-[#03070d]">
      <Navbar />

      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-cyan-500/10 bg-[#050a10]/80 backdrop-blur-xl p-5 lg:block">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="w-full rounded-xl border border-cyan-500/10 bg-cyan-500/5 px-4 py-3 text-left text-xs text-slate-400 transition-all hover:border-cyan-500/20 hover:bg-cyan-500/10 hover:text-slate-300 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Available Tools
              </h3>
            </div>
            <div className="space-y-1.5">
              {tools.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-500"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {t.name}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-8 md:px-8"
          >
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <div
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${msg.role === "user"
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20"
                      }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Shield className="h-4 w-4 text-[#03070d]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-200">
                        {msg.role === "user" ? "You" : "Sentinel"}
                      </span>
                      <span className="text-xs text-slate-600">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.status === "investigating" && (
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 bg-cyan-500/5 text-xs text-cyan-400"
                        >
                          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                          Investigating
                        </Badge>
                      )}
                      {msg.status === "complete" && (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400"
                        >
                          <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          Complete
                        </Badge>
                      )}
                      {msg.status === "error" && (
                        <Badge
                          variant="outline"
                          className="border-rose-500/30 bg-rose-500/5 text-xs text-rose-400"
                        >
                          <AlertTriangle className="mr-1.5 h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>

                    {msg.status === "investigating" && !msg.content ? (
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <div className="h-5 w-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                        <span>Querying logs, checking metrics, correlating deploys...</span>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed text-slate-300">
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("```")) return null;
                          if (line.trim() === "") return <div key={i} className="h-3" />;
                          if (line.startsWith("- ")) {
                            return (
                              <div key={i} className="flex items-start gap-3 py-1">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                                <span>{line.slice(2)}</span>
                              </div>
                            );
                          }
                          return <p key={i} className="mb-1.5">{line}</p>;
                        })}
                      </div>
                    )}

                    {/* Suggestion chips after welcome */}
                    {msg.id === "welcome" && messages.length === 1 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(s)}
                            disabled={loading}
                            className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs text-slate-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:opacity-50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.tools_used && msg.tools_used.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.tools_used.map((t, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400"
                          >
                            <Terminal className="mr-1.5 h-3 w-3 text-cyan-400" />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-cyan-500/10 bg-[#050a10]/80 backdrop-blur-xl p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="mx-auto flex max-w-3xl gap-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe an incident or ask a question..."
                disabled={loading}
                className="flex-1 h-12 border-cyan-500/20 bg-[#0a1018] text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/30"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20 disabled:opacity-30"
                size="icon"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#03070d]" />
                ) : (
                  <Send className="h-5 w-5 text-[#03070d]" />
                )}
              </Button>
            </form>
            <div className="mx-auto mt-3 flex max-w-3xl items-center justify-between">
              <p className="text-xs text-slate-600">
                Sentinel queries your actual systems. All actions are logged.
              </p>
              <p className="hidden text-xs text-slate-700 sm:block">
                Press Enter to send
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
