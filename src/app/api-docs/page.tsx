import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    method: "GET",
    path: "/health",
    desc: "Health check. Returns service status and timestamp.",
    response: '{ "status": "healthy", "service": "sentinel-sre", "timestamp": "..." }',
  },
  {
    method: "POST",
    path: "/webhook/pagerduty",
    desc: "Receives PagerDuty webhook events. Routes incidents to the correct team agent and queues investigation via QStash (or runs synchronously).",
    body: '{ "messages": [{ "event": "trigger", "incident": { "id": "...", "service": { "name": "..." }, "title": "...", "urgency": "high" } }] }',
    response: '{ "status": "queued", "incident_id": "...", "team": "payments" }',
  },
  {
    method: "POST",
    path: "/api/investigate",
    desc: "Runs an AI investigation for a given incident. Typically called by QStash after webhook processing, but can be called directly.",
    body: '{ "incident_id": "...", "service": "checkout-api", "title": "High latency", "urgency": "high", "team_id": "payments" }',
    response: '{ "status": "completed", "incident_id": "...", "findings": "...", "duration_seconds": 12 }',
  },
  {
    method: "POST",
    path: "/api/dashboard/chat",
    desc: "Send a message to the AI agent. Returns investigation findings or answers to questions about your infrastructure.",
    body: '{ "message": "Investigate high latency on checkout-api" }',
    response: '{ "role": "assistant", "content": "...", "tools_used": ["datadog_logs", "k8s_pod_status"] }',
  },
  {
    method: "GET",
    path: "/api/dashboard/metrics",
    desc: "Dashboard metrics including MTTR, success rate, team breakdown, and daily trends.",
    params: "?days=30&team_id=payments",
    response: '{ "total_incidents": 42, "success_rate": 85, "mttr_seconds": 18, ... }',
  },
  {
    method: "GET",
    path: "/api/dashboard/teams",
    desc: "List all configured team agents with their routing rules, services, and keywords.",
    response: '{ "teams": [{ "id": "payments", "name": "Payments", "services": [...], ... }] }',
  },
  {
    method: "GET",
    path: "/api/dashboard/audit",
    desc: "Audit log of all actions — webhook receipts, investigations, approvals, auth events.",
    params: "?limit=50&action=investigation.completed",
    response: '{ "events": [{ "timestamp": "...", "action": "...", "actor": "...", ... }], "stats": {...} }',
  },
  {
    method: "GET",
    path: "/api/dashboard/evaluations",
    desc: "Evaluation framework data — scenarios and past eval runs.",
    response: '{ "runs": [...], "scenarios": [...] }',
  },
  {
    method: "POST",
    path: "/api/dashboard/eval/run",
    desc: "Trigger an evaluation run against built-in or custom scenarios.",
    body: '{ "name": "Prompt v2 test", "team_id": "payments", "dry_run": true }',
    response: '{ "avg_score": 78.5, "root_cause_accuracy": 80.0, "scenarios": 5 }',
  },
  {
    method: "GET",
    path: "/api/dashboard/kb",
    desc: "Knowledge base stats — indexed files, vector DB status, embedding status.",
    response: '{ "indexed_files": 12, "vector_db_configured": true, "openai_configured": true }',
  },
  {
    method: "POST",
    path: "/api/dashboard/kb/index",
    desc: "Re-index runbooks into the knowledge base.",
    response: '{ "indexed": 12, "skipped": 0 }',
  },
  {
    method: "GET",
    path: "/api/dashboard/roles",
    desc: "RBAC role definitions and their permissions.",
    response: '{ "roles": { "platform_admin": { "name": "...", "permissions": [...] }, ... } }',
  },
  {
    method: "POST",
    path: "/api/dashboard/accuracy/label",
    desc: "Label an investigation's accuracy for tracking root cause detection quality.",
    body: '{ "incident_id": "INC-001", "label": "correct", "notes": "Root cause was accurate" }',
    response: '{ "success": true }',
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    POST: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    PUT: "border-amber-500/30 text-amber-400 bg-amber-500/5",
    DELETE: "border-red-500/30 text-red-400 bg-red-500/5",
  };
  return (
    <Badge variant="outline" className={`font-mono text-[11px] font-bold ${colors[method] || ""}`}>
      {method}
    </Badge>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-20 pb-12">
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            API Reference
          </p>
          <h1 className="mb-3 text-3xl font-bold">REST API</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
            All endpoints are served by the Python backend. The base URL depends on your deployment —
            <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
              http://localhost:8000
            </code>
            for local,
            <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
              https://your-app.vercel.app
            </code>
            for Vercel.
          </p>
        </div>

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <Card key={i} className="border-white/5 bg-white/[0.02] p-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
                <MethodBadge method={ep.method} />
                <code className="font-mono text-sm text-white">{ep.path}</code>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="mb-4 text-xs leading-relaxed text-neutral-400">{ep.desc}</p>

                {ep.params && (
                  <div className="mb-3">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                      Query Parameters
                    </p>
                    <code className="block rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-neutral-400">
                      {ep.params}
                    </code>
                  </div>
                )}

                {ep.body && (
                  <div className="mb-3">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                      Request Body
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-neutral-400">
                      {ep.body}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                    Response
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-emerald-400/80">
                    {ep.response}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
