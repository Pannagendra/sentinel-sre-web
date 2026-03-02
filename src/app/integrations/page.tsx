"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Check, Terminal } from "lucide-react";

const integrations = [
  {
    name: "Datadog",
    category: "Observability",
    desc: "Query logs and metrics. Correlate error spikes with incidents in real-time.",
    tools: ["datadog_logs", "datadog_metrics"],
    envVars: [
      { key: "DATADOG_API_KEY", desc: "Your Datadog API key" },
      { key: "DATADOG_APP_KEY", desc: "Your Datadog Application key" },
    ],
    setup: [
      "Go to your Datadog dashboard → Organization Settings → API Keys",
      "Click 'New Key', name it 'Sentinel SRE', and copy the key",
      "Go to Organization Settings → Application Keys → 'New Key'",
      "Add both keys to your .env file",
    ],
    envExample: 'DATADOG_API_KEY=your-api-key-here\nDATADOG_APP_KEY=your-app-key-here',
  },
  {
    name: "New Relic",
    category: "Observability",
    desc: "APM transactions, NRQL queries, and application logs via NerdGraph GraphQL API.",
    tools: ["newrelic_logs", "newrelic_apm"],
    envVars: [
      { key: "NEWRELIC_API_KEY", desc: "User API key (starts with NRAK-)" },
      { key: "NEWRELIC_ACCOUNT_ID", desc: "Your numeric account ID" },
    ],
    setup: [
      "Log in to New Relic → click your name (bottom-left) → API Keys",
      "Create a new User key (type: USER). Copy the key (starts with NRAK-)",
      "Find your Account ID: click your name → Administration → the number in the URL or listed on the page",
      "Add both values to your .env file",
    ],
    envExample: 'NEWRELIC_API_KEY=NRAK-xxxxxxxxxxxxxxxxxxxx\nNEWRELIC_ACCOUNT_ID=1234567',
  },
  {
    name: "Dynatrace",
    category: "Observability",
    desc: "Davis AI-detected problems, service metrics, and full-stack monitoring.",
    tools: ["dynatrace_problems", "dynatrace_metrics"],
    envVars: [
      { key: "DYNATRACE_API_TOKEN", desc: "API token with read permissions" },
      { key: "DYNATRACE_ENV_URL", desc: "Your environment URL" },
    ],
    setup: [
      "Go to Dynatrace → Settings → Integration → Dynatrace API",
      "Click 'Generate new token'. Name it 'Sentinel SRE'",
      "Enable scopes: Read problems (v2), Read metrics (v2), Read entities (v2)",
      "Copy the token. Your env URL is the base URL of your Dynatrace dashboard (e.g. https://abc12345.live.dynatrace.com)",
    ],
    envExample: 'DYNATRACE_API_TOKEN=dt0c01.xxxxxxxx.yyyyyyyy\nDYNATRACE_ENV_URL=https://abc12345.live.dynatrace.com',
  },
  {
    name: "PagerDuty",
    category: "Incident Management",
    desc: "Receives webhook alerts and routes incidents to the correct team agent automatically.",
    tools: ["webhook_receiver"],
    envVars: [
      { key: "PAGERDUTY_WEBHOOK_SECRET", desc: "Webhook HMAC signing secret (optional but recommended)" },
    ],
    setup: [
      "Go to PagerDuty → Integrations → Generic Webhooks (v3)",
      "Click 'New Webhook'. Set the URL to: https://your-host/webhook/pagerduty",
      "Select events: incident.triggered, incident.acknowledged, incident.resolved",
      "If you enable signing, copy the secret and add it to your .env. This verifies webhook authenticity.",
    ],
    envExample: 'PAGERDUTY_WEBHOOK_SECRET=your-signing-secret',
  },
  {
    name: "Slack",
    category: "Communication",
    desc: "Posts investigation findings, approval workflows, and interactive follow-ups to your channels.",
    tools: ["slack_post", "slack_approval"],
    envVars: [
      { key: "SLACK_BOT_TOKEN", desc: "Bot User OAuth Token (starts with xoxb-)" },
      { key: "SLACK_INCIDENT_CHANNEL", desc: "Channel for findings (default: #incidents)" },
    ],
    setup: [
      "Go to api.slack.com/apps → Create New App → From Scratch",
      "Name it 'Sentinel SRE', select your workspace",
      "Go to OAuth & Permissions → add scopes: chat:write, files:write, channels:read",
      "Click 'Install to Workspace' and copy the Bot User OAuth Token",
    ],
    envExample: 'SLACK_BOT_TOKEN=xoxb-xxxx-xxxx-xxxx\nSLACK_INCIDENT_CHANNEL=#incidents',
  },
  {
    name: "GitHub",
    category: "Source Control",
    desc: "Checks recent commits and deploys to correlate code changes with incidents.",
    tools: ["github_recent_commits"],
    envVars: [
      { key: "GITHUB_TOKEN", desc: "Personal access token with repo read access" },
      { key: "GITHUB_ORG", desc: "Your GitHub organization name" },
    ],
    setup: [
      "Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens",
      "Click 'Generate new token'. Name it 'Sentinel SRE'",
      "Grant read-only access to: Contents, Metadata, Commit statuses for your repos",
      "Copy the token and set GITHUB_ORG to your org name (e.g. 'my-company')",
    ],
    envExample: 'GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx\nGITHUB_ORG=your-org-name',
  },
  {
    name: "Kubernetes",
    category: "Infrastructure",
    desc: "Pod status, cluster events, and resource utilization for container workloads.",
    tools: ["k8s_pod_status", "k8s_events"],
    envVars: [
      { key: "KUBECONFIG", desc: "Path to your kubeconfig file" },
    ],
    setup: [
      "Ensure kubectl is configured and can access your cluster",
      "Set KUBECONFIG to the path of your kubeconfig file",
      "For remote clusters, make sure the kubeconfig has valid credentials/tokens",
      "The agent uses read-only operations (get pods, get events) — no write access needed",
    ],
    envExample: 'KUBECONFIG=/path/to/.kube/config',
  },
  {
    name: "Upstash Redis",
    category: "Storage",
    desc: "Persistent storage for audit logs, analytics state, and RBAC data. Falls back to in-memory if not configured.",
    tools: [],
    envVars: [
      { key: "UPSTASH_REDIS_URL", desc: "Redis REST API URL" },
      { key: "UPSTASH_REDIS_TOKEN", desc: "Redis REST API token" },
    ],
    setup: [
      "Go to console.upstash.com → Create Database",
      "Select a region close to your deployment",
      "Copy the REST URL and REST Token from the database details page",
      "Add both to your .env file",
    ],
    envExample: 'UPSTASH_REDIS_URL=https://xxxx.upstash.io\nUPSTASH_REDIS_TOKEN=your-token',
  },
  {
    name: "Upstash Vector",
    category: "AI / Search",
    desc: "Semantic search over runbooks using vector embeddings. Falls back to TF-IDF keyword search if not configured.",
    tools: ["vector_search_runbooks"],
    envVars: [
      { key: "UPSTASH_VECTOR_URL", desc: "Vector index REST URL" },
      { key: "UPSTASH_VECTOR_TOKEN", desc: "Vector index REST token" },
    ],
    setup: [
      "Go to console.upstash.com → Vector → Create Index",
      "Set dimensions to 1536 (for OpenAI text-embedding-3-small)",
      "Set similarity metric to 'cosine'",
      "Copy the REST URL and REST Token. Also requires OPENAI_API_KEY for embeddings.",
    ],
    envExample: 'UPSTASH_VECTOR_URL=https://xxxx.upstash.io\nUPSTASH_VECTOR_TOKEN=your-token',
  },
  {
    name: "OpenAI",
    category: "AI / Search",
    desc: "Text embeddings for the vector knowledge base. Powers semantic runbook search alongside Upstash Vector.",
    tools: [],
    envVars: [
      { key: "OPENAI_API_KEY", desc: "API key for text-embedding-3-small model" },
    ],
    setup: [
      "Go to platform.openai.com → API Keys",
      "Click 'Create new secret key', name it 'Sentinel SRE'",
      "Copy the key immediately (it won't be shown again)",
      "Used for generating embeddings only — not for chat/completions (that's Anthropic)",
    ],
    envExample: 'OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx',
  },
];

const categories = [...new Set(integrations.map((i) => i.category))];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="rounded p-1 text-neutral-600 transition-colors hover:bg-white/5 hover:text-neutral-300"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function IntegrationCard({ ig, expanded, onToggle }: { ig: typeof integrations[0]; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className="border-white/5 bg-white/[0.02] p-0 overflow-hidden transition-all hover:border-white/10 self-start">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white">{ig.name}</h3>
          <p className="text-[11px] text-neutral-500">{ig.category}</p>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-neutral-400">{ig.desc}</p>

        {ig.tools.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {ig.tools.map((t) => (
              <Badge key={t} variant="outline" className="border-emerald-500/20 font-mono text-[10px] text-emerald-400">
                <Terminal className="mr-1 h-3 w-3" />{t}
              </Badge>
            ))}
          </div>
        )}

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {ig.envVars.map((v) => (
              <div key={v.key} className="flex items-center gap-1">
                <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">{v.key}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse Setup Guide */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between border-t border-white/5 px-6 py-3 text-xs text-neutral-500 transition-colors hover:bg-white/[0.02] hover:text-neutral-300"
      >
        <span className="font-medium">Setup Guide</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-6 py-5 bg-white/[0.01]">
          {/* Steps */}
          <ol className="mb-4 space-y-2.5">
            {ig.setup.map((step, i) => (
              <li key={i} className="flex gap-3 text-xs leading-relaxed text-neutral-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {/* Env vars detail */}
          <div className="mb-4 space-y-2">
            {ig.envVars.map((v) => (
              <div key={v.key} className="flex items-start gap-2 text-xs">
                <code className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-indigo-400">{v.key}</code>
                <span className="text-neutral-500">{v.desc}</span>
              </div>
            ))}
          </div>

          {/* Copy-paste env example */}
          <div className="relative rounded-lg bg-black/40 p-3">
            <div className="absolute right-2 top-2">
              <CopyButton text={ig.envExample} />
            </div>
            <pre className="font-mono text-[11px] leading-relaxed text-emerald-400/80 pr-8">
              {ig.envExample}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function IntegrationsPage() {
  const [expandedName, setExpandedName] = useState<string | null>(null);

  const handleToggle = (name: string) => {
    setExpandedName((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Integrations
          </p>
          <h1 className="mb-3 text-3xl font-bold">Connect Your Stack</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
            Sentinel connects to your existing observability, incident management, and infrastructure
            tools. Click any integration to see the step-by-step setup guide. All integrations are
            optional — the agent adds capabilities as you connect more services.
          </p>
        </div>

        {/* Quick start callout */}
        <Card className="mb-10 border-indigo-500/20 bg-indigo-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
            <div>
              <p className="mb-1 text-sm font-medium text-white">Minimum to get started</p>
              <p className="text-xs text-neutral-400">
                You only need <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-indigo-300">ANTHROPIC_API_KEY</code> in
                your <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px]">.env</code> file.
                Everything else is optional and enables additional capabilities.
              </p>
            </div>
          </div>
        </Card>

        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
              {cat}
            </h2>
            <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {integrations
                .filter((i) => i.category === cat)
                .map((ig) => (
                  <IntegrationCard
                    key={ig.name}
                    ig={ig}
                    expanded={expandedName === ig.name}
                    onToggle={() => handleToggle(ig.name)}
                  />
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
