"use client";

import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity, Clock, CheckCircle2, Users,
  RefreshCw, Shield, BookOpen, TrendingUp,
  Plus, Trash2, X, Network
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Metrics {
  total_incidents: number;
  success_rate: number;
  mttr_seconds: number;
  human_override_rate: number;
  team_breakdown: Record<string, { total: number; success_rate: number; avg_duration_seconds: number }>;
  daily_trend: { date: string; total: number; success: number; success_rate: number; avg_duration_seconds: number }[];
  accuracy: { total_labeled: number; accuracy_rate: number | null; breakdown: Record<string, number> };
}

interface Team {
  id: string;
  name: string;
  description: string;
  services: string[];
  keywords: string[];
}

interface AuditEvent {
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  details: Record<string, unknown>;
}

interface TopologyData {
  nodes: { id: string; type: string; status?: string; metrics?: any }[];
  edges: { source: string; target: string; type: string }[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [auditFilter, setAuditFilter] = useState("");

  // Topology State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Team Form State
  const [newTeam, setNewTeam] = useState({ name: "", id: "", description: "", services: "" });
  const [creatingTeam, setCreatingTeam] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/metrics?days=30`),
        fetch(`${API_BASE}/api/dashboard/teams`),
      ]);
      const mData = await mRes.json();
      const tData = await tRes.json();
      setMetrics(mData);
      setTeams(tData.teams || []);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopology = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/topology`);
      const data: TopologyData = await res.json();

      // Transform to ReactFlow format
      const layoutNodes = data.nodes.map((n, i) => ({
        id: n.id,
        position: { x: (i % 3) * 280, y: Math.floor(i / 3) * 160 },
        data: {
          label: (
            <div className="p-3 rounded-xl bg-[#0a1018] border border-cyan-500/20 w-44 backdrop-blur-sm">
              <div className="font-semibold text-xs mb-1.5 text-white">{n.id}</div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-slate-500">{n.type}</span>
                {n.status === "critical" && <span className="text-rose-400">Critical</span>}
                {n.status === "warning" && <span className="text-amber-400">Warning</span>}
                {n.status === "healthy" && <span className="text-emerald-400">Healthy</span>}
              </div>
              {n.metrics && (
                <div className="mt-2 pt-2 border-t border-cyan-500/10 text-[9px] text-slate-500 font-mono space-y-0.5">
                  {Object.entries(n.metrics).map(([k, v]) => <div key={k}>{k}: <span className="text-cyan-300">{String(v)}</span></div>)}
                </div>
              )}
            </div>
          )
        },
        style: {
          border: n.status === 'critical' ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(6, 182, 212, 0.2)',
          background: '#0a1018',
          color: '#fff',
          borderRadius: '12px',
          width: 180
        },
      }));

      const layoutEdges = data.edges.map((e, i) => ({
        id: `e${i}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: 'rgba(6, 182, 212, 0.4)' },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(6, 182, 212, 0.6)' },
      }));

      setNodes(layoutNodes);
      setEdges(layoutEdges);
    } catch (e) {
      console.error("Failed to fetch topology:", e);
    }
  };

  const fetchAudit = async () => {
    try {
      const url = `${API_BASE}/api/dashboard/audit?limit=50${auditFilter ? `&action=${auditFilter}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setAudit(data.events || []);
    } catch (e) {
      console.error("Failed to fetch audit:", e);
    }
  };

  const handleCreateTeam = async () => {
    setCreatingTeam(true);
    try {
      const svcs = newTeam.services.split(",").map(s => s.trim()).filter(Boolean);
      await fetch(`${API_BASE}/api/dashboard/teams/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTeam,
          services: svcs,
          keywords: svcs // simple default
        }),
      });
      setNewTeam({ name: "", id: "", description: "", services: "" });
      fetchData(); // Refresh list
    } catch (e) {
      console.error("Failed to create team:", e);
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      await fetch(`${API_BASE}/api/dashboard/teams/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData(); // Refresh list
    } catch (e) {
      console.error("Failed to delete team:", e);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const kpis = metrics
    ? [
      { label: "Total Incidents", value: metrics.total_incidents, icon: Activity, color: "text-white", iconColor: "text-cyan-400" },
      { label: "Success Rate", value: `${metrics.success_rate}%`, icon: CheckCircle2, color: "text-emerald-400", iconColor: "text-emerald-400", bar: metrics.success_rate, barColor: "bg-emerald-500" },
      { label: "Avg MTTR", value: `${metrics.mttr_seconds}s`, icon: Clock, color: "text-cyan-400", iconColor: "text-cyan-400" },
      { label: "Human Override", value: `${metrics.human_override_rate}%`, icon: Users, color: "text-amber-400", iconColor: "text-amber-400", bar: metrics.human_override_rate, barColor: "bg-amber-500" },
    ]
    : [];

  return (
    <div className="dark min-h-screen bg-[#03070d]">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <main className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Real-time metrics from your AI SRE agents
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-slate-600">
                {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="border-cyan-500/20 text-slate-400 hover:bg-cyan-500/10 hover:text-white hover:border-cyan-500/30"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {loading && !metrics ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} className="border-cyan-500/10 bg-[#0a1018]/60 backdrop-blur-sm p-6">
                  <div className="mb-3 h-3 w-24 animate-pulse rounded bg-cyan-500/10" />
                  <div className="h-8 w-16 animate-pulse rounded bg-cyan-500/10" />
                </Card>
              ))}
            </>
          ) : (
            kpis.map((kpi, i) => (
              <Card key={i} className="border-cyan-500/10 bg-[#0a1018]/60 backdrop-blur-sm p-6 transition-all hover:border-cyan-500/20">
                <div className="mb-3 flex items-center gap-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.iconColor || 'text-slate-500'}`} />
                  <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                    {kpi.label}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
                {kpi.bar !== undefined && (
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${kpi.barColor || 'bg-cyan-500'}`}
                      style={{ width: `${kpi.bar}%` }}
                    />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#0a1018] border border-cyan-500/10">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <TrendingUp className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="topology" className="text-xs data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400" onClick={fetchTopology}>
              <Network className="mr-2 h-4 w-4" />
              Topology
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-xs data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Users className="mr-2 h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400" onClick={fetchAudit}>
              <Shield className="mr-2 h-4 w-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Topology Tab */}
          <TabsContent value="topology" className="h-[600px] border border-cyan-500/10 rounded-2xl overflow-hidden bg-[#03070d]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              className="bg-[#03070d]"
            >
              <Background color="rgba(6, 182, 212, 0.08)" gap={24} />
              <Controls className="bg-[#0a1018] border-cyan-500/20 text-white [&>button]:border-cyan-500/20 [&>button:hover]:bg-cyan-500/10" />
              <MiniMap style={{ background: '#0a1018' }} nodeColor='rgba(6, 182, 212, 0.3)' />
            </ReactFlow>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Accuracy */}
              <Card className="border-white/5 bg-white/[0.02] p-6 lg:col-span-2">
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                  Root Cause Accuracy
                </h3>
                {metrics?.accuracy?.total_labeled ? (
                  <div>
                    <div className="mb-1 text-3xl font-bold text-emerald-400">
                      {metrics.accuracy.accuracy_rate}%
                    </div>
                    <p className="mb-4 text-xs text-neutral-600">
                      {metrics.accuracy.total_labeled} labeled investigations
                    </p>
                    <div className="space-y-2">
                      {Object.entries(metrics.accuracy.breakdown || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-400">{k.replace(/_/g, " ")}</span>
                          <span className="font-mono text-neutral-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <BookOpen className="mx-auto mb-3 h-8 w-8 text-neutral-700" />
                    <p className="text-sm text-neutral-500">No labeled investigations yet</p>
                    <p className="text-xs text-neutral-600">Label accuracy from postmortems</p>
                  </div>
                )}
              </Card>

              {/* Team Performance */}
              <Card className="border-white/5 bg-white/[0.02] p-6 lg:col-span-3">
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                  Team Performance
                </h3>
                {metrics && Object.keys(metrics.team_breakdown).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-neutral-600">
                          <th className="pb-3 text-left font-medium">Team</th>
                          <th className="pb-3 text-left font-medium">Incidents</th>
                          <th className="pb-3 text-left font-medium">Success</th>
                          <th className="pb-3 text-left font-medium">Avg MTTR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metrics.team_breakdown).map(([name, data]) => (
                          <tr key={name} className="border-b border-white/[0.03] text-sm">
                            <td className="py-3 font-medium text-white">{name}</td>
                            <td className="py-3 font-mono text-neutral-400">{data.total}</td>
                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${data.success_rate >= 80
                                  ? "border-emerald-500/30 text-emerald-400"
                                  : data.success_rate >= 50
                                    ? "border-amber-500/30 text-amber-400"
                                    : "border-red-500/30 text-red-400"
                                  }`}
                              >
                                {data.success_rate}%
                              </Badge>
                            </td>
                            <td className="py-3 font-mono text-neutral-400">{data.avg_duration_seconds}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="mx-auto mb-3 h-8 w-8 text-neutral-700" />
                    <p className="text-sm text-neutral-500">No team data yet</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Daily Trend */}
            <Card className="border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                Daily Trend
              </h3>
              {metrics?.daily_trend?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-neutral-600">
                        <th className="pb-3 text-left font-medium">Date</th>
                        <th className="pb-3 text-left font-medium">Incidents</th>
                        <th className="pb-3 text-left font-medium">Resolved</th>
                        <th className="pb-3 text-left font-medium">Success Rate</th>
                        <th className="pb-3 text-left font-medium">Avg MTTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.daily_trend.map((t, i) => (
                        <tr key={i} className="border-b border-white/[0.03] text-sm">
                          <td className="py-2.5 font-mono text-xs text-neutral-500">{t.date}</td>
                          <td className="py-2.5 font-mono text-neutral-400">{t.total}</td>
                          <td className="py-2.5 font-mono text-neutral-400">{t.success}</td>
                          <td className="py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${t.success_rate >= 80
                                ? "border-emerald-500/30 text-emerald-400"
                                : "border-amber-500/30 text-amber-400"
                                }`}
                            >
                              {t.success_rate}%
                            </Badge>
                          </td>
                          <td className="py-2.5 font-mono text-neutral-400">{t.avg_duration_seconds}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <TrendingUp className="mx-auto mb-3 h-8 w-8 text-neutral-700" />
                  <p className="text-sm text-neutral-500">No trend data yet</p>
                  <p className="text-xs text-neutral-600">Incidents will appear here as they are investigated</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="flex justify-end mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                    <Plus className="mr-2 h-4 w-4" /> Add Team
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create New Team</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Team Name</label>
                      <Input
                        id="name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                        placeholder="e.g. Mobile Platform"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="id" className="text-sm font-medium">Team ID</label>
                      <Input
                        id="id"
                        value={newTeam.id}
                        onChange={(e) => setNewTeam({ ...newTeam, id: e.target.value })}
                        placeholder="e.g. mobile-platform"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="desc" className="text-sm font-medium">Description</label>
                      <textarea
                        id="desc"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                        placeholder="What does this team own?"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="services" className="text-sm font-medium">Services (comma separated)</label>
                      <Input
                        id="services"
                        value={newTeam.services}
                        onChange={(e) => setNewTeam({ ...newTeam, services: e.target.value })}
                        placeholder="e.g. ios-api, android-api"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={handleCreateTeam} disabled={creatingTeam}>
                        {creatingTeam ? "Creating..." : "Create Team"}
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {teams.length > 0 ? (
                teams.map((t, i) => {
                  const colors = [
                    "from-indigo-500/20 to-purple-500/10",
                    "from-emerald-500/20 to-cyan-500/10",
                    "from-amber-500/20 to-orange-500/10",
                    "from-rose-500/20 to-pink-500/10",
                  ];
                  return (
                    <Card key={t.id} className="group relative border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10">
                      <button
                        onClick={() => handleDeleteTeam(t.id)}
                        className="absolute top-4 right-4 text-neutral-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                        title="Delete Team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[i % colors.length]
                            } text-lg`}
                        >
                          {t.name[0]}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                          <p className="text-[11px] text-neutral-500">{t.id}</p>
                        </div>
                      </div>
                      <p className="mb-4 text-xs leading-relaxed text-neutral-400 min-h-[40px]">{t.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(t.services || []).map((s) => (
                          <Badge key={s} variant="outline" className="border-indigo-500/20 text-[10px] text-indigo-400">
                            {s}
                          </Badge>
                        ))}
                        {(t.keywords || []).slice(0, 3).map((k) => (
                          <Badge key={k} variant="outline" className="border-white/10 text-[10px] text-neutral-500">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center">
                  <Users className="mx-auto mb-3 h-8 w-8 text-neutral-700" />
                  <p className="text-sm text-neutral-500">No teams configured</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit">
            <Card className="border-white/5 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                  Audit Trail
                </h3>
                <select
                  value={auditFilter}
                  onChange={(e) => {
                    setAuditFilter(e.target.value);
                    setTimeout(fetchAudit, 0);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 outline-none"
                >
                  <option value="">All events</option>
                  <option value="incident.received">incident.received</option>
                  <option value="investigation.started">investigation.started</option>
                  <option value="investigation.completed">investigation.completed</option>
                  <option value="approval.requested">approval.requested</option>
                  <option value="auth.success">auth.success</option>
                </select>
              </div>
              {audit.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-neutral-600">
                        <th className="pb-3 text-left font-medium">Timestamp</th>
                        <th className="pb-3 text-left font-medium">Action</th>
                        <th className="pb-3 text-left font-medium">Actor</th>
                        <th className="pb-3 text-left font-medium">Resource</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audit.map((e, i) => (
                        <tr key={i} className="border-b border-white/[0.03] text-sm">
                          <td className="py-2.5 font-mono text-[11px] text-neutral-600">{e.timestamp}</td>
                          <td className="py-2.5">
                            <Badge variant="outline" className="border-purple-500/20 text-[10px] text-purple-400">
                              {e.action}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-xs text-neutral-400">{e.actor}</td>
                          <td className="py-2.5 font-mono text-xs text-neutral-500">{e.resource || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Shield className="mx-auto mb-3 h-8 w-8 text-neutral-700" />
                  <p className="text-sm text-neutral-500">No audit events yet</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
