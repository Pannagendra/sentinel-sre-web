import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Shield, Zap, MessageSquare, BarChart3, GitBranch, Lock,
  ArrowRight, Search, Terminal, CheckCircle2, Clock, Users,
  Activity, Eye, Bot, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Autonomous Detection",
    desc: "Alert triggers at 3am. Sentinel instantly correlates logs, metrics, and recent deploys. Root cause identified before you wake.",
    details: ["Multi-source correlation", "Real-time anomaly detection", "Contextual analysis"],
    gradient: "from-cyan-500 via-cyan-400 to-teal-400",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Dialogue",
    desc: "Engage naturally. Upload screenshots, paste stack traces. Full conversation memory means no context ever lost.",
    details: ["Vision-powered analysis", "Thread-based memory", "Artifact generation"],
    gradient: "from-teal-400 via-emerald-400 to-green-400",
  },
  {
    icon: Terminal,
    title: "Surgical Remediation",
    desc: "One-click fixes with full audit trails. Human approval gates for all actions. Automated rollback if anything goes wrong.",
    details: ["Sandboxed execution", "Complete audit log", "Instant rollback"],
    gradient: "from-emerald-400 via-cyan-400 to-cyan-500",
  },
];

const features = [
  { icon: Bot, title: "Multi-Agent Architecture", desc: "Specialized AI agents per domain. Payments, Infrastructure, Database — each with scoped expertise." },
  { icon: Activity, title: "Live Analytics", desc: "MTTR, success rates, accuracy trends. Real-time visibility into your AI SRE's performance." },
  { icon: Zap, title: "40+ Integrations", desc: "Datadog, New Relic, Dynatrace, PagerDuty, Slack, GitHub, Kubernetes — seamlessly connected." },
  { icon: BarChart3, title: "Regression Testing", desc: "Replay historical incidents. A/B test prompt variants. Measure accuracy improvements." },
  { icon: GitBranch, title: "Deploy Anywhere", desc: "Vercel, Docker, bare metal. Your infrastructure, your rules, zero vendor lock-in." },
  { icon: Lock, title: "Enterprise Security", desc: "RBAC, full audit trails, webhook verification, human-in-the-loop gates." },
];

const security = [
  { icon: Lock, title: "RBAC", desc: "Fine-grained roles for every access level." },
  { icon: Eye, title: "Audit Trail", desc: "Every action logged and traceable." },
  { icon: CheckCircle2, title: "Human Gates", desc: "Approval required for all actions." },
  { icon: Users, title: "Team Isolation", desc: "Scoped access, zero cross-talk." },
];

export default function Home() {
  return (
    <div className="dark min-h-screen bg-[#03070d]">
      <Navbar />

      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Hero gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-36">
        <div className="relative mx-auto max-w-5xl px-6 text-center">

          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-sm text-cyan-300/80 font-medium">Trusted by elite SRE teams</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
            <span className="text-white">The AI That</span>
            <br />
            <span className="gradient-text">Investigates Incidents</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Alert fires → AI investigates logs, metrics, deploys → Root cause + fix delivered to Slack.
            <br className="hidden sm:block" />
            <span className="text-slate-500">You review. You approve. Incident resolved.</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="btn-glow h-14 px-10 text-base font-semibold"
              asChild
            >
              <Link href="/chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Launch AI Agent
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-base border-cyan-500/20 text-slate-300 hover:bg-cyan-500/5 hover:border-cyan-500/30 backdrop-blur-sm"
              asChild
            >
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          {/* Integration logos */}
          <p className="mt-10 text-xs text-slate-600 tracking-wide">
            INTEGRATES WITH &nbsp;
            <span className="text-slate-500">Datadog</span> ·
            <span className="text-slate-500">New Relic</span> ·
            <span className="text-slate-500">Dynatrace</span> ·
            <span className="text-slate-500">PagerDuty</span> ·
            <span className="text-slate-500">Slack</span> ·
            <span className="text-slate-500">GitHub</span>
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative border-t border-cyan-500/10 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">How It Works</p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Alert to Resolution in Minutes</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="glass-card p-8 transition-all duration-500 hover:translate-y-[-4px]"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg shadow-cyan-500/20`}>
                    <s.icon className="h-6 w-6 text-[#03070d]" />
                  </div>
                  <span className="text-sm font-mono text-slate-600">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-3">
                  {s.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10">
                        <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                      </div>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative border-t border-cyan-500/10 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">Capabilities</p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Built for Production</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-cyan-500/10 bg-[#0a1018]/60 p-7 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/20 hover:bg-[#0a1018]/80"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 group-hover:from-cyan-500/20 group-hover:to-teal-500/20 transition-all duration-300">
                  <f.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="relative border-t border-cyan-500/10 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-4">Security</p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Enterprise Ready</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {security.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-cyan-500/10 bg-[#0a1018]/40 p-6 text-center backdrop-blur-sm transition-all hover:border-cyan-500/20"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/10">
                  <s.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative border-t border-cyan-500/10 py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">Ready to Transform On-Call?</h2>
          <p className="text-lg text-slate-400 mb-10">Connect your stack. Let the AI handle the 3am pages.</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="btn-glow h-14 px-10 text-base font-semibold" asChild>
              <Link href="/chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-base border-cyan-500/20 text-slate-300 hover:bg-cyan-500/5"
              asChild
            >
              <a href="https://github.com/anisri/sentinel-sre" target="_blank" rel="noopener">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-cyan-500/10 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
              <Shield className="h-4 w-4 text-[#03070d]" />
            </div>
            <span className="font-medium text-slate-400">Sentinel SRE</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link href="/chat" className="hover:text-cyan-400 transition-colors">Chat</Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
            <a href="https://github.com/anisri/sentinel-sre" target="_blank" rel="noopener" className="hover:text-cyan-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
